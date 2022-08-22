import { Router } from 'express';

const healthCheck = Router().get('/', (_req, res) => {
  res.json('Ok');
});

export default healthCheck;
