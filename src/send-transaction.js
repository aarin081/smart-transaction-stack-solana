const fs = require("fs");
const {
  Connection,
    Keypair,
      LAMPORTS_PER_SOL,
        SystemProgram,
          Transaction
          } = require("@solana/web3.js");

          const connection = new Connection(
            "https://api.devnet.solana.com",
              "confirmed"
              );

              // load your saved wallet
              const secret = JSON.parse(fs.readFileSync("wallet.json"));
              const sender = Keypair.fromSecretKey(new Uint8Array(secret));

              // create random receiver
              const receiver = Keypair.generate();

              async function main() {
                console.log("Sender:", sender.publicKey.toBase58());
                  console.log("Receiver:", receiver.publicKey.toBase58());

                    const transaction = new Transaction().add(
                        SystemProgram.transfer({
                              fromPubkey: sender.publicKey,
                                    toPubkey: receiver.publicKey,
                                          lamports: 0.01 * LAMPORTS_PER_SOL
                                              })
                                                );

                                                  console.log("Sending transaction...");

                                                    const signature = await connection.sendTransaction(
                                                        transaction,
                                                            [sender]
                                                              );

                                                                console.log("Transaction Signature:", signature);

                                                                  await connection.confirmTransaction(signature, "confirmed");

                                                                    console.log("Transaction Confirmed ✔");
                                                                    }

                                                                    main();