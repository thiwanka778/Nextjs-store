'use client';
import React ,{useState} from 'react';
import "./Product.css";
import { nanoid } from "@reduxjs/toolkit";
import TextField from '@mui/material/TextField';
import { AlignType } from 'rc-table/lib/interface';
import { useDispatch,useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import Pagination from '@mui/material/Pagination';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect,useRouter  } from "next/navigation";
import { Modal, Upload, message,Switch,Table } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { getAllCategory } from '@/redux/features/categorySlice';
import { getAllStores } from '@/redux/features/storeSlice';
import type { ColumnsType } from "antd/es/table";
import CusButton from '../components/CusButton/CusButton';
import {
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import SnackBar from '../components/SnackBar/SnackBar';
import { createProduct, getAllProducts, resetProduct } from '@/redux/features/productSlice';
import moment from 'moment';


const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });




// bulla

interface SubCategory {
  id: number|string;
  name: string;
  description: string|any;
}

interface MainCategory {
  mainCategoryId: number|string;
  mainCategoryName: string;
  mainCategoryDescription: string;
  subCategoryList: SubCategory[];
}

interface Store {
  id: number|string;
  name: string|any|null;
  description: string;
  createdAt: string|any|null;
  city: string|any|null;
  address: string|any|null;
  contact: string|any|null;
  storeImageUrl: string|any|null;
  deleted: boolean;
}
interface ProductVariantType {
  "optionTitle": string|null|any;
  "optionName": string|null|any;
  "price": string|null|any|number;
  "quantity": string|null|any|number;
  "priceErrorMessage":string|any|null,
  "quantityErrorMessage":string|any|null,
}

interface DataType {
  id: any;
  name: any;
  description: any;
  price: any;
  quantity: any;
  mainCategoryId: any;
  subCategoryId: any;
  mainCategoryName: any;
  subCategoryName: any;
  storeName: any;
  storeId: any;
  createdDate: any;
  productImageList: any[];
  productVariantList: any[];
  deleted: boolean;
}

interface VariantCombinationType{
  name:string|null|any;
  price:string|null|any|number;
  quantity:string|null|any|number;
  priceErrorMessage:string|null|any;
  quantityErrorMessage:string|null|any;
}


