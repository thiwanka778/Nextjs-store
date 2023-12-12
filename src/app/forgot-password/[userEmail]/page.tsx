"use client";
import React, { useState } from "react";
import successImage from "../../../../assets/success.png";
import Image from "next/image";
import "../ForgotPassword.css";
import PasswordInput from "@/app/components/PasswordInput/PasswordInput";
import OtpInput from "react-otp-input";
import SnackBar from "@/app/components/SnackBar/SnackBar";
import { useRouter } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, resetPassword, resetUser } from "@/redux/features/userSlice";

type Params = {
  params: {
    userEmail: string;
  };
};

const ForgotPassword = ({ params: { userEmail } }: Params) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { resendOtpLoading, resendOtpStatus, resendOtpErrorMessage,
  
    resetPasswordLoading,
    resetPasswordStatus,
    resetPasswordErrorMessage,
  
  
  } =
    useSelector((state: any) => state.user);
const [open,setOpen]=useState(false);
const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [resendError, setResendError] = React.useState<any>("");
  const [resetPasswordError, setResetPasswordError]=useState<any|null|string>("");
  const [time, setTime] = useState(0);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPasswordOpen,setOtpPasswordOpen]=useState(false);

  const [decodedEmail, setDecodedEmail] = useState("");

  const handleCancel = () => {
    setIsModalOpen3(false);
  };

  const startTimer = () => {
    let t=30;
    const timer = setInterval(() => {
      t=t>0?t-1:0;
      setTime(t);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setTime(0);
    }, t * 1000);
  };

  React.useEffect(() => {
    const decoded = decodeURIComponent(userEmail);
    setDecodedEmail(decoded);
  }, [userEmail]);

  console.log(decodedEmail,"DECODEd ")
  React.useEffect(() => {
    setResetPasswordError("")
      setResendError("");
      console.log(decodedEmail,"DECODEd inside use effect")
      if(decodedEmail && decodedEmail!=""){
        setResendError("");
        dispatch(resendOtp(decodedEmail));
      }
      

  }, [decodedEmail,userEmail]);

  React.useEffect(() => {
    if (resendOtpLoading === false) {
      if (resendOtpStatus === true) {
        setResendError("");
        dispatch(resetUser());
        setOpen(true);
        startTimer();
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage === "User doesn't exist !"
      ) {
        setResendError("*User doesn't exist !");
        dispatch(resetUser());
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage === "Unauthorized"
      ) {
        setResendError("*Failed to send OTP. Try again !");
        dispatch(resetUser());
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage == "Internal Server Error"
      ) {
        setResendError("*Failed to send OTP. Try again !");
        dispatch(resetUser());
      }
    }
  }, [resendOtpLoading]);

  const resendClick=()=>{
    setResetPasswordError("")
    setResendError("");
    dispatch(resendOtp(decodedEmail))
  }


  const resetPasswordClick=()=>{
    setResendError("");
    setResetPasswordError("")
    if(otp=="" || password==""){
         setOtpPasswordOpen(true);
    }else if(otp?.length===4 && password!=""){
      const payload={
        "email":decodedEmail,
        "otpCode":otp,
        "password":password
      }
  
      dispatch(resetPassword(payload));
    }else{
      setOtpPasswordOpen(true);
    }
       
  };

  React.useEffect(()=>{

    if(resetPasswordLoading===false){
      if(resetPasswordStatus===true){
        setIsModalOpen3(true)
        setResetPasswordError("")
        setResendError("")
          dispatch(resetUser());
          setTimeout(() => {
            router.push("/login")
          }, 2000);

      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="User doesn't exist"){
        setResetPasswordError("*User doesn't exist !")
        dispatch(resetUser());
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Otp is expired !"){
        dispatch(resetUser());
        setResetPasswordError("*OTP code is expired. click resend button below !")
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Otp is expired !"){
        dispatch(resetUser());
        setResetPasswordError("*OTP code is expired. click resend button below !")
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Invalid otp code !"){
        dispatch(resetUser());
        setResetPasswordError("*Invalid OTP code !")
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Otp code is expired !"){
        dispatch(resetUser());
        setResetPasswordError("*OTP code is expired. click resend button below !")
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Unauthorized"){
        dispatch(resetUser());
        setResetPasswordError("*Something went wrong. Try again !")
      }else if(resetPasswordStatus===false && resetPasswordErrorMessage=="Internal Server Error"){
        dispatch(resetUser());
        setResetPasswordError("*Something went wrong. Try again !")
      }
    }

  },[resetPasswordLoading]);



  return (
    <>
      <div className="forgot-password-page">
        <div className="forgot-password-box">
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "0.1rem",
              }}
            >
              Reset Password
            </p>
          </div>

          <div className="forgot-password-input-container">
         
         <div style={{display:"flex",alignItems:"center",
         width:"100%",justifyContent:'flex-start',marginBottom:"0.1rem"}}>
                <p  style={{color:"#fa0008",
                fontFamily: "'Roboto', sans-serif",fontWeight:"bold"}}>{resendError}</p>
         </div>

         <div style={{display:"flex",alignItems:"center",
         width:"100%",justifyContent:'flex-start',marginBottom:"0.1rem"}}>
                <p  style={{color:"#fa0008",
                fontFamily: "'Roboto', sans-serif",fontWeight:"bold"}}>{resetPasswordError}</p>
         </div>

            <PasswordInput
              placeholder={"New Password"}
              setPassword={setPassword}
              password={password}
            />

