import express from 'express';
import AuthRouter from './auth';
import FileRouter from './file';
import ProfileRouter from './profile';
import ExpereneceRouter from './experience';

const v1Router = express.Router();
v1Router.use('/auth', AuthRouter);
v1Router.use('/file', FileRouter);
v1Router.use('/profile', ProfileRouter);
v1Router.use('/experience', ExpereneceRouter);

export default v1Router;


