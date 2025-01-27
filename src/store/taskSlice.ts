



// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { db } from '../firebase'; // Import your Firebase configuration
// import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// // Define the task interface
// interface Activity {
//   message: string;
//   date: string; // ISO string
// }

// interface Task {
//   id: string; // Firebase document ID
//   title: string;
//   description: string;
//   status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
//   category: 'WORK' | 'PERSONAL';
//   createdAt: string; // ISO string
//   updatedAt: string; // ISO string
//   dueDate: string; // ISO string
//   activity: Activity[]; // List of actions performed on the task
// }

// // Define the state structure
// interface TaskState {
//   tasks: Task[];
//   filteredTasks: Task[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: TaskState = {
//   tasks: [],
//   filteredTasks: [],
//   loading: false,
//   error: null,
// };

// // Async Thunks for Firebase Operations

// // Fetch all tasks
// export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
//   const tasksCollection = collection(db, 'tasks');
//   const taskSnapshot = await getDocs(tasksCollection);
//   console.log(taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
//   return taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
// });

// // Add a new task
// export const addTask = createAsyncThunk(
//   'tasks/addTask',
//   async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'activity'>) => {
//     const tasksCollection = collection(db, 'tasks');
//     const now = new Date().toISOString();
//     const initialActivity: Activity = { message: `Task created with title: "${newTask.title}"`, date: now };
//     const taskRef = await addDoc(tasksCollection, {
//       ...newTask,
//       createdAt: now,
//       updatedAt: now,
//       activity: [initialActivity],
//     });
//     return { id: taskRef.id, ...newTask, createdAt: now, updatedAt: now, activity: [initialActivity] };
//   }
// );

// // Update a task
// export const updateTask = createAsyncThunk(
//   'tasks/updateTask',
//   async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
//     const taskDoc = doc(db, 'tasks', id);
//     const now = new Date().toISOString();

//     // Get the current task data
//     const taskSnapshot = await getDoc(taskDoc);
//     if (!taskSnapshot.exists()) {
//       throw new Error('Task not found');
//     }

//     const currentTask = taskSnapshot.data() as Task;
//     const newActivity: Activity[] = currentTask.activity || [];

//     if (updates.status && updates.status !== currentTask.status) {
//       newActivity.push({
//         message: `Task status updated from "${currentTask.status}" to "${updates.status}"`,
//         date: now,
//       });
//     }

//     if (updates.title && updates.title !== currentTask.title) {
//       newActivity.push({
//         message: `Task title updated from "${currentTask.title}" to "${updates.title}"`,
//         date: now,
//       });
//     }

//     await updateDoc(taskDoc, { ...updates, updatedAt: now, activity: newActivity });
//     return { id, ...updates, updatedAt: now, activity: newActivity };
//   }
// );

// // Delete a task
// export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string) => {
//   const taskDoc = doc(db, 'tasks', taskId);
//   await deleteDoc(taskDoc);
//   return taskId;
// });

// // Slice Definition
// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     filterTasksByCategory: (state, action: PayloadAction<'WORK' | 'PERSONAL'>) => {
//       state.filteredTasks = state.tasks.filter(task => task.category === action.payload);
//     },
//     searchTasks: (state, action: PayloadAction<{ title?: string; status?: string }>) => {
//       const { title, status } = action.payload;
//       state.filteredTasks = state.tasks.filter(task => {
//         const matchesTitle = title ? task.title.toLowerCase().includes(title.toLowerCase()) : true;
//         const matchesStatus = status ? task.status === status : true;
//         return matchesTitle && matchesStatus;
//       });
//     },
//     clearFilters: (state) => {
//       state.filteredTasks = [...state.tasks];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all tasks
//       .addCase(fetchTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
//         state.loading = false;
//         state.tasks = action.payload;
//         console.log("tasks====>",action.payload);
//         state.filteredTasks = action.payload;
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch tasks';
//       })

//       // Add a new task
//       .addCase(addTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
//         state.loading = false;
//         state.tasks.push(action.payload);
//         state.filteredTasks.push(action.payload);
//       })
//       .addCase(addTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to add task';
//       })

