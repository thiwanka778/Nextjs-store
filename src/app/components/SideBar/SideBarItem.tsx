'use client';
import React, { useState } from "react";
import "./SideBar.css";
import ArticleIcon from "@mui/icons-material/Article";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import sideBarData from "./sideBarData";
import  Link  from "next/link";
import { usePathname } from "next/navigation";



const SideBarItem = ({ title, path, children, icon }: any) => {
const pathname=usePathname();
console.log(pathname,"path name")

  const [open, setOpen] = useState(false);


 

  if (children && children?.length > 0) {
    return (
      <div className={open ? "side-bar-item open" : "side-bar-item"} >
        <div className="side-bar-title">
          {icon}
          <span
            style={{
              marginRight: "auto",
              marginLeft: "1rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {title}
          </span>
          <KeyboardArrowDownIcon
            sx={{ fontSize: 25 }}
            className="toggle-btn"
            onClick={() => setOpen(!open)}
          />
        </div>



        <div className="side-bar-content" style={{transition:'linear 0.6s'}}>
          {children?.map((item: any, index: number) => {
            return <SideBarItem key={index + 1} {...item} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <Link href={path} className={pathname==path?"linkStyle":'side-bar-title'}
       style={{cursor:"pointer",marginBottom:"0.2rem"}}>
          {icon}
          <span
            style={{
              marginRight: "auto",
              marginLeft: "1rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {title}
          </span>
       
      </Link>
    );
  }
};

export default SideBarItem;