const Product = () => {
  const router=useRouter();
 
  const goToProductPage=async(id:any)=>{
    router.push(`/product/${id}`)
  }
  const columns: ColumnsType<DataType> = [
    {
      title: "Product",
      key: "name",
      render:(_:any,{name,productImageList,createdDate,id}:any)=>{
        // console.log(productImageList[0]?.productImageUrl,"productImageList[0]?.productImageUrl")
        const relativeDate:any=moment(createdDate).fromNow();
        return (
          <div style={{display:'flex',alignItems:"center",cursor:'pointer'}} onClick={()=>goToProductPage(id)}>
              <img src={productImageList[0]?.productImageUrl} style={{width:"60px",borderRadius:"8px",}}/>
              <div  style={{marginLeft:'1rem',display:'flex',flexDirection:'column'}}>
              <span>{name}</span>
              <span style={{color:'gray'}}>{relativeDate}</span>
              </div>
             
          </div>
        )
      }
    },
    {
      title: 'Created Date',
      key: 'createdDate',
      render:(_:any,{createdDate}:any)=>{
        const relativeDate:any=moment(createdDate).format('MMMM Do YYYY, h:mm a');
        return (
          <span>{relativeDate}</span>
        )
      }
    },
    {
      title: 'Inventory',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
    },
    {
      title: 'Price',
      dataIndex:'price',
      key:'price',
      align: 'right' as const,
    },
   
    {
      title: "Main Category",
      dataIndex: "mainCategoryName",
      key: "mainCategoryName",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryName",
      key: "subCategoryName",
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
   
  ];
    const dispatch=useDispatch();
    const {user}=useSelector((state:any)=>state.user);
    
    const [loading, setLoading] = useState(false);
    const {categoryList}=useSelector((state:any)=>state.category);
    const {getStoreData}=useSelector((state:any)=>state.store);
    const {    productLoading,
      createProductStatus,
      createProductErrorMessage,
    productObject}=useSelector((state:any)=>state.product);
    const [productSuccess, setProductSuccess]=useState(false);
    const [imageArray,setImageArray]=useState<any[]>([]);
    const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
    const [previewImage, setPreviewImage] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState<any|null>(null); 
    const [selectedMainCategory, setSelectedMainCategory] = useState<null|any>(null);
    const [selectedStore, setSelectedStore] = React.useState<any|null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [mainList, setMainList]=React.useState<MainCategory[]>([]);
    const [subList,setSubList]=React.useState<SubCategory[]>([]);
  
    const [storeList,setStoreList]=useState<Store[]>([]);
    const [switchValue, setSwitchValue] = useState(false); 

    const [productList,setProductList]=useState<any[]>([]);
    const [page,setPage]=useState<number>(1);
    const itemsPerPage:number=10;
    const [totalPages,setTotalPages]=React.useState<number>(1);
    const [productData, setProductData] = useState<any|null>({
      name: '',
      description: '',
      price: '',
      totalQuantity: '',
      priceErrorMessage: '',
      quantityErrorMessage: '',
    });

    const [productVariantList,setProductVariantList]=useState<ProductVariantType[]>([
      {
        "optionTitle": "",
        "optionName": "",
        "price": "",
        "quantity": "",
        "priceErrorMessage":"",
        "quantityErrorMessage":"",
      }
    ]);

    const [variantCombination,setVariantCombination]=useState<VariantCombinationType[]>([{
      name:'',
      price:'',
      quantity:'',
      priceErrorMessage:'',
      quantityErrorMessage:'',

    }]);
    const [variantCombination2,setVariantCombination2]=useState<VariantCombinationType[]>([{
      name:'',
      price:'',
      quantity:'',
      priceErrorMessage:'',
      quantityErrorMessage:'',

    }]);

    React.useLayoutEffect(() => {
      if (!user) {
        redirect("/");
      } else {
        dispatch(getAllProducts(1));
      }
    }, [user]);


    React.useEffect(()=>{
      if(productObject){
        setProductList(productObject?.productList)
        if(productObject?.productList?.length>=1){
          const total = Math.ceil(productObject?.totalCount / itemsPerPage);
             setTotalPages(total)
        }else{
          setTotalPages(1);
        }
      }
    },[productObject]);

    // console.log("productObject : ",productList)



    function isNumberGreaterThanZero(value:any) {
      return !isNaN(value) && Number(value) > 0;
    }
  
    function isIntegerGreaterThanZero(value:any) {
      return Number.isInteger(Number(value)) && Number(value) >= 0;
    }

    const handleInputChange = (event:any) => {
      const { name, value } = event.target;

      let priceValid=true;
      let quantityValid=true;

        if(name==="price" && value?.trim()!=""){
           priceValid=isNumberGreaterThanZero(value);
         
        }
        if(name==="totalQuantity" && value?.trim()!=""){
           quantityValid=isIntegerGreaterThanZero(value);
        }


      setProductData((prevData:any)=>{
          return {
            ...prevData,
            [name]: value,
            priceErrorMessage:priceValid?"":"*Price must be a number and greater than 0",
            quantityErrorMessage:quantityValid?"":"*Invalid quantity",

          }
      })
    };

    // console.log(productData)


    React.useEffect(()=>{
      dispatch(getAllCategory())
      dispatch(getAllStores())
    },[user]);

    React.useEffect(()=>{
      setMainList(categoryList)
      setStoreList(getStoreData);
    },[user,categoryList,getStoreData])

    

   React.useEffect(()=>{

    if(selectedMainCategory && mainList && Array.isArray(mainList) && mainList?.length>=1){
        const findMain= mainList?.find((item:MainCategory)=>item?.mainCategoryId==selectedMainCategory?.mainCategoryId);
        if(findMain){
          setSelectedSubCategory(null);
           setSubList(findMain?.subCategoryList);
        }
    }else{
       setSubList([])
    }

   },[selectedMainCategory,mainList])

      const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as RcFile);
        }
    
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
          file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
        );
      };
    
      const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        // if (newFileList.length > 1) {
        //   message.error("Please select only one image at a time.");
        //   return;
        // }
    
        const updatedFileList = newFileList.map((file: any) => {
          if (file.status !== "done") {
            return { ...file, status: "done" };
          }
          return file;
        });
    
        // Update the fileList state with the modified file list
        setFileList(updatedFileList);
      };

      const handleCancel = () => setPreviewOpen(false);

    

  

  const handleMainCategoryChange = (event:any, newValue:any) => {
    setSelectedMainCategory(newValue);
   
  };
  

  const handleSubCategoryChange = (event:any, newValue:any) => {
    setSelectedSubCategory(newValue);
    
  };

 

  const handleStoreChange = (event:any, newValue:any) => {
    setSelectedStore(newValue);
    
  };



 

  const handleVariantInputChange = (index: number|any, event: React.ChangeEvent<HTMLInputElement>|any) => {
    const { name, value } = event.target;
    let updatedVariantList:any = [...productVariantList];
    updatedVariantList[index][name] = value;
    setProductVariantList(updatedVariantList);
  };

 


  const addVariantClick=()=>{
     setProductVariantList((prevState:ProductVariantType[])=>{
         return [...prevState,
          {"optionTitle": "",
         "optionName": "",
         "price": "",
         "quantity": "",
         "priceErrorMessage":"",
         "quantityErrorMessage":"",}]
     })
  };

  const removeVariantClick = (indexToRemove: number) => {
    setProductVariantList((prevState: ProductVariantType[]) => {
      // Filter out the variant at the specified index
      const updatedVariants = prevState.filter((_, index) => index !== indexToRemove);
      return updatedVariants;
    });
  };

  
  

  const productVariantDisplay:any = productVariantList?.map((item:ProductVariantType,index:number)=>{

    return (
      <div 
      key={index}
      style={{width:"100%",
      marginBottom:"1.5rem",display:"flex",
      paddingTop:"1rem",
      paddingRight:"1rem",
      paddingLeft:"1rem",
      flexDirection:"column",borderRadius:"10px",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}>
  
                       <TextField  label="Option Title" size="small" 
                          name="optionTitle"
                          value={item.optionTitle}
        onChange={(event) => handleVariantInputChange(index, event)}
                        variant="outlined" sx={{marginBottom:"1rem"}} />
  
                 <TextField  label="Option Name" size="small" 
                          name="optionName"
                          value={item.optionName}
                          onChange={(event) => handleVariantInputChange(index, event)}
                        variant="outlined" sx={{marginBottom:"1rem"}} />
  
               {/* <TextField  label="Price" 
               size="small" 
                          name="price"
                          value={item.price}
                          onChange={(event) => handleVariantInputChange(index, event)}
                        variant="outlined" sx={{marginBottom:"0rem"}} /> */}

                        {/* <p style={{color:"red",fontSize:"0.9rem",fontWeight:"bold",marginBottom:"1rem",
                      fontFamily: "'Roboto', sans-serif"}}>
                          {item?.priceErrorMessage}</p> */}
  
            {/* <TextField 
           
             label="Quantity" size="small" 
               value={item.quantity}
               onChange={(event) => handleVariantInputChange(index, event)}
                          name="quantity"
                        variant="outlined" sx={{marginBottom:"0rem"}} /> */}

                         {/* <p style={{color:"red",
                         fontFamily: "'Roboto', sans-serif",
                         fontSize:"0.9rem",fontWeight:"bold",marginBottom:"1rem"}}>
                          {item?.quantityErrorMessage}
                          </p> */}

                        <div style={{marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                             <button className='add-button' 
                             disabled={!switchValue}
                             style={{background:switchValue?"#06d42f":"#d2d4d9",cursor:switchValue?"pointer":'not-allowed'}}
                             onClick={addVariantClick}>ADD</button>
                             {productVariantList?.length>1  && <button 
                             onClick={() => removeVariantClick(index)} className='delete-button'>REMOVE</button>}
                        </div>
      </div>
    );
   
  });

  // console.log("productVariantList", productVariantList)


  const uploadImageToFirebase = async (file: File | any | null) => {
    console.log("uploadImageToFirebase running");
    const maxAttempts = 60; // Number of attempts (1 minute with 1 second intervals)
    const delayBetweenAttempts = 1000; // 1000 milliseconds = 1 second
    setLoading(true);
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const storageRef = ref(
          storage,
          "products/" + `image_${nanoid()}_${file.name}`
        );
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setLoading(false);
        // console.log(downloadURL, " HERE IS THE DOWNLOAD URL");
        return downloadURL;
      } catch (error) {
        console.log(`Error uploading image (attempt ${attempt + 1}):`, error);
      }

      // Wait for the specified delay before the next attempt
      await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
    }
    setLoading(false);
    console.error("Exceeded maximum attempts. Image upload failed.");
    return null;
  };

  const deleteImage = async (downloadURL: any) => {
    const imageRef = ref(storage, downloadURL);
    const maxAttempts = 60; // Number of attempts (1 minute with 1 second intervals)
    const delayBetweenAttempts = 1000; // 1000 milliseconds = 1 second
    setLoading(true);
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await deleteObject(imageRef);
        console.log("Image deleted successfully");
        setLoading(false);
        return; // If successful, exit the function
      } catch (error) {
        console.error(
          `Failed to delete image (attempt ${attempt + 1}):`,
          error
        );
      }

      // Wait for the specified delay before the next attempt
      await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
    }
    setLoading(false);
    console.error("Exceeded maximum attempts. Image deletion failed.");
  };



  function generateCombinations(variantList:any) {

    const optionTitleArray= variantList?.map((item:any)=>{
       return item?.optionTitle?.toLowerCase()?.trim();
    })
    const optionTitleSet:any = new Set(optionTitleArray);


    const optionTitles:any = Array.from(optionTitleSet);

    const optionsMap:any = {};

    // Group variants by option title
    for (const variant of variantList) {
        if (!optionsMap[variant.optionTitle]) {
            optionsMap[variant.optionTitle] = [];
        }
        optionsMap[variant.optionTitle].push(variant.optionName?.trim());
    }

    let combinations = [''];

    for (const title of optionTitles) {
        const newCombinations:any = [];
        for (const combination of combinations) {
            for (const option of optionsMap[title]) {
                newCombinations.push(combination + (combination ? '/' : '') + option);
            }
        }
        combinations = newCombinations;
    }

    return combinations;
}

