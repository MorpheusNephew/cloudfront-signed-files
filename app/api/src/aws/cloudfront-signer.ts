import { Response } from 'express';
import {
  getSignedCookies,
  getSignedUrl,
  CloudfrontSignInputWithParameters,
} from '@aws-sdk/cloudfront-signer';
import {
  cloudfrontDomainName,
  cloudfrontKeyPairId,
  cloudfrontPrivateKey,
} from '../constants';
import { lookup } from 'mime-types';

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

export const addSignedCookies = (res: Response, fileUrl: string) => {
  const viewUrl = `${fileUrl}?response-content-type=${lookup(fileUrl)}`;
  const url = new URL(viewUrl);
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + 30);

  const input: CloudfrontSignInputWithParameters = {
    url: viewUrl,
    keyPairId: cloudfrontKeyPairId,
    privateKey: cloudfrontPrivateKey,
    dateLessThan: expirationDate.toISOString(),
  };

  const signedCookies = getSignedCookies(input);

  for (const [key, value] of Object.entries(signedCookies)) {
    res.cookie(key, value, {
      domain: `.${cloudfrontDomainName}`,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      path: url.pathname,
    });
  }
};
