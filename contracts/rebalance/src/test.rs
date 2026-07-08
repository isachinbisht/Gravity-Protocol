#![cfg(test)]

use super::*;
use soroban_sdk::{Env, Address, symbol_short, Symbol, vec, String};
use soroban_sdk::testutils::Address as _;
use soroban_sdk::token::Client as TokenClient;

// --- Mock Token Contract ---
#[contracttype]
#[derive(Clone)]
pub enum TokenDataKey {
    Balance(Address),
    Allowance(Address, Address),
}

#[contract]
pub struct MockToken;

#[contractimpl]
impl MockToken {
    pub fn mint(env: Env, to: Address, amount: i128) {
        let key = TokenDataKey::Balance(to.clone());
        let bal: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        env.storage().persistent().set(&key, &(bal + amount));
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&TokenDataKey::Balance(id)).unwrap_or(0)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        let from_key = TokenDataKey::Balance(from.clone());
        let to_key = TokenDataKey::Balance(to.clone());
        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);
        if from_bal < amount {
            panic!("insufficient balance");
        }
        env.storage().persistent().set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));
    }

    pub fn approve(env: Env, from: Address, spender: Address, amount: i128, _exp: u32) {
        env.storage().persistent().set(&TokenDataKey::Allowance(from, spender), &amount);
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128) {
        let allowance_key = TokenDataKey::Allowance(from.clone(), spender);
        let allowance: i128 = env.storage().persistent().get(&allowance_key).unwrap_or(0);
        if allowance < amount {
            panic!("insufficient allowance");
        }
        env.storage().persistent().set(&allowance_key, &(allowance - amount));

        let from_key = TokenDataKey::Balance(from.clone());
        let to_key = TokenDataKey::Balance(to.clone());
        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);
        if from_bal < amount {
            panic!("insufficient balance");
        }
        env.storage().persistent().set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));
    }

    pub fn decimals(_env: Env) -> u32 {
        7
    }
}

// --- Mock Oracle Contract ---
#[contract]
pub struct MockOracle;

#[contractimpl]
impl MockOracle {
    pub fn set_price(env: Env, asset: Address, price: i128) {
        env.storage().instance().set(&asset, &price);
    }

    pub fn get_price(env: Env, asset: Address) -> i128 {
        env.storage().instance().get(&asset).unwrap_or(0)
    }
}

// --- Mock DEX Contract ---
#[contract]
pub struct MockDEX;

#[contractimpl]
impl MockDEX {
    pub fn initialize(env: Env, oracle: Address) {
        env.storage().instance().set(&symbol_short!("oracle"), &oracle);
    }

    pub fn swap(
        env: Env,
        sender: Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
    ) -> i128 {
        let oracle: Address = env.storage().instance().get(&symbol_short!("oracle")).unwrap();
        let price_in: i128 = env.invoke_contract(
            &oracle,
            &symbol_short!("get_price"),
            vec![&env, token_in.clone().into_val(&env)],
        );
        let price_out: i128 = env.invoke_contract(
            &oracle,
            &symbol_short!("get_price"),
            vec![&env, token_out.clone().into_val(&env)],
        );

        let amount_out = (amount_in * price_in) / price_out;

        if amount_out < min_amount_out {
            panic!("slippage exceeded");
        }

        // transfer token_in from sender to DEX (we are registering DEX under test)
        let token_in_client = TokenClient::new(&env, &token_in);
        token_in_client.transfer_from(&env.current_contract_address(), &sender, &env.current_contract_address(), &amount_in);

        // transfer token_out from DEX to sender
        let token_out_client = TokenClient::new(&env, &token_out);
        token_out_client.transfer(&env.current_contract_address(), &sender, &amount_out);

        amount_out
    }
}

