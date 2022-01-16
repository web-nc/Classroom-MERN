import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box, Badge } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React from "react";
import NotificationPopover from "./NotificationPopover";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../services/user";
import { getNotifications } from "../services/notification";

const socket = io(process.env.REACT_APP_SOCKET_URL);

export default function NotiButton({ style }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    getNotifications().then((res) => isMounted && setNotifications(res.data.notifications));

    dispatch(async (dispatch) => {
      return getUser().then((res) => {
        dispatch({ type: "USER_FETCHED", payload: res.data });
      });
    });

    return () => {
      dispatch({ type: "USER_EMPTY" });
      isMounted = false;
    };
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (user.id) {
      socket.emit("addUser", user.id);
    }
    socket.on("newNotification", (data) => {
      console.log(data);
      const clone = Object.assign([], [...notifications, data]);
      setNotifications(clone);
    });
  }, [notifications, user]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", ...style }}>
      <IconButton
        ref={anchorRef}
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit"
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        notifications={notifications}
      />
    </Box>
  );
}
