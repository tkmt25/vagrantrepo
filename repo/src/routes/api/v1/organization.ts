import express from 'express';
import { Request, Response } from 'express';
import { dataStore, userStore } from '../../../data_access/StoreFactory';
import { verifyTokenMiddleware } from '../../../util/authtoken';

const router = express.Router();
const store = dataStore();
const users = userStore();

// get an organization
router.get('/user/:org', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const org = await store.retrieve(orgname);
        if (!org) {
            return res.status(204).end();
        }

        return res.status(200).json(org).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});



export default router;