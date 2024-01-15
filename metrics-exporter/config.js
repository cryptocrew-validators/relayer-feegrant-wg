
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');

dotenv.config({ path: envPath });

const config = {
    exporter_port: process.env.RELAYER_EXPORTER_PORT || 3001,
    granter_address: process.env.GRANTER_ACCOUNT || "cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7",
    indexer_start_block_height: process.env.START_BLOCK_HEIGHT || 18957725,
    indexer_poll_frequency: process.env.POLL_FREQUENCY || 1000,
    rpc_url: process.env.RPC_URL || "https://rpc.sentry-01.theta-testnet.polypore.xyz",
    rest_url: process.env.REST_URL || "https://rest.sentry-01.theta-testnet.polypore.xyz",
    addr_prefix: process.env.ADDR_PREFIX || "cosmos"
};

export default config;