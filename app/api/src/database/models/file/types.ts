import { FileRequest, FileResponse } from '../../../types';

export type TCreateFile = FileRequest & { url: string };

export interface IFileModel {
  getFile: (fileId: string) => Promise<FileResponse | undefined>;
  getFiles: () => Promise<FileResponse[]>;
  createFile: (fileToCreate: TCreateFile) => Promise<FileResponse>;
  deleteFile: (fileId: string) => Promise<void>;
}
