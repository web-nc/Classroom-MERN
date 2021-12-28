import {
  Box,
  Typography,
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Chip,
  List,
  ListItem,
  Divider,
  ListItemText,
  Paper,
  InputBase,
} from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function RequestRow({ review, sendReviewComment }) {
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const handleSendComment = (e) => {
    e.preventDefault();
    if (comment) {
      sendReviewComment(review._id, comment);
      setComment("");
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {review.assignment}
        </TableCell>
        <TableCell align="center">{review.currentPoint}</TableCell>
        <TableCell align="center">{review.expectedPoint}</TableCell>
        <TableCell align="center">
          {review.reviewed ? (
            <Chip
              icon={<CheckCircleOutlinedIcon />}
              size="small"
              label="Đã xử lí"
              color="success"
            />
          ) : (
            <Chip
              icon={<ChangeCircleOutlinedIcon />}
              size="small"
              label="Đang xử lí"
              color="info"
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ padding: "16px 64px" }}
          >
            <Box className="flex">
              <Typography
                variant="subtitle2"
                sx={{ width: "30%", flexShrink: 0 }}
              >
                <strong>
                  <i>Lý do</i>
                </strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                <strong>{review.explanation}</strong>
              </Typography>
            </Box>
            <Box className="flex">
              <Typography
                variant="subtitle2"
                sx={{ width: "30%", flexShrink: 0 }}
              >
                <strong>
                  <i>Nhận xét của giáo viên</i>
                </strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                <strong>
                  {review.teacherComment
                    ? review.teacherComment
                    : "Chưa có nhận xét của giáo viên"}
                </strong>
              </Typography>
            </Box>
            <Box className="flex">
              <Typography
                variant="subtitle2"
                sx={{ width: "30%", flexShrink: 0 }}
              >
                <strong>
                  <i>Điểm sau khi chấm lại</i>
                </strong>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                <strong>{review.updatedPoint}</strong>
              </Typography>
            </Box>
            <Divider textAlign="left" sx={{ color: "text.secondary" }}>
              <strong>Bình luận</strong>
            </Divider>
            <Paper sx={{ padding: "10px" }}>
              <List>
                {review.comments &&
                  review.comments.map((comment, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText
                        sx={{ my: 0 }}
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{
                                display: "inline",
                                color: "text.secondary",
                              }}
                              component="span"
                              variant="subtitle2"
                            >
                              <strong>{comment.sender}:</strong>{" "}
                              {comment.comment}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
              </List>

              <Paper
                elevation={3}
                component="form"
                onSubmit={handleSendComment}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Gửi bình luận"
                  disabled={review.reviewed}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  inputProps={{ "aria-label": "Bình luận" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                  disabled={review.reviewed}
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SendIcon />
                </IconButton>
              </Paper>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
