import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// import '@fontsource/roboto';
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import Divider from '@mui/material/Divider';
// import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { fetchTasks } from "../store/taskSlice";
import { useDispatch } from "react-redux";

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: Date;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Interview with Design Team",
    status: "todo",
    dueDate: new Date(),
  },
  { id: "2", title: "Team Meeting", status: "todo", dueDate: new Date() },
  {
    id: "3",
    title: "Design a Dashboard page",
    status: "inProgress",
    dueDate: new Date(),
  },
  {
    id: "4",
    title: "Submit Project Proposal",
    status: "completed",
    dueDate: new Date(),
  },
];

const TaskManager: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);


  useEffect(()=>{
  console.log("tasks=====>",tasks)
  },[tasks])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentIcon sx={{ color: "secondary.light" }}></AssignmentIcon>
          <Typography color="secondary.light" variant="h6">
            TaskBuddy
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ mr: 1 }}
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
          />
          <Typography variant="body2">User</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" ,marginBottom: "2rem",}}>
        <Box sx={{ display: "flex", alignItems: "center" ,gap:"1rem"}}>
          <Button
            variant="text"
            
            sx={{ textTransform: "none", borderRadius: "3rem" ,color:"secondary.contrastText"}}
          >
            {" "}
            <ViewListIcon sx={{ fontSize: "1.3rem", mr: "0.3rem" }}></ViewListIcon>
            List
          </Button>
          <Button
            variant="text"
            
            sx={{ textTransform: "none", borderRadius: "3rem" ,color:"secondary.contrastText"}}
          >
            {" "}
            <GridViewIcon sx={{ fontSize: "1.3rem", mr: "0.3rem" }}></GridViewIcon>
            Board
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none", borderRadius: "0.5rem" }}
          >
            {" "}
            <LogoutIcon sx={{ fontSize: "1rem", mr: "0.1rem" }}></LogoutIcon>
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", }}>
        <Box sx={{ display: "flex", alignItems: "center" ,gap:"1rem"}}>
         
           <Typography variant="body2" color="secondary.light">
        Filter by:
      </Typography>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClick}
       
        sx={{
          fontSize:"0.8rem"
        }}
        style={{
          textTransform: "none",
          borderRadius: "2rem",
          
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Category
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "0.2rem",
            marginTop: "0.5rem",
          },
        }}
        anchorOrigin={{
          vertical: "bottom", // Align to the bottom of the button
          horizontal: "center", // Center horizontally
        }}
        transformOrigin={{
          vertical: "top", // Align to the top of the menu
          horizontal: "center", // Center horizontally
        }}
      >
        <MenuItem sx={{fontSize:"0.9rem"}} onClick={handleClose}>Work</MenuItem>
        <MenuItem sx={{fontSize:"0.9rem"}}  onClick={handleClose}>Personal</MenuItem>
      </Menu>

      <Button
        variant="outlined"
        style={{
          textTransform: "none",
          borderRadius: "2rem",
        }}
        color="secondary"
        sx={{
          fontSize:"0.8rem"
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Due Date
      </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "3rem" ,px:"2rem"}}
          >
            Add Task
          </Button>
        </Box>
      </Box>
      <Divider sx={{py:"1rem"}}></Divider>
      <Box>
      <Box>sdgdfgf</Box>

      <Box>
      <Accordion 
      expanded={expanded}
      onChange={handleChange} 
      sx={{
        "&:first-of-type": {
          borderTopLeftRadius: "14px",
          borderTopRightRadius: "14px",
        },
        "&:last-of-type": {
          borderBottomLeftRadius: "19px",
          borderBottomRightRadius: "19px",
        },
        borderRadius: expanded ? "1rem 1rem 0 0" : "1rem",
        overflow: "hidden", // Prevents content overflow during animation
        "&:before": { display: "none" }, // Removes the default MUI divider line
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{
            backgroundColor: "info.light",
            borderRadius: expanded ? "1rem 1rem 0 0" : "1rem",
          }}
        >
          <Typography component="span">Todo (2)</Typography>
        </AccordionSummary>
        <AccordionDetails  sx={{
          backgroundColor: "info.dark",
          borderRadius: expanded ? "0 0 1rem 1rem" : "1rem",
        }}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </Box>
      
      </Box>
      
    </div>
  );
};

export default TaskManager;
