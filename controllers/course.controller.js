import Course from '../models/course';
import { extractError } from "../utils";
import fs from 'fs';
import cuid from 'cuid';

export function getAllCourse(req, res, next) {
  Course.getAll((err, course) => {
    if (err) {
      req.errors = err;
      req.data = [];
    } else {
      req.data = course;
    }
    next();
  });
}

export function getCourse(req, res, next) {
  Course.get(req.params.alias, (err, course) => {
    if (err) {
      console.log(err);
      req.errors = err;
    } else {
      req.data = course;
    }
    next();
  });
}

export function addCourse(req, res, next) {
  const reqCourse = req.body.course;
  const matches = reqCourse.pdfBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const pdfPath = (matches && matches.length === 3) ? `http://localhost:4000/file/${cuid()}.pdf` : '';
  fs.writeFile(pdfPath, new Buffer(matches[2], 'base64'), { encoding: 'base64' }, (err) => {
    if (!err) {
      const course = new Course({
        active: reqCourse.active,
        code: reqCourse.code,
        name: reqCourse.name,
        time: reqCourse.time,
        pdfPath,
      });
      Course.add(course, (err, course) => {
        if (err) {
          req.errors = extractError(err);
        } else {
        }
        next();
      });
    } else {
      console.log(err);
      next();
    }
  });
}

export function updateCourse(req, res, next) {
  const reqCourse = req.body.course;
  Course.get(reqCourse.id, (err, course) => {
    if (err) {
      req.errors = err;
    } else {
      if (course) {
        let putCourse = {};
        const matches = reqCourse.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const pdfPath = (matches && matches.length === 3) ? `/file/${cuid()}.pdf` : '';
        if (matches && matches.length === 3) {
          fs.writeFileSync(pdfPath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
        }
        reqCourse.active && reqCourse.active !== course.active ? putCourse['active'] = reqCourse.active : null;
        reqCourse.code && reqCourse.code !== course.code ? putCourse['code'] = reqCourse.code : null;
        reqCourse.name && reqCourse.name !== course.name ? putCourse['name'] = reqCourse.name : null;
        reqCourse.time && reqCourse.time !== course.time ? putCourse['time'] = reqCourse.time : null;
        pdfPath && reqCourse.pdfPath !== pdfPath ? putCourse['pdfPath'] = pdfPath : null;
        Course.put(reqCourse.id, putCourse, (err, a) => {
          if (err) {
            req.errors = extractError(err, { password: 'newPassword' });
          }
          next();
        });
      } else {
        req.errors = [{ password: 'Wrong password' }];
        next();
      }
    }
  });
}

export function deleteCourse(req, res, next) {
  const course = req.body.course;
  Course.delete(course.id, (err, course) => {
    if (err) {
      console.log(err);
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function deactiveCourse(req, res, next) {
  const course = req.body.course;
  Course.deactive(course.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function reactiveCourse(req, res, next) {
  const course = req.body.course;
  Course.reactive(course.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}