import Axios from "axios";
import { s3BaseUrl } from "./constants";

export const deleteFile = async (filePath: string) => {
  const fileToDelete = `${s3BaseUrl}/${filePath}`;

  await Axios.delete(fileToDelete);
};
