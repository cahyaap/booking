const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transformUser } = require('./merge');

module.exports = {
    // read users
    users: async () => {
        try {
            const users = await User.find()
            return users.map(user => {
                return transformUser(user);
            });
        } catch (err) {
            throw err;
        };
    },
    // create user
    createUser: async (args) => {
        try {
            const userExisting = await User.findOne({ email: args.userInput.email });
            if (userExisting) {
                throw new Error('User exists already!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return transformUser(result);
        } catch (err) {
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'secretKey', {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
};