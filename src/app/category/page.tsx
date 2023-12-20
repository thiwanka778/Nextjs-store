'use client';
import React ,{useState} from 'react';
import "./Category.css";
import { redirect } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { AutoComplete } from 'antd';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, getAllCategory, resetCategory } from '@/redux/features/categorySlice';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


interface MainCategory {
  mainCategoryId: number|string;
  mainCategoryName: string;
  mainCategoryDescription: string;
  subCategoryList: any[];
}

const Category = () => {
  const dispatch=useDispatch();
 
  const {
    categoryLoading,
    categoryStatus,
    mainCategoryErrorMessage,
    subCategoryErrorMessage,
    categoryList,
  } =useSelector((state:any)=>state.category);
  const {user}=useSelector((state:any)=>state.user);
  const [mainCategory, setMainCategory] = useState('');
  const [categoryError,setCategoryError]=useState("");
  const [mainCategoryList,setMainCategoryList]=useState<MainCategory[]>([]);

  React.useLayoutEffect(() => {
    if (!user) {
      redirect("/");
    }else{
      dispatch(getAllCategory())
    }
  }, [user]);

  const handleMainCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedCategories = [...mainCategoryList]; // Create a copy of the state array
    updatedCategories[index] = {
      ...updatedCategories[index], // Keep other properties unchanged
      mainCategoryName: event.target.value, // Update the mainCategoryName
    };
    setMainCategoryList(updatedCategories); // Update state with the new array
  };

  React.useEffect(()=>{
   if(categoryList && Array.isArray(categoryList)){
     setMainCategoryList(categoryList)
     
   }
  },[categoryList])

  const handleMainCategoryChange = (event:any) => {
    setMainCategory(event.target.value);
    // You can perform any other operations related to the change here
  };

const createMainCategoryClick=()=>{
  setCategoryError("")
  const payload=[{
    "name": mainCategory?.trim(),
        "description": ""
  }];
  if(mainCategory && mainCategory?.trim()!=""){
    dispatch(createCategory(payload))//
  }
  
};




React.useEffect(()=>{

  if(categoryLoading===false){
     if(categoryStatus===true){
      setCategoryError("");
      dispatch(resetCategory());
      dispatch(getAllCategory())
      // success
     }else if(categoryStatus===false && mainCategoryErrorMessage=="Main category already exist in main or sub !"){
           setCategoryError("*Main category already exist in main or sub category !");
           dispatch(resetCategory())
     }else if(categoryStatus===false && mainCategoryErrorMessage=="Unauthorized"){
      setCategoryError("*Your session is expired. please login again");
      dispatch(resetCategory())
     } else if(categoryStatus===false && mainCategoryErrorMessage=="Internal Server Error"){
      setCategoryError("*Something went wrong. try again !");
      dispatch(resetCategory())
     } 
  }

},[categoryLoading]);

const mainCategoryDisplay=mainCategoryList?.map((item:any,index:number)=>{
  return (
    <div key={item?.mainCategoryId}
     style={{display:"flex",alignItems:"center",background:"#5080fa",height:"3rem",marginBottom:'0.5rem',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    width:"100%",padding:"0.5rem",borderRadius:"10px",}}>
      <input 
      onChange={(event) => handleMainCategoryNameChange(event, index)}
      type="text" value={item?.mainCategoryName} 
       style={{outline:"none",border:"none",background:"transparent",width:"100%",
       fontSize:"1.2rem",color:"white",
       fontFamily: "'Ubuntu', sans-serif"}} />

<Tooltip title="Update" placement='top'>
  <IconButton>
    <UpdateIcon sx={{color:"white"}} />
  </IconButton>
</Tooltip>


    </div>
  )
})

console.log(categoryError,mainCategoryList);


  return (
    <>
    <div className='category'> 


    <div className='category-main-box'>

      <section className='category-main-box-a'>

      {categoryError && <p style={{fontWeight:"bold",marginBottom:"0.5rem",
       fontFamily: "'Roboto', sans-serif",
       color:"#f70217"}}>
        {categoryError}</p>}

      <p style={{marginBottom:"0.5rem",fontFamily: "'Roboto', sans-serif",fontSize:'1.2rem'
        ,fontWeight:"bold",}}>Enter Main Category</p>
        <input
       className="input-box"
       placeholder="Main Category"
       type="text"
       style={{ marginBottom: "0.5rem" }}
       value={mainCategory}
       onChange={handleMainCategoryChange}
          />

          <button className='create-category-btn' 
          style={{cursor:mainCategory?.trim()===""?"not-allowed":'pointer',marginBottom:"1rem",
          background:mainCategory?.trim()===""?"#ababb0":"#14ba02"}}
          disabled={mainCategory?.trim()===""?true:false}
          onClick={createMainCategoryClick}>CREATE</button>

          {mainCategoryDisplay}

      </section>

      <section className='category-main-box-b'>


      <p style={{marginBottom:"0.5rem",fontFamily: "'Roboto', sans-serif",fontSize:'1.2rem'
        ,fontWeight:"bold",}}>Select Main Category</p>

      

      <p style={{marginBottom:"0.5rem",fontFamily: "'Roboto', sans-serif",fontSize:'1.2rem'
        ,fontWeight:"bold",}}>Enter Sub Category</p>
        <input
        className="input-box"
         placeholder="Main Category"
         type="text"
         style={{ marginBottom: "0.5rem" }}
          />

          <button className='create-category-btn'>CREATE</button>

      </section>

     

    </div>
    



    </div>

    <Backdrop
        sx={{ color: "#ffd700", zIndex: "9999999999999" }}
        open={categoryLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>

    </>
  )
}

export default Category;