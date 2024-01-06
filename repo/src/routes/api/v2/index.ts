import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import auth from '../v1/auth';
import search from '../v1/search';
import box from '../v1/box';
import version from '../v1/version';
import provider from '../v1/provider';
import organization from '../v1/organization';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(ExpressMongoSanitize());

router.use('/api/v2', auth);
router.use('/api/v2', organization);
router.use('/api/v2', search);
router.use('/api/v2', box);
router.use('/api/v2', version);
router.use('/api/v2', provider);


export default router;