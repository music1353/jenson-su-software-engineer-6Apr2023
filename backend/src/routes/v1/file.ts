import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import type { ApiResponse } from '../../types/apiResponse';
import { checkLogin } from '../../middlewares/checkLogin';
import { FileService } from '../../services/file';

const router = express.Router();
const upload = multer();
const fileService = new FileService();

router.post('', checkLogin, upload.single('file'), async (req: Request, res: Response) => {
  const { originalname, buffer, size, mimetype } = req.file;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  const result = await fileService.uploadS3(originalname, buffer, mimetype);
  const data = await fileService.insertOne(
    result.key,
    originalname,
    result.url,
    size,
    mimetype
  );

  response.data = data;
  response.message = 'Upload File success.';
  res.status(201).json(response);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const fileId = parseInt(req.params.id, 10);
    await fileService.deleteOne(fileId);
    
    response.message = 'Delete file success.';
    res.status(204).json(response);
  } catch (err) {
    console.error(err);
    response.message = 'Delete file failed. The File is not exist.';
    res.status(500).json(response);
  }
});

export default router;