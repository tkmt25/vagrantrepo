import express from 'express';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { userStore } from '../../../data_access/StoreFactory';
import { TokenPayload, createAuthToken, verifyTokenMiddleware } from '../../../util/authtoken';

const router = express.Router();
const store = userStore();

// create token 
router.post('/authenticate', async (req: Request, res: Response) => {
    const username = req.body.user.login;
    const password = req.body.user.password;

    // verify user
    try {
        const user = await store.retrieve(username);
        const sha1 = crypto.createHash('sha1');
        sha1.update(password);
        const hash = sha1.digest('hex');
        if (hash !== user.passwordHash) {
            return res.status(401).end();
        }
    } catch (e) {
        console.error(e);
        return res.status(401).end();
    }

    // create token
    const token = createAuthToken({username} as TokenPayload);
    const hash = crypto.createHash('sha256');
    hash.update(token);

    return res.status(200)
        .set('Authorization', `Bearer ${token}`)
        .json({
            token: token,
            token_hash: hash.digest('hex'),
            created_at: new Date(),
        }).end();
});

// verify token
router.get('/authenticate', verifyTokenMiddleware, async (req: Request, res: Response) => {
    return res.status(200).end();
});

// delete token 
router.delete('/authenticate', verifyTokenMiddleware, async (req: Request, res: Response) => {
    return res.status(200).end();
});

export default router;