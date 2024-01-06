"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../apiService";

interface initialStateType {
    cartLoading:boolean,
    createCartStatus:boolean,
    createCartErrorMessage:any|string|null,
    cartList:any[],
    deleteCartStatus:boolean;
    deleteCartErrorMessage:any|string|null;
}

const initialState: initialStateType = {
   cartLoading:false,
   createCartStatus:false,
   createCartErrorMessage:"",
   
   cartList:[],
   deleteCartErrorMessage:'',
   deleteCartStatus:false,
};

export const createCartItems: any = createAsyncThunk(
  "user/create-cart-items",
  async (payload, thunkAPI) => {
    try {

      console.log(sessionStorage.getItem("token"),payload);
      const response = await axios.post(
        `${BASE_URL}/create-cart`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ` + sessionStorage.getItem("token"),
          },
        }
      );

      return response.data;
    } catch (error: any) {
      let message: any = "";

      if (error?.response?.status == 500) {
        message = "Internal Server Error";
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




export const getAllCartItems: any = createAsyncThunk(
    "user/get-cart-items",
    async (_,thunkAPI) => {
      try {
  
        const response = await axios.get(
          `${BASE_URL}/cart`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ` + sessionStorage.getItem("token"),
            },
          }
        );
  
        return response.data;
      } catch (error: any) {
        let message: any = "";
  
        if (error?.response?.status == 500) {
          message = "Internal Server Error";
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

  export const deleteCartItems: any = createAsyncThunk(
    "user/delete-cart-items",
    async (id,thunkAPI) => {
      try {
  
        const response = await axios.delete(
          `${BASE_URL}/cart/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ` + sessionStorage.getItem("token"),
            },
          }
        );
  
        return response.data;
      } catch (error: any) {
        let message: any = "";
  
        if (error?.response?.status == 500) {
          message = "Internal Server Error";
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




export const cartSlice: any = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state: any) => {
        state.cartLoading=false;
        state.createCartStatus=false;
        state.createCartErrorMessage='';
        state.deleteCartStatus=false;
        state.deleteCartErrorMessage="";
    },
  },

  extraReducers: (builder: any) => {
    builder
      .addCase(createCartItems.pending, (state: any) => {
          state.cartLoading=true;
          state.createCartStatus=false;
          state.createCartErrorMessage='';
      })
      .addCase(createCartItems.fulfilled, (state: any, action: any) => {
        state.cartLoading=false;
          state.createCartStatus=true;
          state.createCartErrorMessage='';
      })
      .addCase(createCartItems.rejected, (state: any, action: any) => {
        state.cartLoading=false;
          state.createCartStatus=false;
          state.createCartErrorMessage=action.payload;
      })

      //  getAllCartItems

      .addCase(getAllCartItems.pending, (state: any) => {
        state.cartLoading=true; 
    })
    .addCase(getAllCartItems.fulfilled, (state: any, action: any) => {
      state.cartLoading=false;
      state.cartList=action.payload?.cartObjectList;  
    })
    .addCase(getAllCartItems.rejected, (state: any, action: any) => {
      state.cartLoading=false;
    })

    //  deleteCartItems

    .addCase(deleteCartItems.pending, (state: any) => {
      state.cartLoading=true; 
      state.deleteCartStatus=false;
      state.deleteCartErrorMessage="";
  })
  .addCase(deleteCartItems.fulfilled, (state: any, action: any) => {
    state.cartLoading=false;
    state.deleteCartStatus=true;
    state.deleteCartErrorMessage="";
  
  })
  .addCase(deleteCartItems.rejected, (state: any, action: any) => {
    state.cartLoading=false;
    state.deleteCartStatus=false;
    state.deleteCartErrorMessage=action.payload;
  })

      
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
