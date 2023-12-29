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

// add a provider
router.post('/box/:org/:box/version/:version/providers', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        const version = box?.versions.find(v => v.version == versionname);
        if (!version) {
            return res.status(204).end();
        }

        const providername = req.body.provider.name;

        // already exists
        if (version.providers.find(p => p.name === providername)) {
            return res.status(201).end();
        }

        const provider = {
            name: providername,
            download_url: req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}`,
            original_url: req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}`,
            checksum: req.body.checksum,
            checksum_type: req.body.checksum_type,
            created_at: new Date(),
            updated_at: new Date(),
        } as Provider;

        version.providers = version.providers || [];
        version.providers.push(provider);

        await store.update(org);
        return res.status(200).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// read a provider
router.get('/box/:org/:box/version/:version/provider/:provider',  verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
        }
        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }
        const provider = version.providers.find(p => p.name == providername);
        if (!provider) {
            return res.status(204).end();
        }

        return res.status(200).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});


// update a provider
router.put('/box/:org/:box/version/:version/provider/:provider',  verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
        }
        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }
        const provider = version.providers.find(p => p.name == providername);
        if (!provider) {
            return res.status(204).end();
        }

        // provider.name = req.body.provider.name;
        provider.download_url = req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}`,
        provider.original_url = req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}`,
        provider.updated_at = new Date();

        await store.update(org);
        return res.status(200).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// delete a provider
router.delete('/box/:org/:box/version/:version/provider/:provider', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;

        const org = await store.retrieve(orgname);
        const box = org.boxes.find(b => b.name === boxname);
        if (!box) {
            return res.status(204).end();
        }
        const version = box.versions.find(v => v.version === versionname);
        if (!version) {
            return res.status(204).end();
        }
        const provider = version.providers?.find(p => p.name == providername);
        if (!provider) {
            return res.status(204).end();
        }

        // remove a box from array
        const index = version.providers.findIndex(p => p.name === providername);
        version.providers.splice(index, 1);
        await store.update(org);

        // remove box file
        await deleteBoxFiles(orgname, boxname, versionname, providername);

        return res.status(200).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// get upload url
router.get('/box/:org/:box/version/:version/provider/:provider/upload/direct', (req:Request, res:Response) => {
    const org = req.params.org;
    const box = req.params.box;
    const version = req.params.version;
    const provider = req.params.provider;

    return res.status(200).json({
        upload_path: `${config.base_url}/upload/${org}/${box}/${version}/${provider}`
    }).end();
});

export default router;