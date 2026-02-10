import express from 'express';

import auth from '../middleware/auth.middleware.js';
import { getComplaints, postComplaints, deleteComplaint, putComplaints, getComplaintById, getComplaintsStats } from '../controllers/complaint.controller.js';

const router = express.Router();

//to get the complaint stats
router.get('/complaints/stats', getComplaintsStats);

//to get the complaints
router.get('/complaints', getComplaints)

//to post the complaints
router.post('/complaints', postComplaints)

// to get the complaint by id
router.get('/complaints/:id', getComplaintById)

//to update complaint status
router.put('/complaints/:id/status', auth, putComplaints );

//to delete a complaint
router.delete('/complaints/:id', auth, deleteComplaint);

export default router;