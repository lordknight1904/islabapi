import { Router } from 'express';
import * as Controller from '../controllers/course.controller';
import handler from './handler';
const router = new Router();

router.route('/course').get(Controller.getAllCourse, handler);
router.route('/course/:alias').get(Controller.getCourse, handler);
router.route('/course').post(Controller.addCourse, handler);
router.route('/course').put(Controller.updateCourse, handler);
router.route('/course/deactive').put(Controller.deactiveCourse, handler);
router.route('/course/reactive').put(Controller.reactiveCourse, handler);
router.route('/course').delete(Controller.deleteCourse, handler);

export default router;
