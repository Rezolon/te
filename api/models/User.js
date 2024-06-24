import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date },
    gender: { type: String, enum: ['Муж', 'Жен'] },
    profilePhoto: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;
