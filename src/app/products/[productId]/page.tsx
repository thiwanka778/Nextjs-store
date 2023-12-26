'use client';
import React, {useState} from 'react';
import "./Product.css";
import { useDispatch,useSelector } from 'react-redux';
import { getProductById } from '@/redux/features/productSlice';


type Params = {
    params: {
        productId: string
    }
}

interface ProductType {
  id: number|any;
  name: string | any;
  description: string| any;
  price: number | any;
  quantity: number | any;
  mainCategoryId: number | any;
  subCategoryId: number | any;
  mainCategoryName: string | any;
  subCategoryName: string | any;
  storeName: string | any;
  storeId: number | any;
  createdDate: string | any;
  status: number | any;
  message: string | any;
  productImageList: {
    id: number | any;
    productImageUrl: string | any;
  }[];
  productVariantList: any[]; 
  deleted: boolean;
}

interface ProductImageType{
   id:string|number|any;
   productImageUrl:string|null|any;
}


const ProductDetails = ({params: {productId}}:Params) => {
    const dispatch=useDispatch();
    const {user}=useSelector((state:any)=>state.user);
    const [product,setProduct]=useState<ProductType | null | any>(null);
    const [productImages,setProductImages]=useState<any[]>([]);
    const [variantList,setVariantList]=useState<any>([]);
    const [productImage,setProductImage]=useState<ProductImageType>({
          "id":"",
         "productImageUrl":"",
    });
    const { productLoading,
        requiredProduct,}=useSelector((state:any)=>state.product);


    React.useEffect(()=>{
      dispatch(getProductById(productId))
    },[productId]);


    React.useEffect(()=>{
      if(requiredProduct){
        setProduct(requiredProduct);
      }
         
    },[requiredProduct,productId]);

    React.useEffect(()=>{
      if(product?.productVariantList && 
        Array.isArray(product?.productVariantList) &&
       product?.productVariantList?.length>=1){

        const newVariantListArray:any= product?.productVariantList?.map((item:any)=>{
           return {
            "id": item?.id,
            "optionTitle": item?.optionTitle?.toLowerCase()?.trim(),
            "optionName":item?.optionName,
            "price":isNaN(item?.price)?item?.price:parseFloat(item?.price),
            "quantity":isNaN(item?.quantity)?item?.quantity:parseInt(item?.quantity)
           }
        });

        setVariantList(newVariantListArray);

      }else{
        setVariantList([]);
      }

    },[productId,product,requiredProduct]);

    // console.log("variantList " ,  variantList)

    function groupByOptionTitle(variantList:any) {
      const groupedOptions:any = {};
    
      variantList.forEach((variant:any) => {
        const { id, optionTitle, optionName, price, quantity }:any = variant;
        if (!groupedOptions[optionTitle]) {
          groupedOptions[optionTitle] = [];
        }
        groupedOptions[optionTitle].push({ id, optionTitle, optionName, price, quantity });
      });
    
      return groupedOptions;
    };

    const transformedObject = groupByOptionTitle(variantList);
    console.log("transformedObject : ", transformedObject);

    React.useEffect(()=>{
         if(requiredProduct){
            setProductImages(requiredProduct?.productImageList)
         }
    },[requiredProduct,productId]);

    React.useEffect(()=>{
      if(productImages && Array.isArray(productImages)){
        setProductImage(productImages[0]);
      }
    },[productImages,productId]);


const imageClick=(id:string|null|any|number)=>{
     if(id){
      const findOne=productImages?.find((item:any)=>item?.id==id);
      if(findOne){
         setProductImage(findOne);
      }
     }
}

const productOptionsDisplay:any = Object.entries(transformedObject).map(([title, items]:any) => (
  <div key={title} style={{ width: '100%' ,marginBottom:'1rem',}}>
    <p style={{ fontWeight: 'bold', color:'#56555c',
    fontFamily: "'Ubuntu', sans-serif",marginBottom:'0.2rem'}}>{title?.toUpperCase()}</p>
    <div className='product-option-name'>
      {items?.map((item:any) => (
        <span key={item.id} style={{padding:'0.5rem', cursor:'pointer',
        borderRadius:'5px',
        width:'fit-content',
        display:'flex',alignItems:'center',
        justifyContent:'center',color:"white",background:'black'}}>{item?.optionName}</span>
      ))}
    </div>
  </div>
));




// console.log("requiredProduct : ", product);




  return (
    <div className='user-product-page'>
        <div className='user-product-page-box'>

            <section className='user-product-page-box-a'>
            <a href={productImage?.productImageUrl} target="_blank" rel="noopener noreferrer">
  <img
    src={productImage?.productImageUrl}
    style={{
      width: "100%",
      borderRadius: '10px',
      marginBottom: '1rem',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    }}
    alt="Product Image"
  />
</a>
                  
                  <div className='product-little-image-container'>
                   {
                    productImages?.map((item:any,index:number)=>{
                      const id= productImage?.id;
                      return (
                        <img 
                        onClick={()=>imageClick(item?.id)}
                        src={item?.productImageUrl}  key={item?.id} 
                        style={{width:'80px',height:'80px', 
                        border:(id==item?.id)?'2px solid #090463':'none',
                         borderRadius:'10px', marginBottom:'5px',
                        cursor:'pointer',boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }} />
                      )
                    })
                   }
                  </div>


            </section>


            <section className='user-product-page-box-b'>

              <p style={{fontSize:'1.5rem',marginBottom:'0.5rem',
              fontFamily: "'Ubuntu', sans-serif",fontWeight:'bold',}}>
                {product?.name}
              </p>
               
               <p style={{fontSize:'1.3rem',marginBottom:'0.5rem',color:'#f51105',
              fontFamily: "'Poppins', sans-serif",fontWeight:'bold',}}>
                LKR {product?.price}
              </p>

              <p style={{fontSize:'1rem',marginBottom:'0.5rem',color:'#8e91ad',
              fontFamily: "'Roboto', sans-serif",fontWeight:'500',}}>
                {product?.description}
              </p>

        
             <div style={{width:'100%',display:'flex',flexDirection:'column'}}>
                {productOptionsDisplay}
              </div>



             </section>


             <section className='user-product-page-box-c'>
                  
            </section>

        </div>
    </div>
  )
}

export default ProductDetails;