<div style={{marginBottom:"0.5rem",width:"100%",marginTop:"0.5rem"}}>
                  <p 
                  style={{fontFamily: "'Roboto', sans-serif",
                  color:"#1622fa",fontWeight:"bold",textAlign:"center"}}>OTP code sent to {decodedEmail}</p>
                </div>

            <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1rem",
                  width: "100%",
                  flexDirection: "column",
                }}>
              <div
                style={{
                 
                  width: "fit-content",
               
                }}
              >
                
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  inputType="tel"
                  numInputs={4}
                  renderSeparator={<span>&nbsp;-&nbsp;</span>}
                  renderInput={(props: any) => (
                    <input id="otp-input-box" {...props} />
                  )}
                  inputStyle={{
                    width: "50px", 
                    height: "50px",
                    fontSize: "16px", 
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                  shouldAutoFocus={true}
                />
                <div style={{display:"flex",width:"100%",
                alignItems:"center",
                justifyContent:"flex-end"}}>
                 {time>0 && <p>Resend OTP in {time} seconds</p>}
                {time<=0 &&  <p 
                onClick={resendClick}
                style={{color:"#2077fa",textDecoration:"underline",cursor:"pointer"}}>Resend OTP</p>}
                  </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <button className="reset-password-btn" onClick={resetPasswordClick}>Reset Password</button>
            </div>
          </div>
        </div>
      </div>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={resendOtpLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>


      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={resetPasswordLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>



      {open && (
        <SnackBar
          severity="info"
          message={`OTP code sent to your email ${decodedEmail}`}
          open={open}
          setOpen={setOpen}
        />
      )}

{otpPasswordOpen && (
        <SnackBar
          severity="warning"
          message={`All fields are required !`}
          open={otpPasswordOpen}
          setOpen={setOtpPasswordOpen}
        />
      )}


<Modal
        footer={null}
        closeIcon={false}
        open={isModalOpen3}
        onCancel={handleCancel}
       
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={successImage} alt="success" width={100} height={100} />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                color: "#05ab0b",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
              }}
            >
              Your password was reset successfully !
            </p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "0.5rem",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                color: "black",
                fontFamily: "'Roboto', sans-serif",
                textAlign: "center",
              }}
            >
              Please wait. You will be automatically redirected to login page
              ...
            </p>
          </div>
        </div>
      </Modal>




    </>
  );
};

export default ForgotPassword;
