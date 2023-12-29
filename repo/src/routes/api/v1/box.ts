import express from 'express';
import { Request, Response } from 'express';
import { Version, Box } from '../../../data_access/DataTypes';
import { marked } from 'marked';
import { dataStore, userStore } from '../../../data_access/StoreFactory';
import { createBoxDir, removeBoxDir } from '../../../util/boxfile';
import { verifyTokenMiddleware } from '../../../util/authtoken';

const router = express.Router();
const store = dataStore();
const users = userStore();

// add a box
router.post('/boxes', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await store.retrieve(req.body.username);
        if (!org) {
            return res.status(204).end();
        }

        // error if already exists
        const boxname = req.body.name;
        if (org.boxes.find(b => b.name === boxname)) {
            return res.status(201).end();
        }

        const box = {
            username: req.body.username,
            name: boxname,
            tag: `${req.body.username}/${boxname}`,
            short_description: req.body.short_description,
            description_markdown: req.body.description || "",
            description_html: marked.parse(req.body.description || ""),
            private: req.body.is_private || true,
            versions: [] as Version[],
            downloads: 0,
            created_at: new Date(),
            updated_at: new Date(),
        } as Box;

        // add a box
        org.boxes = org.boxes || [];
        org.boxes.push(box);
        await store.update(org);

        // create box dir
        await createBoxDir(req.body.username, req.body.name);

        return res.status(200).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// read a box
router.get('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await store.retrieve(req.params.org);
        const box = org.boxes.find(b => b.name === req.params.box);
        if (!box) {
            return res.status(201).end();
        }

        return res.status(200).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// update a box
router.put('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await store.retrieve(req.params.org);
        const box = org.boxes?.find(b => b.name === req.params.box);
        if (!box) {
            return res.status(201).end();
        }

        //box.name = req.body.name;
        box.short_description = req.body.box.short_description || box.short_description;
        box.description_markdown = req.body.box.description || box.description_markdown;
        box.description_html = req.body.box.description ? marked.parse(req.body.box.description) : box.description_html;
        box.private = req.body.box.is_private || box.private;
        box.updated_at = new Date();

        await store.update(org);
        return res.status(200).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});

// delete a box
router.delete('/box/:org/:box', verifyTokenMiddleware, async (req:Request, res:Response) => {
    try {
        const org = await store.retrieve(req.params.org);
        if (!org.boxes) {
            return res.status(201).end();
        }

        const box = org.boxes.find(b => b.name === req.params.box);
        if (!box) {
            return res.status(201).end();
        }

        // remove a box from array
        const index = org.boxes.findIndex(b => b.name === req.params.box);
        org.boxes.splice(index, 1);

        await store.update(org);

        // remove box dir
        await removeBoxDir(req.params.org, req.params.box);

        return res.status(200).json(box).end();
    } catch(err) {
        console.error(err);
        return res.status(500).end();
    }
});


export default router;