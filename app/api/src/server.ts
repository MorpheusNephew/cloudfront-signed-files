import { Context } from 'aws-lambda';
import { handler as lambdaHandler } from '.';

export const handler = async (event: any, context: Context) => {
  return await lambdaHandler(event, context);
};
