import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import Divider from "@mui/material/Divider";
import { AppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import {
  deleteTask,
  fetchTasks,
  filterTasksByStatus,
  Task,
  updateTask,
} from "../store/taskSlice";
import { useDispatch } from "react-redux";
import CreateTaskModal from "../components/CreateTaskModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { logout } from "../store/authSlice";
import { Navigate } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import NoResultsFound from "../components/NoResultsFound";
import BottomPopup from "../components/BottomPopup";
const TaskManager: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionIconsAnchorEl, setActionIconsAnchorEl] =
    useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [actionOpen, setActionOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, todoList, progressList, completedList } = useSelector(
    (state: RootState) => state.tasks
  );
  const [createTaskModalOpen, setCreateTaskModalOpen] = React.useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [activeTask, setActiveTask] = useState<Task>({
    title: "",
    description: "",
    category: "WORK",
    dueDate: "",
    status: "",
  });
  const [actionType, setActionType] = useState("");
  const [search, setSearch] = useState("");
  const [displayTasks, setDisplaytasks] = useState<any>({
    todo: todoList || [],
    progress: progressList || [],
    completed: completedList || [],
  });
  const isMobileDevice = useMediaQuery("(max-width: 600px)");

  const handleClickOpen = () => {
    setCreateTaskModalOpen(true);
    setActionType("newTask");
  };
  useEffect(() => {
    dispatch(fetchTasks({ userId: userData.uid }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterTasksByStatus("TO_DO"));
    dispatch(filterTasksByStatus("IN_PROGRESS"));
    dispatch(filterTasksByStatus("COMPLETED"));
  }, [tasks]);

  useEffect(() => {
    setDisplaytasks({
      todo: todoList,
      progress: progressList,
      completed: completedList,
    });
  }, [todoList]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onActionsCLick = (
    event: React.MouseEvent<HTMLButtonElement>,
    task: Task | undefined
  ) => {
    setActionIconsAnchorEl(event.currentTarget);
    setActionOpen(true);
    if (task) {
      setActiveTask(task);
    }
  };
  const handleClose = (category: string) => {
    setAnchorEl(null);
    if (category) {
      setSelectedCategory(category);
      dispatch(
        fetchTasks({
          userId: userData.uid,
          category: category.toLocaleUpperCase() as "WORK" | "PERSONAL",
        })
      );
    }
  };
  const handleClear = () => {
    setSearch("");
    dispatch(fetchTasks({ userId: userData.uid }));
  };
  const onActionsClose = (action: string) => {
    setActionIconsAnchorEl(null);
    setActionOpen(false);
    if (action === "delete") {
      dispatch(deleteTask({ taskId: activeTask.id, userId: userData.uid }));
    } else if (action === "edit") {
      setCreateTaskModalOpen(true);
      setActionType("editTask");
    }
  };

  const [todoListExpanded, setTodoListExpanded] = useState(true);
  const [progressListExpanded, setProgressListExpanded] = useState(true);
  const [completedListExpanded, setCompletedListExpanded] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [selectedTaskList, setSelectedTaskList] = useState<Task[]>([]);
  const handleChange = (setExpanded: any) => {
    setExpanded((prev: any) => !prev);
  };

  const onViewChange = (view: string) => {
    setViewType(view);
  };

  const filterOnDueDate = (date: Date | null) => {
    if (!date) {
      setSelectedDate(null);
      dispatch(fetchTasks({ userId: userData.uid }));
      return;
    }

    setSelectedDate(date);

    const formattedDate = date.toISOString().split("T")[0];

    dispatch(fetchTasks({ userId: userData.uid, dueDate: formattedDate }));
  };

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceList = [...displayTasks[source.droppableId]];
    const destList = [...displayTasks[destination.droppableId]];

    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    setDisplaytasks({
      ...displayTasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    });

    dispatch(
      updateTask({
        id: draggableId,
        updates: {
          status:
            destination.droppableId === "todo"
              ? "TO_DO"
              : destination.droppableId === "progress"
              ? "IN_PROGRESS"
              : "COMPLETED",
        },
        userId: userData.uid,
      })
    );
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
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
          backgroundColor: { sm: "inherit", xs: "#faeefc" },
          padding: { sm: "0px", xs: "16px" },
          borderBottom: { sm: "0px", xs: "0.5px solid #dddadd" },
        }}
      >
        {selectedTaskList.length > 0 && (
          <BottomPopup
            selectedTaskList={selectedTaskList}
            setSelectedTaskList={setSelectedTaskList}
          ></BottomPopup>
        )}
        <CreateTaskModal
          open={createTaskModalOpen}
          setOpen={setCreateTaskModalOpen}
          modalType={actionType}
          taskData={activeTask}
          setTaskData={setActiveTask}
        ></CreateTaskModal>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentIcon sx={{ color: "secondary.light" }}></AssignmentIcon>
          <Typography color="secondary.light" variant="h6">
            TaskBuddy
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 1 }} alt="Remy Sharp" src={userData.photoURL} />
          <Typography variant="body2" textTransform={"capitalize"}>
            {userData.displayName}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: { sm: "flex", xs: "none" },
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            sx={{
              textTransform: "none",
              borderRadius: "0rem",
              color:
                viewType === "list"
                  ? "secondary.main"
                  : "secondary.contrastText",
              borderBottom: viewType === "list" ? "2px solid black" : "0px",
            }}
            onClick={() => {
              onViewChange("list");
            }}
          >
            {" "}
            <ViewListIcon
              sx={{ fontSize: "1.3rem", mr: "0.3rem" }}
            ></ViewListIcon>
            List
          </Button>
          <Button
            onClick={() => {
              onViewChange("board");
            }}
            sx={{
              textTransform: "none",
              borderRadius: "0rem",
              color:
                viewType === "board"
                  ? "secondary.main"
                  : "secondary.contrastText",
              borderBottom: viewType === "board" ? "2px solid black" : "0px",
            }}
          >
            {" "}
            <GridViewIcon
              sx={{ fontSize: "1.3rem", mr: "0.3rem" }}
            ></GridViewIcon>
            Board
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              textTransform: "none",
              borderRadius: "0.5rem",
              backgroundColor: "#fff9f9",
            }}
            onClick={() => {
              dispatch(logout());
              Navigate({ to: "/" });
            }}
          >
            {" "}
            <LogoutIcon sx={{ fontSize: "1rem", mr: "0.1rem" }}></LogoutIcon>
            Logout
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { sm: "row", xs: "column" },
          gap: { xs: "1.5rem", sm: "0rem" },
          padding: { xs: "0px 16px", sm: "0px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            position: "relative",
            order: { sm: 1, xs: 2 },
            width: { sm: "90%", xs: "100%" },
            justifyContent: "space-between",
            flexDirection: { sm: "row", xs: "column" },
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              dispatch(
                fetchTasks({ userId: userData.uid, searchTerm: e.target.value })
              );
              setSearch(e.target.value);
            }}
            sx={{
              width: { sm: 250, xs: "92vw" },
              borderRadius: "20px",
              backgroundColor: "white",
              marginRight: { sm: "1rem", xs: "0rem" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                paddingLeft: "8px",
                paddingRight: "8px",
              },
              "& .MuiInputBase-input": {
                padding: "6px 10px",
              },
              order: { xs: 2, sm: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="disabled" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              position: "relative",
              flexWrap: { sm: "nowrap", xs: "wrap" },
              width: "100%",
            }}
          >
            <Typography
              sx={{ width: { sm: "fit-content", xs: "100%" } }}
              variant="body2"
              color="secondary.light"
            >
              Filter by:
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClick}
              sx={{
                fontSize: "0.8rem",
              }}
              style={{
                borderRadius: "2rem",
                textTransform: "capitalize",
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {selectedCategory || "Category"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleClose("")}
              PaperProps={{
                style: {
                  border: "1px solid rgb(240, 204, 204)",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "0.2rem",
                  marginTop: "0.5rem",
                  backgroundColor: "#fff9f9",
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem
                sx={{
                  fontSize: "1rem",
                  backgroundColor:
                    selectedCategory === "Work" ? "#f0cccc" : "#fff9f9",
                }}
                onClick={() => handleClose("Work")}
              >
                Work
              </MenuItem>
              <MenuItem
                sx={{
                  fontSize: "1rem",
                  backgroundColor:
                    selectedCategory === "Personal" ? "#f0cccc" : "#fff9f9",
                }}
                onClick={() => handleClose("Personal")}
              >
                Personal
              </MenuItem>
            </Menu>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  filterOnDueDate(date);
                  setSelectedDate(date);
                }
              }}
              dateFormat="dd MMM, yyyy"
              placeholderText="Due Date"
              customInput={
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{
                    textTransform: "none",
                    borderRadius: "2rem",
                    fontSize: "0.8rem",
                    color: selectedDate ? "black" : "inherit",
                    backgroundColor: selectedDate ? "#f0cccc" : "transparent",
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Due Date"}
                </Button>
              }
            />
            {(selectedDate || selectedCategory) && (
              <IconButton
                sx={{
                  position: "absolute",
                  right: "-3rem",
                  color: "gray",
                  border: "1px solid",
                  padding: "0.3rem",
                }}
                onClick={() => {
                  filterOnDueDate(null);
                  if (selectedCategory) {
                    setSelectedCategory("");
                  }
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            order: { sm: 2, xs: 1 },
            display: "flex",
            flexDirection: { sm: "row", xs: "column" },
            alignItems: { xs: "flex-end", sm: "center" },
            gap: { xs: "1rem", sm: "0rem" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              borderRadius: "3rem",
              px: "2rem",
              ":hover": { backgroundColor: "#7b1984" },
              order: { xs: 1, sm: 2 },
              width: "fit-content",
              whiteSpace: "nowrap",
            }}
            onClick={handleClickOpen}
          >
            Add Task
          </Button>
        </Box>
      </Box>
      {viewType === "list" && <Divider sx={{ py: "1rem" }}></Divider>}
      {search && tasks.length === 0 && (
        <Box minHeight={"60vh"} display={"flex"} alignItems={"center"}>
          <NoResultsFound></NoResultsFound>
        </Box>
      )}
      {(tasks.length > 0 || !search) && (
        <Box>
          {viewType === "list" && (
            <Box
              sx={{
                display: { sm: "flex", xs: "none" },
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                Task name
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                Due on
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                {" "}
                Task Status
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                Task Category
              </Box>
            </Box>
          )}
          <Box>
            <DragDropContext onDragEnd={onDragEnd}>
              <Box
                display="flex"
                flexDirection={viewType === "list" ? "column" : "row"}
                justifyContent="space-around"
              >
                {Object.entries(displayTasks).map(([status, taskList]) => {
                  return (
                    <Droppable key={status} droppableId={status}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            width: "100%",
                            minHeight: 200,
                            p: 2,
                          }}
                        >
                          <Accordion
                            expanded={
                              status === "todo"
                                ? todoListExpanded
                                : status === "progress"
                                ? progressListExpanded
                                : completedListExpanded
                            }
                            onChange={() => {
                              handleChange(
                                status === "todo"
                                  ? setTodoListExpanded
                                  : status === "progress"
                                  ? setProgressListExpanded
                                  : setCompletedListExpanded
                              );
                            }}
                            sx={{
                              "&:first-of-type": {
                                borderTopLeftRadius: "14px",
                                borderTopRightRadius: "14px",
                              },
                              "&:last-of-type": {
                                borderBottomLeftRadius: "19px",
                                borderBottomRightRadius: "19px",
                              },
                              borderRadius:
                                todoListExpanded ||
                                progressListExpanded ||
                                completedListExpanded
                                  ? "1rem 1rem 0 0"
                                  : "1rem",
                              overflow: "hidden",
                              "&:before": { display: "none" },
                            }}
                            key={status}
                          >
                            <AccordionSummary
                              expandIcon={
                                viewType === "list" && <ExpandMoreIcon />
                              }
                              aria-controls="panel2-content"
                              id="panel2-header"
                              sx={{
                                backgroundColor:
                                  viewType === "list"
                                    ? status === "todo"
                                      ? "info.light"
                                      : status === "progress"
                                      ? "info.contrastText"
                                      : "info.main"
                                    : "#f1f1f1",
                                borderRadius:
                                  todoListExpanded ||
                                  progressListExpanded ||
                                  completedListExpanded
                                    ? "1rem 1rem 0 0"
                                    : "1rem",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  mb: 0,
                                  textTransform: "uppercase",
                                  backgroundColor:
                                    viewType === "board"
                                      ? status === "todo"
                                        ? "info.light"
                                        : status === "progress"
                                        ? "info.contrastText"
                                        : "info.main"
                                      : "",
                                  padding:
                                    viewType === "board" ? "0.2rem 1rem" : "",
                                  borderRadius:
                                    viewType === "board" ? "0.5rem" : "",
                                  fontSize: "1rem",
                                }}
                              >
                                {status.replace(/([A-Z])/g, " $1")} (
                                {
                                  (Array.isArray(taskList) ? taskList : [])
                                    .length
                                }
                                )
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                backgroundColor: "#f1f1f1",
                                borderRadius:
                                  todoListExpanded ||
                                  progressListExpanded ||
                                  completedListExpanded
                                    ? "0 0 1rem 1rem"
                                    : "1rem",
                                paddingLeft:
                                  viewType === "list" ? "0px" : "16px",
                                paddingRight:
                                  viewType === "list" ? "0px" : "16px",
                                maxHeight: "300px",
                                minHeight:
                                  viewType === "board" ? "60vh" : "fit-content",
                              }}
                            >
                              {(Array.isArray(taskList) ? taskList : [])
                                .length === 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight:
                                      viewType === "list" ? "250px" : "50vh",
                                  }}
                                >
                                  No Tasks in {status}
                                </Box>
                              ) : (
                                (Array.isArray(taskList) ? taskList : []).map(
                                  (task: Task, index: number) => {
                                    return (
                                      <Draggable
                                        key={task.id}
                                        draggableId={task.id}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                              border:
                                                viewType === "board"
                                                  ? "0.5px solid #dddadd"
                                                  : "0px",
                                              borderBottom:
                                                index !==
                                                  (Array.isArray(taskList)
                                                    ? taskList
                                                    : []
                                                  ).length -
                                                    1 && "0.5px solid #dddadd",
                                              display: "flex",
                                              flexDirection: "row", // Stack elements for board view
                                              justifyContent: "space-between",
                                              marginBottom:
                                                viewType === "board"
                                                  ? "1rem"
                                                  : "0rem",
                                              alignItems:
                                                viewType === "board"
                                                  ? "flex-start"
                                                  : "center", // Ensure vertical alignment
                                              fontSize: "0.9rem",
                                              fontWeight: "500",
                                              flexWrap: "wrap",
                                              minHeight:
                                                viewType === "board" && "100px",
                                              boxShadow:
                                                viewType === "board"
                                                  ? 3
                                                  : snapshot.isDragging
                                                  ? 3
                                                  : 0,
                                              backgroundColor:
                                                viewType === "board"
                                                  ? "white"
                                                  : snapshot.isDragging
                                                  ? "white"
                                                  : "inherit",
                                              borderRadius:
                                                viewType === "board"
                                                  ? "12px"
                                                  : snapshot.isDragging
                                                  ? "12px"
                                                  : "0px",
                                              padding:
                                                viewType === "board"
                                                  ? "0.7rem"
                                                  : "0.3rem",
                                            }}
                                            key={task.id}
                                          >
                                            <Box
                                              sx={{
                                                flex: 2,
                                                textAlign: "left",
                                                minWidth:
                                                  viewType === "list"
                                                    ? "100px"
                                                    : "50%",
                                                order: 1,
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  width: "100%",
                                                  order: 2,
                                                  fontSize:
                                                    viewType === "board"
                                                      ? "1rem"
                                                      : "",
                                                  fontWeight:
                                                    viewType === "board"
                                                      ? 700
                                                      : "",
                                                  textDecoration:
                                                    status === "completed"
                                                      ? "line-through"
                                                      : "none",
                                                  overflow: "hidden",
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {viewType === "list" && (
                                                  <>
                                                    <Checkbox
                                                      sx={{
                                                        paddingRight: "0px",
                                                        paddingLeft: "0px",
                                                      }}
                                                      onChange={(e) => {
                                                        if (e.target.checked) {
                                                          setSelectedTaskList([
                                                            ...selectedTaskList,
                                                            task,
                                                          ]);
                                                        } else {
                                                          const filteredTask = [
                                                            ...selectedTaskList,
                                                          ].filter(
                                                            (selectedTask) =>
                                                              selectedTask.id !==
                                                              task.id
                                                          );
                                                          setSelectedTaskList(
                                                            filteredTask
                                                          );
                                                        }
                                                      }}
                                                    />
                                                    <DragIndicatorIcon
                                                      sx={{ color: "#a7a7a7" }}
                                                    ></DragIndicatorIcon>{" "}
                                                    <CheckCircleIcon
                                                      sx={{
                                                        mr: "0.5rem",
                                                        color:
                                                          status === "completed"
                                                            ? "#1b8d17"
                                                            : "#a7a7a7",
                                                      }}
                                                    ></CheckCircleIcon>
                                                  </>
                                                )}
                                                <Box
                                                  sx={{
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    flex: 1, // Ensures it takes available space
                                                  }}
                                                  onClick={() => {
                                                    if (isMobileDevice) {
                                                      setCreateTaskModalOpen(
                                                        true
                                                      );
                                                      setActiveTask(task);
                                                      setActionType("editTask");
                                                    }
                                                  }}
                                                >
                                                  {task.title}
                                                </Box>
                                              </Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                flex: 2,
                                                display: {
                                                  xs: "none",
                                                  sm: "inline",
                                                },
                                                textAlign:
                                                  viewType === "list"
                                                    ? "left"
                                                    : "right",
                                                minWidth:
                                                  viewType === "list"
                                                    ? "100px"
                                                    : "50%",
                                                order:
                                                  viewType === "board" ? 5 : 2,
                                                alignSelf:
                                                  viewType === "board" &&
                                                  "flex-end",
                                                color:
                                                  viewType === "board"
                                                    ? "secondary.contrastText"
                                                    : "",
                                                fontSize:
                                                  viewType === "board"
                                                    ? "0.8rem"
                                                    : "",
                                              }}
                                            >
                                              {formatDate(task.dueDate)}
                                            </Box>
                                            {viewType === "list" && (
                                              <Box
                                                sx={{
                                                  flex: 2,
                                                  textAlign: "left",
                                                  minWidth: "100px",
                                                  order: 3,
                                                  display: {
                                                    xs: "none",
                                                    sm: "inline",
                                                  },
                                                }}
                                              >
                                                <Button
                                                  color="secondary"
                                                  sx={{
                                                    backgroundColor: "#dddadd",
                                                  }}
                                                >
                                                  {task.status
                                                    .split("_")
                                                    .join("-")}
                                                </Button>
                                              </Box>
                                            )}

                                            <Box
                                              sx={{
                                                flex: 1,
                                                textAlign: "left",
                                                minWidth:
                                                  viewType === "list"
                                                    ? "100px"
                                                    : "50%",
                                                textTransform: "lowercase",
                                                alignSelf:
                                                  viewType === "board" &&
                                                  "flex-end",
                                                order: 4,
                                                color:
                                                  viewType === "board"
                                                    ? "secondary.contrastText"
                                                    : "",
                                                fontSize:
                                                  viewType === "board"
                                                    ? "0.8rem"
                                                    : "",
                                                display: {
                                                  xs: "none",
                                                  sm: "inline",
                                                },
                                              }}
                                            >
                                              {task.category}
                                            </Box>
                                            <Box
                                              sx={{
                                                flex: 1,
                                                textAlign: "right",
                                                minWidth:
                                                  viewType === "list"
                                                    ? "50px"
                                                    : "50%",
                                                // alignSelf:viewType==="board" && "flex-end"
                                                order:
                                                  viewType === "board" ? 3 : 5,
                                                display: {
                                                  xs: "none",
                                                  sm: "inline",
                                                },
                                              }}
                                            >
                                              <IconButton
                                                color="secondary"
                                                onClick={(e) =>
                                                  onActionsCLick(e, task)
                                                }
                                                sx={{
                                                  fontSize: "0.8rem",
                                                }}
                                                style={{
                                                  borderRadius: "2rem",
                                                  textTransform: "capitalize",
                                                }}
                                              >
                                                <MoreHorizIcon />
                                              </IconButton>

                                              <Menu
                                                anchorEl={actionIconsAnchorEl}
                                                open={actionOpen}
                                                onClose={() => {
                                                  onActionsClose("");
                                                }}
                                                PaperProps={{
                                                  style: {
                                                    border:
                                                      "1px solid rgb(240, 204, 204)",
                                                    borderRadius: "8px",
                                                    boxShadow:
                                                      "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                                    padding: "0rem",
                                                    marginTop: "0rem",
                                                    backgroundColor: "#fff9f9",
                                                  },
                                                }}
                                                anchorOrigin={{
                                                  vertical: "bottom",
                                                  horizontal: "left",
                                                }}
                                                transformOrigin={{
                                                  vertical: "top",
                                                  horizontal: "center",
                                                }}
                                                key={task.id}
                                              >
                                                <MenuItem
                                                  sx={{
                                                    fontSize: "0.9rem",
                                                    padding: "0.3rem",
                                                    marginBottom: "0.3rem",
                                                    paddingRight: "3rem",
                                                    fontWeight: "500",
                                                  }}
                                                  key={"edit"}
                                                  onClick={() => {
                                                    onActionsClose("edit");
                                                  }}
                                                >
                                                  <BorderColorIcon
                                                    sx={{
                                                      mr: "0.5rem",
                                                      fontSize: "1.2rem",
                                                    }}
                                                  ></BorderColorIcon>{" "}
                                                  Edit
                                                </MenuItem>
                                                <MenuItem
                                                  sx={{
                                                    fontSize: "0.9rem",
                                                    padding: "0.3rem",
                                                    paddingRight: "3rem",
                                                    color: "#da2f2f",
                                                  }}
                                                  key={"delete"}
                                                  onClick={() => {
                                                    onActionsClose("delete");
                                                  }}
                                                >
                                                  <DeleteIcon
                                                    sx={{
                                                      mr: "0.5rem",
                                                      fontSize: "1.2rem",
                                                      color: "#da2f2f",
                                                    }}
                                                  ></DeleteIcon>
                                                  Delete
                                                </MenuItem>
                                              </Menu>
                                            </Box>
                                          </Box>
                                        )}
                                      </Draggable>
                                    );
                                  }
                                )
                              )}
                              {provided.placeholder}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )}
                    </Droppable>
                  );
                })}
              </Box>
            </DragDropContext>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default TaskManager;
