import express from 'express';
import { getAllReports, addReport, getReportsByWorkerId } from '../controllers/addFormData.js';

const router = express.Router();

// Route for all reports (GET all, POST new)
router.route('/')
    .get(getAllReports)
    .post(addReport);

// Route for reports by worker ID
router.route('/:workerId')
    .get(getReportsByWorkerId);

export default router;
