import { Paper, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import {
  getCourseReviewRequest,
  sendReview,
  markAsDone,
} from "../../../../services/review";
import RequestDetail from "./RequestDetail";
import ReviewDialog from "./ReviewDialog";

export default function ReviewRequests({ assignments, course }) {
  const [reviews, setReviews] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState(null);

  const handleCloseDialog = () => {
    setSelectedReview(null);
    setOpenDialog(false);
  };

  const handleOpenDialog = (reviewId) => {
    setSelectedReview(reviewId);
    setOpenDialog(true);
  };

  const sendReviewResult = (updatedPoint, teacherComment) => {
    sendReview({ review: selectedReview, updatedPoint, teacherComment })
      .then((res) => {
        setReviews((preReviews) =>
          preReviews.map((rv) => {
            if (rv._id === selectedReview) {
              rv.updatedPoint = updatedPoint;
              rv.teacherComment = teacherComment;
            }
            return rv;
          })
        );
        handleCloseDialog();
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra trong lúc gửi yêu cầu!");
        handleCloseDialog();
      });
  };

  const markReviewAsDone = (reviewId) => {
    markAsDone({ review: reviewId })
      .then((res) => {
        setReviews(
          reviews.filter(function (obj) {
            return obj._id !== reviewId;
          })
        );
        toast.success("Xử lí thành công yêu cầu phúc khảo");
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra trong lúc gửi yêu cầu!");
      });
  };

  React.useEffect(() => {
    let isMounted = true;
    course._id &&
      getCourseReviewRequest(course._id).then((res) => {
        if (isMounted)
          setReviews(
            res.data.map((review) => {
              const assignment = assignments.find((obj) => {
                return obj._id === review.assignment;
              });
              review.assignment = assignment.name;
              return review;
            })
          );
      });

    return () => {
      isMounted = false;
    };
  }, [assignments, course]);
  return (
    <Paper
      elevation={10}
      sx={{
        width: "60%",
        margin: "30px auto",
        padding: 3,
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{ marginBottom: 3 }}
        color="text.secondary"
        display="block"
        variant="h6"
      >
        <strong>Yêu cầu phúc khảo</strong>
      </Typography>
      {reviews && reviews.length ? (
        reviews.map((review, index) => (
          <RequestDetail
            key={review._id}
            review={review}
            handleOpenDialog={handleOpenDialog}
            markReviewAsDone={markReviewAsDone}
          />
        ))
      ) : (
        <strong>Chưa có yêu cầu phúc khảo</strong>
      )}

      <ReviewDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        sendReviewResult={sendReviewResult}
      />
    </Paper>
  );
}
