import bcrypt from "bcryptjs";
import User from "./user.model.js";
export default {
  getUser: (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
  },
  updateProfile: (req, res) => {
    const user = req.user;
    if (!user)
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản trong hệ thống" });
    const { studentID, firstname, lastname, gender } = req.body;

    User.find({ studentID: studentID }).exec((error, result) => {
      if (user.studentID === studentID) {
        user.firstname = firstname;
        user.lastname = lastname;
        user.gender = gender;

        user.save();

        return res.status(200).json(user);
      }
      if (JSON.stringify(result) != JSON.stringify([])) {
        return res.status(404).json({ message: "Đã tồn tại studentID" });
      }
      user.studentID = studentID;
      user.firstname = firstname;
      user.lastname = lastname;
      user.gender = gender;

      user.save();

      return res.status(200).json(user);
    });
  },
  updatePassword: async (req, res) => {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    if (user) {
      let check = false;
      check = await bcrypt.compareSync(currentPassword, user.password);
      if (check) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.save();
        return res.status(200).json("Cập nhật thành công");
        // return done(null, user);
      } else {
        return res.status(404).json("Mật khẩu không đúng!");
      }
    } else return res.status(404).json("Lỗi tài khoản");
  },
};
