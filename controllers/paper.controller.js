import Paper from '../models/paper';
import { extractError } from "../utils";
import fs from 'fs';
import cuid from 'cuid';

export function getPaperType(req, res, next) {
  Paper.getPaperType(req.params.type, (err, paper) => {
    if (err) {
      req.errors = err;
      req.data = [];
    } else {
      req.data = paper;
    }
    next();
  });
}
export function getAllPaper(req, res, next) {
  Paper.getAll((err, paper) => {
    if (err) {
      req.errors = err;
      req.data = [];
    } else {
      req.data = paper;
    }
    next();
  });
}

export function getPaper(req, res, next) {
  Paper.get(req.params.id, (err, paper) => {
    if (err) {
      req.errors = err;
    } else {
      req.data = paper;
    }
    next();
  });
}

export function addPaper(req, res, next) {
  const reqPaper = req.body.paper;
  let pdfPath = '', filePath = '';
  if (reqPaper.pdfBase64) {
    const matches = reqPaper.pdfBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    pdfPath = (matches && matches.length === 3) ? `file/${cuid()}.pdf` : '';
    fs.writeFileSync(pdfPath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
  }
  if (reqPaper.fileBase64) {
    const matches = reqPaper.fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    filePath = (matches && matches.length === 3) ? `file/${cuid()}.zip` : '';
    fs.writeFileSync(filePath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
  }
  const classObj = new Paper({
    type: reqPaper.type,
    name: reqPaper.name,
    authors: reqPaper.authors,
    submittedTo: reqPaper.submittedTo,
    title: reqPaper.title,
    occupation: reqPaper.occupation,
    profilePage: reqPaper.profilePage,
    pdfPath: pdfPath !== '' ? `http://islab.snu.ac.kr/${pdfPath}` : '',
    filePath: filePath !== '' ? `http://islab.snu.ac.kr/${filePath}` : '',
  });
  Paper.add(classObj, (err, classObj) => {
    if (err) {
      req.errors = extractError(err);
    } else {
    }
    next();
  });
}


export function updatePaper(req, res, next) {
  const reqPaper = req.body.paper;
  Paper.get(reqPaper.id, (err, paper) => {
    if (err) {
      req.errors = err;
    } else {
      if (paper) {
        let pdfPath = '', filePath = '';
        if (reqPaper.pdfBase64) {
          const matches = reqPaper.pdfBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          pdfPath = (matches && matches.length === 3) ? `file/${cuid()}.pdf` : '';
          fs.writeFileSync(pdfPath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
        }
        if (reqPaper.fileBase64) {
          const matches = reqPaper.fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          filePath = (matches && matches.length === 3) ? `file/${cuid()}.zip` : '';
          fs.writeFileSync(filePath, new Buffer(matches[2], 'base64'), { encoding: 'base64' });
        }
        let putPaper = {};
        reqPaper.type && reqPaper.type !== paper.type ? putPaper['type'] = reqPaper.type : null;
        reqPaper.name && reqPaper.name !== paper.name ? putPaper['name'] = reqPaper.name : null;
        reqPaper.authors && reqPaper.authors !== paper.authors ? putPaper['authors'] = reqPaper.authors : null;
        reqPaper.submittedTo && reqPaper.submittedTo !== paper.submittedTo ? putPaper['submittedTo'] = reqPaper.submittedTo : null;
        pdfPath && pdfPath !== paper.pdfPath ? putPaper['pdfPath'] = pdfPath : null;
        filePath && filePath !== paper.filePath ? putPaper['filePath'] = filePath : null;
        Paper.put(reqPaper.id, putPaper, (err2) => {
          if (err2) {
            console.log(err2);
          }
          next();
        });
      } else {
        console.log(err);
        req.errors = [{ password: 'Wrong password' }];
        next();
      }
    }
  });
}

export function deletePaper(req, res, next) {
  const paper = req.body.paper;
  Paper.delete(paper.id, (err, paper) => {
    if (err) {
      console.log(err);
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function deactivePaper(req, res, next) {
  const paper = req.body.paper;
  Paper.deactive(paper.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}

export function reactivePaper(req, res, next) {
  const paper = req.body.paper;
  Paper.reactive(paper.id, (err) => {
    if (err) {
      req.errors = [{ action: 'Incomplete' }];
    }
    next();
  });
}