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
import { FileResponse } from '../../../lib/files';

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

export const createSignedCookies = (files: FileResponse[]) => {
  const policy: Policy = {
    Statement: files.map((file) => ({ Resource: file.url })),
  };

  const input: CloudfrontSignInputWithPolicy = {
    url: `${s3BaseUrl}/*`,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    policy: JSON.stringify(policy),
  };

  return getSignedCookies(input);
};

interface Policy {
  Statement: Array<{
    Resource: string;
  }>;
}