#[test]
fn test_vault_and_rebalance_integration() {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy Admin
    let admin = Address::generate(&env);

    // Deploy Mock Tokens
    let usdc_id = env.register_contract(None, MockToken);
    let usdc = MockTokenClient::new(&env, &usdc_id);

    let xlm_id = env.register_contract(None, MockToken);
    let xlm = MockTokenClient::new(&env, &xlm_id);

    // Deploy Mock Oracle
    let oracle_id = env.register_contract(None, MockOracle);
    let oracle = MockOracleClient::new(&env, &oracle_id);

    // Set Prices (Prices scale by 8 decimals, i.e., $1 = 100,000,000)
    oracle.set_price(&usdc_id, &100_000_000i128); // USDC = $1.00
    oracle.set_price(&xlm_id, &15_000_000i128);   // XLM = $0.15

    // Deploy Mock DEX
    let dex_id = env.register_contract(None, MockDEX);
    let dex = MockDEXClient::new(&env, &dex_id);
    dex.initialize(&oracle_id);

    // Seed DEX with tokens to provide liquidity
    usdc.mint(&dex_id, &100_000_000_0000000i128); // 10M USDC
    xlm.mint(&dex_id, &100_000_000_0000000i128);  // 10M XLM

    // Deploy Vault Contract (which is also a token)
    let vault_id = env.register_contract(None, vault::Vault);
    let vault = vault::VaultClient::new(&env, &vault_id);
    vault.initialize(
        &admin,
        &usdc_id,
        &String::from_str(&env, "Token Ale Fund"),
        &String::from_str(&env, "TALE"),
    );

    // Deploy Allocation Contract
    let allocation_id = env.register_contract(None, allocation::Allocation);
    let allocation = allocation::AllocationClient::new(&env, &allocation_id);
    allocation.initialize(&admin, &oracle_id, &vault_id);

    // Deploy Settlement Contract
    let settlement_id = env.register_contract(None, settlement::Settlement);
    let settlement = settlement::SettlementClient::new(&env, &settlement_id);
    settlement.initialize(&admin, &dex_id);

    // Deploy Rebalance Contract
    let rebalance_id = env.register_contract(None, Rebalance);
    let rebalance = RebalanceClient::new(&env, &rebalance_id);
    rebalance.initialize(&admin, &allocation_id, &settlement_id);

    // Configure Vault Rebalancer
    vault.set_rebalancer(&rebalance_id);

    // Set target weights: 60% USDC, 40% XLM
    let mut target_weights = soroban_sdk::Map::new(&env);
    target_weights.set(usdc_id.clone(), 60u32);
    target_weights.set(xlm_id.clone(), 40u32);
    allocation.set_target_weights(&admin, &target_weights);

    // Test Deposit: Admin deposits 1,000 USDC into Vault
    usdc.mint(&admin, &1000_0000000i128); // 1,000 USDC
    vault.deposit(&admin, &1000_0000000i128);

    // Verify Vault shares and underlying balance
    assert_eq!(vault.total_shares(), 1000_0000000i128);
    assert_eq!(usdc.balance(&vault_id), 1000_0000000i128);

    // Now manually trigger Rebalance
    // XLM is target 40% but current is 0%, so it should swap USDC for XLM.
    rebalance.rebalance(&vault_id);

    // Target value: Total NAV is $1000. Target XLM is 40% = $400.
    // Price of XLM is $0.15. So target XLM tokens = $400 / 0.15 = 2666.66 tokens = 2666.66 * 10^7
    // Let's assert that we now hold XLM in the vault
    let vault_xlm_balance = xlm.balance(&vault_id);
    assert!(vault_xlm_balance > 0);

    // Target USDC is 60% = $600 = 600 * 10^7.
    let vault_usdc_balance = usdc.balance(&vault_id);
    assert_eq!(vault_usdc_balance, 600_0000000i128);

    // Test Withdraw
    vault.withdraw(&admin, &500_0000000i128); // withdraw 500 shares (50%)
    
    // Total shares should decrease
    assert_eq!(vault.total_shares(), 500_0000000i128);
}
