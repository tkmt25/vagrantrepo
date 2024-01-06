import express from 'express';
import { Request, Response } from 'express';
import { marked } from 'marked';
import { removeBoxDir } from '../../../util/boxfile';
import { verifyTokenMiddleware } from '../../../util/authtoken';
import { IBox, IVersion, Organization } from '../../../data_access/DataSchema';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

// add a box
router.post('/boxes', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const username = req.body.username;
        const boxname = req.body.name;

        const org = await Organization.findOne({username: username});
        if (!org) {
            console.info("boxname,username", boxname, username);
            return res.status(StatusCodes.NO_CONTENT).end();
        }

        // error if already exists
        const existBox = org.boxes.find(b => b.name === boxname)
        if (existBox) {
            console.info("exist box", existBox);
            return res.status(StatusCodes.CREATED).end();
        }

        const box = {
            username: username,
            name: boxname,
            tag: `${username}/${boxname}`,
            short_description: req.body.short_description,
            description_markdown: req.body.description || "",
            description_html: marked.parse(req.body.description || ""),
            private: req.body.is_private || true,
            versions: [],
            downloads: 0,
            current_version: null,
            created_at: new Date(),
            updated_at: new Date(),
        } as IBox;
        
        // add a box
        org.boxes.push(box);
        await org.save();

        return res.status(StatusCodes.OK).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// read a box
router.get('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await Organization.findOne({ username: req.params.org });
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === req.params.box);
        if (!box) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        return res.status(StatusCodes.OK).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// update a box
router.put('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await Organization.findOne({ username: req.params.org });
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const box = org.boxes.find(b => b.name === req.params.box);
        if (!box) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        
        box.short_description = req.body.box.short_description || box.short_description;
        box.description_markdown = req.body.box.description || box.description_markdown;
        box.description_html = req.body.box.description ? marked.parse(req.body.box.description) : box.description_html;
        box.private = req.body.box.is_private || box.private;
        box.updated_at = new Date();

        await org.save();

        return res.status(StatusCodes.OK).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

// delete a box
router.delete('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const orgname = req.params.org;
        const boxname = req.params.box;

        const org = await Organization.findOne({username: orgname});
        if (!org) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

        const targetIndex = org.boxes.findIndex(b => b.name === boxname);
        if (targetIndex < 0) {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        const box = org.boxes[targetIndex];
    
        org.boxes.splice(targetIndex, 1);

        // remove box dir
        await removeBoxDir(orgname, boxname);

        // update org
        org.save();
        
        return res.status(StatusCodes.OK).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});


export default router;