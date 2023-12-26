'use client';
import React from 'react';
import './Product.css';
import moment from 'moment';
import { Rate } from "antd";
import { useRouter } from "next/navigation";





const Product = ({item}:any) => {
  const router = useRouter();

const userFriendlyDate:any|string|null = moment(item?.createdDate).fromNow();

  return (
    <div className='product-card'  >

        <img    onClick={()=>router.push(`/products/${item?.id}`)}  
        className='product-image-style' src={item?.productImageList[0]?.productImageUrl} 
        />

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