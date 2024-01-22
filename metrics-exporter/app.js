import { indexer } from "./indexer.js";
import { updateAllMetrics } from "./relayer-exporter.js";
import { fetchFeegrantData } from "./feegrant-exporter.js"

import config from './config.js';
console.log(config);

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();

// Segfault handler
const SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('crash.log');

await fetchFeegrantData();
setInterval(fetchFeegrantData, 10000); // every 10 seconds

app.get('/metrics', async (req, res) => {
    let register = await updateAllMetrics();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = config.exporter_port;
app.listen(port, () => console.log(`Server running on port ${port}`));

indexer();