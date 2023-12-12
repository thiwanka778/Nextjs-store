'use client';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  interface propsType{
    severity:string,
    message:string,
    open:boolean,
    setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  }

const SnackBar = ({severity,message,open,setOpen}:propsType) => {
    

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    

      if(severity==='warning'){
        return (
            <Snackbar 
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                  {message}
                </Alert>
              </Snackbar>
        )
      }else if(severity==='info'){
        return (
          <Snackbar 
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
        )
      }else if(severity==='success'){
        return (
          <Snackbar 
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
        )
      }

}

export default SnackBar
