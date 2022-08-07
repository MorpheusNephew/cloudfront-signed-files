import Axios from "axios";

export const createFile = async (filename: string) => {
  const { data: createdFile } = await Axios.post("/api/files", {
    name: filename,
  });

  return createdFile;
};

export const deleteFile = async (fileId: string) => {
  await Axios.delete(`/api/files/${fileId}`);
};

export const getFile = async (fileId: string) => {
  const { data: file } = await Axios.get(`/api/files/${fileId}`);

  return file;
};

export const getFiles = async () => {
  const { data: files } = await Axios.get("/api/files");

  return files;
};

export const uploadFile = async (s3Url: string, fileToUpload: any) => {
  await Axios.put(s3Url, fileToUpload);
};
