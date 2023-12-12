"use client";
import React,{useState} from "react";
import Image from "next/image";
import successImage from "../../../assets/success.png";
import { authLogin, decrementCount, findUserByEmail, incrementCount, resendOtp,resetUser, verifyOtp } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "antd";
import "./Login.css";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SnackBar from "../components/SnackBar/SnackBar";
import OtpInput from "react-otp-input";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";

export default function Login() {
  const router=useRouter();
  const dispatch = useDispatch();
  const [open,setOpen]=React.useState(false);
  const [otp, setOtp] = useState("");
  const { count,user,
     userLoginLoading,userLoginStatus,
  userLoginErrorMessage, userLoginSuccessMessage,
  
  resendOtpLoading,
  resendOtpStatus,
  resendOtpErrorMessage,

  verifyOtpLoading,
  verifyOtpStatus,
  verifyOtpErrorMessage,


  findUserByEmailLoading,
    findUserByEmailStatus,
    findUserByEmailErrorMessage,

} = useSelector((state: any) => state.user);
  const [password, setPassword] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [findUserError,setFindUserError]=useState<string|any|null>("");
  const [sendOtpOpen,setSendOtpOpen]=useState(false);
  const [resendError,setResendError]=React.useState<any>('');
  const [openEmail,setOpenEmail]=useState<boolean>(false);
  const [verifyOtpError,setVerifyOtpError]=React.useState<any>('');
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [time,setTime]=useState<number>(30);
  const [error,setError]=React.useState("");

 useLayoutEffect(()=>{
  if(user){
    redirect("/")
  }
 },[]);
 

  const [email, setEmail] = useState('');

  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handleCancel = () => {
    setIsModalOpen2(false);
  };


  const loginClick=()=>{
    setFindUserError("");
    setError("");
    setResendError("");
    setVerifyOtpError("");
    if(password=="" || email?.trim()==""){
       setOpen(true)
    }else{
      const payload={
        email,password
      }
           dispatch(authLogin(payload))
    }
  };

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

  React.useEffect(()=>{
    if(userLoginLoading===false){
      if(userLoginStatus==true && userLoginSuccessMessage?.message=="User login successfully !"){
        dispatch(resetUser());
        router.push("/user-dashboard")
        // login successful
      }else if(userLoginStatus==false && userLoginErrorMessage=="User doesn't exist !"){
            setError("User doesn't exist !")
            dispatch(resetUser());
      }else if(userLoginStatus==false && userLoginErrorMessage=="Account is already deleted"){
        setError("Account is already deleted")
        dispatch(resetUser());
      }else if(userLoginStatus==false && userLoginErrorMessage=="Your account has not been activated yet. Otp code has sent to your email"){
        setIsModalOpen(true);
        startTimer(30);
        dispatch(resetUser());
      }else if(userLoginStatus==false && userLoginErrorMessage=="Invalid email or password"){
        setError("Invalid email or password")
        dispatch(resetUser());
      }else if(userLoginStatus==false && userLoginErrorMessage=="Unauthorized"){
        setError("Something went wrong. Try again !")
        dispatch(resetUser());
      }else if(userLoginStatus==false && userLoginErrorMessage=="Internal Server Error"){
        dispatch(resetUser());
        setError("Something went wrong. Try again !")
      }
    }

  },[userLoginLoading]);

  
  const resendOtpClick=()=>{
    setFindUserError("");
    setOtp('')
    setResendError('');
    setVerifyOtpError('');
    dispatch(resendOtp(email))
  };

  React.useEffect(()=>{
    if(resendOtpLoading===false){
      if(resendOtpStatus===true){
       setTime(30);
       startTimer(30);
       dispatch(resetUser());
       setSendOtpOpen(true);
       // success
      }else if(resendOtpStatus===false && resendOtpErrorMessage==="User doesn't exist !"){
       setResendError("User doesn't exist !")
       dispatch(resetUser());
 
      }else if(resendOtpStatus===false && resendOtpErrorMessage==="Unauthorized"){
        setResendError("Failed to send OTP. Try again !");
        dispatch(resetUser());
      }else if(resendOtpStatus===false && resendOtpErrorMessage=="Internal Server Error"){
       setResendError("Failed to send OTP. Try again !");
       dispatch(resetUser());
      }
    }
   },[resendOtpLoading]);

   React.useEffect(()=>{
    setFindUserError("");
    if(otp?.length===4){
      setVerifyOtpError('');
      setResendError('');
      const payload={
        "otpCode":otp,
        "email":email,
      }
      dispatch(verifyOtp(payload))
    }
  },[otp]);


  React.useEffect(()=>{
    if(verifyOtpLoading===false){
      if(verifyOtpStatus===true){
            setResendError('')
            setError('');
            setIsModalOpen(false);
            setTime(0);
            setIsModalOpen2(true);
            dispatch(resetUser());
            setEmail('');
            setPassword('');
            

        // success
      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="User doesn't exist !"){
          setVerifyOtpError("User doesn't exist !");
          dispatch(resetUser());

      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Invalid OTP"){
        setVerifyOtpError("Invalid OTP !")
        dispatch(resetUser());
      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Otp code is expired !"){
        setVerifyOtpError("Otp code is expired. Please click resend button below !")
        dispatch(resetUser());
      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Invalid Otp code !"){
        setVerifyOtpError("Invalid Otp code !")
        dispatch(resetUser());
      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Otp code is expired !"){
        setVerifyOtpError("Otp code is expired !")
        dispatch(resetUser());
      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Internal Server Error"){
        setVerifyOtpError("Something went wrong. try again !");
        dispatch(resetUser());

      }else if(verifyOtpStatus===false && verifyOtpErrorMessage==="Unauthorized"){
        setVerifyOtpError("Something went wrong. try again !");
        dispatch(resetUser());

      }
      
    }

  },[verifyOtpLoading]);

  const forgotPasswordClick=()=>{
    setFindUserError("");
    setError("");
    setResendError("");
    setVerifyOtpError("");
    if(email?.trim()===""){
        setOpenEmail(true);
    }else{
      dispatch(findUserByEmail(email));
      
    }
  };

  React.useEffect(()=>{

    if(findUserByEmailLoading===false){
       if(findUserByEmailStatus===true){
          setFindUserError("");
          dispatch(resetUser());
          setError("");
          // dispatch(resendOtp(email));
          router.push(`/forgot-password/${email}`)
       }else if(findUserByEmailStatus===false && findUserByEmailErrorMessage==="User doesn't exist !"){
        setFindUserError("*User doesn't exist !");
        dispatch(resetUser())
       }else if(findUserByEmailStatus===false && findUserByEmailErrorMessage==="Unauthorized"){
        setFindUserError("*Something went wrong. Try again !");
        dispatch(resetUser())
       }else if(findUserByEmailStatus===false && findUserByEmailErrorMessage==="Internal Server Error"){
        setFindUserError("*Something went wrong. Try again !");
        dispatch(resetUser())
       }
    }

  },[findUserByEmailLoading]);



  return (
    <>
    <div className="login-page">
      <div className="login-box">
        <div className="login-box-input">

        {findUserError && findUserError!="" && <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-start"}}>
             <p style={{
              fontSize:"1rem",
              color:"red",
              fontWeight:"bold",
              fontFamily: "'Roboto', sans-serif",
              marginBottom:"1rem",
             }}>{findUserError}</p>
          </div>}

          {error && error!="" && <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-start"}}>
             <p style={{
              fontSize:"1rem",
              color:"red",
              fontWeight:"bold",
              fontFamily: "'Roboto', sans-serif",
              marginBottom:"1rem",
             }}>*{error}</p>
          </div>}

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
              Login to Your Account
            </span>
          </div>
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
            <button onClick={loginClick} className="login-button">Login</button>
          </div>

          <div
            style={{
              marginTop: "0.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <p
            onClick={forgotPasswordClick}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.8rem",
                color: "#122eff",
                  textDecoration: "underline",
                  cursor: "pointer",
              }}
            >
              Forgot password
           
            </p>
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
              Don't have an account? &nbsp;
              <Link href="/signup"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#122eff",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>


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

{resendError && resendError!="" && <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: "1rem",
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
        </div>}

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
            Your account has not been activated. OTP code sent to <span  style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#0520f0",
              textDecoration:"underline",
              textAlign: "center",
            }}>{email}</span>
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
          <div style={{ width: "fit-content", }}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              inputType="tel"
              numInputs={4}
              renderSeparator={<span>&nbsp;-&nbsp;</span>}
              renderInput={(props) => <input id="otp-input-box" {...props} />}
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
              {time>0 &&<span style={{fontFamily: "'Roboto', sans-serif",}}>Didn't receive OTP in {time} s</span>}
              &nbsp;
              {time<=0 && <span >
                <span style={{fontFamily: "'Roboto', sans-serif",color:"black",textDecoration:"none"}}>Didn't receive OTP </span><span style={{fontFamily: "'Roboto', sans-serif",color:"blue",textDecoration:'underline',cursor:"pointer"}}
                 onClick={resendOtpClick}
                > Resend</span></span>}
            </div>
          </div>
        </div>
      </Modal>


      <Modal
        footer={null}
        closeIcon={true}
        open={isModalOpen2}
        onCancel={handleCancel}
        // open={true}
        
        >
          <div style={{width:"100%"}}>
              
<div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Image src={successImage} alt="success" width={100} height={100} />
</div>

          <div style={{width:"100%",display:"flex",justifyContent:"center",marginTop:"1rem"}}>
              <p style={{fontSize:"1.5rem",color:"#05ab0b",
            fontFamily: "'Roboto', sans-serif",textAlign:"center"}}>Your account has been activated successfully !</p>

          </div>



          </div>

        </Modal>


        <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={userLoginLoading}
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

      <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={findUserByEmailLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>


    {open && (
        <SnackBar
          severity="warning"
          message="All fields are required!"
          open={open}
          setOpen={setOpen}
        />
      )}

{openEmail && (
        <SnackBar
          severity="warning"
          message="Please enter your email"
          open={openEmail}
          setOpen={setOpenEmail}
        />
      )}


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
}
