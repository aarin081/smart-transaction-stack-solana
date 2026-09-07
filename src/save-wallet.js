const fs = require("fs");
const { Keypair } = require("@solana/web3.js");

const wallet = Keypair.generate();

fs.writeFileSync(
  "wallet.json",
  JSON.stringify(Array.from(wallet.secretKey))
);

console.log("Saved wallet:", wallet.publicKey.toBase58());
