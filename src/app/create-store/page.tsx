"use client";
import React, { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import "./CreateStore.css";
import emptyImage from "../../../assets/empty.png";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { redirect } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import CallIcon from "@mui/icons-material/Call";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import Image from "next/image";
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
import { createStore, resetStore } from "@/redux/features/storeSlice";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface storeInfoType {
  storeName: string;
  description: string;
  city: string;
  address: string;
  contactNumber: string;
}

const CreateStore = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const { createStoreLoading, createStoreStatus, createStoreErrorMessage } =
    useSelector((state: any) => state.store);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | any | null>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = React.useState<any | null | string>("");
  const [storeError, setStoreError] = useState<any | null | string>("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
  const [storeInfo, setStoreInfo] = useState<storeInfoType | null | any>({
    storeName: "",
    description: "",
    city: "",
    address: "",
    contactNumber: "",
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

  const handleCancel = () => setPreviewOpen(false);

  useLayoutEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

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
    if (newFileList.length > 1) {
      message.error("Please select only one image at a time.");
      return;
    }

    // if(newFileList && newFileList?.length>=1){
    //   const file = newFileList[0].originFileObj;
    //   uploadImageToFirebase(file);
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

  React.useEffect(() => {
    const makeFile = async () => {
      if (fileList?.length >= 1) {
        let file = fileList[0];
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setSelectedImage(file.url || (file.preview as string));
      } else if (fileList?.length == 0 || fileList?.length < 1) {
        setSelectedImage("");
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

  const saveClick = async () => {
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
    } else if (fileList?.length < 1) {
      setOpen(true);
      setError("Store Image is required !");
      return;
    }

    const downloadURL: any | null | string = await uploadImageToFirebase(
      fileList[0]?.originFileObj
    );
    if (
      downloadURL &&
      downloadURL != null &&
      downloadURL != "undefined" &&
      downloadURL != undefined &&
      downloadURL != ""
    ) {
      console.log("UPLOAD PAMKA : ", downloadURL);
      setUploadedImage(downloadURL);

      const { storeName, contactNumber, address, description, city } =
        storeInfo;

      const payload = [
        {
          name: storeName.trim(),
          description: description.trim(),
          storeImageUrl: downloadURL,
          city: city.trim(),
          address: address.trim(),
          contact: contactNumber.trim(),
        },
      ];
      dispatch(createStore(payload));
    }
  };

  React.useEffect(() => {
    if (createStoreLoading === false) {
      if (createStoreStatus === true) {
        setFileList([]);
        dispatch(resetStore());
        setUploadedImage("");
        setStoreStatus(true);
        setStoreError("");
      } else if (
        createStoreStatus === false &&
        createStoreErrorMessage == "Internal Server Error"
      ) {
        setStoreError("Something went wrong try again !");
        deleteImage(uploadedImage);
        dispatch(resetStore());
      } else if (
        createStoreStatus === false &&
        createStoreErrorMessage == "Unauthorized"
      ) {
        dispatch(resetStore());
        deleteImage(uploadedImage);
        setStoreError("Your session is expired! please login again.");
      } else if (
        createStoreStatus === false &&
        createStoreErrorMessage == "Store name already exists !"
      ) {
        setStoreError("Store name already exist ! please use different name.");
        deleteImage(uploadedImage);
        dispatch(resetStore());
      }else if(createStoreStatus===false && createStoreErrorMessage=="Contact information belong to another user !"){
        setStoreError("Contact information belong to another user !");
        deleteImage(uploadedImage);
        dispatch(resetStore());
      }
    }
  }, [createStoreLoading]);

  return (
    <>
      <div className="create-store-main">
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
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            CREATE STORE
          </p>
        </div>
        <div className="create-store">
          <section className="section1">
            <div className="section1-div">
              {storeError && (
                <div style={{ marginBottom: "1rem", width: "100%" }}>
                  <p
                    style={{
                      color: "#f70202",
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {storeError}
                  </p>
                </div>
              )}

              <input
                className="input-box"
                placeholder="Store Name"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="storeName"
                value={storeInfo.storeName}
                onChange={handleInputChange}
              />
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
              <input
                className="input-box"
                placeholder="City"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="city"
                value={storeInfo.city}
                onChange={handleInputChange}
              />
              <input
                className="input-box"
                placeholder="Address"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="address"
                value={storeInfo.address}
                onChange={handleInputChange}
              />
              <input
                className="input-box"
                placeholder="Contact Number"
                type="text"
                style={{ marginBottom: "1rem" }}
                name="contactNumber"
                value={storeInfo.contactNumber}
                onChange={handleInputChange}
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
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <div style={{ width: "fit-content" }} onClick={saveClick}>
                <CusButton name={"SAVE"} />
              </div>
            </div>
          </section>

          <section className="section2">
            <div className="section2-div">
              <div className="selected-image">
                {selectedImage == "" && (
                  <Image
                    src={emptyImage}
                    alt="empty"
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      height: "auto",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                  />
                )}
                {selectedImage != "" && (
                  <img
                    src={selectedImage}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                  />
                )}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    overflowX:"auto",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Ubuntu', sans-serif",
                      fontSize: "2rem",
                      textAlign:"center",
                    }}
                  >
                    {storeInfo.storeName}
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  {storeInfo.contactNumber?.trim() != "" && (
                    <CallIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1.2rem",
                      color: "black",
                    }}
                  >
                    {storeInfo.contactNumber}
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  {storeInfo.city?.trim() != "" && (
                    <LocationCityIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1.2rem",
                      color: "#2f78ed",
                    }}
                  >
                    {storeInfo.city}
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginTop: "0.5rem",
                  }}
                >
                  {storeInfo.address?.trim() != "" && (
                    <LocationOnIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#f71307",
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1.2rem",
                      color: "#2f78ed",
                    }}
                  >
                    {storeInfo.address}
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginTop: "0.5rem",
                  }}
                >
                  {storeInfo.description?.trim() != "" && (
                    <DescriptionIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1.2rem",
                      color: "#898e96",
                    }}
                  >
                    {storeInfo.description}
                  </p>
                </div>
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

      {open && (
        <SnackBar
          severity="warning"
          message={error}
          open={open}
          setOpen={setOpen}
        />
      )}
      {storeStatus && (
        <SnackBar
          severity="success"
          message="Store created successfully !"
          open={storeStatus}
          setOpen={setStoreStatus}
        />
      )}

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={createStoreLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={loading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
    </>
  );
};

export default CreateStore;
