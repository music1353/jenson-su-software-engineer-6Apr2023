import express from 'express';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/apiResponse';
import { checkLogin } from '../../middlewares/checkLogin';
import { ProfileService } from '../../services/profile';

const router = express.Router();
const profileService = new ProfileService();

router.post('', checkLogin, async (req: Request, res: Response) => {
  const { name } = req.body;
  const response: ApiResponse = {
    message: '',
    data: null
  }
  
  try {
    const data = await profileService.create(req.session.uid, name);

    response.data = data;
    response.message = 'Create profile success';
    res.status(201).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Create profile failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.get('/me', checkLogin, async (req: Request, res: Response) => {
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const data = await profileService.findOneByUid(req.session.uid);

    response.data = data;
    response.message = 'Get profile success';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Get profile failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.put('/:id', checkLogin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    await profileService.updateOne(id, req.body);

    response.message = 'Update profile success.';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Update profile failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.put("/:id/setting", checkLogin, async (req: Request, res: Response) => {
  const profileId = parseInt(req.params.id);
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    await profileService.updateOneSetting(profileId, req.body);

    response.message = 'Update profile setting success.';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Update profile setting failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.get('/user/:uid', async (req: Request, res: Response) => {
  const uid = req.params.uid;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const data = await profileService.findOneByUid(uid);
    if (!data) {
      response.message = 'Get profile failed. Please check the userId is correct.';
      res.status(404).json(response);
      return
    }

    delete data.setting.passCode;
    response.data = data;
    response.message = 'Get profile success';
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Get profile failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.post('/pass',  async (req: Request, res: Response) => {
  const { uid, passCode } = req.body;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const data = await profileService.findOneByUid(uid);
    if (!data) {
      response.message = 'Pass profile failed. Please check the url is correct.';
      res.status(404).json(response);
      return
    }
    
    if (data.setting.passCode === passCode) {
      response.message = 'Pass profile success.';
      res.status(200).json(response);
    } else {
      response.message = 'Pass profile failed. Please check the passcode is correct.';
      res.status(400).json(response);
    }
  } catch (error) {
    console.error(error.message);

    response.message = 'Pass profile failed. Please try again later.';
    res.status(500).json(response);
  }
});

export default router;