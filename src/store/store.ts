// // src/redux/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,

//   },
// });

// export type RootState = ReturnType<typeof store.getState>; // Add this line to infer types from the store

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice'; // Import the taskSlice reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer, // Add tasks to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;