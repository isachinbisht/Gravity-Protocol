#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token, IntoVal};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Dex,
}

#[contract]
pub struct Settlement;

#[contractimpl]
impl Settlement {
    pub fn initialize(env: Env, admin: Address, dex: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Dex, &dex);
    }

    pub fn dex(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Dex).unwrap()
    }

    pub fn set_dex(env: Env, dex: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Dex, &dex);
    }

    pub fn swap(
        env: Env,
        vault: Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
    ) -> i128 {
        let dex_addr = Self::dex(env.clone());
        let token_in_client = token::Client::new(&env, &token_in);

        // Pull token_in from vault (which already approved this contract) into settlement
        token_in_client.transfer_from(
            &env.current_contract_address(),
            &vault,
            &env.current_contract_address(),
            &amount_in,
        );

        // Approve DEX to spend token_in from settlement
        token_in_client.approve(&env.current_contract_address(), &dex_addr, &amount_in, &999999u32);

        // Call DEX swap; DEX pulls token_in from settlement and sends token_out to settlement
        let amount_out: i128 = env.invoke_contract(
            &dex_addr,
            &soroban_sdk::symbol_short!("swap"),
            soroban_sdk::vec![
                &env,
                env.current_contract_address().into_val(&env),
                token_in.into_val(&env),
                token_out.into_val(&env),
                amount_in.into_val(&env),
                min_amount_out.into_val(&env)
            ],
        );

        // Forward token_out from settlement to vault
        let token_out_client = token::Client::new(&env, &token_out);
        token_out_client.transfer(&env.current_contract_address(), &vault, &amount_out);

        amount_out
    }
}
