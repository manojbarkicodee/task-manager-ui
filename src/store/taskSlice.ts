import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase"; 
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

interface Activity {
  message: string;
  date: string; 
}

export interface Task {
  id?: string; 
  userId?: string; 
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED" | "";
  category: "WORK" | "PERSONAL";
  createdAt?: string; 
  updatedAt?: string;
  dueDate: string; 
  activity?: Activity[]; 
}


interface TaskState {
  tasks: Task[];
  todoList: Task[];
  progressList: Task[];
  completedList: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  todoList: [],
  progressList: [],
  completedList: [],
  loading: false,
  error: null,
};
interface FetchTasksParams {
  userId: string;
  category?: string;
  dueDate?: string;
  searchTerm?:string;
}

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ userId, category, dueDate,searchTerm}: FetchTasksParams) => {
    try {
      let tasksQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
      );

      if (category && dueDate) {
        tasksQuery = query(
          tasksQuery,
          where("category", "==", category),
          where("dueDate", "==", dueDate) 
        );
      } else if (category) {
        tasksQuery = query(tasksQuery, where("category", "==", category));
      } else if (dueDate) {
        tasksQuery = query(tasksQuery, where("dueDate", "==", dueDate));
      }
  
      const taskSnapshot = await getDocs(tasksQuery);
      let tasks = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      if(searchTerm){
        tasks = tasks.filter((task) =>
          searchTerm ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
        );
        
       }
      console.log("Fetched filtered tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }
);

// Add a new task for a specific user
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (
    newTask: Omit<Task, "id" | "createdAt" | "updatedAt" | "activity"> & {
      userId: string;
    }
  ) => {
    const tasksCollection = collection(db, "tasks");
    const now = new Date().toISOString();
    const initialActivity: Activity = {
      message: `Task created with title: "${newTask.title}"`,
      date: now,
    };
    console.log("newtask==>", newTask);
    const taskRef = await addDoc(tasksCollection, {
      ...newTask,
      createdAt: now,
      updatedAt: now,
      activity: [initialActivity],
    });
    return {
      id: taskRef.id,
      ...newTask,
      createdAt: now,
      updatedAt: now,
      activity: [initialActivity],
    };
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({
    id,
    updates,
    userId,
  }: {
    id: string;
    updates: Partial<Task>;
    userId: string;
  }) => {
    const taskDoc = doc(db, "tasks", id);
    const taskSnapshot = await getDoc(taskDoc);

    if (!taskSnapshot.exists()) {
      throw new Error("Task not found");
    }

    const currentTask = taskSnapshot.data() as Task;

    if (currentTask.userId !== userId) {
      throw new Error("Unauthorized action");
    }

    const now = new Date().toISOString();
    const newActivity: Activity[] = currentTask.activity || [];

    if (updates.status && updates.status !== currentTask.status) {
      newActivity.push({
        message: `Task status updated from "${currentTask.status}" to "${updates.status}"`,
        date: now,
      });
    }

    if (updates.title && updates.title !== currentTask.title) {
      newActivity.push({
        message: `Task title updated from "${currentTask.title}" to "${updates.title}"`,
        date: now,
      });
    }

    await updateDoc(taskDoc, {
      ...updates,
      updatedAt: now,
      activity: newActivity,
    });
    return { id, ...updates, updatedAt: now, activity: newActivity };
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ taskId, userId }: { taskId: string; userId: string }) => {
    const taskDoc = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskDoc);

    if (!taskSnapshot.exists()) {
      throw new Error("Task not found");
    }

    const task = taskSnapshot.data() as Task;

    if (task.userId !== userId) {
      throw new Error("Unauthorized action");
    }

    await deleteDoc(taskDoc);
    return taskId;
  }
);

// Slice Definition
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    filterTasksByStatus: (
      state,
      action: PayloadAction<"TO_DO" | "IN_PROGRESS" | "COMPLETED">
    ) => {
      if (action.payload === "TO_DO") {
        state.todoList = state.tasks.filter(
          (task) => task.status === action.payload
        );
      } else if (action.payload === "IN_PROGRESS") {
        state.progressList = state.tasks.filter(
          (task) => task.status === action.payload
        );
      } else if (action.payload === "COMPLETED") {
        state.completedList = state.tasks.filter(
          (task) => task.status === action.payload
        );
      }
    },
    filterTasksByCategory: (
      state,
      action: PayloadAction<"WORK" | "PERSONAL">
    ) => {
      state.tasks = state.tasks.filter(
        (task) => task.category === action.payload
      );
    },
    searchTasks: (
      state,
      action: PayloadAction<{ title?: string; status?: string }>
    ) => {
      const { title, status } = action.payload;
      state.tasks = state.tasks.filter((task) => {
        const matchesTitle = title
          ? task.title.toLowerCase().includes(title.toLowerCase())
          : true;
        const matchesStatus = status ? task.status === status : true;
        return matchesTitle && matchesStatus;
      });
    },
    clearFilters: (state) => {
      state.tasks = [...state.tasks];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })

      // Add a new task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        console.log("action.payload", action.payload);
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add task";
        console.log(action.error.message);
      })

      // Update a task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<{ id: string } & Partial<Task>>) => {
        state.loading = false;
        const taskIndex = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            ...action.payload,
          };
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })

      // Delete a task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export const {
  filterTasksByCategory,
  searchTasks,
  clearFilters,
  filterTasksByStatus,
} = taskSlice.actions;
export default taskSlice.reducer;
