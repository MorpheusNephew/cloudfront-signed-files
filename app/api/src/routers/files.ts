import { Router } from 'express';
import { s3BaseUrl } from '../constants';
import { createFile, deleteFile, getFile, getFiles } from '../database/models';
import { deleteFile as deleteS3File } from '../aws/s3';

const fileRouter = Router()
  .get('/:id', async (req, res) => {
    const retrievedFile = await getFile(req.params.id);

    res.status(200).json(retrievedFile ?? undefined);
  })
  .get('/', async (_req, res) => {
    const retrievedFiles = await getFiles();

    res.status(200).json(retrievedFiles);
  })
  .delete('/:id', async (req, res) => {
    const fileToDelete = await getFile(req.params.id);

    if (fileToDelete) {
      await deleteFile(req.params.id);
      await deleteS3File(fileToDelete.url);
    }

    res.status(204).json();
  })
  .post('/', async (req, res) => {
    const fileName: string = req.body.name;
    const encodedFileName = encodeURI(fileName);

    const fileToCreate = {
      name: encodedFileName,
      url: `${s3BaseUrl}/${encodedFileName}`,
    };

    try {
      const createdFile = await createFile(fileToCreate);

      res.status(201).json(createdFile);
    } catch {
      res.status(400).json('Error creating file');
    }
  });

export default fileRouter;
