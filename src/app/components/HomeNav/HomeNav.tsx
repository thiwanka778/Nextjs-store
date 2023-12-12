"use client";
import React from "react";
import "./HomeNav.css";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LoginIcon from '@mui/icons-material/Login';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, userLogout } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";

import Link from "next/link";



const HomeNav = () => {

  const router=useRouter();
  console.log(router);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const logoutClick = () => {
    dispatch(logoutUser(user?.id));
    dispatch(userLogout());
  };

  const goToLogin=()=>{
       router.push("/login")
  }

  return (
    <div className="home-nav">
      <span style={{ marginRight: "auto" }}>Home Nav</span>

     
    <Link href="/" className="nav-title" 
      style={{marginRight:"1rem",color:"black"}}>Home<span className="under-line">
        </span>
        </Link>
       
   

    

    {user &&   <Link href="/user-dashboard" className="nav-title" 
      style={{marginRight:"1rem"}}>Dashboard<span className="under-line">
        </span></Link>}

        {!user &&   <span className="nav-title" 
      style={{marginRight:"1rem"}} onClick={goToLogin}>Login<span className="under-line">
        </span></span>}

    

      {user &&<span>
        <Tooltip title="Logout">
          <IconButton>
            <PowerSettingsNewIcon onClick={logoutClick} />
          </IconButton>
        </Tooltip>
      </span>}

     
    </div>
  );
};

export default HomeNav;
