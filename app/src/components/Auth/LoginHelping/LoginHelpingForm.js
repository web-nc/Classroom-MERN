import React from "react";
import { useForm } from "react-hook-form";
import { TextField, IconButton, Box } from "@mui/material";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import { sendPasswordChangeEmail } from "../../../services/auth";

export default function LoginHelpingForm() {
  const { register, handleSubmit } = useForm();

  const handleSubmitForm = (data) => {
    if (!data.email) {
      toast.warn("Email không bỏ trống");
      return;
    }
    const id = toast.loading("Xin chờ...");
    sendPasswordChangeEmail(data)
      .then((res) => {
        if (res.status === 202) {
          toast.update(id, { render: res.data.message, type: "warning", isLoading: false, autoClose: 2000 });
        }
        if (res.status === 200) {
          toast.update(id, { render: res.data.message, type: "success", isLoading: false, autoClose: 2000 });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      <Box textAlign="center">
        <h2>Quên mật khẩu</h2>
      </Box>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box container sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <TextField {...register("email")} fullWidth type="email" label="Email" variant="outlined" required />
          <IconButton type="submit" color="primary" children={<SendIcon fontSize="large" />} />
        </Box>
      </form>
    </Box>
  );
}
