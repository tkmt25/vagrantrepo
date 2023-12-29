import express from 'express';
import { Request, Response } from 'express';
import { boxDir, boxFilePath } from '../util/boxfile';
import config from '../config';
import fs from 'fs';
import fsp from 'fs/promises';

const router = express.Router();

// upload a box file
router.put('/upload/:org/:box/:version/:provider', express.raw({ type: 'application/octet-stream', limit: config.file_limit }), async (req:Request, res:Response) => {
    const org = req.params.org;
    const box = req.params.box;
    const version = req.params.version;
    const provider = req.params.provider;
    const boxdir = boxDir(org, box);

    try {
        await fsp.mkdir(boxdir, {recursive: true});

        const boxfilePath = boxFilePath(org, box, version, provider);
        const stream = fs.createWriteStream(boxfilePath);
        req.pipe(stream);
        
        stream.on('finish', async () => {
            res.status(200).send('upload complete');
        });
        stream.on('error', (err) => {
            throw err;
        });

    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

export default router;
