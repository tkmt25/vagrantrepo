import express from 'express';
import { Request, Response } from 'express';
import { dataStore } from '../../../data_access/StoreFactory';
import config from '../../../config';
import { verifyTokenMiddleware } from '../../../util/authtoken';

const router = express.Router();
const store = dataStore();

// search box
router.get('/search', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const query = (req.query.q || "") as string;
        const provider = req.query.provider as string;
        const sort = (req.query.sort || "downloads") as string;
        const order = (req.query.order || "desc") as string;
        const limit = (req.query.limit || 10) as number;
        const page = (req.query.page || 1) as number;

        const boxes = await store.search(query, provider, sort, order, limit, page);
        return res.status(200).json(boxes).end();
    } catch(err) {
        return res.status(500).end();
    }
});



export default router;