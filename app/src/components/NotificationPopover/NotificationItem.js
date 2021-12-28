import React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import GradingIcon from "@mui/icons-material/Grading";
import ClockIcon from "./ClockIcon";
import { useNavigate } from "react-router-dom";

export default function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const { title, notiIcon } = renderContent(notification);

  return (
    <ListItemButton
      onClick={() => navigate(notification.linkTo)}
      divider
      sx={{
        maxWidth: "400px",
        px: 2,
      }}
    >
      <ListItemIcon sx={{ minWidth: "24px", marginRight: 2 }}>
        {notiIcon}
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <ClockIcon style={{ marginRight: "5px" }} />
            <strong>
              {formatDistanceToNow(new Date(notification.createdAt), {
                locale: vi,
                addSuffix: true,
              })}
            </strong>
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification) {
  const title = (
    <Typography component="span" variant="subtitle2">
      <strong>{notification.title + " "}</strong>
      <Typography component="span" variant="body2" sx={{ color: "gray" }}>
        {notification.description}
      </Typography>
    </Typography>
  );

  let notiIcon;

  switch (notification.type) {
    case "grade_published":
      notiIcon = <GradingIcon />;
      break;
    case "review_comment":
      notiIcon = <CommentOutlinedIcon />;
      break;
    case "grade_reviewed":
      notiIcon = <ReviewsOutlinedIcon />;
      break;
    case "grade_edit":
      notiIcon = <ModeEditOutlineOutlinedIcon />;
      break;
    case "request_review":
      notiIcon = <RateReviewOutlinedIcon />;
      break;
    default:
      notiIcon = <NotificationsNoneOutlinedIcon />;
  }

  return { title, notiIcon };
}
