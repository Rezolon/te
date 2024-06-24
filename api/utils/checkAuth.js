import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export default (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, 'secret123');
      const user = UserModel.findOne({ _id: decoded._id });
        
      if (!user) {
        throw new Error();
      }
      req.id = decoded._id;
      req.user = user;
      next();
    } catch (err) {
      res.status(401).send({ error: 'Нет доступа' });
    }
  };
