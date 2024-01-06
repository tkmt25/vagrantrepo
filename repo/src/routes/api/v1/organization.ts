import express from 'express';
import { Request, Response } from 'express';
import { verifyTokenMiddleware } from '../../../util/authtoken';
import { Organization } from '../../../data_access/DataSchema';
import { StatusCodes } from 'http-status-codes';
import { marked } from 'marked';

const router = express.Router();

// get an organization
router.get('/user/:org', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const org = await Organization.findOne({ username: orgname });
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        return res.status(StatusCodes.OK).json(org).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// add an organization
router.post('/users', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.body.username;

        const existOrg = await Organization.findOne({ username: orgname });
        if (existOrg) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const org = new Organization({
            username: orgname,
            avatar_url: req.body.avatar_url || "",
            profile_html: req.body.profile_html || "",
            profile_markdown: req.body.profile_html ? marked(req.body.profile_html) : "",
            boxes: [],
        });
        await org.save();

        return res.status(StatusCodes.OK).json(org).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

export default router;