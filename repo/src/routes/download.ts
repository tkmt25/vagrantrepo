import express from 'express';
import { Request, Response } from 'express';
import config from '../config';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path'
import {dataStore} from '../data_access/StoreFactory';

const router = express.Router();
const store = dataStore();

// get box info
router.head('/:org/:box', async (req:Request, res:Response) => {
    const org = await store.retrieve(req.params.org);
    const box = org.boxes?.find(e => e.name === req.params.box);
    if (!box) {
        return res.status(204).end();
    }
    return res.status(200).end();
});

// get box info
router.get('/:org/:box', async (req:Request, res:Response) => {
    const org = await store.retrieve(req.params.org);
    const box = org.boxes?.find(e => e.name === req.params.box);
    if (!box) {
        return res.status(201).end();
    }

    // update downloads
    box.downloads++;
    await store.update(org);

    return res.status(200).json({
        name: `${box.username}/${box.name}`,
        versions: box.versions?.map(e => {
            return {
                version: e.version,
                providers: e.providers?.map(e => {
                    return {
                        name: e.name,
                        url: e.download_url
                    };
                })
            };
        }),
    }).end();
});

// download box file
router.put('/download/:org/:box/:version/:provider', async (req:Request, res:Response) => {
    const dirPath = path.resolve(config.data_dir, req.params.org, req.params.box);
    const filePath = path.resolve(dirPath, `${req.params.version}-${req.params.provider}.box`);

    return res.download(filePath);
});

export default router;
