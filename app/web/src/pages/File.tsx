import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFile } from "../api";
import { FileResponse } from "../types";

export const File = () => {
  const [file, setFile] = useState<FileResponse>();
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const params = useParams();

  console.log({ filePageParams: params });

  const { fileId } = params;

  useEffect(() => {
    if (!fileId) return;

    (async () => {
      setFileLoading(true);
      try {
        const retrievedFile = await getFile(fileId);
        setFile(retrievedFile);
      } catch (e) {
        setError(e);
      }

      setFileLoading(false);
    })();
  }, [fileId]);

  return fileLoading ? (
    <>Loading...</>
  ) : error ? (
    <>An Error occured</>
  ) : (
    <iframe
      title={file?.name}
      src={file?.url}
      sandbox='allow-same-origin'
    ></iframe>
  );
};
