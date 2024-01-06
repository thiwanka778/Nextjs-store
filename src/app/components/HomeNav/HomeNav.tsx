"use client";
import React, {useState} from "react";
import "./HomeNav.css";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeleteIcon from '@mui/icons-material/Delete';
import LoginIcon from "@mui/icons-material/Login";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, userLogout } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import { deleteCartItems, getAllCartItems, resetCart } from "@/redux/features/cartSlice";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const HomeNav = () => {
  const dispatch = useDispatch();
  const { cartLoading, createCartStatus, cartList, createCartErrorMessage,
    deleteCartErrorMessage,
   deleteCartStatus, } =
    useSelector((state: any) => state.cart);
    const [cartListArray,setCartListArray] = useState<any>([]);
    const [rememberStoreId, setRememberStoreId] = useState<any | null | number | string>(() => {
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('openStore');
        return localData ? JSON.parse(localData) : '';
      }
      return ''; // Default value if executed on the server
    });
  const router = useRouter();
  // console.log(router);

  const { user } = useSelector((state: any) => state.user);

  

  const logoutClick = () => {
    dispatch(logoutUser(user?.id));
    dispatch(userLogout());
  };

  const goToLogin = () => {
    router.push("/login");
  };

  React.useEffect(() => {
    dispatch(getAllCartItems());
  }, [user]);

  function calculateTotalCost(products:any) {
    if (!Array.isArray(products)) {
        return 0; // Return 0 if products is not an array
    }

    const totalCost:number = products.reduce((total:any, product:any) => {
        if (typeof product === 'object' && 'price' in product && 'quantity' in product) {
            return total + (product.price * product.quantity);
        } else {
            return total;
        }
    }, 0);

    return totalCost;
}

  const groupCartListByStoreId = (cartObjectList: any) => {
    const groupedItems: any = {};
    cartObjectList.forEach((item: any) => {
      const { store } = item;
      const { id: storeId, name: storeName, storeImageUrl } = store;

      if (!groupedItems[storeId]) {
        groupedItems[storeId] = {
          id: storeId,
          storeName,
          storeImageUrl,
          isRotated:rememberStoreId?(storeId==rememberStoreId)?true:false:false,
          list: [],
        };
      }
      // Push the current item to the list of items for its store ID
      groupedItems[storeId].list.push(item);
    });

    // Convert the groupedItems object to an array of values
    const outputArray: any = Object.values(groupedItems);

    const finalOutPutArray:any= outputArray?.map((item:any)=>{
      const totalCost = calculateTotalCost(item?.list);
       return {
        ...item,totalCost,
       }
    })

    return finalOutPutArray;
  };

  React.useEffect(()=>{
     if(cartList && Array.isArray(cartList) && cartList?.length>=1){
         
      const outputArray = groupCartListByStoreId(cartList);
      console.log("OUT PUT ARRAY : ",outputArray);
      
       setCartListArray(outputArray);

     }else{
      setCartListArray([]);
      setRememberStoreId("");
      if (typeof window !== 'undefined') {
        // Access localStorage here
        localStorage.removeItem("openStore");
      }
      console.log("CART LIST IS EMPTY !")
     }
  },[cartList])

  console.log("cartList", cartList);

  const handleArrowClick = (index: number) => {
    const updatedCartListArray = cartListArray.map((item:any, i:number) => {
      if (i === index) {
          setRememberStoreId(item?.id);
        return { ...item, isRotated: !item?.isRotated };
      }
      return { ...item, };
    });
  
    setCartListArray(updatedCartListArray);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openStore', JSON.stringify(rememberStoreId));
    }
  }, [rememberStoreId]);



  const deleteCartClick=(id:any)=>{
        if(id){
           dispatch(deleteCartItems(id));
        }
  }

  React.useEffect(()=>{
     if(cartLoading===false){
        if(deleteCartStatus===true){
              dispatch(resetCart());
              dispatch(getAllCartItems());
        }else if(deleteCartStatus===false && deleteCartErrorMessage!=""){
          dispatch(resetCart());
        }
     }
  },[cartLoading])

  

  return (
    <div className="home-nav">
      <span style={{ marginRight: "auto" }}>Home</span>

      <Link
        href="/"
        className="nav-title"
        style={{ marginRight: "0.5rem", color: "black" }}
      >
        Home<span className="under-line"></span>
      </Link>

      {user && (
        <Link
          href="/user-dashboard"
          className="nav-title"
          style={{ marginRight: "0.5rem" }}
        >
          Dashboard<span className="under-line"></span>
        </Link>
      )}

      {!user && (
        <span
          className="nav-title"
          style={{ marginRight: "0.5rem" }}
          onClick={goToLogin}
        >
          Login<span className="under-line"></span>
        </span>
      )}

      {user && (
        <span className="cart-icon" style={{ marginRight: "0.5rem" }}>
          <Badge badgeContent={cartList?.length} color="primary">
            <ShoppingCartIcon sx={{ cursor: "pointer" }} color="action" />
          </Badge>

          <div className="cart-icon-card">

            <p style={{textAlign:'center',padding:'0.5rem',fontWeight:'bold',
            fontFamily: "'Ubuntu', sans-serif"}}>
              Your Cart</p>

           

                {
                  cartListArray?.map((item:any,index:number)=>{
                    return (
           <div>           
             <div className="cart-items-big-box" key={index}
                style={{margin:'0.5rem',padding:'0.5rem',position:'relative',
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                borderRadius:'8px',display:'flex',alignItems:'center', }}>
                
                <img src={item?.storeImageUrl}
                style={{width:'100px',height:'100px',borderRadius:'8px',marginRight:'0.5rem',flex:3}}/>

                <section style={{overflowX:'auto',flex:3,}}>
                   <p style={{fontFamily: "'Roboto', sans-serif",}}>{item?.storeName}</p>
                   <p style={{fontFamily: "'Roboto', sans-serif",color:'#7c818a',}} >{item?.list?.length} items</p>
                   <p style={{fontFamily: "'Roboto', sans-serif",color:'#0b59d6',
                   fontSize:'0.9rem',fontWeight:'bold',textDecoration:'underline',cursor:'pointer',}} ><i>Checkout</i></p>
                </section>

                <section style={{flex:1,alignItems:'center',justifyContent:'center',}} className="left-arrow-wrap">
                  <KeyboardArrowRightIcon
                     onClick={() => handleArrowClick(index)}
                     className={item.isRotated ? 'rotated' : 'default'}
                   sx={{cursor:'pointer'}}/>
                </section>

               
             </div>
{/* 
             <div style={{ width: "100px",height:"300px",background:'blue',}}>
                  dfgdghdsg
                </div> */}

                <div className="cart-items-little-box" style={{display:item?.isRotated?'':'none'}}>



                {item?.list?.map((product:any,index:number)=>{

                //   const totalCost = item?.list?.reduce((total:any, p:any) => {
                //     return total + (p.price * p.quantity);
                // }, 0);

                  return (
                    <div style={{marginTop:'1rem'}} key={index} >

                        <div style={{display:'flex',alignItems:'center',background:'transparent',
                         justifyContent:'space-between'}}>

                      <p onClick={()=>router.push(`/products/${product?.product?.id}`)} 
                        style={{fontFamily: "'Ubuntu', sans-serif",fontSize:'1rem',cursor:'pointer',
                         fontWeight:'bold',color:'#0a0587',}}>
                       <i>{product?.name}</i>
                       </p>

                       <DeleteIcon sx={{color:'red',cursor:'pointer',}} onClick={()=>deleteCartClick(product?.id)} />


                    </div>
                     
   
                     <div style={{background:'#82818a',height:'2px',marginTop:'0.2rem',marginBottom:'0.2rem'}}></div>
   
                     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',}}>
                       <span style={{fontFamily: "'Roboto', sans-serif",fontSize:'0.9rem',fontWeight:'bold'}}>Price</span>
                       <span style={{fontFamily: "'Roboto', sans-serif",fontSize:'0.9rem',fontWeight:'bold',color:'#636175'}}>Rs. {product?.price}</span>
                     </div>
   
                     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',}}>
                       <span style={{fontFamily: "'Roboto', sans-serif",fontSize:'0.9rem',fontWeight:'bold'}}>Quantity</span>
                       <span style={{fontFamily: "'Roboto', sans-serif",
                       fontSize:'0.9rem',fontWeight:'bold',color:'#636175'}}>{product?.quantity}</span>
                     </div>
   
   
                     <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',}}>
                       <span style={{fontFamily: "'Roboto', sans-serif",fontSize:'0.9rem',fontWeight:'bold'}}>Sub Total</span>
                       <span style={{fontFamily: "'Roboto', sans-serif",
                       fontSize:'0.9rem',fontWeight:'bold',color:'#636175'}}>Rs. {(Number(product?.price) * Number(product?.quantity))?.toFixed(2)}</span>
                     </div>

                   </div>
                  )
                })}

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',}}>
                       <span style={{fontFamily: "'Roboto', sans-serif",fontSize:'1rem',
                       fontWeight:'bold',color:'#fc0303'}}>Total</span>
                       <span style={{fontFamily: "'Roboto', sans-serif",
                       fontSize:'1rem',fontWeight:'bold',color:'#fc0303'}}>Rs. {item?.totalCost?.toFixed(2)}</span>
                     </div>






                



                </div>



             </div>
                    )
                  })
                }





          </div>
        </span>
      )}

      {user && (
        <span>
          <Tooltip title="Logout">
            <IconButton>
              <PowerSettingsNewIcon
                sx={{ cursor: "pointer" }}
                onClick={logoutClick}
              />
            </IconButton>
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default HomeNav;
