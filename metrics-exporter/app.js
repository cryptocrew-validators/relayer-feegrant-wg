import { indexer } from "./indexer.js";
import { updateAllMetrics } from "./relayer-exporter.js";
import config from './config.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();

app.get('/metrics', async (req, res) => {
    let register = await updateAllMetrics();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = config.relayer_exporter_port;
app.listen(port, () => console.log(`Server running on port ${port}`));

indexer();