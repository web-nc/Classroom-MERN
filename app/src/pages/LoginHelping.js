import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import { Avatar, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router";
import { Link, Routes, Route } from "react-router-dom";
import ChangePasswordForm from "../components/Auth/LoginHelping/ChangePasswordForm";
import LoginHelpingForm from "../components/Auth/LoginHelping/LoginHelpingForm";

export default function LoginHelping() {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };
  const avatarStyle = {
    backgroundColor: "skyblue",
    height: "70px",
    width: "70px",
  };
  const iconStyle = { transform: "scale(2.2)" };
  const typoStyle = { marginLeft: "10px" };

  const location = useLocation();
  const from = location.state?.from || "/";
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <PersonSharpIcon style={iconStyle} />
          </Avatar>
        </Grid>

        <Routes>
          <Route path="/" element={<LoginHelpingForm />} />
          <Route path="sendEmail" element={<LoginHelpingForm />} />
          <Route path="changePassword/:id" element={<ChangePasswordForm />} />
        </Routes>

        <Typography>
          Quay về trang
          <Link to="/login" state={{ from: from }} style={typoStyle}>
            Đăng nhập
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}
