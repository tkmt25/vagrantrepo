import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import config from "../config";

// create or read keypair
const getKeyPair = (): { publicKey: string; privateKey: string } => {
    if (!fs.existsSync(config.public_key_path)) {
        const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        fs.writeFileSync(config.public_key_path, publicKey, 'utf8');
        fs.writeFileSync(config.private_key_path, privateKey, 'utf8');
    }

    const publicKey = fs.readFileSync(config.public_key_path, 'utf8');
    const privateKey = fs.readFileSync(config.private_key_path, 'utf8');
    return { publicKey, privateKey };
};
const { publicKey, privateKey } = getKeyPair();

interface TokenPayload {
    username: string;
}

function createAuthToken(payload: TokenPayload):string {
    const token = jwt.sign(
        { 
            username: payload.username 
        } as TokenPayload
    , privateKey, { algorithm: 'RS256' });
    return token;
}


function verifyTokenMiddleware(req:Request, res:Response, next:NextFunction) {
    const authzHeader = req.headers['authorization'];
    if (!authzHeader) {
        return res.status(401).end();
    }

    const token = authzHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, publicKey);
        res.locals.token = decode;
        next();
    } catch(e) {
        return res.status(401).end();
    }
}


export {verifyTokenMiddleware, createAuthToken, TokenPayload};

