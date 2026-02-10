import express from 'express'
import logger from './middleware/logger.middleware.js';

import complaint from './routes/complaint.routes.js';
import path from 'path';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve('public/admin.html'));
});
app.use('/', complaint);





export default app;