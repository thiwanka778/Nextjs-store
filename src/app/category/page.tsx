'use client';
import React ,{useState} from 'react';
import "./Category.css";
import { redirect } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, getAllCategory, resetCategory,createSubCategory, updateMainCategory, updateSubCategory } from '@/redux/features/categorySlice';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


interface MainCategory {
  mainCategoryId: number|string;
  mainCategoryName: string;
  mainCategoryDescription: string|any|null;
  subCategoryList: any[];
}
interface SubCategory{
  id:number|string;
  name:string;
  description:string|any|null;
}

const Category = () => {
  const dispatch=useDispatch();
 
  const {
    categoryLoading,
    categoryStatus,
    mainCategoryErrorMessage,
    subCategoryErrorMessage,
    categoryList,
    updateMainCategoryErrorMessage,
      updateSubCategoryErrorMessage,
  } =useSelector((state:any)=>state.category);
  const {user}=useSelector((state:any)=>state.user);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategoryList,setSubCategoryList]=useState<SubCategory[]>([]);
  const [subCategory, setSubCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<any|null|string>(null);
  const [categoryError,setCategoryError]=useState("");
  const [subCategoryError,setSubCategoryError]=useState("");
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

const createSubCategoryClick=()=>{
  setSubCategoryError("")
   if(selectedMainCategory){
      if(subCategory && subCategory?.trim()!=""){
        
            
             const id:any=selectedMainCategory;
              const name:any=subCategory?.trim();
              const description:any="";
              
          dispatch(createSubCategory({id,name,description}))
        
      }
   }
}




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

const updateMainCategoryClick=(item:any)=>{
  setCategoryError("");
    // console.log(item);
    if(item?.mainCategoryName?.trim()!=""){
      const id=item?.mainCategoryId;
      const name=item?.mainCategoryName?.trim();
      const description="";
       dispatch(updateMainCategory({id,name,description}))
    }
}



React.useEffect(()=>{
  if(categoryLoading===false){
     if(categoryStatus===true){
      dispatch(resetCategory());
      setCategoryError("");
      dispatch(getAllCategory());
      // success
     }else if(categoryStatus===false && updateMainCategoryErrorMessage==="The provided main category name matches an existing subcategory name. Please use a different name for the main category."){
      dispatch(resetCategory());
      setCategoryError("*The provided main category name matches an existing subcategory name. Please use a different name for the main category.")
     }else if(categoryStatus===false && updateMainCategoryErrorMessage==="Duplicate category found! Cannot update."){
      dispatch(resetCategory());
      setCategoryError("*Main category already exist !")
     }else if(categoryStatus===false && updateMainCategoryErrorMessage==="Unauthorized"){
      dispatch(resetCategory());
      setCategoryError("*Your session is expired. please login again")
     }else if(categoryStatus===false && updateMainCategoryErrorMessage==="Internal Server Error"){
      dispatch(resetCategory());
      setCategoryError("*Something went wrong. Please try again !")
     }
  }
},[categoryLoading])

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

<Tooltip title="Update" placement='left' onClick={()=>updateMainCategoryClick(item)}>
  <IconButton>
    <UpdateIcon sx={{color:"white"}} />
  </IconButton>
</Tooltip>


    </div>
  )
})

// console.log(categoryError,selectedMainCategory);


const handleCategoryChange = (event:any, newValue:any) => {
  setSelectedMainCategory(newValue?.mainCategoryId);
  // You can perform additional actions here with the selected category
  // For example, console.log(newValue) to see the selected category object
};

const handleSubCategoryChange = (event:any) => {
  setSubCategory(event.target.value);
  // You can perform additional actions here with the entered sub-category
  // For example, console.log(event.target.value) to see the entered value
};

