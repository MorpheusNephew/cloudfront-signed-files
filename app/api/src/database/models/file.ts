import mongoose, { model, Schema } from "mongoose";
import { FileRequest, FileResponse } from "../../../../lib/files";

const FileSchema = new Schema<FileResponse>({
  id: Schema.Types.ObjectId,
  name: { type: Schema.Types.String, unique: true },
  url: { type: Schema.Types.String, unique: true },
});

const File = model<FileResponse>("File", FileSchema);

export const getFile = async (fileId: string) => File.findById(fileId);

export const getFiles = async () => File.find();

export const createFile = async (
  fileToCreate: FileRequest & { url: string }
) => {
  const fileId = new mongoose.Types.ObjectId();

  const createdFile = await File.create({
    _id: fileId,
    id: fileId,
    ...fileToCreate,
  });

  return createdFile;
};

export const deleteFile = async (fileId: string) =>
  File.findByIdAndDelete(fileId);
