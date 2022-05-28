const User = require('../models/User');
const CryptoJS = require('crypto-js');
const Common = require('../constants/common');

const updateUser = async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, refreshToken, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        let _users = users.filter((u) => {
            const result = Common.Search(u.fullName, req.body.name);
            return result;
        });
        _users = _users.map((s) => {
            const { password, ...other } = s._doc;
            return other;
        });
        if (!(req.body.status == 0)) {
            _users = _users.filter((user) => {
                return user.status === parseInt(req.body.status);
            });
        }
        res.status(200).json(_users);
    } catch (err) {
        res.status(500).json(err);
    }
};

const newUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body._id,
            {
                $set: req.body,
            },
            { new: true }
        );
        if (user) {
            return res.status(200).json(user);
        } else {
            const newUser = new User({
                ...req.body,
                password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
            });
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getUserById,
    getAllUser,
    newUser,
};
