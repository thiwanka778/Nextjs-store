'use client';
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

interface initialStateType {
    createStoreLoading:boolean,
    createStoreStatus:boolean,
    createStoreErrorMessage:any|null|string,
    getStoreLoading:boolean,
    getStoreData:any|null,

    updateStoreLoading:boolean,
    updateStoreStatus:boolean,
   updateStoreErrorMesssage:any|null|string,

   deleteStoreLoading:boolean,
   deleteStoreStatus:boolean,
   deleteStoreErrorMessage:any|null|string,
 
    
}




const initialState:initialStateType = {
   createStoreLoading:false,
   createStoreStatus:false,
   createStoreErrorMessage:"",


   updateStoreLoading:false,
   updateStoreStatus:false,
  updateStoreErrorMesssage:"",

   getStoreLoading:false,
   getStoreData:[],

   deleteStoreLoading:false,
   deleteStoreStatus:false,
   deleteStoreErrorMessage:"",
}



export const createStore:any = createAsyncThunk(
  'user/createStore', 
  async (payload, thunkAPI) => {
  try {

    const response = await axios.post(`${BASE_URL}/store/create-store`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+sessionStorage.getItem("token"),
    
      },
    });

    return response.data;
  } catch (error:any) {
  
   
    let message:any='';

    if(error?.response?.status==500){
        message='Internal Server Error'
    }else{
      message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    }
     

    return thunkAPI.rejectWithValue(message);
  }
});

export const updateStore:any = createAsyncThunk(
  'user/updateStore', 
  async (payload:any, thunkAPI) => {
  

    try {
      const response = await axios.put(`${BASE_URL}/store/update-store/${payload?.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error:any) {
      let message = '';

      if (error?.response?.status === 500) {
        message = 'Internal Server Error';
      } else {
        message = (error.response && error.response.data && error.response.data.message) ||
                  error.message || error.toString();
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteStore:any = createAsyncThunk(
  'user/temp-deleteStore', 
  async (id, thunkAPI) => {
  

    try {
      const response = await axios.put(`${BASE_URL}/store/temp-delete/${id}`,null, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error:any) {
      let message = '';

      if (error?.response?.status === 500) {
        message = 'Internal Server Error';
      } else {
        message = (error.response && error.response.data && error.response.data.message) ||
                  error.message || error.toString();
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getAllStores:any = createAsyncThunk(
  'store/getAllStores',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/store/get-all-store`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      return response.data;
    } catch (error:any) {
      let message = '';

      if (error?.response?.status === 500) {
        message = 'Internal Server Error';
      } else {
        message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);




export const storeSlice:any=createSlice({
    name:'store',
    initialState,
    reducers:{
             resetStore:(state:any)=>{
               
                state.createStoreStatus=false;
                state.createStoreErrorMessage="";
                state.updateStoreStatus=false;
                state.updateStoreErrorMesssage="";
                state.deleteStoreErrorMessage="";
                state.deleteStoreStatus=false;
             }
          },

    extraReducers: (builder:any) => {
      builder
        .addCase(createStore.pending, (state:any) => {
           state.createStoreLoading=true;
           state.createStoreStatus=false;
           state.createStoreErrorMessage="";
        })
        .addCase(createStore.fulfilled, (state:any, action:any) => {
            state.createStoreLoading=false;
            state.createStoreStatus=true;
            state.createStoreErrorMessage="";
        })
        .addCase(createStore.rejected, (state:any, action:any) => {
            state.createStoreLoading=false;
            state.createStoreStatus=false;
            state.createStoreErrorMessage=action.payload;
         
        })
    //getAllStores

    .addCase(getAllStores.pending, (state:any) => {
     state.getStoreLoading=true;
   })
   .addCase(getAllStores.fulfilled, (state:any, action:any) => {
    state.getStoreLoading=false;
    state.getStoreData=action.payload?.storeList;
   })
   .addCase(getAllStores.rejected, (state:any, action:any) => {
    state.getStoreLoading=false;
    
   })

      // updateStore


.addCase(updateStore.pending, (state:any) => {
     state.updateStoreLoading=true;
     state.updateStoreStatus=false;
     state.updateStoreErrorMesssage="";
   })
   .addCase(updateStore.fulfilled, (state:any, action:any) => {
    state.updateStoreLoading=false;
    state.updateStoreStatus=true;
    state.updateStoreErrorMesssage="";
   })
   .addCase(updateStore.rejected, (state:any, action:any) => {
    state.updateStoreLoading=false;
    state.updateStoreStatus=false;
    state.updateStoreErrorMesssage=action?.payload;
    
   })

   //deleteStore

   .addCase(deleteStore.pending, (state:any) => {
    state.deleteStoreLoading=true;
    state.deleteStoreErrorMessage="";
    state.deleteStoreStatus=false;
  })
  .addCase(deleteStore.fulfilled, (state:any, action:any) => {
    state.deleteStoreLoading=false;
    state.deleteStoreErrorMessage="";
    state.deleteStoreStatus=true;
  })
  .addCase(deleteStore.rejected, (state:any, action:any) => {
    state.deleteStoreLoading=false;
    state.deleteStoreErrorMessage=action.payload;
    state.deleteStoreStatus=false;
   
  })
     


    },

})

export const {resetStore}=storeSlice.actions;
export default storeSlice.reducer;