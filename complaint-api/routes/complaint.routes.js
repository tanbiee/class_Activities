import express from 'express';

import auth from '../middleware/auth.middleware.js';
import { getComplaints, postComplaints, deleteComplaint, putComplaints } from '../controllers/complaint.controller.js';

const router = express.Router();

//to get the complaints
router.get('/complaints', getComplaints)
//to post the complaints
router.post('/complaints', postComplaints)

router.put('/complaints/:id/resolve', auth, putComplaints );

router.delete('/complaints/:id', auth, deleteComplaint);

export default router;