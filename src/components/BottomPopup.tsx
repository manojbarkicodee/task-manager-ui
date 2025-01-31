import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTask, Task, updateTask } from "../store/taskSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const BottomPopup = ({
  selectedTaskList,
  setSelectedTaskList,
}: {
  selectedTaskList: Task[];
  setSelectedTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const dispatch = useDispatch<AppDispatch>();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSelectedAction = (actionType: string, status?: string) => {
    if (actionType === "delete") {
      for (const task of selectedTaskList) {
        dispatch(deleteTask({ taskId: task.id || "", userId: userData.uid }));
      }
    } else if (actionType === "update") {
      console.log("actionType", actionType, selectedStatus);
      for (const task of selectedTaskList) {
        dispatch(
          updateTask({
            id: task.id || "",
            updates: { status: status || "TO_DO" },
            userId: userData.uid,
          })
        );
      }
    }
    setSelectedTaskList([]);
  };

  const handleMenuClose = (status?: string) => {
    if (status) {
      setSelectedStatus(status);
      onSelectedAction("update", status);
    }
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        padding: "8px 16px",
        borderRadius: "8px",
        boxShadow: 3,
        gap: 1,
        zIndex: 100,
      }}
    >
      <Chip
        label={`${selectedTaskList.length}  Tasks Selected`}
        sx={{ backgroundColor: "#292929", color: "#fff" }}
      />

      <Button
        onClick={handleMenuOpen}
        endIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#292929",
          color: "#fff",
          textTransform: "none",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        {selectedStatus.split("_").join(" ")}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1E1E1E",
            color: "#fff",
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => handleMenuClose("TO_DO")}>TO-DO</MenuItem>
        <MenuItem onClick={() => handleMenuClose("IN_PROGRESS")}>
          IN-PROGRESS
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose("COMPLETED")}>
          COMPLETED
        </MenuItem>
      </Menu>

      <IconButton
        sx={{
          backgroundColor: "#8B0000",
          color: "#fff",
          "&:hover": { backgroundColor: "#A00000" },
        }}
        onClick={() => onSelectedAction("delete")}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default BottomPopup;
