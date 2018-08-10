import { Router } from 'express';
import * as Controller from '../controllers/person.controller';
import handler from './handler';
const router = new Router();

router.route('/person/graduated/:graduated').get(Controller.getPeronGraduated, handler);
router.route('/person').get(Controller.getAllPerson, handler);
router.route('/person/:id').get(Controller.getPerson, handler);
router.route('/person').post(Controller.addPerson, handler);
router.route('/person').put(Controller.updatePerson, handler);
router.route('/person/deactive').put(Controller.deactivePerson, handler);
router.route('/person/reactive').put(Controller.reactivePerson, handler);
router.route('/person').delete(Controller.deletePerson, handler);

export default router;
