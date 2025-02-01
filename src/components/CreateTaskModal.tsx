import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { MenuItem, Typography, Box } from "@mui/material";
import { addTask, Task, updateTask } from "../store/taskSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    maxWidth: "70vw", // Set a default value
    [theme.breakpoints.down("sm")]: { maxWidth: "100vw" }, // Responsive fix
  },
  "& .MuiDialogContent-root": {
    padding: "0px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    justifyContent: "flex-end",
  },
  "& .MuiDialog-paper": {
    margin: "32px", // Default margin
    [theme.breakpoints.down("sm")]: { margin: "0px" }, // Responsive margin fix
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "capitalize",
  border: `1px solid ${theme.palette.grey[300]}`,
  padding: "0.5rem 1rem",
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f1f1f1",
  },
  "& .MuiInputLabel-root": { fontSize: "0.9rem" },
  "& .MuiOutlinedInput-input": { fontSize: "0.95rem" },
}));

const taskStatuses = [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function CreateTaskModal({
  open,
  setOpen,
  modalType,
  taskData,
  setTaskData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
  taskData: Task;
  setTaskData: React.Dispatch<React.SetStateAction<Task>>;
}) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [viewTypeInmobile,setViewTypeInmobile]=React.useState<string>("details");
  const dispatch = useDispatch<AppDispatch>();
  const handleClose = () => {
    clearFormdata();
    setOpen(false);
    setViewTypeInmobile("details")
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const formdata = {
      title: taskData.title,
      description: taskData.description,
      category: taskData.category || "WORK",
      dueDate: taskData.dueDate,
      status: taskData.status || "TO_DO",
      userId: userData.uid,
    };
    return Object.values(formdata).every((value) => value.trim() !== "");
  };

  const onCreateTask = () => {
    if (!isFormValid()) return;

    if (!userData.uid) {
      console.error("User ID is missing!");
      return;
    }

    const newTask: Omit<Task, "id" | "createdAt" | "updatedAt" | "activity"> & {
      userId: string;
    } = {
      title: taskData.title,
      description: taskData.description,
      category: taskData.category || "WORK",
      dueDate: taskData.dueDate,
      status: taskData.status || "TO_DO",
      userId: userData.uid,
    };
    if (modalType === "newTask") {
      dispatch(addTask(newTask));
    } else {
      delete newTask.userId;
      dispatch(
        updateTask({
          id: taskData.id || "",
          updates: newTask,
          userId: userData.uid,
        })
      );
    }

    setOpen(false);
    clearFormdata();
  };

  const clearFormdata = () => {
    setTaskData({
      title: "",
      description: "",
      category: "WORK",
      dueDate: "",
      status: "",
    });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return "Today";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <BootstrapDialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          borderBottom: "1px solid rgba(117, 117, 117, 0.3)",
          minHeight: "60px",
        }}
      >
        {modalType === "newTask" && "Create Task"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 16, top: 16, color: "grey" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: { sm: "row", xs: "column" },
          padding: "0px",
        }}
      >
        <Box sx={{ display:{sm: "none", xs: "flex"},padding:"20px" ,justifyContent:"space-between"}}>
          
          <StyledButton
            color="secondary"
            variant={viewTypeInmobile === "details" ? "contained" : "outlined"}
            sx={{
              ":hover": {
                backgroundColor: viewTypeInmobile === "details" && "#271e1e",
              },
              padding:"3px 5rem",
              fontSize:"0.9rem"
            }}
            onClick={()=>{setViewTypeInmobile("details")}}
          >
            DETAILS
          </StyledButton>

          <StyledButton
            color="secondary"
            variant={viewTypeInmobile === "activity" ? "contained" : "outlined"}
            sx={{
              ":hover": {
                backgroundColor: viewTypeInmobile === "activity" && "#271e1e",
              },
              padding:"3px 2rem",
              fontSize:"0.9rem"
            }}
            onClick={()=>{setViewTypeInmobile("activity")}}
          >
            ACTIVITY
          </StyledButton>
        </Box>
        <Box
          sx={{
            width:{ sm:modalType === "newTask" ? "100%" : "65%",xs:"100%"},
            padding: { sm: "24px", xs: "16px" },
            display:{sm:"inline",xs:viewTypeInmobile==="details"?"inline":"none"}
          }}
        >
          <StyledTextField
            fullWidth
            variant="outlined"
            margin="dense"
            size="small"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <StyledTextField
            fullWidth
            variant="outlined"
            margin="dense"
            multiline
            rows={3}
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              flexDirection: { sm: "row", xs: "column" },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "secondary.contrastText", mb: "0.5rem" }}
              >
                Task Category*
              </Typography>
              <div style={{ display: "flex", gap: "1rem" }}>
                <StyledButton
                  color="primary"
                  variant={
                    taskData.category === "WORK" ? "contained" : "outlined"
                  }
                  sx={{
                    ":hover": {
                      backgroundColor:
                        taskData.category === "WORK" && "#7b1984",
                    },
                  }}
                  onClick={() =>
                    setTaskData((prev) => ({ ...prev, category: "WORK" }))
                  }
                >
                  Work
                </StyledButton>
                <StyledButton
                  color="primary"
                  variant={
                    taskData.category === "PERSONAL" ? "contained" : "outlined"
                  }
                  sx={{
                    ":hover": {
                      backgroundColor:
                        taskData.category === "PERSONAL" && "#7b1984",
                    },
                  }}
                  onClick={() =>
                    setTaskData((prev) => ({ ...prev, category: "PERSONAL" }))
                  }
                >
                  Personal
                </StyledButton>
              </div>
            </Box>

            <Box width="100%">
              <Typography
                variant="body2"
                sx={{ color: "secondary.contrastText", mb: "0.5rem" }}
              >
                Due on*
              </Typography>
              <StyledTextField
                fullWidth
                type="date"
                variant="outlined"
                margin="dense"
                size="small"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
              />
            </Box>

            <Box width="100%">
              <Typography
                variant="body2"
                sx={{ color: "secondary.contrastText", mb: "0.5rem" }}
              >
                Task Status*
              </Typography>
              <StyledTextField
                select
                fullWidth
                label="Choose"
                variant="outlined"
                margin="dense"
                size="small"
                name="status"
                value={taskData.status}
                onChange={handleChange}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        border: "1px solid rgb(240, 204, 204)",
                        borderRadius: "8px",
                      },
                    },
                  },
                }}
              >
                {taskStatuses.map((status) => (
                  <MenuItem
                    key={status.value}
                    sx={{
                      backgroundColor: "#fff9f9",
                      ":MuiPaper-root": {
                        border: "6px solid rgb(240, 204, 204)",
                      },
                    }}
                    value={status.value}
                  >
                    {status.label}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Box>
          </Box>
        </Box>
        {modalType === "editTask" && (
          <Box
            sx={{
              width: {sm:"35%",xs:"100vw"},
              borderLeft: "1px solid rgba(117, 117, 117, 0.3)",
              display:{sm:"inline",xs:viewTypeInmobile==="activity"?"inline":"none"}
            }}
          >
            <Typography
              variant="body1"
              sx={{
                borderBottom: "1px solid rgba(117, 117, 117, 0.3)",
                padding: "10px",
                fontWeight: 500,
                color: "secondary.contrastText",
                display:{sm:"inherit",xs:"none"}
              }}
            >
              Activity
            </Typography>
            <Box
              sx={{
                padding: "15px 15px 15px 15px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {taskData?.activity?.map(
                (act: { message: string; date: string }, index: number) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                    key={index}
                  >
                    <Typography
                      variant="caption"
                      sx={{ maxWidth: "70%", color: "secondary.contrastText" }}
                    >
                      {act.message.split("_").join("")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "secondary.contrastText" }}
                    >
                      {formatDate(act.date)}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#f1f1f1",
          borderTop: "1px solid rgba(117, 117, 117, 0.3)",
        }}
      >
        <Button
          variant="outlined"
          sx={{ borderRadius: "20px", textTransform: "capitalize" }}
          color="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{
            borderRadius: "20px",
            textTransform: "capitalize",
            ":hover": { backgroundColor: "#7b1984" },
          }}
          onClick={() => onCreateTask()}
          disabled={!isFormValid()}
        >
          {modalType === "newTask" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
