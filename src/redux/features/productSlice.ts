'use client';
import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../apiService';

interface initialStateType {
    productLoading:boolean,
    createProductStatus:boolean,
    createProductErrorMessage:string|any|null, 
    productObject:any|null,   
    requiredProduct:any|null,
    requiredProductPublic:any|null,
    productImageDeleteStatus:boolean,
    updateProductStatus:boolean,
    updateProductErrorMessage:any|string|null,
    updateProductVariantStatus:boolean,
    updateProductVariantErrorMessage:any|string|null,
}




const initialState:initialStateType = {
     productLoading:false,
     createProductStatus:false,
     createProductErrorMessage:"",

     productObject:"",
     requiredProduct:"",
     requiredProductPublic:'',
     productImageDeleteStatus:false,

     updateProductStatus:false,
     updateProductErrorMessage:"",

     updateProductVariantStatus:false,
     updateProductVariantErrorMessage:'',
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

  export const getAllProducts:any = createAsyncThunk(
    'user/getAllProducts', 
    async (page, thunkAPI) => {
    try {
     
      const response = await axios.get(`${BASE_URL}/product/private?page=${page}&size=${10}`,
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

  export const getAllProductsPublic:any = createAsyncThunk(
    'user/getAllProductsPublic', 
    async (page, thunkAPI) => {
    try {
     
      const response = await axios.get(`${BASE_URL}/product/public?page=${page}&size=${10}`,
      {
        headers: {
          'Content-Type': 'application/json',
        
      
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


  export const getProductById:any = createAsyncThunk(
    'user/getProductById', 
    async (productId:string|number, thunkAPI) => {
    try {
     
      const response = await axios.get(`${BASE_URL}/product/${productId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer `+sessionStorage.getItem("token"),
      
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


  export const deleteProductImage:any = createAsyncThunk(
    'user/deleteProductImage', 
    async (id:string|number, thunkAPI) => {
    try {
     
      const response = await axios.delete(`${BASE_URL}/product/image-delete/${id}`,
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

  export const updateProduct:any = createAsyncThunk(
    'user/updateProduct', 
    async ({id,payload}:any, thunkAPI) => {
    try {
     
      const response = await axios.put(`${BASE_URL}/product/update/${id}`,payload,
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


  export const updateProductVariants:any = createAsyncThunk(
    'user/updateProductVariants', 
        async ({id,payload}:any, thunkAPI) => {
    try {
     
      const response = await axios.put(`${BASE_URL}/product/update-product-variant/${id}`,payload,
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
                 state.productImageDeleteStatus=false;
                 state.updateProductStatus=false;
                 state.updateProductErrorMessage="";
                 state.updateProductVariantStatus=false;
                 state.updateProductVariantErrorMessage="";
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

        //        getAllProducts

        .addCase(getAllProducts.pending, (state:any) => {
          state.productLoading=true;
      })
      .addCase(getAllProducts.fulfilled, (state:any, action:any) => {
          state.productLoading=false;
          state.productObject=action.payload;
      })
      .addCase(getAllProducts.rejected, (state:any, action:any) => {
          state.productLoading=false;
      })

      // getProductById
      .addCase(getProductById.pending, (state:any) => {
        state.productLoading=true;
    })
    .addCase(getProductById.fulfilled, (state:any, action:any) => {
        state.productLoading=false;
        state.requiredProduct=action.payload;
      
    })
    .addCase(getProductById.rejected, (state:any, action:any) => {
        state.productLoading=false;
    })

    //     deleteProductImage
    .addCase(deleteProductImage.pending, (state:any) => {
      state.productLoading=true;
      state.productImageDeleteStatus=false;
  })
  .addCase(deleteProductImage.fulfilled, (state:any, action:any) => {
      state.productLoading=false;
      state.productImageDeleteStatus=true;
  })
  .addCase(deleteProductImage.rejected, (state:any, action:any) => {
      state.productLoading=false;
      state.productImageDeleteStatus=false;
  })

  // updateProduct
  .addCase(updateProduct.pending, (state:any) => {
    state.productLoading=true;
    state.updateProductStatus=false;
    state.updateProductErrorMessage="";
  
})
.addCase(updateProduct.fulfilled, (state:any, action:any) => {
    state.productLoading=false;
    state.updateProductStatus=true;
    state.updateProductErrorMessage="";
})
.addCase(updateProduct.rejected, (state:any, action:any) => {
    state.productLoading=false;
    state.updateProductStatus=false;
    state.updateProductErrorMessage=action.payload;
    
})

// updateProductVariants
.addCase(updateProductVariants.pending, (state:any) => {
  state.productLoading=true;
  state.updateProductVariantStatus=false;
  state.updateProductVariantErrorMessage="";

})
.addCase(updateProductVariants.fulfilled, (state:any, action:any) => {
  state.productLoading=false;
  state.updateProductVariantStatus=true;
  state.updateProductVariantErrorMessage="";
})
.addCase(updateProductVariants.rejected, (state:any, action:any) => {
  state.productLoading=false;
  state.updateProductVariantStatus=false;
  state.updateProductVariantErrorMessage=action.payload;
  
})

// getAllProductsPublic
.addCase(getAllProductsPublic.pending, (state:any) => {
  state.productLoading=true;
 state.requiredProductPublic="";

})
.addCase(getAllProductsPublic.fulfilled, (state:any, action:any) => {
  state.productLoading=false;
  state.requiredProductPublic=action.payload;
})
.addCase(getAllProductsPublic.rejected, (state:any, action:any) => {
  state.productLoading=false;
  state.requiredProductPublic="";
  
})


    },

})

export const {resetProduct}=productSlice.actions;
export default productSlice.reducer;