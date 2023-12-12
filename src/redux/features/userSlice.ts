'use client';
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

interface initialStateType {
   user:null|any,
   count:number,
   accessToken:string,
   refreshToken:string,
    signUpLoading:boolean,
    signUpStatus:boolean,
    signUpErrorMessage:null|any,
    signUpSuccessMessage:null|any,
    resendOtpLoading:boolean,
    resendOtpStatus:boolean,
    resendOtpErrorMessage:null|any,
    verifyOtpLoading:boolean,
    verifyOtpStatus:boolean,
    verifyOtpErrorMessage:null|any,
    userLoginLoading:boolean,
    userLoginStatus:boolean,
    userLoginErrorMessage:null|any,
    userLoginSuccessMessage:null|any,
    findUserByEmailLoading:boolean,
    findUserByEmailStatus:boolean,
    findUserByEmailErrorMessage:any|null|string,

    resetPasswordLoading:boolean,
    resetPasswordStatus:boolean,
    resetPasswordErrorMessage:any|null|string,
}

const localUser= localStorage.getItem("user");
const localToken=sessionStorage.getItem("token");
const localRefreshToken=localStorage.getItem("refreshToken");


const initialState:initialStateType = {
    user:localUser?JSON.parse(localUser):null,
    count:0,
    accessToken:localToken?localToken:"",
    refreshToken:localRefreshToken?localRefreshToken:"",

    signUpLoading:false,
    signUpStatus:false,
    signUpErrorMessage:"",
    signUpSuccessMessage:"",


    resendOtpLoading:false,
    resendOtpStatus:false,
    resendOtpErrorMessage:"",


    verifyOtpLoading:false,
    verifyOtpStatus:false,
    verifyOtpErrorMessage:'',

    userLoginLoading:false,
    userLoginStatus:false,
    userLoginErrorMessage:"",
    userLoginSuccessMessage:"",

    findUserByEmailLoading:false,
    findUserByEmailStatus:false,
    findUserByEmailErrorMessage:"",


    resetPasswordLoading:false,
    resetPasswordStatus:false,
    resetPasswordErrorMessage:"",
}

