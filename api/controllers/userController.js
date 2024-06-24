import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment/moment.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function calculateAge(dateOfBirth) {
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const createUser = async (req, res) => {
    try {
        const { name, email, password, birthDate, gender } = req.body;
        const profilePhoto = req.file ? req.file.path : '';

        console.log(profilePhoto);

        if (!name || !email || !password) {
            return res.json({
                message: 'Имя, email и пароль обязательны'
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.json({
                message: 'Пользователь с таким email уже существует'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new UserModel({
            name,
            email,
            passwordHash: hash,
            birthDate,
            gender,
            profilePhoto,
        });

        await user.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};
export const getMe = async (req, res) => {
    try {
        const userId = req.id;
       
        const user = await UserModel.findById(userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        let profilePhotoBase64 = null;

        if (user.profilePhoto) {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(user.profilePhoto));
            try {
                const fileBuffer = fs.readFileSync(filePath);
                profilePhotoBase64 = fileBuffer.toString('base64');
            } catch (error) {
                console.error('Ошибка при чтении файла:', error);
            }
        }

        const userWithPhoto = {
            ...user._doc,
            profilePhoto: profilePhotoBase64,
        };

        res.json(userWithPhoto);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Ошибка сервера',
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email и пароль обязательны'
            });
        };

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Неверный email или пароль'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordValid) {
            return res.status(404).json({
                message: 'Неверный email или пароль'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        res.json({
            token,
            user: {
                email: user.email,
                name: user.name,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Ошибка сервера',
        });
    }
};
export const updateProfile = async(req, res) => {
    try {
        const { name, oldPassword, newPassword } = req.body;
        const userId = req.id;
    
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'Пользователь не найден' });
        }
    
        console.log('Старый пароль', oldPassword);
        console.log('Актуальный пароль:', user.passwordHash);
    
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

        if (!isMatch) {
          return res.json({ message: 'Неправильный старый пароль' });
        }
    
        if (newPassword) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(newPassword, salt);
        }
    
        user.name = name;
    
        if (req.file) {
          user.profilePhoto = req.file.path;
        }
    
        await user.save();
    
        res.status(200).json({ access: 'Успешное обновление данных', user });
      } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        res.status(500).json({ message: 'Server error', error });
      }

};
export const getUsers = async (req, res) => {
    try {
        let profilePhotoBase64 = null;
        const userId = req.id;
        const users = await UserModel.find({ _id: { $ne: userId } });

        const usersWithAge = users.map(user => {

            if(user)


            if (user.profilePhoto) {
                const filePath = path.join(__dirname, '..', 'uploads', path.basename(user.profilePhoto));
                try {
                    const fileBuffer = fs.readFileSync(filePath);
                    profilePhotoBase64 = fileBuffer.toString('base64');
                } catch (error) {
                    console.error('Ошибка при чтении файла:', error);
                }
            }

            const birthYear  = moment(user.birthDate).format("YYYY");
            const currentYear  =  moment(Date.now()).format("YYYY");
            const ageDate = currentYear  - birthYear;
            
            return {
                id: user._id,
                name: user.name,
                img: profilePhotoBase64,
                age: ageDate,
            };
        });

        res.json(usersWithAge);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
  };