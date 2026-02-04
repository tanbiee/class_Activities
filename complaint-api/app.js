import express from 'express'
import logger from './middleware/logger.middleware.js';

import complaint from './routes/complaint.routes.js';

const app = express();
app.use(express.json());
app.use(logger);

app.use(complaint);


export default app;