'use client';
import React from 'react';
import "./PasswordInput.css";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';



const PasswordInput = (props:any) => {
    const [showPassword,setShowPassword]=React.useState<boolean>(false);

    const showPasswordClick=()=>{
         setShowPassword(!showPassword);
    }

   const handleChangePassword=(e:any)=>{
         props.setPassword(e.target.value)
   }
  return (
    <div className='password-input'>
        <input 
        id="password"
        value={props.password}
        onChange={handleChangePassword}
        className='password-input-box' 
        placeholder={props.placeholder} 
        type={showPassword?"text":"password"}/>
        {!showPassword && <VisibilityOffIcon onClick={showPasswordClick} style={{marginRight:"1rem",color:"#a2a2a8",cursor:"pointer"}}/>}
        {showPassword && <VisibilityIcon onClick={showPasswordClick} style={{marginRight:"1rem",color:"#a2a2a8",cursor:"pointer"}}/>}
    </div>
  )
}

export default PasswordInput