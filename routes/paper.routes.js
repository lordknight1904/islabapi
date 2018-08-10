import { Router } from 'express';
import * as Controller from '../controllers/paper.controller';
import handler from './handler';
const router = new Router();

router.route('/paper').get(Controller.getAllPaper, handler);
router.route('/paper/type/:type').get(Controller.getPaperType, handler);
router.route('/paper/:id').get(Controller.getPaper, handler);
router.route('/paper').post(Controller.addPaper, handler);
router.route('/paper').put(Controller.updatePaper, handler);
router.route('/paper/deactive').put(Controller.deactivePaper, handler);
router.route('/paper/reactive').put(Controller.reactivePaper, handler);
router.route('/paper').delete(Controller.deletePaper, handler);

export default router;