React.useEffect(()=>{
   if(categoryLoading===false){
     if(categoryStatus===true){
      dispatch(resetCategory());
      setSubCategoryError("");
      dispatch(getAllCategory());

     }else if(categoryStatus===false && subCategoryErrorMessage==="Sub category already exist in main or sub !"){
      dispatch(resetCategory())
      setSubCategoryError("*Sub category already exist in main or sub category !")
     }else if(categoryStatus===false && subCategoryErrorMessage==="Unauthorized"){
      dispatch(resetCategory())
      setSubCategoryError("*Your session is expired. please login again")
     }else if(categoryStatus===false && subCategoryErrorMessage==="Internal Server Error"){
      dispatch(resetCategory())
      setSubCategoryError("*Something went wrong. try again")
     }
   }
},[categoryLoading])


     React.useEffect(()=>{
      if(selectedMainCategory){
         const findSub=mainCategoryList?.find((item:any)=>item?.mainCategoryId==selectedMainCategory);
        //  console.log(findSub)
         if(findSub){
          setSubCategoryList(findSub?.subCategoryList)
         }else{
          setSubCategoryList([])
         }

      }else{
        // null
        setSubCategoryList([])
      }

     },[selectedMainCategory,categoryList]);

     console.log(subCategoryList)

     const updateSubCategoryClick=(item:any)=>{
      setSubCategoryError("");
      const id=item?.id;
      const name=item?.name?.trim();
      const description="";
        if(name?.trim()!==""){
             dispatch(updateSubCategory({id,name,description}))
        }
     }

     React.useEffect(()=>{
      if(categoryLoading===false){
         if(categoryStatus===true){
          dispatch(resetCategory());
          setSubCategoryError("");
          dispatch(getAllCategory());
          // success
         }else if(categoryStatus===false && updateSubCategoryErrorMessage==="The provided sub category name matches an existing main category name. Please use a different name for the sub category."){
          dispatch(resetCategory());
           setSubCategoryError("*The provided sub category name matches an existing main category name. Please use a different name for the sub category.")
         }else if(categoryStatus===false && updateSubCategoryErrorMessage==="Duplicate sub category !"){
          dispatch(resetCategory());
          setSubCategoryError("*Sub category already exist !")
         }else if(categoryStatus===false && updateSubCategoryErrorMessage==="Unauthorized"){
          dispatch(resetCategory());
          setSubCategoryError("*Your session is expired. please login again")
         }else if(categoryStatus===false && updateSubCategoryErrorMessage==="Internal Server Error"){
          dispatch(resetCategory());
          setSubCategoryError("*Something went wrong. Please try again !")
         }
      }
    },[categoryLoading])

     const handleInputChangeSubCategoryList = (index:number, event:any) => {
      const updatedSubCategoryList = subCategoryList.map((item, i) => {
        if (i === index) {
          return { ...item, name: event.target.value }; // Update the name of the specific item
        }
        return item;
      });
    
      setSubCategoryList(updatedSubCategoryList); // Update the state with the modified array
    };

     const subCategoryDisplay=subCategoryList?.map((item:any,index:number)=>{
      return (
        <div key={item?.id}
         style={{display:"flex",alignItems:"center",background:"#a70ec9",height:"3rem",marginBottom:'0.5rem',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        width:"100%",padding:"0.5rem",borderRadius:"10px",}}>
          <input 
         onChange={(event) => handleInputChangeSubCategoryList(index, event)}
          type="text" value={item?.name} 
           style={{outline:"none",border:"none",background:"transparent",width:"100%",
           fontSize:"1.2rem",color:"white",
           fontFamily: "'Ubuntu', sans-serif"}} />
    
    <Tooltip title="Update" placement='left' onClick={()=>updateSubCategoryClick(item)}>
      <IconButton>
        <UpdateIcon sx={{color:"white"}} />
      </IconButton>
    </Tooltip>
    
    
        </div>
      )
    }) 

    // console.log(mainCategoryList)

  return (
    <>
    <div className='category'> 


    <div className='category-main-box'>

      <section className='category-main-box-a'>

      {categoryError && <p style={{fontWeight:"bold",marginBottom:"1rem",
       fontFamily: "'Roboto', sans-serif",
       color:"#f70217"}}>
        {categoryError}</p>}

        <TextField 
        sx={{width:"100%",marginBottom:"0.5rem"}}
         value={mainCategory}
         onChange={handleMainCategoryChange}
         label="Enter Main Category"
          variant="outlined" />
      

          <button className='create-category-btn' 
          style={{cursor:mainCategory?.trim()===""?"not-allowed":'pointer',marginBottom:"1rem",
          background:mainCategory?.trim()===""?"#ababb0":"#14ba02"}}
          disabled={mainCategory?.trim()===""?true:false}
          onClick={createMainCategoryClick}>CREATE</button>

         {mainCategoryList?.length>=1 &&  <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
            <p style={{textAlign:"center",color:"#0e63eb",fontSize:"1.2rem",
            fontFamily: "'Roboto', sans-serif",
            fontWeight:"bold"}}>Main categories you have added</p>
          </div>}

          {mainCategoryDisplay}

      </section>

      <section className='category-main-box-b'>

      {subCategoryError && <p style={{fontWeight:"bold",marginBottom:"1rem",
       fontFamily: "'Roboto', sans-serif",
       color:"#f70217"}}>
        {subCategoryError}</p>}


      <p style={{marginBottom:"1rem",fontFamily: "'Roboto', sans-serif",fontSize:'1rem',color:"#fc9c0a"
        ,fontWeight:"bold",}}>*First Select Main Category</p>

     <Autocomplete
      disablePortal
      id="combo-box-demo"
      onChange={handleCategoryChange}
      options={mainCategoryList}
      getOptionLabel={(option:any) => option?.mainCategoryName}
      sx={{ width: "100%",marginBottom:"1rem" }}
      renderInput={(params) => <TextField {...params} label="Select Main Category" />}
       />

      
        <TextField 
        value={subCategory}
        onChange={handleSubCategoryChange}
        sx={{width:"100%",marginBottom:"0.5rem"}}
         label="Enter Sub Category"
          variant="outlined" />

          <button className='create-category-btn'
          style={{cursor:(selectedMainCategory && subCategory?.trim()!="")?"pointer":"not-allowed",
          marginBottom:"1rem",
        background:(selectedMainCategory && subCategory?.trim()!="")?"#14ba02":"#a3a4a8"}}
           disabled={(selectedMainCategory && subCategory?.trim()!="")?false:true}
          onClick={createSubCategoryClick}>CREATE</button>

{selectedMainCategory && <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
            <p style={{textAlign:"center",color:"#a40ec9",fontSize:"1.2rem",
            fontFamily: "'Roboto', sans-serif",
            fontWeight:"bold"}}>Sub categories of {(mainCategoryList?.find((item:MainCategory)=>item?.mainCategoryId==selectedMainCategory))?.mainCategoryName}</p>
          </div>}

          {subCategoryDisplay}

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