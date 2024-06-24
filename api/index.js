import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import {registerValidation, loginValidation} from './validations/validations.js';
import multer from 'multer';
import cors from 'cors';
import { checkAuth } from './utils/index.js';

import { ControllerUser } from './controllers/index.js';

dotenv.config();
const app = express();
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors()); 


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

//GET
app.get('/auth/me', checkAuth, ControllerUser.getMe);
app.get('/get/users', checkAuth, ControllerUser.getUsers);
//POST
app.post('/auth/registration', registerValidation, upload.single('profilePicture'), ControllerUser.createUser);
app.post('/auth/login', loginValidation, ControllerUser.Login);
app.post('/auth/updateProfile', checkAuth, upload.single('profilePicture'), ControllerUser.updateProfile);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
