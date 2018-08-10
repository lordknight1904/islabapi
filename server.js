import config from './config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dummyData from './dummyData/index';

const app = express();
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/image', express.static(__dirname + '/image'));
app.use('/file', express.static(__dirname + '/file'));
// app.use(express.static('file'));
// app.use(express.static(path.resolve(__dirname, 'file')));
// app.use(express.static(__dirname + '/file'));

// ROUTES FOR OUR API

// import bear from './routes/bear.routes';
import admin from './routes/admin.routes';
import course from './routes/course.routes';
import person from './routes/person.routes';
import paper from './routes/paper.routes';
app.use([paper, person, course, admin]);

mongoose.connect(config.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
  dummyData();
});
// START THE SERVER
// =============================================================================
app.listen(config.port);
console.log('Api start at ' + config.port);
