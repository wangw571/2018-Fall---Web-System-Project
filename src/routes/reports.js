import express from 'express';
import { authenticate } from '../util';
import { reportsController } from '../controllers';

const router = express.Router();
router.use(authenticate);

router.route('/')
  .get(reportsController.getReports)
  .post(reportsController.postReports)
;

router.route('/:rid')
  .get(reportsController.getReport)
  .post(reportsController.postReport)
  .delete(reportsController.deleteReport)
;

export const Reports = { router, path: '/report' };
