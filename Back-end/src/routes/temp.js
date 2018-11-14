import express from 'express';
import multer from 'multer';
import { authenticate, buildTemplate } from '../util';
import { templateController } from '../controllers';

const router = express.Router();
const upload = multer();
router.use(authenticate);
router.route('/')
  .get(templateController.getTemplates)
  .post(upload.single('file'), buildTemplate, templateController.newTemplate)
;
router.route('/:temp')
  .get(templateController.getTemplate)
  .post(templateController.postTemplate)
  .delete(templateController.deleteTemplate)
;

export const Template = { router, path: "/temp" };
