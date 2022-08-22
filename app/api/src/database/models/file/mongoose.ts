import mongoose, { model, Schema } from 'mongoose';
import { FileResponse } from '../../../types';
import { IFileModel, TCreateFile } from './types';

const FileSchema = new Schema<FileResponse>({
  id: Schema.Types.ObjectId,
  name: { type: Schema.Types.String, unique: true },
  url: { type: Schema.Types.String, unique: true },
});

const File = model<FileResponse>('File', FileSchema);

export class MongooseFileModel implements IFileModel {
  async getFile(fileId: string) {
    return (await File.findById(fileId))?.toObject();
  }

  async getFiles() {
    return (await File.find()).map((file) => file.toObject());
  }

  async createFile(fileToCreate: TCreateFile) {
    const fileId = new mongoose.Types.ObjectId();

    const createdFile = (
      await File.create({
        _id: fileId,
        id: fileId,
        ...fileToCreate,
      })
    ).toObject();

    return createdFile;
  }

  async deleteFile(fileId: string) {
    await File.findByIdAndDelete(fileId);
  }
}
