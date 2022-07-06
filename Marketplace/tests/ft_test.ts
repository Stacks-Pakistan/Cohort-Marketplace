
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that Fungible token minting is working",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get("deployer")!;

        let block = chain.mineBlock([
            Tx.contractCall("ft", "mint!", [types.uint(20)], deployer.address),
            Tx.contractCall("ft", "get-balance", [types.principal(deployer.address)], deployer.address)
        ]);
        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);

        block.receipts[0].events.expectFungibleTokenMintEvent(20, deployer.address, "cohort-currency")

        block.receipts[1].result.expectOk()
        .expectUint(20)

    },
});

Clarinet.test({
    name: "Ensure that Fungible token transfer is working",
    async fn(chain: Chain, accounts: Map<string, Account>) {

        const deployer = accounts.get("deployer")!;
        const wallet2 = accounts.get("wallet_2")!;

        let block = chain.mineBlock([
            Tx.contractCall("ft", "mint!", [types.uint(20)], deployer.address),
            Tx.contractCall("ft", "transfer", [types.uint(10), types.principal(deployer.address), types.principal(wallet2.address), types.some(types.buff("Utility Bill"))], deployer.address),
            Tx.contractCall("ft", "get-balance", [types.principal(deployer.address)], deployer.address),
            Tx.contractCall("ft", "get-balance", [types.principal(wallet2.address)], deployer.address)
        ]);

        assertEquals(block.receipts.length, 4);
        assertEquals(block.height, 2);

        block.receipts[0].events.expectFungibleTokenMintEvent(20, deployer.address, "cohort-currency")

        block.receipts[1].events.expectFungibleTokenTransferEvent(10, deployer.address, wallet2.address ,"cohort-currency")

        // Deployer Balance
        block.receipts[2].result.expectOk()
        .expectUint(10)

        // Wallet 2 Balance
        block.receipts[3].result.expectOk()
        .expectUint(10)

    },
});
