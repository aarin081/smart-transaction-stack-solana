import "dotenv/config";
import Client from "@triton-one/yellowstone-grpc";

const ENDPOINT = process.env.YELLOWSTONE_URL || "https://api.mainnet-beta.solana.com";

if (!ENDPOINT) {
  throw new Error("Missing YELLOWSTONE_URL in .env");
}

async function start() {
  console.log("Connecting to Yellowstone...");

  if (ENDPOINT === "disabled") {
    console.log("Yellowstone disabled - using RPC mode");
    return;
  }

  const client = new (Client as any)(
    ENDPOINT,
    undefined,
    {}
  );

  const stream = await client.subscribe();

  stream.write({
    slots: {},
    commitment: "confirmed",
  });

  stream.on("data", (data: any) => {
    console.log("Yellowstone event:", {
      slot: data?.slot,
      timestamp: new Date().toISOString(),
    });
  });

  stream.on("error", (err: any) => {
    console.error("Yellowstone error:", err);
  });

  stream.on("end", () => {
    console.log("Yellowstone stream ended");
  });
}

start();