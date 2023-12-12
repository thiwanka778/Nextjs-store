"use client";
import React, { useState } from "react";
import Image from "next/image";
import successImage from "../../../assets/success.png";
import OtpInput from "react-otp-input";
import "./SignUp.css";
import { Modal } from "antd";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";
import {
  addNewUser,
  resendOtp,
  resetUser,
  verifyOtp,
} from "@/redux/features/userSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SnackBar from "../components/SnackBar/SnackBar";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user,
    signUpLoading,
    signUpStatus,
    signUpErrorMessage,
    signUpSuccessMessage,

    resendOtpLoading,
    resendOtpStatus,
    resendOtpErrorMessage,

    verifyOtpLoading,
    verifyOtpStatus,
    verifyOtpErrorMessage,
  } = useSelector((state: any) => state.user);
  const [error, setError] = useState<any | null>("");
  const [password, setPassword] = React.useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [sendOtpOpen, setSendOtpOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState<number>(30);
  const [resendError, setResendError] = React.useState<any>("");
  const [verifyOtpError, setVerifyOtpError] = React.useState<any>("");

  useLayoutEffect(()=>{
    if(user){
      redirect("/")
    }
   },[]);

  console.log({ otp });

  const gotoLogin: any = () => {
    router.push("/login");
  };

  const handleCancel = () => {
    setIsModalOpen3(false);
  };

  // onChange function for the Name input
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  // onChange function for the Email input
  const handleEmailChange = (event: any) => {
    const inputValue = event.target.value;

    // Check if the input contains spaces
    if (inputValue.includes(" ")) {
      // If it contains spaces, don't update the state
      return;
    }

    // Update the state if there are no spaces
    setEmail(inputValue);
  };

  // console.log({ email, name, password });

  const signupClick = () => {
    setError("");
    if (name == "" || password == "" || email == "") {
      setOpen(true);
    } else {
      const payload = {
        name: name,
        password: password,
        email: email,
        roles: "ROLE_USER",
        active: false,
      };

      dispatch(addNewUser(payload));
    }
  };

  // console.log({ signUpStatus, signUpErrorMessage });

  React.useEffect(() => {
    if (signUpLoading === false) {
      if (
        signUpStatus === true &&
        signUpSuccessMessage?.message === "Account created successfully !"
      ) {
        dispatch(resetUser());
        setIsModalOpen3(true);
        // success
      } else if (
        signUpStatus === true &&
        signUpSuccessMessage?.message === "Otp code has been sent"
      ) {
        dispatch(resetUser());
        setIsModalOpen(true);
        startTimer(30);
        // modal open
      } else if (
        signUpStatus === false &&
        signUpErrorMessage === "User already exist. please login..!"
      ) {
        dispatch(resetUser());
        setError("User already exist. please login..!");
      } else if (
        signUpStatus === false &&
        signUpErrorMessage === "Something went wrong.. try again !"
      ) {
        dispatch(resetUser());
        setError("Something went wrong.. try again !");
      } else if (
        signUpStatus === false &&
        signUpErrorMessage === "Failed to create user..try again !"
      ) {
        dispatch(resetUser());
        setError("Failed to create user..try again !");
      } else if (
        signUpStatus === false &&
        signUpErrorMessage === "Unauthorized"
      ) {
        dispatch(resetUser());
        // invalid email
        setError("Something went wrong.. try again !");
      } else if (
        signUpStatus === false &&
        signUpErrorMessage == "Internal Server Error"
      ) {
        dispatch(resetUser());
        setError("Something went wrong.. try again !");
      }
    }
  }, [signUpLoading]);

  const startTimer = (durationSeconds: number) => {
    let timeRemaining = durationSeconds;
    const timerId = setInterval(() => {
      setTime(timeRemaining);
      timeRemaining--;
      if (timeRemaining < 0) {
        clearInterval(timerId);
        setTime(0);
      }
    }, 1000);
  };

  // console.log("Time bulla ",time)Fr

  const resendOtpClick = () => {
    setOtp("");
    setResendError("");
    setVerifyOtpError("");
    dispatch(resendOtp(email));
  };

  React.useEffect(() => {
    if (resendOtpLoading === false) {
      if (resendOtpStatus === true) {
        setTime(30);
        startTimer(30);
        dispatch(resetUser());
        setSendOtpOpen(true);

        // success
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage === "User doesn't exist !"
      ) {
        setResendError("User doesn't exist !");
        dispatch(resetUser());
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage === "Unauthorized"
      ) {
        setResendError("Failed to send OTP. Try again !");
        dispatch(resetUser());
      } else if (
        resendOtpStatus === false &&
        resendOtpErrorMessage == "Internal Server Error"
      ) {
        setResendError("Failed to send OTP. Try again !");
        dispatch(resetUser());
      }
    }
  }, [resendOtpLoading]);

  React.useEffect(() => {
    if (otp?.length === 4) {
      setVerifyOtpError("");
      setResendError("");
      const payload = {
        otpCode: otp,
        email: email,
      };
      dispatch(verifyOtp(payload));
    }
  }, [otp]);

  React.useEffect(() => {
    if (verifyOtpLoading === false) {
      if (verifyOtpStatus === true) {
        setResendError("");
        setError("");
        setIsModalOpen(false);
        setTime(0);
        setIsModalOpen2(true);
        dispatch(resetUser());
        setEmail("");
        setPassword("");
        setName("");

        const logTimeout = setTimeout(() => {
          console.log("After 2 seconds...");
          gotoLogin();
        }, 2000);

        return () => clearTimeout(logTimeout);
        // success
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "User doesn't exist !"
      ) {
        setVerifyOtpError("User doesn't exist !");
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Invalid OTP"
      ) {
        setVerifyOtpError("Invalid OTP !");
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Otp code is expired !"
      ) {
        setVerifyOtpError("Otp code is expired !");
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Invalid Otp code !"
      ) {
        setVerifyOtpError("Invalid Otp code !");
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Otp code is expired !"
      ) {
        setVerifyOtpError(
          "Otp code is expired. Please click resend button below !"
        );
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Internal Server Error"
      ) {
        setVerifyOtpError("Something went wrong. try again !");
        dispatch(resetUser());
      } else if (
        verifyOtpStatus === false &&
        verifyOtpErrorMessage === "Unauthorized"
      ) {
        setVerifyOtpError("Something went wrong. try again !");
        dispatch(resetUser());
      }
    }
  }, [verifyOtpLoading]);

  return (
    <>
      <div className="signup-page">
        <div className="signup-box">
          <div className="signup-box-input">
            {error && error !== "" && (
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
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  *{error}
                </p>
              </div>
            )}

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontFamily: "'Ubuntu', sans-serif",
                  textAlign: "center",
                }}
              >
                Sign Up for Your Account
              </span>
            </div>

            <input
              className="input-box"
              placeholder="Name"
              type="text"
              style={{ marginBottom: "1rem" }}
              value={name}
              onChange={handleNameChange}
            />

            <input
              className="input-box"
              placeholder="Email"
              type="text"
              style={{ marginBottom: "1rem" }}
              value={email}
              onChange={handleEmailChange}
            />
            <PasswordInput
              placeholder={"Password"}
              setPassword={setPassword}
              password={password}
            />

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button className="login-button" onClick={signupClick}>
                SIgn Up
              </button>
            </div>

            <div
              style={{
                marginTop: "0.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                Already have an account? &nbsp;
                <Link
                  href="/login"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#122eff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* components  */}

      {/* <Snackbar 
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          All fields are required !
        </Alert>
      </Snackbar> */}

      {/* 
       <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert>
      
      */}

      {/* backdrop loading */}

      {open && (
        <SnackBar
          severity="warning"
          message="All fields are required!"
          open={open}
          setOpen={setOpen}
        />
      )}

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={signUpLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={resendOtpLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={verifyOtpLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

      {/* modal */}

      <Modal
        footer={null}
        closeIcon={false}
        open={isModalOpen}
        // open={true}
        title={
          <span
            style={{
              color: "#02ba08",
              fontSize: "2rem",
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center",
            }}
          >
            OTP Verification
          </span>
        }
      >
        {/* <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Image src={successImage} alt="success" width={100} height={100} />
</div> */}

        {verifyOtpError && verifyOtpError !== "" && (
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
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              *{verifyOtpError}
            </p>
          </div>
        )}

        {resendError && resendError != "" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              // marginTop: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#f00707",
                textAlign: "center",
              }}
            >
              *{resendError}
            </p>
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "black",
              textAlign: "center",
            }}
          >
            OTP code sent to{" "}
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#0520f0",
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              {email}
            </span>
          </p>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <div style={{ width: "fit-content" }}>
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
                width: "50px", // Adjust the width as needed
                height: "50px", // Adjust the height as needed
                fontSize: "16px", // Adjust the font size as needed
                // Adjust the margin as needed
                // Adjust the padding as needed
                textAlign: "center", // Center the text
                border: "1px solid #ccc", // Add a border for better visibility
                borderRadius: "4px", // Optional: Add border-radius for rounded corners
                outline: "none",
              }}
              shouldAutoFocus={true}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {time > 0 && (
                <span style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Didn't receive OTP in {time} s
                </span>
              )}
              &nbsp;
              {time <= 0 && (
                <span>
                  <span
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      color: "black",
                      textDecoration: "none",
                    }}
                  >
                    Didn't receive OTP{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={resendOtpClick}
                  >
                    {" "}
                    Resend
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        footer={null}
        closeIcon={false}
        open={isModalOpen2}
        // open={true}
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
              Your account has been activated successfully !
            </p>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "1rem",
            }}
          >
            <p
              // onClick={gotoLogin}
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

      <Modal
        footer={null}
        closeIcon={true}
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
              Your account created successfully !
            </p>
          </div>
        </div>
      </Modal>

      {sendOtpOpen && (
        <SnackBar
          severity="success"
          message={`OTP code sent to your email ${email}`}
          open={sendOtpOpen}
          setOpen={setSendOtpOpen}
        />
      )}
    </>
  );
};

export default SignUp;