React.useEffect(()=>{

  if(productVariantList && Array.isArray(productVariantList)){
     const variantList = productVariantList?.map((item:any)=>{
         return {
          "optionTitle": item?.optionTitle?.toLowerCase()?.trim(),
        "optionName": item?.optionName,
         }
     });

     const combinations:any = generateCombinations(variantList);
     
     let combinationArray:any = combinations?.map((item:string)=>{
       return {
        name:item?.toUpperCase()?.trim(),
        price:'',
        quantity:'',
        priceErrorMessage:'',
        quantityErrorMessage:'',
       }
     });

    //  console.log("combinationArray : ",combinationArray)
    //  console.log( "variantCombination : ", variantCombination)

     for (let i = 0; i < combinationArray.length; i++) {
      combinationArray[i].price = variantCombination2[i]?.price?variantCombination2[i]?.price:'';
      combinationArray[i].quantity = variantCombination2[i]?.quantity?variantCombination2[i]?.quantity:'';
  }

     if(combinationArray && Array.isArray(combinationArray)){
       setVariantCombination(combinationArray);
     }

  }

},[productVariantList])

// console.log("combinations pamka  : variantCombination ",variantCombination);

const handleVariantCombinationChange = (index:number, field:string, value:any) => {
  let updatedVariantCombination:any = [...variantCombination];
  if(field==='price'){
    updatedVariantCombination[index].price=value?isNaN(value)?updatedVariantCombination[index].price:Number(value):'';
  }else if(field === 'quantity'){
    updatedVariantCombination[index].quantity=value?isNaN(value)?updatedVariantCombination[index].quantity:Number(value)>=0?parseInt(value):updatedVariantCombination[index].quantity:'';
  }else{
    updatedVariantCombination[index][field] = value;
  }
  
  setVariantCombination(updatedVariantCombination);
  setVariantCombination2(updatedVariantCombination);
  
};

