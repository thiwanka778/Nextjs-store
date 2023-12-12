"use client";
import React,{useState} from "react";
import Image from "next/image";
import successImage from "../../assets/success.png";
import { authLogin, decrementCount, findUserByEmail, incrementCount, resendOtp,resetUser, verifyOtp } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "antd";
import "./globals.css";
import PasswordInput from "./components/PasswordInput/PasswordInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SnackBar from "./components/SnackBar/SnackBar";
import OtpInput from "react-otp-input";
import HomeNav from "./components/HomeNav/HomeNav";

export default function Home() {
  const router=useRouter();
  const dispatch = useDispatch();




  return (
    <>
  <HomeNav/>
    </>
  );
}
