import express from 'express';
import { Request, Response } from 'express';
import { marked } from 'marked';
import { deleteBoxFiles} from '../../../util/boxfile';
import config from '../../../config';
import { verifyTokenMiddleware } from '../../../util/authtoken';
import { IVersion, Organization, Status} from '../../../data_access/DataSchema';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const router = express.Router();

const latestVersion = (versions: IVersion[]) => {
    return versions.reduce((latest:IVersion | undefined, version) => {
        if (!version) {
            return latest;
        }
        if (!latest || version.version.localeCompare(latest.version) > 0) {
            return version;
        }
        return latest;
    }, undefined);
};

// add a version
router.post('/box/:org/:box/versions', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.body.version.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        // already exists
        const existsVersion = box.versions.find(v => v.version === versionname);
        if (existsVersion) {
            return res.status(StatusCodes.CREATED).json(existsVersion).end();
        }

        const version = {
            status: Status.Unreleased,
            version: versionname,
            number: versionname,
            description_markdown: req.body.version.description,
            description_html: marked.parse(req.body.version.description || ""),
            release_url: `${config.base_url}/${orgname}/${boxname}/version/${versionname}/release`,
            revoke_url: `${config.base_url}/${orgname}/${boxname}/version/${versionname}/revoke`,
            providers: [], 
            created_at: new Date(),
            updated_at: new Date()
        } as IVersion;

        box.versions.push(version);

        // update current version
        box.current_version = (await latestVersion(box.versions))!;
        await org.save();
        
        return res.status(StatusCodes.OK).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// read a version
router.get('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        return res.status(StatusCodes.OK).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});


// update a version
router.put('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }

        //version.version = req.body.version;
        version.description_markdown = req.body.version.description || version.description_markdown;
        version.description_html = req.body.version.description ? marked.parse(req.body.version.description) : version.description_html;
        version.updated_at = new Date();

        // update current version
        box.current_version = latestVersion(box.versions)!;

        await org.save();
        return res.status(StatusCodes.OK).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// delete a version
router.delete('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        // remove a box from array
        const index = box.versions.findIndex(b => b.version === versionname);
        box.versions?.splice(index, 1);
        
        // update current version
        box.current_version = latestVersion(box.versions)!;

        await org.save();

        // remove box file
        await deleteBoxFiles(orgname, boxname, versionname);

        return res.status(StatusCodes.OK).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// release version 
router.put('/box/:org/:box/version/:version/release', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        version.status = Status.Active;
        await org.save();

        return res.status(StatusCodes.OK).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// revoke version 
router.put('/box/:org/:box/version/:version/revoke', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        version.status = Status.Unreleased;
        await org.save();

        return res.status(StatusCodes.OK).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

export default router;