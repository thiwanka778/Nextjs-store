'use client';
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

interface initialStateType {
    
    categoryLoading:boolean,
      categoryStatus:boolean,
      mainCategoryErrorMessage:any|string|null,
      subCategoryErrorMessage:any|string|null,

      categoryList:any[]|null|any,
    
}




const initialState:initialStateType = {
      categoryLoading:false,
      categoryStatus:false,
      mainCategoryErrorMessage:"",
      subCategoryErrorMessage:"",

      categoryList:[],
}


export const createCategory:any = createAsyncThunk(
    'user/createMainCategory', 
    async (payload, thunkAPI) => {
    try {
      console.log(sessionStorage.getItem("token"))
      const response = await axios.post(`${BASE_URL}/create-main-category`, payload,
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

  export const getAllCategory:any = createAsyncThunk(
    'user/getAllCategory', 
    async (_, thunkAPI) => {
    try {
     
      const response = await axios.get(`${BASE_URL}/get-category-list`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `+ sessionStorage.getItem("token")
      
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




export const categorySlice:any=createSlice({
    name:'category',
    initialState,
    reducers:{
             resetCategory:(state:any)=>{
                state.categoryLoading=false;
                state.categoryStatus=false;
                state.mainCategoryErrorMessage="";
                
             }
          },

    extraReducers: (builder:any) => {
      builder
        .addCase(createCategory.pending, (state:any) => {
           state.categoryLoading=true;
           state.categoryStatus=false;
           state.mainCategoryErrorMessage="";
        })
        .addCase(createCategory.fulfilled, (state:any, action:any) => {
            state.categoryLoading=false;
            state.categoryStatus=true;
            state.mainCategoryErrorMessage="";
        })
        .addCase(createCategory.rejected, (state:any, action:any) => {
            state.categoryLoading=false;
            state.categoryStatus=false;
            state.mainCategoryErrorMessage=action.payload;
         
        })

        //getAllCategory

        .addCase(getAllCategory.pending, (state:any) => {
          state.categoryLoading=true;
          
          
       })
       .addCase(getAllCategory.fulfilled, (state:any, action:any) => {
           state.categoryLoading=false;
           state.categoryList=action.payload?.categoryList;
           
       })
       .addCase(getAllCategory.rejected, (state:any, action:any) => {
           state.categoryLoading=false;
          
        
       })


    


    },

})

export const {resetCategory}=categorySlice.actions;
export default categorySlice.reducer;