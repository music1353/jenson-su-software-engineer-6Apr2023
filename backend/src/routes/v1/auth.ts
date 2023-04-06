import express from 'express';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/apiResponse';
import { checkLogin } from '../../middlewares/checkLogin';
import { AuthService } from '../../services/auth';
import { ProfileService } from '../../services/profile';

const router = express.Router();
const authService = new AuthService();
const profileService = new ProfileService();

router.post('/register', async (req: Request, res: Response) => {
  const { identifier, credential, username } = req.body;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  const exist = await authService.checkIsAccountExist(identifier);
  if (exist) {
    response.message = 'Sign up failed. The email has already been registered.';
    res.status(400).json(response);
    return
  }

  try {
    const auth = await authService.create(identifier, credential, username);
    await profileService.create(auth.uid, username);

    response.message = 'Sign up success.';
    res.status(201).json(response);
  } catch (error) {
    console.error(error.message);

    response.message = 'Sign up failed. Please try again later.';
    res.status(500).json(response);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { identifier, credential } = req.body;
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const auth = await authService.getAuthenticatedData(identifier, credential);

    req.session.uid = auth.uid;
    
    response.message = 'Login success.';
    response.data = auth;
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    
    response.message = 'Login failed.';
    res.status(400).json(response);
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const response: ApiResponse = {
    message: '',
    data: null
  }

  if (req.session?.uid) {
    delete req.session.uid;
  }

  response.message = 'Logged out scuccess.';
  res.status(200).json(response);
});

router.get('', checkLogin, async (req: Request, res: Response) => {
  const response: ApiResponse = {
    message: '',
    data: null
  }

  try {
    const auth = await authService.findOne(req.session.uid);
    response.message = 'Get auth data success.';
    response.data = auth;
    res.status(200).json(response);
  } catch (err) {
    response.message = 'Get auth data failed.';
    res.status(400).json(response);
  }
})

export default router;