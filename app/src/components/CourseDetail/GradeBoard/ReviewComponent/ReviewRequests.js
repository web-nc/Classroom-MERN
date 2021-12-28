import { Paper, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import {
  getCourseReviewRequest,
  sendReview,
  sendComment,
} from "../../../../services/review";
import { createNotification } from "../../../../services/notification";
import RequestDetail from "./RequestDetail";
import ReviewDialog from "./ReviewDialog";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

export default function ReviewRequests({ assignments, course, user }) {
  const [reviews, setReviews] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState(null);

  const handleCloseDialog = () => {
    setSelectedReview(null);
    setOpenDialog(false);
  };

  const handleOpenDialog = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  // Handle việc xử lí yêu cầu phúc khảo
  const sendReviewResult = (updatedPoint, teacherComment) => {
    sendReview({ review: selectedReview._id, updatedPoint, teacherComment })
      .then((res) => {
        setReviews(
          reviews.filter(function (obj) {
            return obj._id !== selectedReview._id;
          })
        );
        toast.success("Xử lí thành công yêu cầu phúc khảo");

        // Gửi thông báo đến học Sinh
        let notificationData = notificationGenerate(
          course,
          selectedReview.studentId,
          "grade_reviewed"
        );
        createNotification(notificationData).then((res) => {
          notificationData.notification = res.data.notification;
          socket.emit("createNewNotification", notificationData);
        });

        handleCloseDialog();
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra trong lúc gửi yêu cầu!");
        handleCloseDialog();
      });
  };

  // Handle việc bình luận trong 1 yêu cầu phúc khảo
  const sendReviewComment = (reviewId, comment, studentId) => {
    sendComment({
      review: reviewId,
      sender: user.firstname + " " + user.lastname,
      comment,
    })
      .then(() => {
        setReviews((preReviews) => {
          return preReviews.map((review) => {
            if (review._id === reviewId) {
              review.comments.push({
                sender: user.firstname + " " + user.lastname,
                comment,
              });
            }
            return review;
          });
        });

        let notificationData = notificationGenerate(
          course,
          studentId,
          "review_comment"
        );
        createNotification(notificationData).then((res) => {
          notificationData.notification = res.data.notification;
          socket.emit("createNewNotification", notificationData);
        });
      })
      .catch((err) => {
        toast.error("Có lỗi khi gửi bình luận");
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
            sendReviewComment={sendReviewComment}
            handleOpenDialog={handleOpenDialog}
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

function notificationGenerate(course, studentId, type) {
  let description;
  switch (type) {
    case "review_comment":
      description = "Giáo viên đã bình luận trong yêu cầu phúc khảo của bạn";
      break;
    case "grade_reviewed":
      description = "Yêu cầu phúc khảo của bạn đã được giải quyết";
      break;
    default:
      description = "Có lỗi khi tạo thông báo";
  }

  const receiver = course.students.find((obj) => {
    return obj.studentID === studentId;
  });

  return {
    receiverID: receiver._id,
    notification: {
      title: course.name,
      description: description,
      type: type,
      linkTo: "/course/" + course._id + "/studentGrade",
      createdAt: new Date(),
    },
  };
}
