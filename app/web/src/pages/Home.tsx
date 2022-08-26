import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createFile, deleteFile, getFile, getFiles, uploadFile } from "../api";
import { FileResponse } from "../types";

const timeout = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const Home = () => {
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [updatingFiles, setUpdatingFiles] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const params = useParams();

  console.log({ homePageParams: params });

  const loadFiles = async () => {
    setFilesLoading(true);
    const data = await getFiles();

    setFiles(await data);
    setFilesLoading(false);
  };

  useEffect(() => {
    if (initialLoad) return;

    setInitialLoad(true);

    loadFiles();
  }, [initialLoad]);

  useEffect(() => {
    if (updatingFiles) return;

    loadFiles();
  }, [updatingFiles]);

  const isLoading = filesLoading || updatingFiles;

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          setUpdatingFiles(true);

          const fileToUpload = e.currentTarget.fileToUpload.files[0];

          try {
            const apiResponse = await createFile(fileToUpload.name);

            await uploadFile(apiResponse.url, fileToUpload);

            await timeout(1000);
          } catch {
          } finally {
            fileToUpload.value = null;

            setUpdatingFiles(false);
          }
        }}
      >
        <label>Upload File</label>{" "}
        <input
          name='fileToUpload'
          type={"file"}
          accept='image/*,audio/*,video/*,.pdf'
          aria-label='Upload File'
        />{" "}
        <input type={"submit"} value='Submit' />
      </form>
      {files.map((file) => {
        const decodedFileName = decodeURI(file.name);
        return (
          <div key={decodedFileName}>
            <div>
              <input
                type={"button"}
                onClick={async () => {
                  setUpdatingFiles(true);

                  await deleteFile(file.id);

                  await timeout(1000);

                  setUpdatingFiles(false);
                }}
                value='Delete'
              />{" "}
              <a
                href={file.url}
                target={"_blank"}
                onClick={async (e) => {
                  e.preventDefault();

                  const retrievedFile = await getFile(file.id);

                  window.open(retrievedFile.url, "_blank", "noreferrer");
                }}
                rel='noreferrer'
              >
                {decodedFileName}
              </a>
            </div>
            <div>
              <iframe
                title={file.name}
                src={file.url}
                sandbox='allow-same-origin'
              ></iframe>
            </div>
          </div>
        );
      })}
    </>
  );
};
