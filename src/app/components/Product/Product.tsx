import React from 'react';
import './Product.css';
import moment from 'moment';
import { Rate } from "antd";

const Product = ({item}:any) => {
   

const userFriendlyDate:any|string|null = moment(item?.createdDate).fromNow();

  return (
    <div className='product-card'>
        <img src={item?.productImageList[0]?.productImageUrl} 
        style={{width:'100%',borderRadius:'10px',height:300}}/>

        <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              <p style={{fontFamily: "'Roboto', sans-serif",
              fontSize:'0.9rem',color:'#92929c'}}>{userFriendlyDate}</p>
        </div>

        <p style={{fontSize:'1.2rem',fontWeight:'bold'}}>{item?.name}</p>

        <p style={{fontSize:'1rem',color:'#9796a3'}}>
            {item?.description}
            </p>

            <p style={{fontSize:'1.2rem',color:'#f50008',fontWeight:'bold',}}>
                LKR {item?.price}
            </p>
            <Rate style={{ fontSize: "15px" }} value={1} />

        </div>
  )
}

export default Product