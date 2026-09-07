import Client from "@triton-one/yellowstone-grpc";

const ENDPOINT = process.env.YELLOWSTONE_URL || "https://api.mainnet-beta.solana.com";

async function main() {
  console.log("Starting Yellowstone slot stream...");

  const client = new (Client as any)(ENDPOINT, undefined, {});

  const stream = await client.subscribe();

  stream.write({
    slots: {},
    commitment: "confirmed",
  });

  stream.on("data", (data: any) => {
    console.log("Yellowstone event:", {
      slot: data?.slot,
      type: data?.type,
    });
  });

  stream.on("error", (err: any) => {
    console.error("Stream error:", err);
  });
}

main();