import {configureStore} from '@reduxjs/toolkit';
import userReducer from "./features/userSlice";
import storeReducer from "./features/storeSlice";
import categoryReducer from "./features/categorySlice";


export const store=configureStore({
    reducer:{
         user:userReducer, 
         store:storeReducer,
         category:categoryReducer,
    }
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
