import express from 'express';
import { Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';

import upload from './routes/upload';
import download from './routes/download';
import apiv1 from './routes/api/v1/index';


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

// download
app.use(download);

app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
});