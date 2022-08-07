import assert from 'assert';
import { readFileSync } from 'fs';

assert(
  process.env.CLOUDFRONT_DOMAIN_NAME,
  'CLOUDFRONT_DOMAIN_NAME must be present'
);
assert(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH || process.env.CLOUDFRONT_PRIVATE_KEY,
  'CLOUDFRONT_PRIVATE_KEY_PATH OR CLOUDFRONT_PRIVATE_KEY must be present'
);

assert(
  process.env.CLOUDFRONT_KEY_PAIR_ID,
  'CLOUDFRONT_KEY_PAIR_ID must be present'
);

export const mongoDbUrl = process.env.MONGO_DB_URL || '';
export const mongoDbName = process.env.MONGO_DB_NAME || '';
export const mongoDbUser = process.env.MONGO_DB_USER || '';
export const mongoDbPass = process.env.MONGO_DB_PASS || '';
export const s3BaseUrl = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}`;
export const cloudfrontDomainName = process.env.CLOUDFRONT_DOMAIN_NAME;

export const cloudfrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY_PATH ? readFileSync(
  process.env.CLOUDFRONT_PRIVATE_KEY_PATH,
  'utf-8'
) : process.env.CLOUDFRONT_PRIVATE_KEY!;
export const cloudfrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
export const isLocal = process.env.AWS_EXECUTION_ENV ? false : true;
