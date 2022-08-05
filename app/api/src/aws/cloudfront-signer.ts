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
  s3BaseUrl,
} from '../constants';

export const createSignedUrl = (fileUrl: string) => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + 10);

  const input: CloudfrontSignInputWithParameters = {
    url: fileUrl,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    dateLessThan: expirationDate.toISOString(),
  };

  return getSignedUrl(input);
};

export const addSignedCookies = (res: Response) => {
  const input: CloudfrontSignInputWithPolicy = {
    url: `${s3BaseUrl}/*`,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    policy: '',
  };

  const signedCookies = getSignedCookies(input);

  for (const [key, value] of Object.entries(signedCookies)) {
    res.cookie(key, value);
  }
};
