import express from 'express';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/apiResponse';
import { checkLogin } from '../../middlewares/checkLogin';
import { ExpService } from '../../services/experience';
import { FileService } from '../../services/file';

const router = express.Router();
const expService = new ExpService();
const fileService =  new FileService();

router.post('', checkLogin, async (req: Request, res: Response) => {
  const reqData = req.body;
  const response: ApiResponse = {
    message: '',
    data: null
  }
  
  try {
    const data = await expService.insertOne(reqData);
    
    response.data = data;
    response.message = 'Insert one experience success';
    res.status(201).json(response);
  } catch (error) {
    console.error(error.message);
    
    response.message = 'Insert one experience failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.put('/:id', checkLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    await expService.updateOne(id, req.body);

    response.message = 'Update experience success.';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Update experience failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.delete('/:id', checkLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  let fileId: number;
  const expData = await expService.findOne(id);
  if (expData.logo) {
    fileId = expData.logo.id;
  }

  try {
    await expService.deleteOne(id);

    if (fileId) {
      await fileService.deleteOne(fileId);
      console.log('Delete file success:', fileId);
    }

    response.message = 'Delete experience success.';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Delete experience failed. Please try again later.';
    res.status(500).json(response);
  }
});

export default router;