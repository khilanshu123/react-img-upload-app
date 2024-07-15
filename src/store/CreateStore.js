import { configureStore } from '@reduxjs/toolkit'
import authSlice from './uthSlice';

const store = configureStore({
   reducer:
   {
    auth : authSlice,
   }
})


export default store