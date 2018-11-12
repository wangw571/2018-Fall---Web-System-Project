import express from 'express';
import { authenticate } from '../util';
import { orgsController } from '../controllers';
const router = express.Router();

router.use(authenticate);
router.route('/')
  .get(orgsController.getOrganizations)
  .post(orgsController.postOrganizations)
;

router.route('/:org')
  .get(orgsController.getOrganization)
  .post(orgsController.postOrganization)
  .delete(orgsController.deleteOrganization)
;

export const Orgs = { router, path: '/orgs' };
