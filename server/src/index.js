import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import users from './routes/users';
import auth from './routes/auth';
import book from './routes/book';

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });

var port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/book1', { useMongoClient: true });

let app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use ('/api/book',book);
//console.log(process.env.MONGODB_URI );
//console.log('mongodb://localhost/book1');
app.listen(port, () => console.log('Running on port: ' + port));
