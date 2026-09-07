const fs = require("fs");
const {
  Connection,
    Keypair,
      LAMPORTS_PER_SOL,
        SystemProgram,
          Transaction
          } = require("@solana/web3.js");

          // ---------------- CONNECTION ----------------
          const connection = new Connection(
            "https://api.devnet.solana.com",
              "confirmed"
              );

              // ---------------- WALLET ----------------
              const secret = JSON.parse(fs.readFileSync("wallet.json"));
              const sender = Keypair.fromSecretKey(new Uint8Array(secret));

              const receiver = Keypair.generate();

              // ---------------- UTIL ----------------
              function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
                }

                // ---------------- NETWORK ANALYSIS ----------------
                async function getNetworkState() {
                  const samples = await connection.getRecentPerformanceSamples(5);

                    const tpsList = samples.map(s =>
                        s.numTransactions / s.samplePeriodSecs
                          );

                            const currentTPS = tpsList[0] || 0;

                              const avgTPS =
                                  tpsList.reduce((a, b) => a + b, 0) / (tpsList.length || 1);

                                    const deviation = currentTPS - avgTPS;

                                      return {
                                          currentTPS,
                                              avgTPS,
                                                  deviation
                                                    };
                                                    }

                                                    // ---------------- ADAPTIVE DECISION ----------------
                                                    function shouldSend(network) {
                                                      // Balanced logic (NOT too strict, NOT too loose)

                                                        const stable = Math.abs(network.deviation) < network.avgTPS * 0.9;
                                                          const acceptable = network.currentTPS > network.avgTPS * 0.5;

                                                            return stable && acceptable;
                                                            }

                                                            // ---------------- SEND TX ----------------
                                                            async function sendTransaction() {
                                                              const tx = new Transaction().add(
                                                                  SystemProgram.transfer({
                                                                        fromPubkey: sender.publicKey,
                                                                              toPubkey: receiver.publicKey,
                                                                                    lamports: 0.01 * LAMPORTS_PER_SOL
                                                                                        })
                                                                                          );

                                                                                            return await connection.sendTransaction(tx, [sender]);
                                                                                            }

                                                                                            // ---------------- RETRY ENGINE ----------------
                                                                                            async function runWithRetry(maxRetries = 5) {
                                                                                              let attempt = 0;

                                                                                                while (attempt < maxRetries) {
                                                                                                    attempt++;

                                                                                                        console.log(`\n--- Attempt ${attempt} ---`);

                                                                                                            const network = await getNetworkState();

                                                                                                                console.log("Current TPS:", network.currentTPS.toFixed(2));
                                                                                                                    console.log("Avg TPS:", network.avgTPS.toFixed(2));
                                                                                                                        console.log("Deviation:", network.deviation.toFixed(2));

                                                                                                                            const decision = shouldSend(network);

                                                                                                                                if (!decision) {
                                                                                                                                      console.log("Decision: HOLD");

                                                                                                                                            const waitTime = attempt * 2000;
                                                                                                                                                  console.log(`Waiting ${waitTime}ms...`);

                                                                                                                                                        await sleep(waitTime);
                                                                                                                                                              continue;
                                                                                                                                                                  }

                                                                                                                                                                      console.log("Decision: SEND");

                                                                                                                                                                          try {
                                                                                                                                                                                const start = Date.now();

                                                                                                                                                                                      const signature = await sendTransaction();

                                                                                                                                                                                            console.log("Signature:", signature);
                                                                                                                                                                                                  console.log("Status: SUBMITTED");

                                                                                                                                                                                                        await connection.confirmTransaction(signature, "confirmed");

                                                                                                                                                                                                              const end = Date.now();

                                                                                                                                                                                                                    console.log("Status: CONFIRMED ✔");
                                                                                                                                                                                                                          console.log("Latency:", end - start, "ms");

                                                                                                                                                                                                                                // ---------------- LOGGING ----------------
                                                                                                                                                                                                                                      const log = {
                                                                                                                                                                                                                                              signature,
                                                                                                                                                                                                                                                      latency: end - start,
                                                                                                                                                                                                                                                              attempts: attempt,
                                                                                                                                                                                                                                                                      network
                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                  fs.writeFileSync("logs.json", JSON.stringify(log, null, 2));

                                                                                                                                                                                                                                                                                        console.log("Log saved ✔");
                                                                                                                                                                                                                                                                                              return;

                                                                                                                                                                                                                                                                                                  } catch (err) {
                                                                                                                                                                                                                                                                                                        console.log("FAILED TX:", err.message);
                                                                                                                                                                                                                                                                                                              console.log("Retrying...");

                                                                                                                                                                                                                                                                                                                    await sleep(attempt * 2000);
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                            console.log("\nMax retries reached. Transaction aborted.");
                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                            // ---------------- MAIN ----------------
                                                                                                                                                                                                                                                                                                                            async function main() {
                                                                                                                                                                                                                                                                                                                              console.log("Sender:", sender.publicKey.toBase58());
                                                                                                                                                                                                                                                                                                                                console.log("Receiver:", receiver.publicKey.toBase58());

                                                                                                                                                                                                                                                                                                                                  await runWithRetry();
                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                  main();