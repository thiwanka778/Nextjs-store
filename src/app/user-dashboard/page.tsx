'use client';
import React ,{useState} from 'react';
import "./UserDashboard.css";
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Button, Drawer, Radio, Space } from 'antd';
import { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
const {user}=useSelector((state:any)=>state.user);

  useLayoutEffect(()=>{
    if(!user){
      redirect("/")
    }
   },[user]);
  
  return (
    <>
  <div className='user-dashboard'>
      
  </div>

    </>
   
  )
}

export default UserDashboard;