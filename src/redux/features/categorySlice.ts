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
      updateMainCategoryErrorMessage:any|null|string,
      updateSubCategoryErrorMessage:any|null|string,
    
}




const initialState:initialStateType = {
      categoryLoading:false,
      categoryStatus:false,
      mainCategoryErrorMessage:"",
      subCategoryErrorMessage:"",

      updateMainCategoryErrorMessage:"",
      updateSubCategoryErrorMessage:"",

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


  export const createSubCategory:any = createAsyncThunk(
    'user/createSubCategory', 
    async ({id,name,description}:any, thunkAPI) => {

    try {
      const reqBody=[{
        name,description
      }]
      console.log(sessionStorage.getItem("token"))
      const response = await axios.post(`${BASE_URL}/create-sub-category/${id}`, reqBody,
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

  export const updateMainCategory:any = createAsyncThunk(
    'user/updateMainCategory', 
    async ({id,name,description}:any, thunkAPI) => {

    try {
      const reqBody={
        name,
        description
      }
    
      const response = await axios.put(`${BASE_URL}/update-main-category/${id}`, reqBody,
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

  export const updateSubCategory:any = createAsyncThunk(
    'user/updateSubCategory', 
    async ({id,name,description}:any, thunkAPI) => {

    try {
      const reqBody={
        name,
        description
      }
    
      const response = await axios.put(`${BASE_URL}/update-sub-category/${id}`, reqBody,
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




export const categorySlice:any=createSlice({
    name:'category',
    initialState,
    reducers:{
             resetCategory:(state:any)=>{
                state.categoryLoading=false;
                state.categoryStatus=false;
                state.mainCategoryErrorMessage="";
                state.subCategoryErrorMessage="";
                state.updateMainCategoryErrorMessage="";
                state.updateSubCategoryErrorMessage="";
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

       //createSubCategory

       .addCase(createSubCategory.pending, (state:any) => {
        state.categoryLoading=true;
        state.categoryStatus=false;
        state.subCategoryErrorMessage="";
        
        
     })
     .addCase(createSubCategory.fulfilled, (state:any, action:any) => {
         state.categoryLoading=false;
         state.categoryStatus=true;
         state.subCategoryErrorMessage="";
         
     })
     .addCase(createSubCategory.rejected, (state:any, action:any) => {
         state.categoryLoading=false;
         state.categoryStatus=false;
         state.subCategoryErrorMessage=action.payload;
      
     })

     //const updateMainCategory

     .addCase(updateMainCategory.pending, (state:any) => {
      state.categoryLoading=true;
      state.categoryStatus=false;
      state.updateMainCategoryErrorMessage="";
      
      
      
   })
   .addCase(updateMainCategory.fulfilled, (state:any, action:any) => {
       state.categoryLoading=false;
       state.categoryStatus=true;
 
       state.updateMainCategoryErrorMessage="";
       
   })
   .addCase(updateMainCategory.rejected, (state:any, action:any) => {
       state.categoryLoading=false;
       state.categoryStatus=false;
       state.updateMainCategoryErrorMessage=action.payload;
    
   })
// updateSubCategory
.addCase(updateSubCategory.pending, (state:any) => {
  state.categoryLoading=true;
  state.categoryStatus=false;
  state.updateSubCategoryErrorMessage="";
  
  
  
})
.addCase(updateSubCategory.fulfilled, (state:any, action:any) => {
   state.categoryLoading=false;
   state.categoryStatus=true;

   state.updateSubCategoryErrorMessage="";
   
})
.addCase(updateSubCategory.rejected, (state:any, action:any) => {
   state.categoryLoading=false;
   state.categoryStatus=false;
   state.updateSubCategoryErrorMessage=action.payload;

})
    


    },

})

export const {resetCategory}=categorySlice.actions;
export default categorySlice.reducer;