import express from 'express';
import multer from 'multer';
import { authenticate, buildSubmit } from '../util';
import { submitController } from '../controllers';

const router = express.Router();
const upload = multer();
router.use(authenticate);

router.route('/')
  .get(submitController.getSubmissions)
;

// Uses the template id
// Get submission
// Uploads submission
// Updates submission
// Removes submission
router.route('/:tid')
  .get(submitController.getSubmission)
  .post(upload.single('file'), buildSubmit, submitController.postSubmission)
  .patch(submitController.patchSubmission)
  .delete(submitController.deleteSubmission)
;

export const Submit = { router, path: "/submit" };
