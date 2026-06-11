// Importing modules
import mongoose from 'mongoose';
import ROLES from '../../shared/constants/roles.constants.js';
import bcrypt from 'bcryptjs';

// Defining the user schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.SCORER
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

// making pre save hook to hash the password before saving the user
userSchema.pre('save', async function () {

    // checking if password is already hashed or not, if not then hash it
    if (!this.isModified('password')) {
        return;
    }

    // no password return
    if(this.password == "") return;

    // hasing the password
    this.password = await bcrypt.hash(this.password, 10);

});

// applying method to compare the password
userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

// making the model from the schema
const User = mongoose.model('users', userSchema);
export default User;