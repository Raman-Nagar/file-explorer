import { configureStore } from '@reduxjs/toolkit'
import fileSystemReducer from './features/fileSystemSlice';

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
  },
})