import express from 'express';
import { connectToMongoDb } from './database';
import routers from './routers';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json()).use('/api', routers);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Running on port ${port}...`);

  await connectToMongoDb();
});
