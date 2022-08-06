import { Router } from 'express';
import { s3BaseUrl } from '../constants';
import { createFile, deleteFile, getFile, getFiles } from '../database/models';
import { createSignedUrl, deleteFile as deleteS3File } from '../aws';
import { lookup } from 'mime-types';

const fileRouter = Router()
  .get('/:id', async (req, res) => {
    try {
      const retrievedFile = await getFile(req.params.id);

      if (retrievedFile) {
        const { url: fileUrl } = retrievedFile;

        const viewUrl = `${fileUrl}?response-content-type=${lookup(
          fileUrl
        )}`;

        retrievedFile.url = createSignedUrl(viewUrl);

        res.json(retrievedFile);
      } else {
        res.status(404).json();
      }
    } catch (e) {
      res.status(400).json(e);
    }
  })
  .get('/', async (_req, res) => {
    const retrievedFiles = await getFiles();

    res.status(200).json(retrievedFiles);
  })
  .delete('/:id', async (req, res) => {
    try {
      const fileToDelete = await getFile(req.params.id);

      if (fileToDelete) {
        await deleteFile(req.params.id);
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
      const createdFile = await createFile(fileToCreate);

      createdFile.url = createSignedUrl(fileUrl);

      res.status(201).json(createdFile);
    } catch {
      res.status(400).json('Error creating file');
    }
  });

export default fileRouter;
