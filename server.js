import config from './config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// import path from 'path';
import cors from 'cors';
import fs from 'fs';
import dummyData from './dummyData/index';

var tunnel = require('tunnel-ssh');

const app = express();
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
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

// const configTunnel = {
//     agent: process.env.SSH_AUTH_SOCK,
//     username: 'islab',
//     password: 'islab08',
//     host: '147.46.118.35',
//     port: 22,
//     // dstHost: 'your-test-instance.mlab.com',
//     dstPort: 31568,
//     localHost: '127.0.0.1',
//     localPort: 27000,
// };
//
// tunnel(configTunnel, (error, server) => {
//     if (error) {
//         console.log("SSH connection error: ", error);
//     } else {
//         console.log(server);
//         // mongoose.connect(`mongodb://127.0.0.1:27017/islab`)
//         //     .then((error2) => {
//         //             if (error2) {
//         //                 console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
//         //                 console.log(error2);
//         //             }
//         //             dummyData();
//         //         }
//         //     )
//     }
// });

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
