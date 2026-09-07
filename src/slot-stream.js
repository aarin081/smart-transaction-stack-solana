const { Connection } = require("@solana/web3.js");
require("dotenv").config();

const connection = new Connection(process.env.RPC_URL, "confirmed");

async function start() {
  console.log("Starting Solana slot stream...");

    let lastSlot = 0;

      setInterval(async () => {
          try {
                const slot = await connection.getSlot();

                      if (slot !== lastSlot) {
                              console.log("Current slot:", slot);
                                      lastSlot = slot;
                                            }
                                                } catch (err) {
                                                      console.error("Error:", err.message);
                                                          }
                                                            }, 1000);
                                                            }

                                                            start();