const variantCombinationDisplay:any = variantCombination?.map((item:any,index:number)=>{
     return (
      <div  key={index} 
       style={{width:'100%',padding:'1rem',borderRadius:'10px',
       boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',marginBottom:'1rem'  }}>

            <p style={{fontFamily: "'Roboto', sans-serif",marginBottom:'1rem',fontWeight:'bold',}}>{item?.name}</p>
                  <TextField  label="Price" size="small" 
                        name="price"
                        value={item.price}  // Bind the value from state
                        onChange={(e) => handleVariantCombinationChange(index, 'price', e.target.value)} 
                      variant="outlined" sx={{marginBottom:"1rem",width:'100%'}} />

                     <TextField  label="Quantity" size="small" 
                        name="quantity"
                        value={item?.quantity}
                        onChange={(e) => handleVariantCombinationChange(index, 'quantity', e.target.value)} 
                      variant="outlined" sx={{marginBottom:"1rem",width:'100%'}} />
      </div>
     )
})




  const saveProductClick=async()=>{
    setImageArray([]);

    if(productData?.name?.trim()=="" || productData?.description?.trim()=="" || 
     productData?.price?.trim()=="" || productData?.totalQuantity?.trim()=="" ||
     productData?.priceErrorMessage!="" || productData?.quantityErrorMessage!=""){
      return;
    };

    if(fileList?.length<=0){
       return;
    }

    if(!selectedMainCategory){
      return;
    }

    if(!selectedSubCategory){
      return;
    }
    if(!selectedStore){
      return;
    }


  if(switchValue==true){
    for(let i=0;i<productVariantList?.length;i++){

      if(productVariantList[i]?.optionTitle?.trim()=="" ||
      productVariantList[i]?.optionName?.trim()==""){
            return;  
      }
   };
  }

  if(switchValue){
    for(let i=0;i<variantCombination?.length;i++){
       if(variantCombination[i]?.name?.trim()==''||
       !variantCombination[i]?.price || variantCombination[i]?.quantity===''){
         return;
       }
    }
  }

  const preparedVariantCombination:any = variantCombination?.map((item:any)=>{
      return {
         name:item?.name?.toUpperCase()?.trim(),
         price:isNaN(item?.price)?0:parseFloat(item?.price),
         quantity:isNaN(item?.quantity)?0:parseInt(item?.quantity),
      }
  })


    
    const preparedVariants:any= productVariantList?.map((item:ProductVariantType)=>{
       return {
        "optionTitle": item?.optionTitle?.trim(),
        "optionName": item?.optionName?.trim(),
        "price":0,
        "quantity":0,
        // "price": isNaN(item?.price)?0:parseFloat(item?.price),
        // "quantity": isNaN(item?.quantity)?0:parseInt(item?.quantity),
       }
    });




    let uploadedURLs:any[] = [];

    fileList.forEach(async (file) => {
      const downloadURL = await uploadImageToFirebase(file.originFileObj);
      if (downloadURL) {
        uploadedURLs.push(downloadURL);
        if(uploadedURLs?.length===fileList?.length){
          setImageArray(uploadedURLs);
          if(uploadedURLs && Array.isArray(uploadedURLs) && uploadedURLs?.length>=1){
            const preparedImagesArray:any[]=uploadedURLs?.map((item:any|string)=>{
                 return {
                  "productImageUrl":item,   
                 }
              });
              
              const payload={
                "name": productData?.name?.trim(),
                "description": productData.description?.trim(),
                "price": isNaN(productData?.price)?0:parseFloat(productData?.price),
                "quantity": isNaN(productData?.totalQuantity)?0:parseInt(productData?.totalQuantity),
                "mainCategoryId": selectedMainCategory?.mainCategoryId,
                "subCategoryId": selectedSubCategory?.id,
                "storeId": selectedStore?.id,
                "productImages": preparedImagesArray,
                "productVariants": switchValue===false?[]:preparedVariants,
                "variantCombinations": switchValue===false?[]:preparedVariantCombination,
              };
          
              // console.log("payload : ",payload);
              dispatch(createProduct(payload));
              
        }
        }
       
      } 
    }); 
    
  }

React.useEffect(()=>{
   if(productLoading===false){
           if(createProductStatus===true){
            // product created successfully
            dispatch(getAllProducts(page));
            setProductVariantList([{
              "optionTitle": "",
              "optionName": "",
              "price": "",
              "quantity": "",
              "priceErrorMessage":"",
              "quantityErrorMessage":"",
            }]);
            setVariantCombination([]);
            setVariantCombination2([]);
            setImageArray([]);
            dispatch(resetProduct());
              setProductSuccess(true);
           }else if (createProductStatus===false && createProductErrorMessage==="Unauthorized"){
            dispatch(resetProduct());
            setProductSuccess(false);
            imageArray.forEach(async(item:string|any|null)=>{
              await deleteImage(item);
          })
           }else if(createProductStatus===false && createProductErrorMessage==="Internal Server Error"){
            dispatch(resetProduct());
            setProductSuccess(false);
            imageArray.forEach(async(item:string|any|null)=>{
                await deleteImage(item);
            })
           }
   }
},[productLoading])
 
  const handleSwitchChange = (checked: boolean) => {
    setSwitchValue(checked); // Update the state when the switch value changes
  };

  // console.log("switchValue", switchValue);

  const handlePageChange = (event:any, value:any) => {
    setPage(value);
    dispatch(getAllProducts(value));
  };

  // console.log("PAGE : ",page);



  return (
    <>
    <div className='product-page'>


             <div className='product-main-box'>
                  <section className='product-main-box-a'>
                      <div className='create-product-box'>

                        <div style={{width:"100%",display:"flex",alignItems:"center",
                        justifyContent:"center",marginBottom:"1rem"}}>
                           <p style={{textAlign:"center",fontWeight:"bold",
                           fontSize:"1.5rem",fontFamily: "'Roboto', sans-serif",
                           letterSpacing:"0.1rem"}}><i>Create Product</i></p>
                        </div>

                      <TextField  label="Product Name" size="small" 
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                      variant="outlined" sx={{marginBottom:"1rem"}} />


                      <TextField 
                      inputProps={{ maxLength: 254 }}
                       multiline 
                       rows={4}
                       label="Description" size="small" 
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                      variant="outlined" sx={{marginBottom:"1rem"}} />


                      <TextField  
                    
                      label="Price" 
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                      size="small" variant="outlined" sx={{marginBottom:"0rem"}} />
                         <p style={{color:"red",fontSize:"0.9rem",fontWeight:"bold",marginBottom:"1rem",
                      fontFamily: "'Roboto', sans-serif"}}>
                          {productData?.priceErrorMessage}</p>


                      <TextField 
                  
                       label="Total quantity" size="small" 
                       name="totalQuantity"
                       value={productData.totalQuantity}
                       onChange={handleInputChange}
                       variant="outlined" sx={{marginBottom:"0rem"}} />
                         <p style={{color:"red",fontSize:"0.9rem",fontWeight:"bold",marginBottom:"1rem",
                      fontFamily: "'Roboto', sans-serif"}}>
                          {productData?.quantityErrorMessage}</p>



                      <Autocomplete
                            disablePortal
                        id="combo-box-demo"
                        options={storeList}
                        getOptionLabel={(option) => option.name}
                        onChange={handleStoreChange}
                        value={selectedStore}
                        sx={{ width: "100%",marginBottom:"1rem" }}
                            renderInput={(params) => <TextField {...params} label="Select Store" size='small' />}
                          />



                           <Autocomplete
                            disablePortal
                        id="combo-box-demo"
                        options={mainList}
                        getOptionLabel={(option) => option.mainCategoryName}
                        value={selectedMainCategory}
                        onChange={handleMainCategoryChange}
                        sx={{ width: "100%",marginBottom:"1rem" }}
                            renderInput={(params) => <TextField {...params} label="Main Category" size='small' />}
                          />


                           <Autocomplete
                            disablePortal
                        id="combo-box-demo"
                        options={subList}
                        value={selectedSubCategory}
                       onChange={handleSubCategoryChange}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: "100%",marginBottom:"1rem" }}
                            renderInput={(params) => <TextField {...params} label="Sub Category" size='small' />}
                          />





                           <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept=".jpg, .jpeg, .png"
              >
                <div className="custom-upload">
                  <svg
                    style={{ color: "#5140ed" }}
                    viewBox="0 0 1024 1024"
                    focusable="false"
                    data-icon="inbox"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                  </svg>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single upload. Strictly prohibited from
                    uploading company data or other banned files.
                  </p>
                </div>
              </Upload>

             {switchValue && <div style={{width:'100%',marginBottom:'1rem',display:'flex',flexDirection:'column',marginTop:'1rem'}}>
              <p style={{marginBottom:"1rem",
              fontWeight:'bold',fontSize:'1.2rem',
              fontFamily: "'Ubuntu', sans-serif"}}>
                You have {variantCombination?.length} different {variantCombination?.length===1?'combination.':variantCombination?.length>1?'combinations':''}</p>

                 {variantCombinationDisplay}

              </div>}

              <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-end",marginTop:"1rem"}}>
                  <span style={{width:"fit-content"}} onClick={saveProductClick}><CusButton name={"SAVE PRODUCT"}/></span>
              </div>
                      </div>
                  </section>

                  <section className='product-main-box-b'>
                  <div className='create-variant-box'>

                  <div style={{width:"100%",display:"flex",alignItems:"center",
                        justifyContent:"center",marginBottom:"1rem"}}>
                           <p style={{textAlign:"center",fontWeight:"bold",
                           fontSize:"1.5rem",fontFamily: "'Roboto', sans-serif",
                           letterSpacing:"0.1rem"}}><i>Create Product Variants</i></p>
                        </div>

                        {productVariantDisplay}

                        <div style={{width:"100%",display:"flex",alignItems:'center',justifyContent:"center",marginBottom:"1rem"}}>
                           <p style={{fontFamily: "'Roboto', sans-serif",fontWeight:"bold",
                           fontSize:"1.2rem",textAlign:"center",color:"#ed325e"}}>You have product variants ? &nbsp; 
                            <span>
                            <Switch
                           checkedChildren="YES"
                           unCheckedChildren="NO"
                          defaultChecked={switchValue}
                            onChange={handleSwitchChange} />
      
                            </span>
                            </p>
                        </div>

                  </div>
                   </section>
            </div>


            <div style={{width:"100%",marginTop:"2rem",padding:'0.5rem',overflowX:'auto'}}>
            <Table columns={columns} dataSource={productList} pagination={false} /> 
              <div style={{width:"100%",display:'flex',alignItems:'center',justifyContent:'flex-end',marginTop:'1rem',}}>
                 <Pagination count={totalPages} color="primary"     page={page}
                            onChange={handlePageChange} />
              </div>
            </div>
        </div>


        <Modal
        zIndex={99999999}
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>



      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={productLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={loading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
      

     {productSuccess &&  <SnackBar
          severity="success"
          message="Product created successfully !"
          open={productSuccess}
          setOpen={setProductSuccess}
        />}
        
        </>
  )
}

export default Product