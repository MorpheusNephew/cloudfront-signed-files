import Axios from 'axios';
import { createSignedUrl } from './cloudfront-signer';

export const deleteFile = async (s3FilePath: string) => {
  const fileToDelete = createSignedUrl(s3FilePath);
  await Axios.delete(fileToDelete);
};
