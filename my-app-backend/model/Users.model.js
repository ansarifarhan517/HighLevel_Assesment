
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = 'HighLevel' //later move to env


// Define the schema for the user
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contacts: [{
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        note: {
            type: String,
        },
        lastContactedOn: {
            type: Date,
            default: Date.now
        },
        meansOfContact: {
            type: String,
            enum: ['email', 'call', 'in-person'],
            required: true
        }
    }],
    organizationName: {
        type: String,
        required: true
    }
});

// Hash the password before saving the user
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, saltRounds, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});
// Compare the password with the hashed password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
// Generate a JWT token for the user

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, secret, { expiresIn: '1h' });
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;