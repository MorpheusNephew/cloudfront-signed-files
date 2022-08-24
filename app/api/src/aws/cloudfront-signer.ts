import { Response } from 'express';
import {
  getSignedCookies,
  getSignedUrl,
  CloudfrontSignInputWithParameters,
  CloudfrontSignInputWithPolicy,
} from '@aws-sdk/cloudfront-signer';
import {
  cloudfrontKeyPairId,
  cloudfrontPrivateKey,
  cloudfrontS3Path,
  s3BaseUrl,
} from '../constants';
import { FileResponse } from '../types';

export const createSignedUrl = (fileUrl: string) => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + 30);

  const input: CloudfrontSignInputWithParameters = {
    url: fileUrl,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    dateLessThan: expirationDate.toISOString(),
  };

  return getSignedUrl(input);
};

export const addSignedCookies = (res: Response, files: FileResponse[]) => {
  const policy: Policy = {
    Statement: files.map((file) => ({
      Action: 's3:GetObject',
      Effect: 'Allow',
      Resource: file.url,
    })),
  };

  const input: CloudfrontSignInputWithPolicy = {
    url: `${s3BaseUrl}/*`,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    policy: JSON.stringify(policy),
  };

  console.log('CloudfrontSignInputWithPolicy', { policy: input.policy });

  const signedCookies = getSignedCookies(input);

  for (const [key, value] of Object.entries(signedCookies)) {
    res.cookie(key, value, { sameSite: 'strict', path: cloudfrontS3Path });
  }
};

interface Policy {
  Statement: Array<{
    Resource: string;
  }>;
}
