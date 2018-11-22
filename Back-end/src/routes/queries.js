import express from 'express';
import { authenticate } from '../util';
import { queriesController } from '../controllers';

const router = express.Router();
router.use(authenticate);

router.route('/')
  .get(queriesController.getQueries)
  .post(queriesController.postQueries)
;

router.route('/:qid')
  .get(queriesController.getQuery)
  .post(queriesController.postQuery)
  .put(queriesController.runQuery)
  .delete(queriesController.deleteQuery)
;

export const Queries = { router, path: '/queries' };
