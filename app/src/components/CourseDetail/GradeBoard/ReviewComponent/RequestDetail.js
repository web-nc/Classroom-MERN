import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  List,
  ListItem,
  Divider,
  ListItemText,
  InputBase,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

export default function RequestDetail({
  review,
  handleOpenDialog,
  sendReviewComment,
}) {
  const [comment, setComment] = React.useState("");

  const handleSendComment = (e) => {
    e.preventDefault();
    if (comment) {
      sendReviewComment(review._id, comment, review.studentId);
      setComment("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: "rgb(248, 249, 250)",
        display: "flex",
        marginBottom: "25px",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Thông tin học sinh</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>
              [{review.studentId}] {review.studentName}
            </strong>
          </Typography>
        </Box>
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Bài tập</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>{review.assignment}</strong>
          </Typography>
        </Box>
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Mong muốn</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>
              Điểm từ {review.currentPoint} thành {review.expectedPoint}
            </strong>
          </Typography>
        </Box>
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Lý do</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>{review.explanation}</strong>
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
                          <strong>{comment.sender}:</strong> {comment.comment}
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
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              inputProps={{ "aria-label": "Bình luận" }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SendIcon />
            </IconButton>
          </Paper>
        </Paper>
      </Box>
      <Tooltip title="Thêm nhận xét và điểm">
        <IconButton
          onClick={() =>
            handleOpenDialog({ _id: review._id, studentId: review.studentId })
          }
          sx={{ margin: "auto" }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
