import { IFileModel, TCreateFile } from './types';
import * as dynamoose from 'dynamoose';
import { v4 as uuid } from 'uuid';
import { filesTableName } from '../../../constants';

const FileModel = dynamoose.model(filesTableName, {
  id: String,
  name: String,
  url: String,
});

export class DynamooseFileModel implements IFileModel {
  async getFile(fileId: string) {
    try {
      const file = await FileModel.get(fileId);

      return file.original() as any;
    } catch {
      return undefined;
    }
  }

  async getFiles() {
    const files = (await FileModel.scan().exec()).map((file) =>
      file.original()
    );

    return files as any[];
  }

  async createFile(fileToCreate: TCreateFile) {
    const fileId = uuid();

    const createdFile = await FileModel.create({ id: fileId, ...fileToCreate });

    console.log('dynamoose createdFile', { createdFile });
    return createdFile.original() as any;
  }

  async deleteFile(fileId: string) {
    await FileModel.delete(fileId);
  }
}
