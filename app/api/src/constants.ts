import assert from 'assert';
import { readFileSync } from 'fs';

export const mongoDbUrl = process.env.MONGO_DB_URL || '';
export const mongoDbName = process.env.MONGO_DB_NAME || '';
export const mongoDbUser = process.env.MONGO_DB_USER || '';
export const mongoDbPass = process.env.MONGO_DB_PASS || '';
export const s3BaseUrl = process.env.CLOUDFRONT_DOMAIN_NAME
  ? `https://${process.env.CLOUDFRONT_DOMAIN_NAME}`
  : '';
export const cloudfrontDomainName = process.env.CLOUDFRONT_DOMAIN_NAME || '';

assert(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
  'CLOUDFRONT_PRIVATE_KEY_PATH must be present'
);
export const cloudfrontPrivateKey = readFileSync(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
  'utf-8'
);

assert(
  process.env.CLOUDFRONT_KEY_PAIR_ID,
  'CLOUDFRONT_KEY_PAIR_ID must be present'
);
export const cloudfrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
