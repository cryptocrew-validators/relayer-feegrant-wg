const config = {
    "port": 3000,
    "granter_address": process.env.GRANTER_ADDRESS ?? "cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7",
    "start_block_height": process.env.START_BLOCK_HEIGHT ?? 18957725,
    "poll_frequency": process.env.POLL_FREQUENCY ?? 1000,
    "rpc_url": process.env.RPC_URL ?? "https://rpc.sentry-01.theta-testnet.polypore.xyz",
    "addr_prefix": "cosmos"
};

export default config;