//       // Update a task
//       .addCase(updateTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
//         state.loading = false;
//         const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
//         if (taskIndex !== -1) {
//           state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...action.payload };
//         }
//         state.filteredTasks = [...state.tasks];
//       })
//       .addCase(updateTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to update task';
//       })

//       // Delete a task
//       .addCase(deleteTask.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
//         state.loading = false;
//         state.tasks = state.tasks.filter(task => task.id !== action.payload);
//         state.filteredTasks = state.filteredTasks.filter(task => task.id !== action.payload);
//       })
//       .addCase(deleteTask.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to delete task';
//       });
//   },
// });

// export const { filterTasksByCategory, searchTasks, clearFilters } = taskSlice.actions;
// export default taskSlice.reducer;



import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../firebase'; // Import your Firebase configuration
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Define the task interface
interface Activity {
  message: string;
  date: string; // ISO string
}

interface Task {
  id: string; // Firebase document ID
  userId: string; // User ID
  title: string;
  description: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  category: 'WORK' | 'PERSONAL';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  dueDate: string; // ISO string
  activity: Activity[]; // List of actions performed on the task
}

// Define the state structure
interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
};

// Async Thunks for Firebase Operations

// Fetch all tasks for a specific user
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (userId: string) => {
    try{
        const tasksCollection = collection(db, 'tasks');
        console.log("tasks")
        const taskSnapshot = await getDocs(tasksCollection);
        const tasks = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
        console.log("tasks=======123",taskSnapshot)
        return tasks.filter(task => task.userId === userId); // Filter tasks by userId
    }catch(error){
        console.log(error)
    }

});

// Add a new task for a specific user
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'activity'> & { userId: string }) => {
    const tasksCollection = collection(db, 'tasks');
    const now = new Date().toISOString();
    const initialActivity: Activity = { message: `Task created with title: "${newTask.title}"`, date: now };
    const taskRef = await addDoc(tasksCollection, {
      ...newTask,
      createdAt: now,
      updatedAt: now,
      activity: [initialActivity],
    });
    return { id: taskRef.id, ...newTask, createdAt: now, updatedAt: now, activity: [initialActivity] };
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates, userId }: { id: string; updates: Partial<Task>; userId: string }) => {
    const taskDoc = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDoc);
    
    if (!taskSnapshot.exists()) {
      throw new Error('Task not found');
    }

    const currentTask = taskSnapshot.data() as Task;

    // Ensure the task belongs to the authenticated user
    if (currentTask.userId !== userId) {
      throw new Error('Unauthorized action');
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

    await updateDoc(taskDoc, { ...updates, updatedAt: now, activity: newActivity });
    return { id, ...updates, updatedAt: now, activity: newActivity };
  }
);

// Delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ taskId, userId }: { taskId: string; userId: string }) => {
  const taskDoc = doc(db, 'tasks', taskId);
  const taskSnapshot = await getDoc(taskDoc);
  
  if (!taskSnapshot.exists()) {
    throw new Error('Task not found');
  }

  const task = taskSnapshot.data() as Task;

  // Ensure the task belongs to the authenticated user
  if (task.userId !== userId) {
    throw new Error('Unauthorized action');
  }

  await deleteDoc(taskDoc);
  return taskId;
});

// Slice Definition
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    filterTasksByCategory: (state, action: PayloadAction<'WORK' | 'PERSONAL'>) => {
      state.filteredTasks = state.tasks.filter(task => task.category === action.payload);
    },
    searchTasks: (state, action: PayloadAction<{ title?: string; status?: string }>) => {
      const { title, status } = action.payload;
      state.filteredTasks = state.tasks.filter(task => {
        const matchesTitle = title ? task.title.toLowerCase().includes(title.toLowerCase()) : true;
        const matchesStatus = status ? task.status === status : true;
        return matchesTitle && matchesStatus;
      });
    },
    clearFilters: (state) => {
      state.filteredTasks = [...state.tasks];
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
        state.filteredTasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })

      // Add a new task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.filteredTasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      })

      // Update a task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...action.payload };
        }
        state.filteredTasks = [...state.tasks];
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })

      // Delete a task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.filteredTasks = state.filteredTasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { filterTasksByCategory, searchTasks, clearFilters } = taskSlice.actions;
export default taskSlice.reducer;

