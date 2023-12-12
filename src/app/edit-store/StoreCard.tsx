'use client';
import React from 'react';
import moment from 'moment';
import "./EditStore.css";
import CallIcon from "@mui/icons-material/Call";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const StoreCard = ({name, description, city, address, contact, storeImageUrl, deleted,id,createdAt,updateClick}:any) => {

  // const createdAt = "2023-12-06T22:48:20.150971";
const formattedTime = moment(createdAt).fromNow();
const createdDate=moment(createdAt).format('MMMM Do YYYY');
const data:any={
  name,
   description, 
   city,
   address,
    contact,
     storeImageUrl,
      deleted,
      id,
      createdAt
}

  return (
         <div className='store-card'>
            <img src={storeImageUrl}
            style={{width:"100%",objectFit:"cover",borderRadius:"10px",}}/>

        <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-end",overflowX:"auto",marginBottom:"0rem"}}>
              <p 
              style={{textAlign:"center",fontSize:"1rem",
              fontFamily: "'Ubuntu', sans-serif"}}>{formattedTime}</p>
            </div>

            <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",overflowX:"auto",marginBottom:"1rem"}}>
              <p 
              style={{textAlign:"center",fontSize:"1.5rem",fontWeight:"bold",
              fontFamily: "'Ubuntu', sans-serif"}}>{name}</p>
            </div>

            <div style={{width:"100%",display:"flex",overflowX:"auto",marginTop:"0.5rem"}}>
            <CalendarMonthIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
              <p 
              style={{textAlign:"center",fontSize:"1.2rem",color:"black",
              fontFamily: "'Roboto', sans-serif"}}>{createdDate}</p>
            </div>

            <div style={{width:"100%",display:"flex",overflowX:"auto",alignItems:"center",marginTop:"0.5rem"}}>
             <CallIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
              <p 
              style={{textAlign:"center",fontSize:"1.2rem",
              fontFamily: "'Roboto', sans-serif"}}>{contact}</p>
            </div>

            <div style={{width:"100%",display:"flex",overflowX:"auto",alignItems:"center",marginTop:"0.5rem"}}>
            <LocationCityIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
              <p 
              style={{textAlign:"center",fontSize:"1.2rem",color:"#255cf5",
              fontFamily: "'Roboto', sans-serif"}}>{city}</p>
            </div>


            <div style={{width:"100%",display:"flex",marginTop:"0.5rem"}}>
            <LocationOnIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#f71307",
                      }}
                    />
              <p 
              style={{fontSize:"1.2rem",color:"#255cf5",
              fontFamily: "'Roboto', sans-serif"}}>{address}</p>
            </div>


            <div style={{width:"100%",display:"flex",marginTop:"0.5rem",overflowX:"auto"}}>
            <DescriptionIcon
                      sx={{
                        fontSize: 20,
                        marginRight: "0.5rem",
                        color: "#494a4d",
                      }}
                    />
              <p 
              style={{fontSize:"1.2rem",color:"#a0a2a8",
              fontFamily: "'Roboto', sans-serif"}}>{description}</p>
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",width:"100%",marginTop:"auto",}}>
              <span>
              <EditIcon sx={{color:"#04b020",marginRight:"0.5rem",cursor:"pointer",fontSize:25}} 
              onClick={()=>updateClick(data)}/>
              <DeleteForeverIcon sx={{color:"#f20505",cursor:"pointer",fontSize:25}}/>
              </span>
            </div>


          




        </div>
  )
}

export default StoreCard