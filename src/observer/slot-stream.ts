import { Connection } from "@solana/web3.js";

// ---------------- LIVE SHARED STATE ----------------
// This is what other files will read
global.liveState = {
  slot: 0,
    parent: 0,
      root: 0,
        isLive: false
        };

        // ---------------- CONNECTION ----------------
        const connection = new Connection(
          "https://api.devnet.solana.com",
            "confirmed"
            );

            // ---------------- STREAM START ----------------
            function startStream() {
              console.log("🚀 Live Solana slot stream started...\n");

                connection.onSlotChange((slotInfo) => {
                    global.liveState = {
                          slot: slotInfo.slot,
                                parent: slotInfo.parent,
                                      root: slotInfo.root,
                                            isLive: true,
                                                  timestamp: Date.now()
                                                      };

                                                          console.log("Slot Update:");
                                                              console.log("  Slot:", slotInfo.slot);
                                                                  console.log("  Parent:", slotInfo.parent);
                                                                      console.log("  Root:", slotInfo.root);
                                                                          console.log("------------------------------");
                                                                            });

                                                                              connection.onRootChange((root) => {
                                                                                  console.log("🌱 New Root:", root);
                                                                                    });
                                                                                    }

                                                                                    // ---------------- START ----------------
                                                                                    startStream();