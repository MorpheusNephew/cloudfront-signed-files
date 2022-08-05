import Axios from 'axios';

export const deleteFile = async (s3FilePath: string) => {
  await Axios.delete(s3FilePath);
};
