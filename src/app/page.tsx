"use client";
import React, { useState } from "react";
import Image from "next/image";
import successImage from "../../assets/success.png";
import {
  authLogin,
  decrementCount,
  findUserByEmail,
  incrementCount,
  resendOtp,
  resetUser,
  verifyOtp,
} from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "antd";
import "./globals.css";
import PasswordInput from "./components/PasswordInput/PasswordInput";
import Pagination from '@mui/material/Pagination';
import { useRouter } from "next/navigation";
import Link from "next/link";
import SnackBar from "./components/SnackBar/SnackBar";
import OtpInput from "react-otp-input";
import HomeNav from "./components/HomeNav/HomeNav";
import Product from "./components/Product/Product";
import { getAllProductsPublic } from "@/redux/features/productSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const { requiredProductPublic } = useSelector((state: any) => state.product);
  const {
    productLoading,
    createProductStatus,
    createProductErrorMessage,
    productObject,
    productImageDeleteStatus,
  } = useSelector((state: any) => state.product);
  const [productList, setProductList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  const [totalPages, setTotalPages] = React.useState<number>(1);

  console.log(productList, "requiredProductPublic");

  React.useLayoutEffect(() => {
    dispatch(getAllProductsPublic(1));
  }, [user]);

  React.useEffect(() => {
    if (requiredProductPublic) {
      setProductList(requiredProductPublic?.productList);
      if (requiredProductPublic?.productList?.length >= 1) {
        const total = Math.ceil(
          requiredProductPublic?.totalCount / itemsPerPage
        );
        setTotalPages(total);
      } else {
        setTotalPages(1);
      }
    }
  }, [user, requiredProductPublic]);

  const productListDisplay = productList?.map((item: any) => {
    return <Product key={item?.id} item={item} />;
  });

  const handlePageChange = (event:any, value:any) => {
    setPage(value);
    dispatch(getAllProductsPublic(value));
  };

  return (
    <>
      <div className="main-home-page">
        <HomeNav />
        <div className="home-page-product-container">{productListDisplay}</div>

          <div style={{maxWidth:'98%',  display:'flex',alignItems:'center',justifyContent:'center',
                          overflowX:"auto",marginTop:'1rem',marginBottom:'1rem'}}>
                          <Pagination count={totalPages} color="primary"  page={page}
                               onChange={handlePageChange} />
          </div>
        
      </div>
    </>
  );
}
