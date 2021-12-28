import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import UserButton from "../../UserButton";
import NotiButton from "../../NotiButton";

const navLink = {
  color: "inherit",
  textDecoration: "none",
  height: "100%",
  display: "flex",
  alignItems: "center",
  marginLeft: "100%",
};

export default function RightComp({ role }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexBasis: 0,
        justifyContent: "end",
      }}
    >
      {role && (role === "TEACHER" || role === "OWNER") && (
        <NavLink end to="setting" style={navLink}>
          <Button color="inherit">
            <SettingsIcon />
          </Button>
        </NavLink>
      )}
      <Box sx={{ display: "flex" }}>
        <NotiButton />
        <UserButton />
      </Box>
    </Box>
  );
}
