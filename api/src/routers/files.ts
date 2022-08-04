import { Router } from "express";
import { FileRequest } from "../../../lib/files";
import { createFile, deleteFile, getFile, getFiles } from "../database/models";

const fileRouter = Router()
  .get("/:id", async (req, res) => {
    const retrievedFile = await getFile(req.params.id);

    res.status(200).json(retrievedFile ?? undefined);
  })
  .get("/", async (_req, res) => {
    const retrievedFiles = await getFiles();

    res.status(200).json(retrievedFiles);
  })
  .delete("/:id", async (req, res) => {
    await deleteFile(req.params.id);

    res.status(204).json();
  })
  .post("/", async (req, res) => {
    const fileName: string = req.body.name;
    const encodedFileName = encodeURI(fileName);

    const fileToCreate = {
      name: encodedFileName,
      url: `https://somecloudfrontUrlToS3.com/${encodedFileName}`,
    };

    try {
      const createdFile = await createFile(fileToCreate);

    res.status(201).json(createdFile);
    } catch {
      res.status(400).json("Error creating file");
    }
  });

export default fileRouter;
