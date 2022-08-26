import { Router } from 'express';
import { s3BaseUrl } from '../constants';
import { FileModel } from '../database/models';
import {
  addSignedCookies,
  createSignedUrl,
  deleteFile as deleteS3File,
} from '../aws';
import { lookup } from 'mime-types';

const fileRouter = Router()
  .get('/:id', async (req, res) => {
    try {
      const retrievedFile = await FileModel.getFile(req.params.id);

      if (retrievedFile) {
        const { url: fileUrl } = retrievedFile;

        retrievedFile.url = `${fileUrl}?response-content-type=${lookup(fileUrl)}`;

        addSignedCookies(res, retrievedFile.url);

        res.json(retrievedFile);
      } else {
        res.status(404).json();
      }
    } catch (e) {
      res.status(400).json(e);
    }
  })
  .get('/:id/download', async (req, res) => {
    try {
      const retrievedFile = await FileModel.getFile(req.params.id);

      if (retrievedFile) {
        const { url: fileUrl } = retrievedFile;

        retrievedFile.url = createSignedUrl(fileUrl);

        res.json(retrievedFile);
      } else {
        res.status(404).json();
      }
    } catch (e) {
      res.status(400).json(e);
    }
  })
  .get('/', async (_req, res) => {
    const retrievedFiles = await FileModel.getFiles();

    res.status(200).json(retrievedFiles);
  })
  .delete('/:id', async (req, res) => {
    try {
      const fileToDelete = await FileModel.getFile(req.params.id);

      if (fileToDelete) {
        await FileModel.deleteFile(req.params.id);
        await deleteS3File(fileToDelete.url);

        res.status(204).json();
      } else {
        res.status(404).json();
      }
    } catch (e) {
      res.status(400).json();
    }
  })
  .post('/', async (req, res) => {
    const fileName: string = req.body.name;
    const encodedFileName = encodeURI(fileName);

    const fileUrl = `${s3BaseUrl}/${encodedFileName}`;

    const fileToCreate = {
      name: encodedFileName,
      url: fileUrl,
    };

    try {
      const createdFile = await FileModel.createFile(fileToCreate);

      createdFile.url = createSignedUrl(fileUrl);
      res.status(201).json(createdFile);
    } catch (e) {
      console.error(e);
      res.status(400).json('Error creating file');
    }
  });

export default fileRouter;
