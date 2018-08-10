import Person from '../models/person';
import { extractError } from "../utils";
import fs from 'fs';
import cuid from 'cuid';

export function getPeronGraduated(req, res, next) {
  Person.getPersonType(req.params.graduated, (err, paper) => {
    if (err) {
      req.errors = err;
      req.data = [];
    } else {
      req.data = paper;
    }
    next();
  });
}
export function getAllPerson(req, res, next) {
  Person.getAll((err, person) => {
    if (err) {
      req.errors = err;
      req.data = [];
    } else {
      req.data = person;
    }
    next();
  });
}

export function getPerson(req, res, next) {
  Person.get(req.params.id, (err, person) => {
    if (err) {
      req.errors = err;
    } else {
      req.data = person;
    }
    next();
  });
}

export function addPerson(req, res, next) {
  const reqPerson = req.body.person;
  const matches = reqPerson.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (matches && matches.length !== 3) {
    return new Error('Invalid input string');
  } else {
    const imagePath = `image/${cuid()}.${matches[1].split('/')[1]}`;
    fs.writeFile(imagePath, new Buffer(matches[2], 'base64'), { encoding: 'base64' }, (err) => {
      if (!err) {
        const classObj = new Person({
          graduated: reqPerson.graduated,
          name: reqPerson.name,
          field: reqPerson.field,
          time: reqPerson.time,
          email: reqPerson.email,
          title: reqPerson.title,
          occupation: reqPerson.occupation,
          profilePage: reqPerson.profilePage,
          imagePath,
        });
        Person.add(classObj, (err, classObj) => {
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
}

export function updatePerson(req, res, next) {
  const reqPerson = req.body.person;
  Person.get(reqPerson.id, (err, person) => {
    if (err) {
      req.errors = err;
    } else {
      if (person) {
        const matches = reqPerson.file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let putPerson = {};
        const imagePath = (matches && matches.length !== 3) ? `image/${cuid()}.${matches[1].split('/')[1]}` : '';
        if (matches && matches.length !== 3) {
          fs.writeFileSync(imagePath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
        }
        reqPerson.name && reqPerson.name !== person.name ? putPerson['name'] = reqPerson.name : null;
        reqPerson.field && reqPerson.field !== person.field ? putPerson['field'] = reqPerson.field : null;
        reqPerson.email && reqPerson.email !== person.email ? putPerson['email'] = reqPerson.email : null;
        reqPerson.title && reqPerson.name !== person.name ? putPerson['name'] = reqPerson.name : null;
        reqPerson.occupation && reqPerson.occupation !== person.occupation ? putPerson['occupation'] = reqPerson.occupation : null;
        imagePath !== '' && imagePath !== person.imagePath ? putPerson['imagePath'] = imagePath : null;
        reqPerson.profilePage && reqPerson.profilePage !== person.profilePage ? putPerson['profilePage'] = reqPerson.profilePage : null;
        Person.put(reqPerson.id, putPerson, (err, a) => {
          if (err) {
            req.errors = extractError(err, { password: 'newPassword' });
          }
          next();
        });
      } else {
        console.log('not exist');
        next();
      }
    }
  });
}

export function deletePerson(req, res, next) {
  const person = req.body.person;
  Person.delete(person.id, (err, person) => {
    if (err) {
      console.log(err);
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function deactivePerson(req, res, next) {
  const person = req.body.person;
  Person.deactive(person.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function reactivePerson(req, res, next) {
  const person = req.body.person;
  Person.reactive(person.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}