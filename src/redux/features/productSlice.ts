'use client';
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

interface initialStateType {
    productLoading:boolean,
    createProductStatus:boolean,
    createProductErrorMessage:string|any|null,    
}




const initialState:initialStateType = {
     productLoading:false,
     createProductStatus:false,
     createProductErrorMessage:"",
}


export const createProduct:any = createAsyncThunk(
    'user/createProduct', 
    async (payload, thunkAPI) => {
    try {
     
      const response = await axios.post(`${BASE_URL}/product`, payload,
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


export const productSlice:any=createSlice({
    name:'product',
    initialState,
    reducers:{
             resetProduct:(state:any)=>{
                 state.createProductStatus=false;
                 state.createProductErrorMessage="";
             }
          },

    extraReducers: (builder:any) => {
      builder
        .addCase(createProduct.pending, (state:any) => {
            state.productLoading=true;
            state.createProductStatus=false;
            state.createProductErrorMessage="";
        })
        .addCase(createProduct.fulfilled, (state:any, action:any) => {
            state.productLoading=false;
            state.createProductStatus=true;
            state.createProductErrorMessage="";
        })
        .addCase(createProduct.rejected, (state:any, action:any) => {
            state.productLoading=false;
            state.createProductStatus=false;
            state.createProductErrorMessage=action.payload;
         
        })

      
    


    },

})

export const {resetProduct}=productSlice.actions;
export default productSlice.reducer;