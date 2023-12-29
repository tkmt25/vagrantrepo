import express from 'express';
import { Request, Response } from 'express';
import { Version, Status, Provider } from '../../../data_access/DataTypes';
import { marked } from 'marked';
import { dataStore } from '../../../data_access/StoreFactory';
import { deleteBoxFiles} from '../../../util/boxfile';
import config from '../../../config';
import { verifyTokenMiddleware } from '../../../util/authtoken';

const router = express.Router();
const store = dataStore();

const latestVersion = (versions: Version[]) => {
    return versions.reduce((latest:Version|undefined, version) => {
        if (!latest || version.version.localeCompare((latest as Version).version) > 0) {
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

        const org = await store.retrieve(orgname);
        const box = org.boxes?.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
        }

        // already exists
        if (box.versions.find(v => v.version === versionname)) {
            return res.status(201).end();
        }

        const version = {
            status: Status.Unreleased,
            version: versionname,
            description_markdown: req.body.version.description,
            description_html: marked.parse(req.body.version.description || ""),
            release_url: `${config.base_url}/${orgname}/${boxname}/version/${versionname}/release`,
            revoke_url: `${config.base_url}/${orgname}/${boxname}/version/${versionname}/revoke`,
            providers: [] as Provider[], 
            updated_at: new Date(),
        } as Version;

        box.versions = box.versions || [];
        box.versions.push(version);

        // update current version
        box.current_version = latestVersion(box.versions);

        await store.update(org);
        return res.status(200).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// read a version
router.get('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
        }
        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }

        return res.status(200).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});


// update a version
router.put('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
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
        box.current_version = latestVersion(box.versions);

        await store.update(org);
        return res.status(200).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// delete a version
router.delete('/box/:org/:box/version/:version', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        if (!org.boxes) {
            return res.status(204).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(204).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }

        // remove a box from array
        const index = box.versions.findIndex(b => b.version === versionname);
        box.versions?.splice(index, 1);
        
        // update current version
        box.current_version = latestVersion(box.versions);

        await store.update(org);

        // remove box file
        await deleteBoxFiles(orgname, boxname, versionname);

        return res.status(200).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// release version 
router.put('/box/:org/:box/version/:version/release', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        if (!org.boxes) {
            return res.status(204).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(204).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }

        version.status = Status.Active;
        await store.update(org);

        return res.status(200).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// revoke version 
router.put('/box/:org/:box/version/:version/revoke', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        if (!org.boxes) {
            return res.status(204).end();
        }

        const box = org.boxes.find(b => b.name === boxname);
        if (!box || !box.versions) {
            return res.status(204).end();
        }

        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }

        version.status = Status.Unreleased;
        await store.update(org);

        return res.status(200).json(version).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

export default router;