const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
var speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('475624587151-p1e4spm2s469j4s9g7dq3au2flar356k.apps.googleusercontent.com');

const register = async (req, res) => {
    // const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    const newUser = new User({
        ...req.body,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        await newUser.save();
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};
const checkOtp = async (req, res) => {
    const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    try {
        if (isValid) {
            res.status(200).json(true);
        } else {
            res.status(400).json(false);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const forgotPassword = async (req, res) => {
    const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        if (isValid) {
            const user = await User.findOne({ email: req.body.email });
            await User.findByIdAndUpdate(
                user._id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(true);
        } else {
            res.status(400).json(false);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const se = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'dat.lq172465@sis.hust.edu.vn',
                pass: 'Datumltk123',
            },
        });
        await transporter.sendMail({
            from: 'dat.lq172465@sis.hust.edu.vn',
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.log(error);
    }
};
const sendMail = async (req, res) => {
    const otp = speakeasy.totp({ secret: req.body.email + process.env.PASS_SEC, window: 19 });
    const message = `Dear ${req.body.email},
    
    Bạn đang thực hiện xác nhận bảo mật tài khoản LMS APP, dưới đây là mã xác thực của bạn:
                
    ${otp}
               
    Nếu đây không phải là email của bạn, xin hãy bỏ qua email này, hãy đừng trả lời.`;
    try {
        const user = await User.findOne({ email: req.body.email });

        if (req.params.slug === 'register') {
            if (user !== null) {
                res.send(false);
            } else {
                await se(req.body.email, 'Mã OTP:', message);
                res.send(true);
            }
        } else if (req.params.slug === 'forgotpassword') {
            await se(req.body.email, 'Mã OTP:', message);
            res.send(true);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });
        !user && res.status(401).json('Wrong credentials!');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401).json('Wrong credentials!');

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '30d' }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
};
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;
    try {
        client
            .verifyIdToken({ idToken: tokenId, audience: '475624587151-p1e4spm2s469j4s9g7dq3au2flar356k.apps.googleusercontent.com' })
            .then((response) => {
                const { email, email_verified, name, picture } = response.payload;
                if (email_verified) {
                    User.findOne({
                        email: email,
                    }).exec((err, user) => {
                        if (err) {
                            return res.status(400).json(err);
                        } else {
                            if (user) {
                                const token = jwt.sign(
                                    {
                                        id: user._id,
                                        isAdmin: user.isAdmin,
                                    },
                                    process.env.JWT_SEC,
                                    { expiresIn: '30d' }
                                );
                                const { password, ...others } = user._doc;
                                return res.status(200).json({ ...others, token });
                            } else {
                                let password = 'abc123';
                                const newUser = new User({
                                    fullName: name,
                                    email: email,
                                    avatar: picture,
                                    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
                                });
                                newUser.save((err, data) => {
                                    if (err) {
                                        return res.status(400).json(err);
                                    } else {
                                        if (data) {
                                            const token = jwt.sign(
                                                {
                                                    id: data._id,
                                                    isAdmin: data.isAdmin,
                                                },
                                                process.env.JWT_SEC,
                                                { expiresIn: '30d' }
                                            );
                                            const { password, ...others } = data._doc;
                                            return res.status(200).json({ ...others, token });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    register,
    checkOtp,
    forgotPassword,
    sendMail,
    login,
    googleLogin,
};
