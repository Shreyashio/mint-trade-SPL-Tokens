import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../cluster1/wallet/my-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { sign } from "crypto";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("66SkVeVT3v6u57VUCcsB6Bi81ZwjPPLPtz9Bnr88iYjx");

// Recipient address
const to = new PublicKey("7pbLhwipL1p7LV1c857V5eRSkF3ZvV9nH3BUeCFeTv7M");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );
        // Transfer the new token to the "toTokenAccount" we just created
        const signature = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            10_000_000 // 10 tokens, remember 1 token = 1_000_000 (6 decimals)
        );
        console.log(`Transfer successful! Check out your TX here: 
        https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        console.log("Signature ID", signature);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

console.log("Using wallet:", keypair.publicKey.toBase58());
console.log("Transferring tokens to:", to.toBase58());