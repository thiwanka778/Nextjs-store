import React from 'react';
import "./CusButton.css";

const CusButton = ({name}:any) => {
  return (
    <button className='cus-button'>{name}</button>
  )
}

export default CusButton