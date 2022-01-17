import { Paper, Card, CardContent, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  getGrades,
  editGrade,
  finalizeGrade,
  finalizeAssignment,
} from "../../../services/grade";
import { updateGradeBoard } from "../../../services/course";
import { createNotification } from "../../../services/notification";
import { toast } from "react-toastify";
import CustomColumnMenu from "./CustomComponent/CustomColumnMenu";
import CustomToolbar from "./CustomComponent/CustomToolbar";
import CustomFooter from "./CustomComponent/CustomFooter";
import CustomCell from "./CustomComponent/CustomCell";
import AddCell from "./CustomComponent/AddCell";
import ReviewRequests from "./ReviewComponent/ReviewRequests";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

const paperStyle = {
  width: "60%",
  margin: "30px auto",
};

export default function GradeBoard({
  course,
  assignments,
  handleUpdateCourse,
  user,
}) {
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "studentId",
      headerName: "MSSV",
      width: 120,
      disableColumnMenu: true,
    },
    {
      field: "studentName",
      headerName: "Họ tên",
      flex: 1,
      minWidth: 200,
      disableColumnMenu: true,
    },
  ];

  for (const assignment of assignments) {
    columns.push({
      field: assignment._id,
      headerName: assignment.name,
      align: "center",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => {
        if (params.value === undefined) {
          return (
            <AddCell
              assignmentId={params.field}
              studentId={params.id}
              handleEditGrade={handleEditGrade}
            />
          );
        }
        return (
          <CustomCell
            point={params.value.point}
            assignmentId={params.field}
            studentId={params.id}
            finalized={params.value.finalized}
            handleEditGrade={handleEditGrade}
            handleFinalizedGrade={handleFinalizedGrade}
          />
        );
      },
    });
  }
  columns.push({
    field: "total",
    headerName: "Điểm tổng kết",
    align: "center",
    headerAlign: "center",
    sortable: false,
    disableColumnMenu: true,
    width: 150,
    renderCell: (params) => {
      return <strong>{calcGPA(params.row, assignments)}/100</strong>;
    },
  });

  // Handle việc thêm hoặc sửa điểm cho 1 cột điểm của 1 học sinh
  const handleEditGrade = (assignment, studentId, point, finalized) => {
    editGrade({ assignment, studentId, point }, course._id)
      .then((res) => {
        handleUpdateRow(studentId, assignment, { point, finalized });
        if (res.data.finalized) {
          // Tạo thông báo và gửi cho học sinh
          let notificationData = notificationGenerate(
            assignment,
            course,
            studentId,
            "grade_edit",
            assignments
          );

          createNotification(notificationData).then((res) => {
            notificationData.notification = res.data.notification;
            socket.emit("createNewNotification", notificationData);
          });
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.warn("Thiếu quyền để thực hiện thao tác");
          return;
        }
        toast.error("Có lỗi xảy ra khi cập nhật!");
      });
  };

  // Handle việc công bố điểm cho 1 cột điểm của 1 học sinh
  const handleFinalizedGrade = (assignment, studentId, point) => {
    finalizeGrade({ assignment, studentId }, course._id)
      .then((res) => {
        handleUpdateRow(studentId, assignment, { point, finalized: true });

        let notificationData = notificationGenerate(
          assignment,
          course,
          studentId,
          "grade_published",
          assignments
        );

        createNotification(notificationData).then((res) => {
          notificationData.notification = res.data.notification;
          socket.emit("createNewNotification", notificationData);
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.warn("Thiếu quyền để thực hiện thao tác");
          return;
        }
      });
  };

  const handleUpdateRow = (id, assignment, data) => {
    setRows((prevRows) => {
      return prevRows.map((row, index) => {
        if (row.id === id) {
          let updatedRow = Object.assign({}, row);
          updatedRow[assignment] = data;
          return updatedRow;
        } else return row;
      });
    });
  };

  // Handle việc thêm hoặc sửa điểm cho 1 cột điểm (bằng cách import file)
  const handleUpdateAGradeColumn = (data) => {
    data.forEach((item) => {
      const { studentId, assignment, point } = item;
      if (point && point >= 0 && point <= 100) {
        setRows((prevRows) => {
          return prevRows.map((row) => {
            if (String(row.id) === String(studentId)) {
              let updatedRow = Object.assign({}, row);
              updatedRow[assignment] = { finalized: false, point: point };
              return updatedRow;
            } else return row;
          });
        });

        editGrade(
          {
            assignment,
            studentId: String(studentId),
            point: Number(point),
            finalized: false,
          },
          course._id
        ).catch((err) => {
          if (err.status === 401) {
            toast.warn("Thiếu quyền để thực hiện thao tác");
            return;
          }
          toast.error("Có lỗi xảy ra khi cập nhật!");
        });
      }
    });
  };

  // Handle việc công bố điểm cho 1 cột điểm
  const handleFinalizeColumn = (assignmentId) => {
    finalizeAssignment(assignmentId, course._id)
      .then((res) => {
        for (const student of course.students) {
          if (student.studentID) {
            let notificationData = notificationGenerate(
              assignmentId,
              course,
              student.studentID,
              "grade_published",
              assignments
            );

            createNotification(notificationData).then((res) => {
              notificationData.notification = res.data.notification;
              socket.emit("createNewNotification", notificationData);
            });
          }
        }

        setRows((prevRows) => {
          return prevRows.map((row, index) => {
            if (row[assignmentId] !== undefined) {
              let updatedRow = Object.assign({}, row);
              updatedRow[assignmentId].finalized = true;
              return updatedRow;
            } else return row;
          });
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.warn("Thiếu quyền để thực hiện thao tác");
          return;
        }
        toast.error("Có lỗi xảy ra khi cập nhật!");
      });
  };

  // Handle việc import 1 file (studentId, studentName)
  const handleUpdateStudentList = (data) => {
    updateGradeBoard(course._id, data)
      .then((res) => {
        if (res.status === 200) {
          handleUpdateCourse(res.data.payload);
          toast.success("Tải lên thành công!");
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.warn("Thiếu quyền để thực hiện thao tác");
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (course.gradeBoard) {
      if (isMounted)
        setRows(
          course.gradeBoard.map((student) => ({
            ...student,
            id: student.studentId,
          }))
        );
    }

    course._id &&
      getGrades(course._id)
        .then((res) => {
          res.data.forEach((grade) => {
            if (isMounted)
              handleUpdateRow(grade.studentId, grade.assignment, {
                point: grade.point,
                finalized: grade.finalized,
              });
          });
        })
        .catch((err) => {
          if (err.status === 401)
            toast.warn("Thiếu quyền để thực hiện thao tác");
        });

    return () => {
      isMounted = false;
    };
  }, [course]);

  return (
    <div>
      <Paper elevation={10} style={paperStyle}>
        <Card>
          <Typography
            sx={{ marginLeft: 2, marginTop: 3 }}
            color="text.secondary"
            display="block"
            variant="h6"
          >
            <strong>Bảng điểm</strong>
          </Typography>
          <CardContent>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              components={{
                ColumnMenu: CustomColumnMenu,
                Toolbar: CustomToolbar,
                Footer: CustomFooter,
              }}
              componentsProps={{
                columnMenu: {
                  onFileSelect: handleUpdateAGradeColumn,
                  onFinalize: handleFinalizeColumn,
                },
                toolbar: {
                  rows,
                  columns,
                  assignments,
                  onFileSelect: handleUpdateStudentList,
                  role: course.role,
                },
                footer: { rows, columns, assignments },
              }}
            />
          </CardContent>
        </Card>
      </Paper>

      <ReviewRequests user={user} assignments={assignments} course={course} />
    </div>
  );
}

// Hàm tính toán GPA
function calcGPA(row, assignments) {
  const totalAssignmentsWeight = assignments.reduce(
    (pre, cur) => pre + cur.weight,
    0
  );
  if (totalAssignmentsWeight === 0) return 0;
  let GPA = 0;
  for (const property in row) {
    if (
      property !== "id" &&
      property !== "studentId" &&
      property !== "studentName" &&
      row[property].finalized
    ) {
      const assignment = assignments.find((obj) => {
        return obj._id === property;
      });
      if (assignment !== undefined) {
        GPA = GPA + assignment.weight * row[property].point;
      }
    }
  }
  return (GPA = Math.round(GPA / totalAssignmentsWeight));
}

// Hàm tạo thông báo để gửi đến cho học sinh
function notificationGenerate(
  assignmentId,
  course,
  studentId,
  type,
  assignments
) {
  let description;
  switch (type) {
    case "grade_published":
      description = "Điểm của bạn đã được công bố";
      break;
    case "grade_edit":
      description = "Điểm bài tập của bạn đã được cập nhật";
      break;
    default:
      description = "Có lỗi khi tạo thông báo";
  }

  let title = assignments.find((obj) => {
    return obj._id === assignmentId;
  });
  if (title === undefined) title = "Có thông báo mới";

  const receiver = course.students.find((obj) => {
    return obj.studentID === studentId;
  });

  return {
    receiverID: receiver._id,
    notification: {
      title: title.name,
      description: description,
      type: type,
      linkTo: "/course/" + course._id + "/studentGrade",
      createdAt: new Date(),
    },
  };
}
