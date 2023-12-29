import express from 'express';

import auth from './auth';
import search from './search';
import box from './box';
import version from './version';
import provider from './provider';
import organization from './organization';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/api/v1', auth);
router.use('/api/v1', organization);
router.use('/api/v1', search);
router.use('/api/v1', box);
router.use('/api/v1', version);
router.use('/api/v1', provider);

export default router;