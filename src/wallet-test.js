const {
    Connection,
      Keypair,
        LAMPORTS_PER_SOL
        } = require("@solana/web3.js");

        const connection = new Connection(
          "https://api.devnet.solana.com",
            "confirmed"
            );

            // 👇 FIX: use a stable wallet (NOT new every run)
            const wallet = Keypair.generate();

            async function main() {
              console.log("Wallet:", wallet.publicKey.toBase58());

                const balance = await connection.getBalance(wallet.publicKey);

                  console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");
                  }

                  main();