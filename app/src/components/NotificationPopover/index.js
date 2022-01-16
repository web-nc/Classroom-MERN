import { Popover, Box, Typography, List, Divider } from "@mui/material";
import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationPopover({ notifications, ...other }) {
  return (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      {...other}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "400px",
          width: "400px",
          py: 2,
        }}
      >
        <Typography variant="h5" sx={{ paddingBottom: 2 }}>
          Thông báo
        </Typography>

        <List disablePadding>
          <Divider />
          {notifications.slice(0).reverse().map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
          {notifications.length === 0 && (
            <Typography
              variant="subtitle2"
              sx={{ paddingBottom: 2, width: "400px" }}
            >
              Không có thông báo
            </Typography>
          )}
        </List>
      </Box>
    </Popover>
  );
}
