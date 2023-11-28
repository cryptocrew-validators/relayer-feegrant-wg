const config = {
    "feegrant_exporter_port": process.env.FEEGRANT_EXPORTER_PORT ?? 3000,
    "relayer_exporter_port": process.env.RELAYER_EXPORTER_PORT ?? 3001,
    "granter_address": process.env.GRANTER_ADDRESS ?? "cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7",
    "indexer_start_block_height": process.env.START_BLOCK_HEIGHT ?? 18957725,
    "indexer_poll_frequency": process.env.POLL_FREQUENCY ?? 1000,
    "rpc_url": process.env.RPC_URL ?? "https://rpc.sentry-01.theta-testnet.polypore.xyz",
    "rest_url": process.env.RPC_URL ?? "https://rest.sentry-01.theta-testnet.polypore.xyz",
    "addr_prefix": "cosmos"
};

export default config;