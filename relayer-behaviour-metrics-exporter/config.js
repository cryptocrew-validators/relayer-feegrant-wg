const config = {
    "port": 3000,
    "granter_address": process.env.GRANTER_ADDRESS ?? "cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7",
    "start_block_height": process.env.START_BLOCK_HEIGHT ?? 1,
    "poll_frequency": process.env.POLL_FREQUENCY ?? 1000,
    "chains": [
      {
        "rpcUrl": "https://cosmoshub-rpc.lavenderfive.com:443"
      },
      {
        "rpcUrl": "https://osmosis-rpc.polkachu.com"
      }
    ]
  };
  
  export default config;

