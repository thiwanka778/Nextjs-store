'use client';
import React ,{useState} from "react";
import "./EditStore.css";
import { useSelector, useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import { nanoid } from "@reduxjs/toolkit";
import Backdrop from "@mui/material/Backdrop";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CircularProgress from "@mui/material/CircularProgress";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StoreCard from "./StoreCard";
import { getAllStores, resetStore, updateStore } from "@/redux/features/storeSlice";
import {  Modal, Upload,message } from 'antd';
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import {
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import CusButton from "../components/CusButton/CusButton";
import SnackBar from "../components/SnackBar/SnackBar";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface storeInfoType {
  storeName: string,
  description: string,
  city: string,
  address: string,
  contactNumber: string,
  imageURL:string,
  id:number|string|any|null,
}

const EditStore = () => {
  const dispatch = useDispatch();
  const {  updateStoreLoading,
    updateStoreStatus,
   updateStoreErrorMesssage,}=useSelector((state:any)=>state.store);
  const { user } = useSelector((state: any) => state.user);
  const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | any | null>("");
  const [existingImage,setExistingImage]= useState<any|null|string>("");
  const [previewImage, setPreviewImage] = useState("");
  const [deleteOpen,setDeleteOpen]=useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [deleteData,setDeleteData]=React.useState<any|null|string>("");
  const [loading,setLoading]=useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const {getStoreData}=useSelector((state:any)=>state.store);
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = React.useState<any | null | string>("");
  const [storeError, setStoreError] = useState<any | null | string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState<storeInfoType | null | any>({
    id:"",
    storeName: "",
    description: "",
    city: "",
    address: "",
    contactNumber: "",
    imageURL:"",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const updateClick=(data:any)=>{

    setUploadedImage("");
    setExistingImage(data?.storeImageUrl);
    // console.log(data);
    setStoreInfo({ storeName: data?.name?data?.name?.trim():"",
    description: data?.description?data?.description?.trim():"",
    city: data?.city?data?.city?.trim():"",
    address: data?.address?data?.address?.trim():"",
    contactNumber: data?.contact?data?.contact?.trim():"",
    id:data?.id?data?.id:"",
    imageURL:data?.storeImageUrl||"",})
    setIsModalOpen(true);
  };

// console.log(storeInfo)
  const handleOk = () => {
    setStoreError("");
    setUploadedImage("");
    setFileList([]);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setStoreError("");
    setUploadedImage("");
    setFileList([]);
    setIsModalOpen(false);
  };

  React.useLayoutEffect(() => {
    if (!user) {
      redirect("/");
    }else{
      dispatch(getAllStores());
    }
  }, [user]);

  // console.log(getStoreData)

  const deleteIconClick=(data:any)=>{
    //  console.log(data,"DATA BALLA");
    setDeleteData(data);
     setDeleteOpen(true);
  }

  const displayStores=getStoreData?.map((item:any)=>{
    return (
      <StoreCard {...item} key={item?.id} updateClick={updateClick} 
       setDeleteOpen={setDeleteOpen}  deleteIconClick={deleteIconClick}/>
    )
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    // Validation for allowing only numbers and limiting to maximum 10 digits
    if (
      name === "contactNumber" &&
      (!/^\d*$/.test(value) || value.length > 10)
    ) {
      // Prevents typing non-numeric characters or exceeding 10 digits
      return;
    }

    setStoreInfo({
      ...storeInfo,
      [name]: value,
    });
  };

  const handlePreview = async (file: UploadFile|any|null) => {
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
    if (newFileList.length > 1) {
      message.error("Please select only one image at a time.");
      return;
    }


    const updatedFileList = newFileList.map((file: any) => {
      if (file.status !== "done") {
        return { ...file, status: "done" };
      }
      return file;
    });

    // Update the fileList state with the modified file list
    setFileList(updatedFileList);
  };

  React.useEffect(() => {
    const makeFile = async () => {
      if (fileList?.length >= 1) {
        let file = fileList[0];
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as RcFile);
        }
        const imageURL:string|null|any=file.url || (file.preview as string);
        setStoreInfo((prevState:any|null)=>{
           return {...prevState,imageURL}
        })
        setSelectedImage(file.url || (file.preview as string));
      } else if (fileList?.length == 0 || fileList?.length < 1) {
        setSelectedImage("");
        setStoreInfo((prevState:any|null)=>{
          return {...prevState,imageURL:""}
       })
      }else if(!fileList || !Array.isArray(fileList)){
        setSelectedImage("");
        setStoreInfo((prevState:any|null)=>{
          return {...prevState,imageURL:""}
       })
      }
    };

    makeFile();
  }, [fileList]);

  const uploadImageToFirebase = async (file: File | any | null) => {
    console.log("uploadImageToFirebase running");
    const maxAttempts = 60; // Number of attempts (1 minute with 1 second intervals)
    const delayBetweenAttempts = 1000; // 1000 milliseconds = 1 second
    setLoading(true);
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const storageRef = ref(
          storage,
          "stores/" + `image_${nanoid()}_${file.name}`
        );
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setLoading(false);
        // console.log(downloadURL, " HERE IS THE DOWNLOAD URL");
        return downloadURL;
      } catch (error) {
        console.error(`Error uploading image (attempt ${attempt + 1}):`, error);
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
        return "Image deleted successfully"; // If successful, exit the function
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
    console.log("Exceeded maximum attempts. Image deletion failed.");
  };

  const updateStoreClick=async()=>{
    setStoreError("");
    setError("");
    if (storeInfo?.storeName?.trim() === "") {
      setOpen(true);
      setError("Store Name is required !");
      return;
    } else if (storeInfo?.description?.trim() === "") {
      setOpen(true);
      setError("Please provide a description !");
      return;
    } else if (storeInfo?.contactNumber?.trim() === "") {
      setOpen(true);
      setError("Contact Number is required !");
      return;
    } else if (fileList?.length < 1 && existingImage=="" && storeInfo?.imageURL=="") {
      setOpen(true);
      setError("Store Image is required !");
      return;
    }

    if(fileList?.length>=1){
      const downloadURL: any | null | string = await uploadImageToFirebase(
        fileList[0]?.originFileObj
      );
      if(downloadURL){
        console.log("UPLOAD PAMKA : ", downloadURL);
        setUploadedImage(downloadURL);
        const { storeName, contactNumber, address, description, city,imageURL,id } =
        storeInfo;

      const payload = 
        {
          id,
          name: storeName.trim(),
          description: description.trim(),
          storeImageUrl: downloadURL,
          city: city.trim(),
          address: address.trim(),
          contact: contactNumber.trim(),
        }
      
      dispatch(updateStore(payload));
      }
    }else if(fileList?.length===0 && existingImage!=""){
      const { storeName, contactNumber, address, description, city,imageURL ,id} =
        storeInfo;

      const payload = 
        {
          id,
          name: storeName.trim(),
          description: description.trim(),
          storeImageUrl: existingImage,
          city: city.trim(),
          address: address.trim(),
          contact: contactNumber.trim(),
        }
      
      dispatch(updateStore(payload));
    }

   
  };

  React.useEffect(()=>{
    if(updateStoreLoading===false){
       if(updateStoreStatus===true){
       
        dispatch(getAllStores());
        if(uploadedImage!=""){
           const output:any|null|string=deleteImage(existingImage);
           if(output==="Image deleted successfully"){
               setUploadedImage("");
               setExistingImage("");
           }

        }
        setStoreError("");
        setFileList([]);
        setIsModalOpen(false);



       }else if(updateStoreStatus===false && updateStoreErrorMesssage=="Store not found !"){
        setStoreError("*Store not found !");
        if(uploadedImage && uploadedImage!=""){
          deleteImage(uploadedImage);
        }
        
        dispatch(resetStore());
       }else if(updateStoreStatus===false && updateStoreErrorMesssage=="Unauthorized request !"){
        setStoreError("*You are trying to update others' store !");
        if(uploadedImage && uploadedImage!=""){
          deleteImage(uploadedImage);
        }
        dispatch(resetStore());
       }else if(updateStoreStatus===false && updateStoreErrorMesssage=="duplicate name !"){
        setStoreError("*Store name already exist ! please use different name.");
        if(uploadedImage && uploadedImage!=""){
          deleteImage(uploadedImage);
        }
        dispatch(resetStore());
       }else if(updateStoreStatus===false && updateStoreErrorMesssage=="Internal Server Error"){
        setStoreError("*Something went wrong try again !");
        if(uploadedImage && uploadedImage!=""){
          deleteImage(uploadedImage);
        }
        dispatch(resetStore());
       }else if(updateStoreStatus===false && updateStoreErrorMesssage=="Unauthorized"){
        setStoreError("*Your session is expired! please login again.");
        if(uploadedImage && uploadedImage!=""){
          deleteImage(uploadedImage);
        }
        dispatch(resetStore());
       }
    }

  },[updateStoreLoading]);


  const handleDeleteOk = () => {
   setDeleteOpen(false);
   setDeleteData("");
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setDeleteData("");
  };

  return (
    <>
  <div className="edit-store">

    {getStoreData && getStoreData?.length>=1 && Array.isArray(getStoreData) &&<div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",}}>
          <p style={{textAlign:"center",fontFamily: "'Poppins', sans-serif",
          fontSize:"2rem",fontWeight:"bold"}}>You have {getStoreData?.length} stores</p>
    </div>}

        <div className="edit-store-container" >
          {displayStores}
        </div>
    </div>











    <Modal title={<span style={{fontFamily: "'Poppins', sans-serif",fontSize:"1.2rem",letterSpacing:"0.1rem",fontWeight:600,}}>Edit Store</span>}
    footer={null}
    open={isModalOpen} 
    onOk={handleOk} 
    onCancel={handleCancel}>
        <div style={{width:"100%",display:"flex",flexDirection:"column",}}>

          {storeError && <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-start",marginBottom:"0.5rem"}}>
            <p style={{color:"red",fontFamily: "'Roboto', sans-serif",}}>{storeError}</p>
          </div>}

              <img src={storeInfo?.imageURL} style={{width:"100%",marginBottom:"1rem",
              borderRadius:"10px",boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" ,}}/>

{/* upload start */}

                           <div style={{marginBottom:"1rem"}}>
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
                           </div>

{/* upload end*/}

              <span className="update-input-box-title">Store Name</span>
              <input
                className="input-box"
                placeholder="Store Name"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="storeName"
                value={storeInfo.storeName}
                onChange={handleInputChange}
              />
               <span className="update-input-box-title">Description</span>
              <textarea
               rows={6}
                className="input-box"
                placeholder="Description"
                style={{ marginBottom: "1rem" }}
                name="description"
                value={storeInfo.description}
                onChange={handleInputChange}
                maxLength={254}
              />
                  <span className="update-input-box-title">City</span>
              <input
                className="input-box"
                placeholder="City"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="city"
                value={storeInfo.city}
                onChange={handleInputChange}
              />
               <span className="update-input-box-title">Address</span>
              <input
                className="input-box"
                placeholder="Address"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="address"
                value={storeInfo.address}
                onChange={handleInputChange}
              />
                <span className="update-input-box-title">Contact</span>
              <input
                className="input-box"
                placeholder="Contact Number"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="contactNumber"
                value={storeInfo.contactNumber}
                onChange={handleInputChange}
              />
              <div style={{
                display:"flex",width:"100%",alignItems:"center",justifyContent:"flex-end",
              }}>

              <div style={{ width: "fit-content" }} onClick={updateStoreClick}>
                <CusButton name={"UPDATE"} />
              </div>
              </div>
          </div>
      </Modal>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={updateStoreLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={loading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>


      <Modal 
   
      title={
        <div style={{display:"flex",alignItems:"center",background:"transparent"}}>
          <WarningRoundedIcon sx={{color:"#f2a407",marginRight:"0.5rem",fontSize:"30px"}}/>
            <span style={{textAlign:"center",
      fontFamily: "'Roboto', sans-serif",fontSize:"1.2rem",color:"black"}}>Delete Store</span>
        </div>
    
    }
       open={deleteOpen}
       onOk={handleDeleteOk} 
       footer={null}
       zIndex={50000}
       onCancel={handleDeleteCancel}>
     <div style={{width:"100%",display:"flex",flexDirection:"column"}}>
           <p style={{fontFamily: "'Roboto', sans-serif",
           fontSize:"1rem",color:"#67686e",fontWeight:"500"}}>Are you sure you want to delete 
           <span style={{color:"black",fontWeight:"bold",}}> {deleteData?.name} ? </span></p>

           <div style={{display:"flex",width:"100%",alignItems:"center",justifyContent:"flex-end",marginTop:"0.5rem"}}>
                  <button className="delete-btn-cancel-store" onClick={handleDeleteCancel}
                   style={{marginRight:"0.5rem"}}>Cancel</button>
                  <button className="delete-btn-store">Delete</button>
           </div>
     </div>
      </Modal>



      {open && (
        <SnackBar
          severity="warning"
          message={error}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
    );
};

export default EditStore;
