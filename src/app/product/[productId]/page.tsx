"use client";
import React, { useState } from "react";
import "../Product.css";
import {
  deleteProductImage,
  getProductById,
  updateProduct,
  updateProductVariants,
} from "@/redux/features/productSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { nanoid } from "@reduxjs/toolkit";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect, useRouter } from "next/navigation";
import { Modal, Upload, message, Switch, Table } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { getAllCategory } from "@/redux/features/categorySlice";
import { getAllStores } from "@/redux/features/storeSlice";
import CusButton from "../../components/CusButton/CusButton";
import {
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import SnackBar from "../../components/SnackBar/SnackBar";
import {
  createProduct,
  getAllProducts,
  resetProduct,
} from "@/redux/features/productSlice";
import moment from "moment";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Params = {
  params: {
    productId: string;
  };
};

interface SubCategory {
  id: number | string;
  name: string;
  description: string | any;
}

interface MainCategory {
  mainCategoryId: number | string;
  mainCategoryName: string;
  mainCategoryDescription: string;
  subCategoryList: SubCategory[];
}

interface Store {
  id: number | string;
  name: string | any | null;
  description: string;
  createdAt: string | any | null;
  city: string | any | null;
  address: string | any | null;
  contact: string | any | null;
  storeImageUrl: string | any | null;
  deleted: boolean;
}
interface ProductVariantType {
  id: string | any | null;
  optionTitle: string | null | any;
  optionName: string | null | any;
  price: string | null | any | number;
  quantity: string | null | any | number;
  priceErrorMessage: string | any | null;
  quantityErrorMessage: string | any | null;
}

interface VariantCombinationType {
  name: string | null | any;
  price: string | null | any | number;
  quantity: string | null | any | number;
  priceErrorMessage: string | null | any;
  quantityErrorMessage: string | null | any;
}

const ProductPage = ({ params: { productId } }: Params) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const {
    productLoading,
    createProductStatus,
    createProductErrorMessage,
    productObject,
    productImageDeleteStatus,
    updateProductStatus,
    updateProductErrorMessage,
    updateProductVariantStatus,
    updateProductVariantErrorMessage,
    requiredProduct,
  } = useSelector((state: any) => state.product);

  const [productError, setProductError] = useState<any | string | null>("");
  const [variantCombination, setVariantCombination] = useState<
    VariantCombinationType[]
  >([
    {
      name: "",
      price: "",
      quantity: "",
      priceErrorMessage: "",
      quantityErrorMessage: "",
    },
  ]);
  const [variantCombination2, setVariantCombination2] = useState<
  VariantCombinationType[]
>([
  {
    name: "",
    price: "",
    quantity: "",
    priceErrorMessage: "",
    quantityErrorMessage: "",
  },
]);

  function generateCombinations(variantList: any) {
    const optionTitleArray = variantList?.map((item: any) => {
      return item?.optionTitle?.toLowerCase()?.trim();
    });
    const optionTitleSet: any = new Set(optionTitleArray);

    const optionTitles: any = Array.from(optionTitleSet);

    const optionsMap: any = {};

    // Group variants by option title
    for (const variant of variantList) {
      if (!optionsMap[variant.optionTitle]) {
        optionsMap[variant.optionTitle] = [];
      }
      optionsMap[variant.optionTitle].push(variant.optionName?.trim());
    }

    let combinations = [""];

    for (const title of optionTitles) {
      const newCombinations: any = [];
      for (const combination of combinations) {
        for (const option of optionsMap[title]) {
          newCombinations.push(combination + (combination ? "/" : "") + option);
        }
      }
      combinations = newCombinations;
    }

    return combinations;
  }

  // console.log("productId",productId);
  React.useLayoutEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  React.useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }
  }, [productId, user]);

  console.log("requiredProduct", requiredProduct);

  const [loading, setLoading] = useState(false);
  const [productVariantSuccess, setProductVariantSuccess] = useState(false);
  const { categoryList } = useSelector((state: any) => state.category);
  const { getStoreData } = useSelector((state: any) => state.store);
  const [productSuccess, setProductSuccess] = useState(false);
  const [imageArray, setImageArray] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(
    null
  );
  const [selectedMainCategory, setSelectedMainCategory] = useState<null | any>(
    null
  );
  const [selectedStore, setSelectedStore] = React.useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [productVariantError, setProductVariantError] = useState<
    any | string | null
  >("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [mainList, setMainList] = React.useState<MainCategory[]>([]);
  const [subList, setSubList] = React.useState<SubCategory[]>([]);

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  const [productData, setProductData] = useState<any | null>({
    id: "",
    name: "",
    description: "",
    price: "",
    totalQuantity: "",
    priceErrorMessage: "",
    quantityErrorMessage: "",
  });

  // console.log("productData : ",productData)

  const [productVariantList, setProductVariantList] = useState<
    ProductVariantType[]
  >([
    {
      id: "",
      optionTitle: "",
      optionName: "",
      price: "",
      quantity: "",
      priceErrorMessage: "",
      quantityErrorMessage: "",
    },
  ]);

  React.useEffect(() => {
   
    const newArray = requiredProduct?.productVariantList?.map((item: any) => {
      return {
        id: item?.id,
        optionTitle: item?.optionTitle,
        optionName: item?.optionName,
        price: item?.price,
        quantity: item?.quantity,
        priceErrorMessage: "",
        quantityErrorMessage: "",
      };
    });

    if (newArray && Array.isArray(newArray) && newArray.length >= 1) {
      setProductVariantList(newArray);
    } else {
      setProductVariantList([
        {
          id: "",
          optionTitle: "",
          optionName: "",
          price: "",
          quantity: "",
          priceErrorMessage: "",
          quantityErrorMessage: "",
        },
      ]);
    }

    setProductData({
      id: requiredProduct?.id,
      name: requiredProduct?.name,
      description: requiredProduct?.description,
      price: requiredProduct?.price,
      totalQuantity: requiredProduct?.quantity,
      priceErrorMessage: "",
      quantityErrorMessage: "",
    });

    const { mainCategoryId, subCategoryId, storeId } = requiredProduct;
    const findMain = mainList?.find(
      (item: any) => item?.mainCategoryId == mainCategoryId
    );
    if (findMain) {
      setSelectedMainCategory(findMain);
    }
    const findSub = subList?.find((item: any) => item?.id == subCategoryId);
    if (findSub) {
      setSelectedSubCategory(findSub);
    }

    const findStore = storeList?.find((item: any) => item?.id == storeId);
    if (findStore) {
      setSelectedStore(findStore);
    }

    if (requiredProduct?.productVariantList && Array.isArray(requiredProduct?.productVariantList)) {
      
      const variantList:any = requiredProduct?.productVariantList?.map((item: any) => {
        return {
          optionTitle: item?.optionTitle?.toLowerCase()?.trim(),
          optionName: item?.optionName,
        };
      });

      const combinations: any = generateCombinations(variantList);

      let combinationArray: any = combinations?.map((item: string) => {
        return {
          name: item?.toUpperCase()?.trim(),
          price: "",
          quantity: "",
          priceErrorMessage: "",
          quantityErrorMessage: "",
        };
      });

      if(requiredProduct?.variantCombinationList && Array.isArray(requiredProduct?.variantCombinationList)){
        setVariantCombination2(requiredProduct?.variantCombinationList);
        const tempCombinationArray:any= requiredProduct?.variantCombinationList
        
        for (const variantCombination of tempCombinationArray) {
          const index: any = combinationArray.findIndex(
            (item: any) => item?.name?.toLowerCase()?.trim() === variantCombination?.name?.toLowerCase()?.trim()
          );
          if (index !== -1) {
            combinationArray[index].price = variantCombination.price;
            combinationArray[index].quantity = variantCombination.quantity;
          }
        }
      }

     
      // console.log("combinationArray : ", combinationArray);

      if (combinationArray && Array.isArray(combinationArray)) {
        setVariantCombination(combinationArray);
      }
    }
  }, [productId, requiredProduct]);

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

       console.log("variantCombination2 : ",variantCombination2)

       for (let i = 0; i < combinationArray.length; i++) {
        combinationArray[i].price = variantCombination2[i]?.price?variantCombination2[i]?.price:'';
        combinationArray[i].quantity = variantCombination2[i]?.quantity!==''?variantCombination2[i]?.quantity:'';
    }
  
       if(combinationArray && Array.isArray(combinationArray)){
         setVariantCombination(combinationArray);
       }
    }
  
  },[productVariantList])
 

  const handleVariantCombinationChange = (index:number, field:string, value:any) => {
    let updatedVariantCombination:any = [...variantCombination];
  if(field==='price'){
    updatedVariantCombination[index].price=value?.trim()!==''?isNaN(value)?updatedVariantCombination[index].price:Number(value):'';
  }else if(field === 'quantity'){
    updatedVariantCombination[index].quantity=value?.trim()!==''?isNaN(value)?updatedVariantCombination[index].quantity:Number(value)>=0?parseInt(value):updatedVariantCombination[index].quantity:'';
  }else{
    updatedVariantCombination[index][field] = value;
  }
  
  setVariantCombination(updatedVariantCombination);
  setVariantCombination2(updatedVariantCombination);
  };
  
  console.log("variantCombination humtha",variantCombination)
  const variantCombinationDisplay:any = variantCombination?.map((item:any,index:number)=>{
       return (
        <div  key={index} 
         style={{width:'100%',padding:'1rem',borderRadius:'10px',
         boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',marginBottom:'1rem'  }}>
  
              <p style={{fontFamily: "'Roboto', sans-serif",marginBottom:'1rem',fontWeight:'bold',}}>{item?.name}</p>
                    <TextField  label="Price" size="small" 
                          name="price"
                          value={item?.price}  // Bind the value from state
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

  // console.log("productVariantList BULLA", productVariantList)

  function isNumberGreaterThanZero(value: any) {
    return !isNaN(value) && Number(value) > 0;
  }

  function isIntegerGreaterThanZero(value: any) {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
  }

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    let priceValid = true;
    let quantityValid = true;

    if (name === "price" && value?.trim() != "") {
      priceValid = isNumberGreaterThanZero(value);
    }
    if (name === "totalQuantity" && value?.trim() != "") {
      quantityValid = isIntegerGreaterThanZero(value);
    }

    setProductData((prevData: any) => {
      return {
        ...prevData,
        [name]: value,
        priceErrorMessage: priceValid
          ? ""
          : "*Price must be a number and greater than 0",
        quantityErrorMessage: quantityValid ? "" : "*Invalid quantity",
      };
    });
  };

  // console.log(productData)

  React.useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllStores());
  }, [user]);

  React.useEffect(() => {
    setMainList(categoryList);
    setStoreList(getStoreData);
  }, [user, categoryList, getStoreData]);

  React.useEffect(() => {
    if (
      selectedMainCategory &&
      mainList &&
      Array.isArray(mainList) &&
      mainList?.length >= 1
    ) {
      const findMain = mainList?.find(
        (item: MainCategory) =>
          item?.mainCategoryId == selectedMainCategory?.mainCategoryId
      );
      if (findMain) {
        setSelectedSubCategory(null);
        setSubList(findMain?.subCategoryList);
      }
    } else {
      setSubList([]);
    }
  }, [selectedMainCategory, mainList]);

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

  const handleMainCategoryChange = (event: any, newValue: any) => {
    setSelectedMainCategory(newValue);
  };

  const handleSubCategoryChange = (event: any, newValue: any) => {
    setSelectedSubCategory(newValue);
  };

  const handleStoreChange = (event: any, newValue: any) => {
    setSelectedStore(newValue);
  };

  const handleVariantInputChange = (
    index: number | any,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { name, value } = event.target;
    let updatedVariantList: any = [...productVariantList];
    updatedVariantList[index][name] = value;

    setProductVariantList(updatedVariantList);
  };

  const addVariantClick = () => {
    setProductVariantList((prevState: ProductVariantType[]) => {
      return [
        ...prevState,
        {
          optionTitle: "",
          id: "",
          optionName: "",
          price: "",
          quantity: "",
          priceErrorMessage: "",
          quantityErrorMessage: "",
        },
      ];
    });
  };

  const removeVariantClick = (indexToRemove: number) => {
    setProductVariantList((prevState: ProductVariantType[]) => {
      // Filter out the variant at the specified index
      const updatedVariants = prevState.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedVariants;
    });
  };

  const productVariantDisplay: any = productVariantList?.map(
    (item: ProductVariantType, index: number) => {
      return (
        <div
          key={index}
          style={{
            width: "100%",
            marginBottom: "1.5rem",
            display: "flex",
            paddingTop: "1rem",
            paddingRight: "1rem",
            paddingLeft: "1rem",
            flexDirection: "column",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <TextField
            label="Option Title"
            size="small"
            name="optionTitle"
            value={item.optionTitle}
            onChange={(event) => handleVariantInputChange(index, event)}
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />

          <TextField
            label="Option Name"
            size="small"
            name="optionName"
            value={item.optionName}
            onChange={(event) => handleVariantInputChange(index, event)}
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />

          {/* <TextField
            label="Price"
            size="small"
            name="price"
            value={item.price}
            onChange={(event) => handleVariantInputChange(index, event)}
            variant="outlined"
            sx={{ marginBottom: "0rem" }}
          /> */}
          {/* <p
            style={{
              color: "red",
              fontSize: "0.9rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {item?.priceErrorMessage}
          </p> */}

          {/* <TextField
            label="Quantity"
            size="small"
            value={item.quantity}
            onChange={(event) => handleVariantInputChange(index, event)}
            name="quantity"
            variant="outlined"
            sx={{ marginBottom: "0rem" }}
          /> */}
          {/* <p
            style={{
              color: "red",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "0.9rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            {item?.quantityErrorMessage}
          </p> */}

          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="add-button"
              disabled={!switchValue}
              style={{
                background: switchValue ? "#06d42f" : "#d2d4d9",
                cursor: switchValue ? "pointer" : "not-allowed",
              }}
              onClick={addVariantClick}
            >
              ADD
            </button>
            {productVariantList?.length > 1 && (
              <button
                onClick={() => removeVariantClick(index)}
                className="delete-button"
              >
                REMOVE
              </button>
            )}
          </div>
        </div>
      );
    }
  );

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

  const updateProductClick = async () => {
    setProductError("");
    if (
      productData?.name?.trim() == "" ||
      productData?.description?.trim() == "" ||
      productData?.price?.toString()?.trim() == "" ||
      productData?.totalQuantity?.toString()?.trim() == "" ||
      productData?.priceErrorMessage != "" ||
      productData?.quantityErrorMessage != ""
    ) {
      return;
    }

    // if(fileList?.length<=0){
    //    return;
    // }

    if (!selectedMainCategory) {
      return;
    }

    if (!selectedSubCategory) {
      return;
    }
    if (!selectedStore) {
      return;
    }

    if (
      requiredProduct?.productImageList?.length === 0 &&
      fileList?.length === 0
    ) {
      return;
    }

    let uploadedURLs: any[] = [];

    if (fileList && fileList?.length >= 1) {
      fileList.forEach(async (file) => {
        const downloadURL = await uploadImageToFirebase(file.originFileObj);
        if (downloadURL) {
          uploadedURLs.push(downloadURL);
          if (uploadedURLs?.length === fileList?.length) {
            setImageArray(uploadedURLs);
            if (
              uploadedURLs &&
              Array.isArray(uploadedURLs) &&
              uploadedURLs?.length >= 1
            ) {
              const preparedImagesArray: any[] = uploadedURLs?.map(
                (item: any | string) => {
                  return {
                    productImageUrl: item,
                  };
                }
              );

              const payload = {
                name: productData?.name?.trim(),
                description: productData.description?.trim(),
                price: isNaN(productData?.price)
                  ? 0
                  : parseFloat(productData?.price),
                quantity: isNaN(productData?.totalQuantity)
                  ? 0
                  : parseInt(productData?.totalQuantity),
                mainCategoryId: selectedMainCategory?.mainCategoryId,
                subCategoryId: selectedSubCategory?.id,
                storeId: selectedStore?.id,
                productImages: preparedImagesArray,
                productVariants: [],
              };

              // console.log("payload : ",payload);
              // dispatch(createProduct(payload));
              const id = productId;
              dispatch(updateProduct({ id, payload }));
            }
          }
        }
      });
    } else {
      const payload = {
        name: productData?.name?.trim(),
        description: productData.description?.trim(),
        price: isNaN(productData?.price) ? 0 : parseFloat(productData?.price),
        quantity: isNaN(productData?.totalQuantity)
          ? 0
          : parseInt(productData?.totalQuantity),
        mainCategoryId: selectedMainCategory?.mainCategoryId,
        subCategoryId: selectedSubCategory?.id,
        storeId: selectedStore?.id,
        productImages: [],
        productVariants: [],
      };

      // console.log("payload : ",payload);
      // dispatch(createProduct(payload));
      const id = productId;
      dispatch(updateProduct({ id, payload }));
    }
  };

  React.useEffect(() => {
    if (productLoading === false) {
      if (updateProductStatus === true) {
        // product created successfully
        dispatch(getProductById(productId));
        setFileList([]);
        setProductError("");
        setImageArray([]);
        dispatch(resetProduct());
        setProductSuccess(true);
      } else if (
        updateProductStatus === false &&
        updateProductErrorMessage === "Unauthorized"
      ) {
        setProductError("*Your session has expired. please login again");
        dispatch(resetProduct());
        setProductSuccess(false);
        imageArray.forEach(async (item: string | any | null) => {
          await deleteImage(item);
        });
      } else if (
        updateProductStatus === false &&
        updateProductErrorMessage === "Internal Server Error"
      ) {
        dispatch(resetProduct());
        setProductError("*Something went wrong. please try again !");
        setProductSuccess(false);
        imageArray.forEach(async (item: string | any | null) => {
          await deleteImage(item);
        });
      }
    }
  }, [productLoading]);

  const handleSwitchChange = (checked: boolean) => {
    setSwitchValue(checked); // Update the state when the switch value changes
  };

  // console.log("switchValue", switchValue);

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, "_blank");
  };

  const deleteProductImageClick = async (image: any, id: any) => {
    dispatch(deleteProductImage(id));
    await deleteImage(image);
  };

  React.useEffect(() => {
    if (productLoading === false) {
      if (productImageDeleteStatus === true) {
        dispatch(getProductById(productId));
        dispatch(resetProduct());
      } else if (productImageDeleteStatus === false) {
        dispatch(resetProduct());
      }
    }
  }, [productLoading]);

  const productImagesDisplay = requiredProduct?.productImageList?.map(
    (item: any) => {
      return (
        <div
          key={item?.id}
          style={{
            width: "100px",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <img
            src={item?.productImageUrl}
            onClick={() => openImageInNewTab(item?.productImageUrl)}
            style={{ height: "100px", borderRadius: "8px", cursor: "pointer" }}
          />
          <button
            style={{ marginTop: "5px" }}
            className="delete-image"
            onClick={() =>
              deleteProductImageClick(item?.productImageUrl, item?.id)
            }
          >
            Delete
          </button>
        </div>
      );
    }
  );

  const updateProductVariantClick = () => {
 
    setProductVariantError("");

    if (switchValue == true) {
      for (let i = 0; i < productVariantList?.length; i++) {
        if (
          productVariantList[i]?.optionTitle?.trim() == "" ||
          productVariantList[i]?.optionName?.trim() == "" 
        
        ) {

          return;
        }
      }
    }

    if(switchValue==true){
       for(let i=0;i<variantCombination?.length;i++){
          if(variantCombination[i]?.name=='' || 
           variantCombination[i]?.price=='' || variantCombination[i]?.quantity==='' ||
           !variantCombination[i]?.price ){
             return;
           }
       }
    }

    const preparedVariants = productVariantList?.map(
      (item: ProductVariantType) => {
        return {
          optionTitle: item?.optionTitle?.trim(),
          optionName: item?.optionName?.trim(),
          price: 0,
          quantity: 0,
        };
      }
    );

    const variantCombinationArray:any = variantCombination?.map((item:any)=>{
      return {
         name:item?.name?.toUpperCase()?.trim(),
         quantity:isNaN(item?.quantity)?0:parseInt(item?.quantity),
         price:isNaN(item?.price)?0:Number(item?.price),
      }
    })

    const payload = {
      productVariantList: switchValue? preparedVariants:[],
      variantCombinationList:switchValue?variantCombinationArray:[],
    };

    console.log("payload pamka : ", payload);

    const id = productId;

    dispatch(updateProductVariants({ id, payload }));
  };

  React.useEffect(() => {
    if (productLoading === false) {
      if (updateProductVariantStatus === true) {
        dispatch(resetProduct());
        setProductVariantError("");
        dispatch(getProductById(productId));
        setProductVariantSuccess(true);
      } else if (
        updateProductVariantStatus === false &&
        updateProductVariantErrorMessage === "Unauthorized"
      ) {
        dispatch(resetProduct());
        setProductVariantSuccess(false);
        setProductVariantError("*your session is expired. please login again");
      } else if (
        updateProductVariantStatus === false &&
        updateProductVariantErrorMessage === "Internal Server Error"
      ) {
        dispatch(resetProduct());
        setProductVariantSuccess(false);
        setProductVariantError("*Something went wrong. try again");
      }
    }
  }, [productLoading]);

  return (
    <>
      <div className="product-page">
        <div className="product-main-box">
          <section className="product-main-box-a">
            <div className="create-product-box">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    letterSpacing: "0.1rem",
                  }}
                >
                  <i>Update Product</i>
                </p>
              </div>

              {productError && (
                <p
                  style={{
                    color: "red",
                    marginBottom: "1rem",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  {productError}
                </p>
              )}

              <TextField
                label="Product Name"
                size="small"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ marginBottom: "1rem" }}
              />

              <TextField
                inputProps={{ maxLength: 254 }}
                multiline
                rows={4}
                label="Description"
                size="small"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ marginBottom: "1rem" }}
              />

              <TextField
                label="Price"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                size="small"
                variant="outlined"
                sx={{ marginBottom: "0rem" }}
              />
              <p
                style={{
                  color: "red",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {productData?.priceErrorMessage}
              </p>

              <TextField
                label="Total quantity"
                size="small"
                name="totalQuantity"
                value={productData.totalQuantity}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ marginBottom: "0rem" }}
              />
              <p
                style={{
                  color: "red",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {productData?.quantityErrorMessage}
              </p>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={storeList}
                getOptionLabel={(option) => option.name}
                onChange={handleStoreChange}
                value={selectedStore}
                sx={{ width: "100%", marginBottom: "1rem" }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Store" size="small" />
                )}
              />

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={mainList}
                getOptionLabel={(option) => option.mainCategoryName}
                value={selectedMainCategory}
                onChange={handleMainCategoryChange}
                sx={{ width: "100%", marginBottom: "1rem" }}
                renderInput={(params) => (
                  <TextField {...params} label="Main Category" size="small" />
                )}
              />

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={subList}
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                getOptionLabel={(option) => option.name}
                sx={{ width: "100%", marginBottom: "1rem" }}
                renderInput={(params) => (
                  <TextField {...params} label="Sub Category" size="small" />
                )}
              />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    letterSpacing: "0.1rem",
                  }}
                >
                  <i>Update Product Images</i>
                </p>
              </div>

              <div
                style={{ width: "100%", marginBottom: "1rem" }}
                className="product-image-container"
              >
                {productImagesDisplay}
              </div>

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

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <span
                  style={{ width: "fit-content" }}
                  onClick={updateProductClick}
                >
                  <CusButton name={"UPDATE PRODUCT"} />
                </span>
              </div>

              {switchValue && <div style={{width:'100%',marginBottom:'1rem',display:'flex',flexDirection:'column',marginTop:'1rem'}}>
              <p style={{marginBottom:"1rem",
              fontWeight:'bold',fontSize:'1.2rem',
              fontFamily: "'Ubuntu', sans-serif"}}>
                You have {variantCombination?.length} different {variantCombination?.length===1?'combination.':variantCombination?.length>1?'combinations':''}</p>

                 {variantCombinationDisplay}

              </div>}
            </div>
          </section>

          <section className="product-main-box-b">
            <div className="create-variant-box">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    letterSpacing: "0.1rem",
                  }}
                >
                  <i>Update Product Variants</i>
                </p>
              </div>

              {productVariantError && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {productVariantError}
                  </p>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  border: "1px solid #f71905",
                  padding: "0.5rem",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    color: "#f71905",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "0.8rem",
                  }}
                >
                  ** Please be advised that upon clicking the{" "}
                  <b>'UPDATE PRODUCT VARIANTS'</b> button, the existing product
                  variants will be replaced with the updated ones. Kindly note
                  this action will overwrite the previous variants with the
                  newly provided information.
                </p>
              </div>

              {productVariantDisplay}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    color: "#ed325e",
                  }}
                >
                  You have product variants ? &nbsp;
                  <span>
                    <Switch
                      checkedChildren="YES"
                      unCheckedChildren="NO"
                      defaultChecked={switchValue}
                      onChange={handleSwitchChange}
                    />
                  </span>
                </p>
              </div>

             
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <span
                    style={{ width: "fit-content" }}
                    onClick={updateProductVariantClick}
                  >
                    <CusButton name={"UPDATE PRODUCT VARIANTS"} />
                  </span>
                </div>
          

              <div
                style={{
                  width: "100%",
                  border: "1px solid #f71905",
                  padding: "0.5rem",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    color: "#f71905",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "0.8rem",
                  }}
                >
                  ** Please be advised that upon clicking the{" "}
                  <b>'UPDATE PRODUCT VARIANTS'</b> button, the existing product
                  variants will be replaced with the updated ones. Kindly note
                  this action will overwrite the previous variants with the
                  newly provided information.
                </p>
              </div>
            </div>
          </section>
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

      {productSuccess && (
        <SnackBar
          severity="success"
          message="Product updated successfully !"
          open={productSuccess}
          setOpen={setProductSuccess}
        />
      )}

      {productVariantSuccess && (
        <SnackBar
          severity="success"
          message="Product variants updated successfully !"
          open={productVariantSuccess}
          setOpen={setProductVariantSuccess}
        />
      )}
    </>
  );
};

export default ProductPage;
