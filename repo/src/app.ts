import express from 'express';
import { Request } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import setupUser from './util/initusers';

import upload from './routes/upload';
import download from './routes/download';
import apiv1 from './routes/api/v1/index';
import apiv2 from './routes/api/v2/index';

mongoose.connect(config.db_url!).then(()=> setupUser()).catch(console.error);

const app = express();

// allow all cors request
app.use(cors());

// upload
app.use(upload);

// morgan
//app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
morgan.token('body', (req:Request) => JSON.stringify(req.body));

// api
app.use(apiv1);
app.use(apiv2);

// download
app.use(download);

export default app;