export const addNewUser:any = createAsyncThunk(
  'user/addNewUser', 
  async (payload, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/addNewUser`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
   
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


export const resendOtp:any = createAsyncThunk(
  'user/resendOtp', 
  async (email:any, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/resend-otp/${email}`, null,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
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


export const verifyOtp:any = createAsyncThunk(
  'user/verifyOtp', 
  async (payload, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/verify-otp`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
    console.log(error)
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


export const authLogin:any = createAsyncThunk(
  'user/login', 
  async (payload, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/login`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
    console.log(error)
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


export const findUserByEmail:any = createAsyncThunk(
  'user/findUserByEmail', 
  async (email, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/find-user-exist/${email}`, null,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
    console.log(error)
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


export const resetPassword:any = createAsyncThunk(
  'user/resetPassword', 
  async (payload, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
    console.log(error)
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


export const logoutUser:any = createAsyncThunk(
  'user/logoutUser', 
  async (userId, thunkAPI) => {
  try {
    // Make the POST request with the user data as the request body
    const response = await axios.post(`${BASE_URL}/auth/logout/${userId}`, null,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error:any) {
    // Handle errors and return a rejected value with the error message
    console.log(error)
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

export const userSlice:any=createSlice({
    name:'user',
    initialState,
    reducers:{
           incrementCount:(state:any,action:any)=>{
             state.count=state.count+1;
           },
           decrementCount:(state:any,action:any)=>{
            state.count=state.count-1;
          },
          resetUser:(state:any)=>{
            
            state.signUpStatus = false;
            state.signUpErrorMessage = '';
            state.signUpSuccessMessage = '';
      
           
            state.resendOtpStatus = false;
            state.resendOtpErrorMessage = '';
      
           
            state.verifyOtpStatus = false;
            state.verifyOtpErrorMessage = '';

            
            state.userLoginStatus=false;
            state.userLoginErrorMessage="";
            state.userLoginSuccessMessage="";

        
            state.resetPasswordStatus=false;
            state.resetPasswordErrorMessage="";


        
      state.findUserByEmailStatus=false;
      state.findUserByEmailErrorMessage="";
          },

          userLogout:(state:any)=>{
              state.user=null;
              state.accessToken="";
              state.refreshToken="";
              localStorage.setItem("user",JSON.stringify(state.user));
              sessionStorage.setItem("token",state.accessToken);
              sessionStorage.setItem("refreshToken",state.refreshToken);
          }
    },
    extraReducers: (builder:any) => {
      builder
        .addCase(addNewUser.pending, (state:any) => {
          state.signUpLoading=true;
          state.signUpStatus=false;
          state.signUpErrorMessage="";
          state.signUpSuccessMessage="";
        })
        .addCase(addNewUser.fulfilled, (state:any, action:any) => {
          state.signUpLoading=false;
          state.signUpStatus=true;
          state.signUpErrorMessage="";
          state.signUpSuccessMessage=action.payload;
        })
        .addCase(addNewUser.rejected, (state:any, action:any) => {
          state.signUpLoading=false;
          state.signUpStatus=false;
          state.signUpErrorMessage=action.payload;
          state.signUpSuccessMessage="";
         
        })
        //resendOtp

        .addCase(resendOtp.pending, (state:any) => {
           state.resendOtpLoading=true;
           state.resendOtpStatus=false;
           state.resendOtpErrorMessage="";
        })
        .addCase(resendOtp.fulfilled, (state:any, action:any) => {
          state.resendOtpLoading=false;
          state.resendOtpStatus=true;
          state.resendOtpErrorMessage="";
        })
        .addCase(resendOtp.rejected, (state:any, action:any) => {
          state.resendOtpLoading=false;
          state.resendOtpStatus=false;
          state.resendOtpErrorMessage=action.payload;
         
        })

        //verifyOtp

        .addCase(verifyOtp.pending, (state:any) => {
          state.verifyOtpLoading=true;
          state.verifyOtpStatus=false;
          state.verifyOtpErrorMessage='';
          
       })
       .addCase(verifyOtp.fulfilled, (state:any, action:any) => {
        state.verifyOtpLoading=false;
        state.verifyOtpStatus=true;
        state.verifyOtpErrorMessage='';
       })
       .addCase(verifyOtp.rejected, (state:any, action:any) => {
        state.verifyOtpLoading=false;
        state.verifyOtpStatus=false;
        state.verifyOtpErrorMessage=action.payload;
        
       })

       //authLogin

       .addCase(authLogin.pending, (state:any) => {
        state.userLoginLoading=true;
        state.userLoginStatus=false;
        state.userLoginErrorMessage="";
        state.userLoginSuccessMessage="";
        
     })
     .addCase(authLogin.fulfilled, (state:any, action:any) => {
      state.userLoginLoading=false;
      state.userLoginStatus=true;
      state.userLoginErrorMessage="";
      state.userLoginSuccessMessage=action.payload;

      state.user=action.payload;
      state.accessToken=action.payload?.token;
      state.refreshToken=action.payload?.refreshToken;

      window.localStorage.setItem("user",JSON.stringify(state.user))
      window.localStorage.setItem("refreshToken",state.refreshToken)
      window.sessionStorage.setItem("token",state.accessToken)

   
     })
     .addCase(authLogin.rejected, (state:any, action:any) => {
      state.userLoginLoading=false;
      state.userLoginStatus=false;
      state.userLoginErrorMessage=action.payload;
      state.userLoginSuccessMessage="";
    
      
     })


     // findUserByEmail

     .addCase(findUserByEmail.pending, (state:any) => {
      state.findUserByEmailLoading=true;
      state.findUserByEmailStatus=false;
      state.findUserByEmailErrorMessage="";
   })
   .addCase(findUserByEmail.fulfilled, (state:any, action:any) => {
    state.findUserByEmailLoading=false
    state.findUserByEmailStatus=true
    state.findUserByEmailErrorMessage="";
 
   })
   .addCase(findUserByEmail.rejected, (state:any, action:any) => {
    state.findUserByEmailLoading=false
    state.findUserByEmailStatus=false;
    state.findUserByEmailErrorMessage=action.payload;
   })

   //   resetPassword

   .addCase(resetPassword.pending, (state:any) => {
   state.resetPasswordLoading=true;
   state.resetPasswordStatus=false;
   state.resetPasswordErrorMessage="";
 })
 .addCase(resetPassword.fulfilled, (state:any, action:any) => {
  state.resetPasswordLoading=false;
  state.resetPasswordStatus=true;
  state.resetPasswordErrorMessage="";
 })
 .addCase(resetPassword.rejected, (state:any, action:any) => {
  state.resetPasswordLoading=false;
  state.resetPasswordStatus=false;
  state.resetPasswordErrorMessage=action.payload;
 })




    },

})

export const {incrementCount,decrementCount,resetUser,userLogout}=userSlice.actions;
export default userSlice.reducer;