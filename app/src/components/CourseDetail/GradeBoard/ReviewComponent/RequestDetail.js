import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import React from "react";

export default function RequestDetail({
  review,
  handleOpenDialog,
  markReviewAsDone,
}) {
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
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Nhận xét của giáo viên</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>{review.teacherComment}</strong>
          </Typography>
        </Box>
        <Box className="flex">
          <Typography variant="subtitle2" sx={{ width: "30%", flexShrink: 0 }}>
            <strong>
              <i>Điểm sau khi chấm lại</i>
            </strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            <strong>{review.updatedPoint}</strong>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tooltip title="Đánh dấu là đã hoàn thành">
          <IconButton
            onClick={() => markReviewAsDone(review._id)}
            sx={{ margin: "auto" }}
          >
            <FactCheckOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Thêm nhận xét và điểm">
          <IconButton
            onClick={() => handleOpenDialog(review._id)}
            sx={{ margin: "auto" }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
