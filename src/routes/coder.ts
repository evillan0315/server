import { Router } from 'express';
import { getFilesByDirectory, getFileContent, createFile } from '../utils/fileUtils';

const router = Router();

router.get('/', async (req, res) => {
  const { directory, file } = req.query;
  if (file) {
    return res.json(await getFileContent(file as string));
  }
  return res.json(await getFilesByDirectory(directory as string));
});

router.post('/', async (req, res) => {
  const { path: filePath, fileContent } = req.body;
  return res.json(await createFile(filePath, fileContent));
});

export default router;
