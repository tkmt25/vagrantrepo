import express from 'express';
import { Request, Response } from 'express';
import config from '../config';
import path from 'path'
import { StatusCodes } from 'http-status-codes';
import { Organization } from '../data_access/DataSchema';

const router = express.Router();

// get box info
router.head('/:org/:box', async (req:Request, res:Response) => {
    const org = await Organization.findOne({
        'username': req.params.org,
        'boxes': {
            $elemMatch: { name: req.params.box }
        }
    });
    if (!org || org.boxes.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).end();
    }

    const box = org.boxes[0];
    if (!box) {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
    return res.status(StatusCodes.OK).type('application/json').end();
});

// get box
router.get('/:org/:box', async (req:Request, res:Response) => {
    const org = await Organization.findOne({
        'username': req.params.org,
        'boxes': {
            $elemMatch: { name: req.params.box }
        }
    });
    if (!org || org.boxes.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).end();
    }

    const box = org.boxes[0];
    // update downloads
    box.downloads++;
    await org.save();
    
    return res.status(StatusCodes.OK).json({
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
router.get('/download/:org/:box/:version/:provider/:architecture?', async (req:Request, res:Response) => {
    const dirPath = path.resolve(config.data_dir, "org", req.params.org, req.params.box);
    let boxfileName = `${req.params.version}-${req.params.provider}`;
    if (req.params.architecture) {
        boxfileName += `-${req.params.architecture}`;
    }
    const filePath = path.resolve(dirPath, `${boxfileName}.box`);

    return res.download(filePath);
});

export default router;
