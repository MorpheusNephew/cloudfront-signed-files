import React, { useEffect, useState } from "react";
import { FileResponse } from "../../lib/files";
import Axios from "axios";

const timeout = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const App = () => {
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [updatingFiles, setUpdatingFiles] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const loadFiles = async () => {
    setFilesLoading(true);
    const { data } = await Axios.get("/api/files");

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

  return (
    <>
      <h1>File Renderer</h1>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setUpdatingFiles(true);

              const fileToUpload = e.currentTarget.fileToUpload;

              const fileToUploadName = fileToUpload.files[0].name;

              try {
                await Axios.post("/api/files", { name: fileToUploadName });

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
              name="fileToUpload"
              type={"file"}
              accept="image/*,audio/*,video/*,.pdf"
              aria-label="Upload File"
            />{" "}
            <input type={"submit"} value="Submit" />
          </form>
          {files.map((file) => {
            const decodedFileName = decodeURI(file.name);
            return (
              <div key={decodedFileName}>
                <input
                  type={"button"}
                  onClick={async () => {
                    setUpdatingFiles(true);

                    await Axios.delete(`/api/files/${file.id}`);

                    await timeout(1000);

                    setUpdatingFiles(false);
                  }}
                  value="Delete"
                />{" "}
                <span>{decodedFileName}</span>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default App;
