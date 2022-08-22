import express from 'express';
import { connectToMongoDb } from './database';
import routers from './routers';
import bodyParser from 'body-parser';
import ServerlessHttp from 'serverless-http';
import { isLocal } from './constants';
import healthCheck from './routers/health';

const app = express();

app.use(bodyParser.json()).use('/healthcheck', healthCheck).use('/api', routers);

export const handler = ServerlessHttp(app);

if (isLocal) {
  const port = process.env.PORT || 5000;

  app.listen(port, async () => {
    console.log(`Running on port ${port}...`);

    await connectToMongoDb();
  });
}
