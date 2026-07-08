#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, token, IntoVal};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Underlying,
    TotalShares,
    Balance(Address),
    Allowance(Address, Address),
    Name,
    Symbol,
    Rebalancer,
}

#[contract]
pub struct Vault;

#[contractimpl]
impl Vault {
    pub fn initialize(
        env: Env,
        admin: Address,
        underlying: Address,
        name: String,
        symbol: String,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Underlying, &underlying);
        env.storage().instance().set(&DataKey::TotalShares, &0i128);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
    }

    pub fn underlying(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Underlying).unwrap()
    }

    pub fn total_shares(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalShares).unwrap_or(0i128)
    }

    pub fn deposit(env: Env, from: Address, amount: i128) -> i128 {
        from.require_auth();
        if amount <= 0 {
            panic!("amount must be positive");
        }

        let underlying = Self::underlying(env.clone());
        let total_shares = Self::total_shares(env.clone());
        
        let underlying_client = token::Client::new(&env, &underlying);
        let vault_balance = underlying_client.balance(&env.current_contract_address());

        let shares_to_mint = if total_shares == 0 || vault_balance == 0 {
            amount
        } else {
            (amount * total_shares) / vault_balance
        };

        // Transfer underlying to the vault
        underlying_client.transfer(&from, &env.current_contract_address(), &amount);

        // Mint shares to the user
        let user_balance_key = DataKey::Balance(from.clone());
        let user_balance: i128 = env.storage().persistent().get(&user_balance_key).unwrap_or(0i128);
        env.storage().persistent().set(&user_balance_key, &(user_balance + shares_to_mint));

        // Update total shares
        env.storage().instance().set(&DataKey::TotalShares, &(total_shares + shares_to_mint));

        shares_to_mint
    }

    pub fn withdraw(env: Env, from: Address, shares: i128) -> i128 {
        from.require_auth();
        if shares <= 0 {
            panic!("shares must be positive");
        }

        let user_balance_key = DataKey::Balance(from.clone());
        let user_balance: i128 = env.storage().persistent().get(&user_balance_key).unwrap_or(0i128);
        if user_balance < shares {
            panic!("insufficient share balance");
        }

        let underlying = Self::underlying(env.clone());
        let total_shares = Self::total_shares(env.clone());
        
        let underlying_client = token::Client::new(&env, &underlying);
        let vault_balance = underlying_client.balance(&env.current_contract_address());

        let amount_to_withdraw = (shares * vault_balance) / total_shares;

        // Burn user shares
        env.storage().persistent().set(&user_balance_key, &(user_balance - shares));
        env.storage().instance().set(&DataKey::TotalShares, &(total_shares - shares));

        // Transfer underlying to the user
        underlying_client.transfer(&env.current_contract_address(), &from, &amount_to_withdraw);

        amount_to_withdraw
    }

    pub fn set_rebalancer(env: Env, rebalancer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Rebalancer, &rebalancer);
    }

    pub fn rebalancer(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Rebalancer)
    }

    pub fn execute_swap(
        env: Env,
        settlement: Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
    ) -> i128 {
        let rebalancer = Self::rebalancer(env.clone()).expect("rebalancer not set");
        rebalancer.require_auth();

        // Approve settlement contract to spend token_in from this vault
        let token_in_client = token::Client::new(&env, &token_in);
        token_in_client.approve(&env.current_contract_address(), &settlement, &amount_in, &999999u32);

        // Call settlement.swap, passing vault address so it can pull approved token_in
        let amount_out: i128 = env.invoke_contract(
            &settlement,
            &soroban_sdk::symbol_short!("swap"),
            soroban_sdk::vec![
                &env,
                env.current_contract_address().into_val(&env),
                token_in.into_val(&env),
                token_out.into_val(&env),
                amount_in.into_val(&env),
                min_amount_out.into_val(&env),
            ],
        );

        amount_out
    }


    // --- SEP-41 compliant token methods ---

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(id)).unwrap_or(0i128)
    }

    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Allowance(from, spender)).unwrap_or(0i128)
    }

    pub fn approve(env: Env, from: Address, spender: Address, amount: i128, _expiration_ledger: u32) {
        from.require_auth();
        env.storage().persistent().set(&DataKey::Allowance(from, spender), &amount);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic!("amount must be positive");
        }
        let from_key = DataKey::Balance(from.clone());
        let to_key = DataKey::Balance(to.clone());

        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0i128);
        if from_bal < amount {
            panic!("insufficient balance");
        }

        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0i128);
        env.storage().persistent().set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        spender.require_auth();
        if amount <= 0 {
            panic!("amount must be positive");
        }
        let allowance_key = DataKey::Allowance(from.clone(), spender);
        let allowance: i128 = env.storage().persistent().get(&allowance_key).unwrap_or(0i128);
        if allowance < amount {
            panic!("insufficient allowance");
        }

        let from_key = DataKey::Balance(from.clone());
        let to_key = DataKey::Balance(to.clone());

        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0i128);
        if from_bal < amount {
            panic!("insufficient balance");
        }

        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0i128);
        env.storage().persistent().set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));
        env.storage().persistent().set(&allowance_key, &(allowance - amount));
    }

    pub fn name(env: Env) -> String {
        env.storage().instance().get(&DataKey::Name).unwrap()
    }

    pub fn symbol(env: Env) -> String {
        env.storage().instance().get(&DataKey::Symbol).unwrap()
    }

    pub fn decimals(_env: Env) -> u32 {
        7 // standard decimals for Stellar assets
    }
}
