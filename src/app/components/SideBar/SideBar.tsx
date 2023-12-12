'use client';
import React from 'react';
import "./SideBar.css";
import Link from 'next/link';
import SideBarItem from './SideBarItem';
import sideBarData from './sideBarData';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useDispatch,useSelector } from 'react-redux';
import { logoutUser, userLogout } from '@/redux/features/userSlice';

const SideBar = () => {
    const dispatch=useDispatch();
    const {user}=useSelector((state:any)=>state.user);

    const logoutClick = () => {
        dispatch(logoutUser(user?.id));
        dispatch(userLogout());
      };
    const path="/";
  return (
    <div className='side-bar'>
       {
        sideBarData?.map((item:any,index:number)=>{
             return (
                <SideBarItem key={index+1} {...item}/>
             )
        })
       }
       <Link href={path} className={'side-bar-title'} onClick={logoutClick}
       style={{cursor:"pointer",marginBottom:"0.2rem"}}>
         <PowerSettingsNewIcon/>
          <span
            style={{
              marginRight: "auto",
              marginLeft: "1rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Logout
          </span>
       
      </Link>
        </div>
  )
}

export default SideBar