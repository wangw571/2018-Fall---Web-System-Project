import express from 'express';
import { queriesController } from '../controllers';
import { authenticate } from '../util';
const router = express.Router();

router.use(authenticate);
router.route('/')
  .get(queriesController.getQueries)
  .post(queriesController.postQueries)
;

router.route('/:qid')
  .get(queriesController.getQuery)
  .post(queriesController.postQuery)
  .move(queriesController.runQuery)
  .delete(queriesController.deleteQuery)
;

export const Queries = { router, path: '/queries' };
