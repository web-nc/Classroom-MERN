import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { sendPasswordChangeEmail } from "../../modules/nodemailer/index.js";
import User from "../user/user.model.js";

const client = new OAuth2Client(
  "363623650683-5asnak0qhe873go03791oh3ln35uae26.apps.googleusercontent.com"
);
export default {
  login: async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (user.isBanned) {
      return res
        .status(402)
        .json({ message: "Tài khoản của bạn đang bị khóa" });
    }
    const token = jwt.sign({ _id: req.user._id }, process.env.AUTH_SECRET);
    res.json({
      token: token,
    });
  },

  google: (req, res, next) => {
    const { tokenId } = req.body;
    client
      .verifyIdToken({ idToken: tokenId })
      .then(async function (data) {
        let user = await User.findOne({ email: `${data.payload.email}` });

        if (!user) {
          user = new User({
            email: data.payload.email,
            password: "",
            firstname: data.payload.given_name,
            lastname: data.payload.family_name,
            gender: "Khác",
            courses: [],
            isBanned: false,
          });
          user.save();
        }

        if (user.isBanned) {
          return res
            .status(402)
            .json({ message: "Tài khoản của bạn đang bị khóa" });
        }

        res.json({
          success: true,
          token: jwt.sign({ _id: user._id }, process.env.AUTH_SECRET),
        });
      })
      .catch((err) => {
        res.status(401).json({ message: "Không có quyền truy cập" });
      });
  },

  register: async (req, res, next) => {
    const user = await User.find({ email: `${req.body.email}` });
    if (user.length) {
      return res.status(401).send({ message: "Email đã tồn tại." });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender ? req.body.gender : "Khác",
        courses: [],
      });
      newUser.save();
      return res.status(200).json({
        token: jwt.sign({ _id: newUser._id }, process.env.AUTH_SECRET),
      });
    }
  },

  sendPasswordChangeEmail: async (req, res, next) => {
    const user = await User.find({ email: `${req.body.email}` }).lean();
    if (!user.length) {
      return res.status(202).json({ message: "Email không tồn tại" });
    }
    const receiver = user.pop();
    const isSocialAccount = receiver.password === "";
    if (isSocialAccount) {
      return res.status(202).json({ message: "Tài khoản không hợp lệ" });
    }

    const token = randomstring.generate(12);

    sendPasswordChangeEmail(receiver, token).then(async (result) => {
      if (result) {
        await User.findByIdAndUpdate(receiver._id, {
          changePasswordToken: token,
        });
        return res.status(200).json({ message: "Gửi thành công" });
      } else {
        return res.status(202).json({ message: "Gửi thất bại" });
      }
    });
  },

  getUserChangePassword: async (req, res, next) => {
    const userId = req.params.id;
    // Check id legit
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(202).json({ message: `ID không hợp lệ` });
    }

    const { token } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(202).json({ message: "Tài khoản không tồn tại" });
    }
    if (user.changePasswordToken !== token) {
      return res.status(202).json({ message: "Token không hợp lệ" });
    }

    return res.status(200).json({ email: user.email });
  },

  changePassword: async (req, res, next) => {
    const { userId, token, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(202).json({ message: "Tài khoản không tồn tại" });
    }
    if (user.changePasswordToken !== token) {
      return res.status(202).json({ message: "Token không hợp lệ" });
    }

    user.changePasswordToken = "";

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({ message: "Cập nhật thành công" });
  },
};
