import express from 'express';
import { Request, Response } from 'express';
import { verifyTokenMiddleware } from '../../../util/authtoken';
import { StatusCodes } from 'http-status-codes';
import { Organization } from '../../../data_access/DataSchema';

const router = express.Router();

// search box
router.get('/search', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const query = (req.query.q || "") as string;
        const provider = req.query.provider;
        const architecture = req.query.architecture;
        const sort = (req.query.sort || "downloads") as string;
        const order = (req.query.order == "asc") ? 1  : -1;
        const limit = (req.query.limit || 10) as number;
        const page = (req.query.page || 1) as number;

        const startIndex = (page - 1) * limit;

        let searchQuery: { [key: string]: any }  = {
            'boxes': {
                $elemMatch: {
                    $or: [
                        { 'name': new RegExp(query, 'i') },
                        { 'username': new RegExp(query, 'i') },
                        { 'short_description': new RegExp(query, 'i') },
                    ]
                }
            },
        };

        if (provider) searchQuery['boxes.providers.name'] = provider as string;
        if (architecture) searchQuery['boxes.providers.architecture'] = architecture;

        const orgs = await Organization.find()
            .limit(limit)
            .skip(startIndex)
            .sort({ [`boxes.${sort}`]: order });
        
        const boxes = orgs.flatMap(o => o.boxes);
        return res.status(StatusCodes.OK).json(boxes).end();
    } catch(err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});



export default router;