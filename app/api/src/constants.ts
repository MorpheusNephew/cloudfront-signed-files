import assert from 'assert';
import { readFileSync } from 'fs';

assert(process.env.MONGO_DB_URL, 'MONGO_DB_URL must be present');
assert(process.env.MONGO_DB_NAME, 'MONGO_DB_NAME must be present');
assert(process.env.MONGO_DB_USER, 'MONGO_DB_USER must be present');
assert(process.env.MONGO_DB_PASS, 'MONGO_DB_PASS must be present');
assert(
  process.env.CLOUDFRONT_DOMAIN_NAME,
  'CLOUDFRONT_DOMAIN_NAME must be present'
);
assert(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
  'CLOUDFRONT_PRIVATE_KEY_PATH must be present'
);

assert(
  process.env.CLOUDFRONT_KEY_PAIR_ID,
  'CLOUDFRONT_KEY_PAIR_ID must be present'
);

export const mongoDbUrl = process.env.MONGO_DB_URL;
export const mongoDbName = process.env.MONGO_DB_NAME;
export const mongoDbUser = process.env.MONGO_DB_USER;
export const mongoDbPass = process.env.MONGO_DB_PASS;
export const s3BaseUrl = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}`;
export const cloudfrontDomainName = process.env.CLOUDFRONT_DOMAIN_NAME;
export const cloudfrontPrivateKey = readFileSync(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
  'utf-8'
);
export const cloudfrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
