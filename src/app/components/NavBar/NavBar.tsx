'use client';
import React , {useState} from 'react';
import "./NavBar.css";
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Button, Drawer, Radio, Space } from 'antd';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import SideBar from '../SideBar/SideBar';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const showDrawer = () => {
      setDrawerOpen(true);
    };
  
    const onClose = () => {
      setDrawerOpen(false);
    };
  return (
    <>
    <div className='nav-bar'>
        <MenuIcon style={{cursor:"pointer"}} onClick={showDrawer}/>
        </div>



    
    <Drawer
 
      width={280}
      zIndex={9999999999}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={drawerOpen}
        key={'left'}
       
      >
        <div style={{width:"100%",background:"#030142",minHeight:"100vh",}}>
          <div style={{width:"100%",padding:"1rem",display:"flex",alignItems:"center",
          justifyContent:"center"}}>
            <InventoryIcon sx={{color:"white",fontSize:30,marginRight:"1rem"}}/>
            <p style={{color:"white",fontSize:"1.5rem",
            textAlign:"center",fontFamily: "'Ubuntu', sans-serif"}}>Next Store</p>
          </div>
        <SideBar/>
        </div>
       

    
      </Drawer>
    </>
  )
}

export default NavBar