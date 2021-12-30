import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { changePassword, getUserChangePassword } from "../../../services/auth";

export default function ChangePasswordForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const navigator = useNavigate();

  useEffect(() => {
    let isMounted = true;

    getUserChangePassword({ id, token })
      .then((res) => {
        if (res.status === 202) {
          toast.warn(res.data.message);
          // id or token did not met
          return navigator("/404");
        }
        if (res.status === 200) {
          if (isMounted) setEmail(res.data.email);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isMounted = false;
    };
  });

  const { register, handleSubmit } = useForm();

  const handleSubmitForm = (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.warn("Mật khẩu xác nhận sai!");
    }

    const toastId = toast.loading("Xin chờ...");
    changePassword({ newPassword: data.password, token: token, userId: id })
      .then((res) => {
        if (res.status === 202) {
          toast.update(toastId, { render: res.data.message, type: "warning", isLoading: false, autoClose: 2000 });
        }
        if (res.status === 200) {
          toast.update(toastId, { render: res.data.message, type: "success", isLoading: false, autoClose: 2000 });
          navigator("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      <Box textAlign="center">
        <h2>Đổi mật khẩu mới</h2>
      </Box>
      <Box>
        <p>
          Bạn đang thực hiện đổi mật khẩu mới cho tài khoản <strong>{email}</strong>
        </p>
      </Box>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <TextField
          {...register("password")}
          sx={{ mb: 2 }}
          fullWidth
          type="password"
          label="Mật khẩu"
          variant="outlined"
          required
        />
        <TextField
          {...register("confirmPassword")}
          sx={{ mb: 2 }}
          fullWidth
          type="password"
          label="Xác nhận mật khẩu"
          variant="outlined"
          required
        />
        <Button type="submit" color="primary" variant="contained" fullWidth>
          Xác nhận
        </Button>
      </form>
    </Box>
  );
}
