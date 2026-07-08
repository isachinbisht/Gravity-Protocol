#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, Map, IntoVal, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Allocation,
    Settlement,
}

#[contract]
pub struct Rebalance;

#[contractimpl]
impl Rebalance {
    pub fn initialize(env: Env, admin: Address, allocation: Address, settlement: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Allocation, &allocation);
        env.storage().instance().set(&DataKey::Settlement, &settlement);
    }

    pub fn allocation(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Allocation).unwrap()
    }

    pub fn settlement(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Settlement).unwrap()
    }

    pub fn rebalance(env: Env, vault: Address) {
        let alloc_addr = Self::allocation(env.clone());
        let settlement_addr = Self::settlement(env.clone());

        // Get target weights from Allocation contract
        let weights: Map<Address, u32> = env.invoke_contract(
            &alloc_addr,
            &soroban_sdk::symbol_short!("weights"),
            soroban_sdk::vec![&env],
        );

        // Get oracle address from Allocation
        let oracle_addr: Address = env.invoke_contract(
            &alloc_addr,
            &soroban_sdk::symbol_short!("oracle"),
            soroban_sdk::vec![&env],
        );

        // Get underlying asset of the vault
        let underlying_asset: Address = env.invoke_contract(
            &vault,
            &Symbol::new(&env, "underlying"),
            soroban_sdk::vec![&env],
        );

        // Step 1: Calculate current NAV of all assets and total NAV
        let mut total_nav: i128 = 0;
        
        // We will store lists of assets, prices, balances and weights in vectors for sequential iteration
        let mut assets_vec: Vec<Address> = Vec::new(&env);
        let mut prices_vec: Vec<i128> = Vec::new(&env);
        let mut balances_vec: Vec<i128> = Vec::new(&env);
        let mut weights_vec: Vec<u32> = Vec::new(&env);

        for item in weights.iter() {
            let (asset, weight) = item;

            // Get balance of asset in the vault
            let balance: i128 = env.invoke_contract(
                &asset,
                &soroban_sdk::symbol_short!("balance"),
                soroban_sdk::vec![&env, vault.clone().into_val(&env)],
            );

            // Fetch oracle price of asset
            let price: i128 = env.invoke_contract(
                &oracle_addr,
                &soroban_sdk::symbol_short!("get_price"),
                soroban_sdk::vec![&env, asset.clone().into_val(&env)],
            );

            assets_vec.push_back(asset);
            prices_vec.push_back(price);
            balances_vec.push_back(balance);
            weights_vec.push_back(weight);

            let val = (balance * price) / 100_000_000i128;
            total_nav += val;
        }

        if total_nav <= 0 {
            return; // Empty fund, nothing to rebalance
        }

        // Step 2: First phase - Sell all surplus assets for the underlying asset
        for i in 0..assets_vec.len() {
            let asset = assets_vec.get(i).unwrap();
            if asset == underlying_asset {
                continue; // Skip the base settlement asset
            }

            let price = prices_vec.get(i).unwrap();
            let balance = balances_vec.get(i).unwrap();
            let weight = weights_vec.get(i).unwrap();

            let current_value = (balance * price) / 100_000_000i128;
            let target_value = (total_nav * weight as i128) / 100i128; // weights out of 100 baseline now

            if current_value > target_value {
                let surplus_value = current_value - target_value;
                let surplus_tokens = (surplus_value * 100_000_000i128) / price;

                if surplus_tokens > 0 {
                    // Call vault.execute_swap to swap surplus_tokens of asset to underlying_asset
                    let _: i128 = env.invoke_contract(
                        &vault,
                        &Symbol::new(&env, "execute_swap"),
                        soroban_sdk::vec![
                            &env,
                            settlement_addr.clone().into_val(&env),
                            asset.into_val(&env),
                            underlying_asset.clone().into_val(&env),
                            surplus_tokens.into_val(&env),
                            0i128.into_val(&env),
                        ],
                    );
                }
            }
        }

        // Step 3: Second phase - Buy all deficit assets using the underlying asset
        for i in 0..assets_vec.len() {
            let asset = assets_vec.get(i).unwrap();
            if asset == underlying_asset {
                continue; // Skip the base settlement asset
            }

            let price = prices_vec.get(i).unwrap();
            let balance = balances_vec.get(i).unwrap();
            let weight = weights_vec.get(i).unwrap();

            let current_value = (balance * price) / 100_000_000i128;
            let target_value = (total_nav * weight as i128) / 100i128; // weights out of 100 baseline now

            if current_value < target_value {
                let deficit_value = target_value - current_value;
                let underlying_needed = deficit_value; // USDC price is 1.0

                if underlying_needed > 0 {
                    // Call vault.execute_swap to swap underlying_needed of underlying_asset to asset
                    let _: i128 = env.invoke_contract(
                        &vault,
                        &Symbol::new(&env, "execute_swap"),
                        soroban_sdk::vec![
                            &env,
                            settlement_addr.clone().into_val(&env),
                            underlying_asset.clone().into_val(&env),
                            asset.into_val(&env),
                            underlying_needed.into_val(&env),
                            0i128.into_val(&env),
                        ],
                    );
                }
            }
        }
    }
}

mod test;
