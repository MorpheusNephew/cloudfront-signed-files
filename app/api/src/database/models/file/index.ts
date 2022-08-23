import { isLocal } from '../../../constants';
import { DynamooseFileModel } from './dynamoose';
import { MongooseFileModel } from './mongoose';

export const FileModel = isLocal
  ? new MongooseFileModel()
  : new DynamooseFileModel();
