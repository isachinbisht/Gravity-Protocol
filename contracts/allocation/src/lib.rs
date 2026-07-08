#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, token, IntoVal, symbol_short};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Oracle,
    Vault,
    Weights,
}

#[contract]
pub struct Allocation;

#[contractimpl]
impl Allocation {
    pub fn initialize(env: Env, admin: Address, oracle: Address, vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
        env.storage().instance().set(&DataKey::Vault, &vault);
        
        Self::extend_lifetime(&env);
    }

    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    pub fn oracle(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Oracle).unwrap()
    }

    pub fn vault(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Vault).unwrap()
    }

    pub fn weights(env: Env) -> Map<Address, u32> {
        env.storage().instance().get(&DataKey::Weights).unwrap_or(Map::new(&env))
    }

    pub fn set_target_weights(env: Env, admin: Address, weights: Map<Address, u32>) {
        admin.require_auth();
        let stored_admin = Self::admin(env.clone());
        if admin != stored_admin {
            panic!("not admin");
        }

        let mut total_weight: u32 = 0;
        for item in weights.iter() {
            let (_, weight) = item;
            total_weight = total_weight.checked_add(weight).expect("overflow adding weights");
        }

        if total_weight != 100 {
            panic!("total weight must sum up to exactly 100");
        }

        env.storage().instance().set(&DataKey::Weights, &weights);
        Self::extend_lifetime(&env);
    }

    pub fn calculate_nav(env: Env) -> i128 {
        Self::extend_lifetime(&env);

        let vault_addr = Self::vault(env.clone());
        let oracle_addr = Self::oracle(env.clone());
        let weights = Self::weights(env.clone());

        let mut total_nav: i128 = 0;

        for item in weights.iter() {
            let (asset, _) = item;

            let asset_client = token::Client::new(&env, &asset);
            let balance = asset_client.balance(&vault_addr);

            if balance > 0 {
                let price: i128 = env.invoke_contract(
                    &oracle_addr,
                    &symbol_short!("get_price"),
                    soroban_sdk::vec![&env, asset.into_val(&env)],
                );

                let asset_value = balance
                    .checked_mul(price)
                    .expect("NAV balance * price overflow")
                    .checked_div(100_000_000i128)
                    .expect("NAV division overflow");

                total_nav = total_nav
                    .checked_add(asset_value)
                    .expect("NAV addition overflow");
            }
        }

        total_nav
    }

    pub fn extend_lifetime(env: &Env) {
        env.storage().instance().extend_ttl(172800, 518400);
    }
}
