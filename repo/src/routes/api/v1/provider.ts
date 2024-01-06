import express from 'express';
import { Request, Response } from 'express';
import { deleteBoxFiles} from '../../../util/boxfile';
import config from '../../../config';
import { verifyTokenMiddleware } from '../../../util/authtoken';
import { IOrganization, Organization, IProvider } from '../../../data_access/DataSchema';
import { StatusCodes } from 'http-status-codes';
import { arch } from 'os';

const router = express.Router();

function getVersion(org:IOrganization|undefined, boxname:string, versionname:string) {
    if (!org) {
        return null;
    }
    const box = org.boxes.find(b => b.name === boxname);
    if (!box) {
        return null;
    }
    return box.versions.find(v => v.version === versionname);
}

function getProvider(org:IOrganization|undefined, boxname:string, versionname:string, providername:string, architecture:string|undefined=undefined) {
    const version = getVersion(org, boxname, versionname);
    if (!version) {
        return null;
    }
    if (!architecture) {
        return version.providers.find(p => p.name === providername);
    }

    return version.providers.find(p => p.name === providername && p.architecture === architecture);
}

// add a provider
router.post('/box/:org/:box/version/:version/providers', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;

        const org = await Organization.findOne({username: orgname});
        const version = getVersion(org!, boxname, versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const providername = req.body.provider.name;

        // already exists
        const archname = req.body.provider.architecture || "";
        let searchExistQuery = (provider:IProvider) => provider.name === providername;
        if (archname) {
            searchExistQuery = (provider:IProvider) => provider.name === providername && provider.architecture === archname;
        }
        
        if (version.providers.find(searchExistQuery)) {
            return res.status(StatusCodes.CREATED).end();
        }

        const provider = {
            name: providername,
            download_url: req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}/${archname}`,
            original_url: req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}/${archname}`,
            hosted: req.body.provider.url ? false : true,
            checksum: req.body.checksum,
            checksum_type: req.body.checksum_type,
            architecture: req.body.provider.architecture,
            default_architecture: req.body.provider.default_architecture,
            created_at: new Date(),
            updated_at: new Date(),
        } as IProvider;

        version.providers = version.providers || [];
        version.providers.push(provider);

        await org?.save();
        return res.status(StatusCodes.OK).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// read a provider
router.get('/box/:org/:box/version/:version/provider/:provider/:architecture?',  verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;
        const archname = req.params.architecture;

        const org = await Organization.findOne({username: orgname});
        const provider = getProvider(org!, boxname, versionname, providername, archname);
        if (!provider) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        return res.status(StatusCodes.OK).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});


// update a provider
router.put('/box/:org/:box/version/:version/provider/:provider/:architecture?',  verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;
        const archname = req.params.architecture || "";

        const org = await Organization.findOne({username: orgname});
        const provider = getProvider(org!, boxname, versionname, providername, archname);
        if (!provider) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        // todo: checksum, checksum_type, architecture, default_architecture
        provider.name = req.body.provider.name;
        provider.download_url = req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}/${archname}`,
        provider.original_url = req.body.provider.url || `${config.base_url}/download/${orgname}/${boxname}/${versionname}/${providername}/${archname}`,
        provider.updated_at = new Date();

        await org?.save();
        return res.status(StatusCodes.OK).json(provider).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// delete a provider
router.delete('/box/:org/:box/version/:version/provider/:provider/:architecture?', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;
        const versionname = req.params.version;
        const providername = req.params.provider;
        const archname = req.params.architecture || "";

        const org = await Organization.findOne({username: orgname})
        const version = getVersion(org!, boxname, versionname);
        if (!version) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        // remove a box from array
        let query = (p:IProvider) => p.name === providername;
        if (archname) {
            query = (p:IProvider) => p.name === providername && p.architecture === archname;
        }

        const index = version.providers.findIndex(query);
        if (index < 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        version.providers.splice(index, 1);
        await org?.save();

        // remove box file
        await deleteBoxFiles(orgname, boxname, versionname, providername, archname);

        return res.status(StatusCodes.OK).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// get upload url(for v1)
router.get('/box/:org/:box/version/:version/provider/:provider/upload/direct', (req:Request, res:Response) => {
    const org = req.params.org;
    const box = req.params.box;
    const version = req.params.version;
    const provider = req.params.provider;

    return res.status(StatusCodes.OK).json({
        upload_path: `${config.base_url}/upload/${org}/${box}/${version}/${provider}`
    }).end();
});

router.get('/box/:org/:box/version/:version/provider/:provider/:architecture/upload/direct', (req:Request, res:Response) => {
    const org = req.params.org;
    const box = req.params.box;
    const version = req.params.version;
    const provider = req.params.provider;
    const arch = req.params.architecture;

    return res.status(StatusCodes.OK).json({
        upload_path: `${config.base_url}/upload/${org}/${box}/${version}/${provider}/${arch}`
    }).end();
});

export default router;