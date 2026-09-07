const fs = require("fs");
const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
} = require("@solana/web3.js");

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Read the local wallet file. wallet.json is excluded by .gitignore.
const secret = JSON.parse(fs.readFileSync("wallet.json"));
const wallet = Keypair.fromSecretKey(new Uint8Array(secret));

async function main() {
  console.log("Wallet:", wallet.publicKey.toBase58());

  const balance = await connection.getBalance(wallet.publicKey);

  console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");
}

main();
