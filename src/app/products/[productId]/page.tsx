"use client";
import React, { useState } from "react";
import "./Product.css";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "@/redux/features/productSlice";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Client } from "@googlemaps/google-maps-services-js";
import { BASE_URL } from "@/redux/apiService";
import axios from "axios";
import MapComponent from "@/app/components/Map/MapComponent";
import { getLocation } from "@/redux/features/userSlice";

type Params = {
  params: {
    productId: string;
  };
};

interface ProductType {
  id: number | any;
  name: string | any;
  description: string | any;
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

interface ProductImageType {
  id: string | number | any;
  productImageUrl: string | null | any;
}

const ProductDetails = ({ params: { productId } }: Params) => {
  const dispatch = useDispatch();
  const { user, lat, lng } = useSelector((state: any) => state.user);
  const [product, setProduct] = useState<ProductType | null | any>(null);
  const [text, setText] = useState<string>("");
  const [isSelectedAdded, setIsSelectedAdded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any | null | string>("");
  const [productImages, setProductImages] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState<number | any | null | string>(
    ""
  );
  const [deliveryAddress, setDeliveryAddress] = useState<any | null | string>(
    ""
  );
  const [distance, setDistance] = useState<number>(0);
  const [distanceInfo, setDistanceInfo] = useState<any | null>(null);
  const [variantList, setVariantList] = useState<any>([]);
  const [count, setCount] = useState<number>(1);
  const [transObject, setTransObject] = useState<any | null | string>("");
  const [inputValue, setInputValue] = useState<any | null>("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [productImage, setProductImage] = useState<ProductImageType>({
    id: "",
    productImageUrl: "",
  });
  const { productLoading, requiredProduct } = useSelector(
    (state: any) => state.product
  );

  console.log("LAT PAMKA", lat, lng);

  //  console.log("distanceInfo",distanceInfo)

  React.useEffect(() => {
    dispatch(getProductById(productId));
  }, [productId]);

  React.useEffect(() => {
    if (requiredProduct) {
      setProduct(requiredProduct);
    }
  }, [requiredProduct, productId]);

  React.useEffect(() => {
    if (
      product?.productVariantList &&
      Array.isArray(product?.productVariantList) &&
      product?.productVariantList?.length >= 1
    ) {
      const newVariantListArray: any = product?.productVariantList?.map(
        (item: any) => {
          return {
            id: item?.id,
            optionTitle: item?.optionTitle?.toLowerCase()?.trim(),
            optionName: item?.optionName,
            price: 0,
            quantity: 0,
          };
        }
      );

      setVariantList(newVariantListArray);
    } else {
      setVariantList([]);
    }
  }, [productId, product, requiredProduct]);

  // console.log("variantList " ,  variantList)

  function groupByOptionTitle(variantList: any) {
    const groupedOptions: any = {};

    variantList.forEach((variant: any) => {
      const { id, optionTitle, optionName, price, quantity }: any = variant;
      if (!groupedOptions[optionTitle]) {
        groupedOptions[optionTitle] = [];
      }
      groupedOptions[optionTitle].push({
        id,
        optionTitle,
        optionName,
        price,
        quantity,
        isSelected: false,
      });
    });

    return groupedOptions;
  }

  React.useEffect(() => {
    const transformedObject: any = groupByOptionTitle(variantList);
    if (transformedObject) {
      setTransObject(transformedObject);
    } else {
      setTransObject("");
    }
  }, [variantList]);

  React.useEffect(() => {
    let array1: string[] = [];
    let selectedOptionDetails: any = {};
    for (const key in transObject) {
      if (Object.prototype.hasOwnProperty.call(transObject, key)) {
        console.log(`Category: ${key}`);
        const category: any = transObject[key];

        // Iterate through the items in each category
        category.forEach((item: any) => {
          if (item.isSelected) {
            array1.push(item?.optionName?.toLowerCase()?.trim());
            // console.log(`Selected ${item.optionName} in ${key}`);
            selectedOptionDetails = {
              ...selectedOptionDetails,
              [key]: item?.optionName,
            };
          }
        });
      }
    }
    // console.log("PAMKE NEW ARRAY : ", array1);
    // console.log("OBJECT : ",selectedOptionDetails);

    const sentence: any = generateSentence(selectedOptionDetails);
    if (sentence) {
      setText(sentence);
    } else {
      setText("");
    }

    let array2: string[] = [];

    for (let i = 0; i < product?.variantCombinationList?.length; i++) {
      const name = product?.variantCombinationList[i]?.name;
      array2 = name.toLowerCase()?.trim().split("/");

      const sortedArray1 = array1.slice().sort();
      const sortedArray2 = array2.slice().sort();

      const isEqual =
        JSON.stringify(sortedArray1) === JSON.stringify(sortedArray2);

      if (isEqual) {
        setSelectedOption(product?.variantCombinationList[i]);
        break;
      } else {
        setSelectedOption("");
      }
    }
  }, [transObject]);

  const generateSentence = (options: any) => {
    const optionKeys: any = Object.keys(options);

    // Constructing the sentence dynamically based on available properties
    let sentence: string = `You have selected ${product?.name}, the`;

    optionKeys?.forEach((key: any, index: number) => {
      sentence += ` ${key.toLowerCase()} is ${options[key]}`;
      if (index !== optionKeys.length - 1) {
        sentence += " and the";
      } else {
        sentence += ".";
      }
    });

    return sentence;
  };

  // console.log("SELECTED OPRION PAMKA" ,selectedOption)

  function addIsSelectedProperty(data: any) {
    const newData = { ...data }; // Create a shallow copy of the object

    // Iterate through each key in the data object
    for (let key in newData) {
      if (Array.isArray(newData[key])) {
        // If the value is an array, create a new array with modified objects
        newData[key] = newData[key]?.map((item: any) => ({
          ...item,
          isSelected: false,
        }));
      }
    }
    return newData;
  }

  // React.useEffect(()=>{
  //   const newObject:any = addIsSelectedProperty(transformedObject);
  //   if(newObject){
  //     setTransObject(newObject)
  //   }else{
  //     setTransObject("")
  //   }

  // },[transformedObject])

  React.useEffect(() => {
    if (requiredProduct) {
      setProductImages(requiredProduct?.productImageList);
    }
  }, [requiredProduct, productId]);

  // console.log(transObject);

  React.useEffect(() => {
    if (productImages && Array.isArray(productImages)) {
      setProductImage(productImages[0]);
    }
  }, [productImages, productId]);

  const imageClick = (id: string | null | any | number) => {
    if (id) {
      const findOne = productImages?.find((item: any) => item?.id == id);
      if (findOne) {
        setProductImage(findOne);
      }
    }
  };

  const optionClick = (title: any, optionName: any) => {
    // console.log(title, optionName);
    const requiredArray = transObject[title]?.map((item: any) => {
      if (
        item?.optionName?.toLowerCase()?.trim() ===
        optionName?.toLowerCase()?.trim()
      ) {
        return {
          ...item,
          isSelected: !item?.isSelected,
        };
      } else {
        return {
          ...item,
          isSelected: false,
        };
      }
    });

    setTransObject((prevState: any) => {
      return {
        ...prevState,
        [title]: requiredArray,
      };
    });
  };

  const productOptionsDisplay: any = Object.entries(transObject)?.map(
    ([title, items]: any) => (
      <div key={title} style={{ width: "100%", marginBottom: "1rem" }}>
        <p
          style={{
            fontWeight: "bold",
            color: "#56555c",
            fontFamily: "'Ubuntu', sans-serif",
            marginBottom: "0.2rem",
          }}
        >
          {title?.toUpperCase()}
        </p>
        <div className="product-option-name">
          {items?.map((item: any) => (
            <span
              key={item.id}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                borderRadius: "5px",
                border: item?.isSelected === false ? "2px solid black" : "none",
                width: "fit-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item?.isSelected === false ? "black" : "white",
                background:
                  item?.isSelected === false ? "transparent" : "black",
              }}
              onClick={() => optionClick(title, item?.optionName)}
            >
              {item?.optionName}
            </span>
          ))}
        </div>
      </div>
    )
  );

  // console.log("requiredProduct : ", product);

  React.useEffect(() => {
    setCount(1);
  }, [selectedOption]);

  const increaseCount = () => {
    if (requiredProduct?.variantCombinationList?.length >= 1) {
      setCount((prevState: number) => {
        if (selectedOption?.quantity > prevState) {
          return prevState + 1;
        } else {
          return prevState;
        }
      });
    } else {
      setCount((prevState: number) => {
        if (product?.quantity > prevState) {
          return prevState + 1;
        } else {
          return prevState;
        }
      });
    }
  };
  const decreaseCount = () => {
    if (requiredProduct?.variantCombinationList?.length >= 1) {
      setCount((prevState: number) => {
        if (prevState > 1) {
          return prevState - 1;
        } else {
          return prevState;
        }
      });
    } else {
      setCount((prevState: number) => {
        if (prevState > 1) {
          return prevState - 1;
        } else {
          return prevState;
        }
      });
    }
  };

  // map pamka balla

  const getAddressFromPlaceId = async (placeId: any) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Replace with your Google Maps API key
    if (!placeId) {
      return;
    }
    try {
      const response: any = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`
      );
      const data: any = await response.json();

      // Check if the response contains valid data
      if (
        data?.results &&
        Array.isArray(data?.results) &&
        data?.results.length > 0
      ) {
        const address: any = data?.results[0]?.formatted_address;
        if (address) {
          console.log("Address: HUMTHE=====>>>>>>>>", address);
          setDeliveryAddress(address);
        } else {
          return;
        }
      } else {
        console.error("Invalid place ID or no results found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const getPlaceIdFromLatLng = async (lat: any, lng: any) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!lat && !lng) {
      return;
    }

    try {
      const response: any = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data: any = await response.json();

      // Check if the response contains valid data
      if (
        data?.results &&
        Array.isArray(data?.results) &&
        data?.results?.length > 0
      ) {
        const placeId: any = data?.results[0]?.place_id;
        console.log("Place ID: HUMATHO", placeId);
        if (placeId) {
          getAddressFromPlaceId(placeId);
          calculateDistance(placeId);
        } else {
          return;
        }
      } else {
        console.error("Invalid coordinates or no results found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  React.useEffect(() => {
    if(lat && lng){
      getPlaceIdFromLatLng(lat, lng);
    }
    
  }, [lat, lng]);

  const getGeoLocation = async (address: any) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const encodedAddress: any = encodeURIComponent(address);

    try {
      const response: any = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
      );
      const data: any = await response.json();

      // Check if the response contains valid data
      if (
        data?.results &&
        Array.isArray(data?.results) &&
        data?.results?.length > 0
      ) {
        const { lat, lng }: any = data?.results[0]?.geometry?.location;
        console.log("Latitude:", lat);
        console.log("Longitude:", lng);
        dispatch(getLocation({ lat, lng }));

        // Use lat and lng in your application (e.g., display on a map)
      } else {
        console.error("Invalid address or no results found");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (event: any, newValue: any) => {
    setInputValue(newValue); // Update the input value
    console.log("Selected Value:", newValue);
    await handleInputChange(newValue);
  };

  const handleInputChange = async (value: any) => {
    // setInputValue(value);

    try {
      const response: any = await axios.get(
        `${BASE_URL}/google-map/places/autocomplete?input=${value}`
      );
      console.log("response.data.predictions : ", response.data.predictions);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      // setPredictions([]);
    }
  };

  React.useEffect(() => {
    const findAddress: any = predictions?.find(
      (item: any) =>
        item?.description?.toLowerCase()?.trim() ==
        inputValue?.toLowerCase()?.trim()
    );
    console.log("findAddress : ", findAddress);
    if (findAddress && findAddress != "undefined" && findAddress != undefined) {
      // calculateDistance(findAddress?.place_id);
      getGeoLocation(findAddress?.description);
    }
  }, [inputValue, predictions]);

  const calculateDistance = async (destinationPlaceId: any) => {
    try {
      const response: any = await axios.get(
        `${BASE_URL}/google-map/places/distance?destinationPlaceId=${destinationPlaceId}`
      );
      // Process the response from the backend API (distance information)
      console.log(
        "Distance calculation result:",
        response.data?.rows[0]?.elements[0]?.distance?.value
      );
      if (response.data?.rows[0]?.elements[0]?.distance?.value) {
        const distanceKM: any =
          response.data?.rows[0]?.elements[0]?.distance?.value / 1000;
        calculateDeliveryCharges(distanceKM, 360);
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      // Handle the error or display an error message to the user
    }
  };

  const calculateDeliveryCharges = (
    distance: any,
    petrolPricePerLiter: any
  ) => {
    const distanceInKm: any = parseFloat(distance); // Ensure distance is a number
    const petrolPrice: any = parseFloat(petrolPricePerLiter); // Ensure petrol price is a number

    if (isNaN(distanceInKm) || isNaN(petrolPrice)) {
      return "Invalid input. Please provide valid distance and petrol price.";
    }

    const petrolConsumed = distanceInKm / 20; // Assuming 25 km per liter fuel consumption
    const totalPetrolCost = petrolConsumed * petrolPrice;

    // Assuming a fixed delivery charge of $5 in addition to petrol cost
    const deliveryCharge = 0;

    const totalCharges: any = totalPetrolCost + deliveryCharge;
    setShippingFee(totalCharges);
    console.log(
      `The estimated delivery charge is RS.${totalCharges.toFixed(2)}.`
    );
  };

  return (
    <>
      {requiredProduct && (
        <div className="user-product-page">
          <div className="user-product-page-box">
            <section className="user-product-page-box-a">
              <a
                href={productImage?.productImageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={productImage?.productImageUrl}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                  alt="Product Image"
                />
              </a>

              <div className="product-little-image-container">
                {productImages?.map((item: any, index: number) => {
                  const id = productImage?.id;
                  return (
                    <img
                      onClick={() => imageClick(item?.id)}
                      src={item?.productImageUrl}
                      key={item?.id}
                      style={{
                        width: "80px",
                        height: "80px",
                        border: id == item?.id ? "2px solid #090463" : "none",
                        borderRadius: "10px",
                        marginBottom: "5px",
                        cursor: "pointer",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                  );
                })}
              </div>
            </section>

            <section className="user-product-page-box-b">
              <p
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: "bold",
                }}
              >
                {product?.name}
              </p>

              <p
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "0.5rem",
                  color: "#f51105",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "bold",
                }}
              >
                LKR {selectedOption ? selectedOption?.price : product?.price}
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  color: "#8e91ad",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: "500",
                }}
              >
                {product?.description}
              </p>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {productOptionsDisplay}
              </div>

              {selectedOption && selectedOption?.quantity >= 1 && (
                <div style={{ width: "100%", marginBottom: "0.5rem" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      color: "#616469",
                    }}
                  >
                    <span style={{ color: "#f01202", fontWeight: "bold" }}>
                      {requiredProduct?.variantCombinationList?.length === 0
                        ? product?.quantity
                        : selectedOption?.quantity}
                    </span>{" "}
                    items are available.
                  </p>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 &&
                product?.quantity >= 1 && (
                  <div style={{ width: "100%", marginBottom: "0.5rem" }}>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: "bold",
                        color: "#616469",
                      }}
                    >
                      <span style={{ color: "#f01202", fontWeight: "bold" }}>
                        {requiredProduct?.variantCombinationList?.length === 0
                          ? product?.quantity
                          : selectedOption?.quantity}
                      </span>{" "}
                      items are available.
                    </p>
                  </div>
                )}

              {selectedOption && selectedOption?.quantity == 0 && (
                <div style={{ width: "100%", marginBottom: "0.5rem" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      color: "#616469",
                    }}
                  >
                    <span style={{ color: "#f01202", fontWeight: "bold" }}>
                      Out of Stock
                    </span>
                  </p>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 &&
                product?.quantity == 0 && (
                  <div style={{ width: "100%", marginBottom: "0.5rem" }}>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: "bold",
                        color: "#616469",
                      }}
                    >
                      <span style={{ color: "#f01202", fontWeight: "bold" }}>
                        Out of Stock
                      </span>
                    </p>
                  </div>
                )}

              {selectedOption && selectedOption?.quantity >= 1 && (
                <div
                  style={{
                    marginBottom: "0.5rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    onClick={decreaseCount}
                    style={{
                      border: "1px solid black",
                      borderRadius: "5px",
                      background: "black",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <RemoveIcon sx={{ color: "white" }} />
                  </span>

                  <span
                    style={{
                      marginRight: "0.5rem",
                      marginLeft: "0.5rem",
                      fontWeight: "bold",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {count}
                  </span>

                  <span
                    onClick={increaseCount}
                    style={{
                      border: "1px solid black",
                      borderRadius: "5px",
                      background: "black",
                      width: "fit-content",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AddIcon sx={{ color: "white" }} />
                  </span>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 &&
                product?.quantity >= 1 && (
                  <div
                    style={{
                      marginBottom: "0.5rem",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      onClick={decreaseCount}
                      style={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        background: "black",
                        width: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <RemoveIcon sx={{ color: "white" }} />
                    </span>

                    <span
                      style={{
                        marginRight: "0.5rem",
                        marginLeft: "0.5rem",
                        fontWeight: "bold",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {count}
                    </span>

                    <span
                      onClick={increaseCount}
                      style={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        background: "black",
                        width: "fit-content",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AddIcon sx={{ color: "white" }} />
                    </span>
                  </div>
                )}
            </section>

            <section className="user-product-page-box-c">
              {selectedOption && (
                <p
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  Information regarding the selected product.
                </p>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 && (
                <p
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  Information regarding the selected product.
                </p>
              )}

              {text && text?.trim() != "" && selectedOption && (
                <p
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: "500",
                    color: "#8f8e99",
                  }}
                >
                  {text}
                </p>
              )}

              {selectedOption && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    Per item price
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#f51105",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR{" "}
                    {selectedOption ? selectedOption?.price : product?.price}
                  </p>
                </div>
              )}

              {selectedOption && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    {count} items
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#f51105",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR{" "}
                    {selectedOption ? selectedOption?.price : product?.price} X{" "}
                    {count}
                  </p>
                </div>
              )}

              {selectedOption && shippingFee && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    Shipping fee
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#4402a8",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR {shippingFee.toFixed(2)}
                  </p>
                </div>
              )}

              {selectedOption && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "black",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR{" "}
                    {(
                      Number(selectedOption?.price) * Number(count) +
                        Number(shippingFee) || 0
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    Per item price
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#f51105",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR {product?.price}
                  </p>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    {count} items
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#f51105",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR{" "}
                    {selectedOption ? selectedOption?.price : product?.price} X{" "}
                    {count}
                  </p>
                </div>
              )}

              {requiredProduct?.variantCombinationList?.length === 0 &&
                shippingFee && (
                  <div style={{ width: "100%", display: "flex" }}>
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: "0.5rem",
                        color: "#888794",
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: "bold",
                        marginRight: "auto",
                      }}
                    >
                      Shipping fee
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: "0.5rem",
                        color: "#4303a3",
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: "bold",
                      }}
                    >
                      LKR {shippingFee.toFixed(2)}
                    </p>
                  </div>
                )}

              {requiredProduct?.variantCombinationList?.length === 0 && (
                <div style={{ width: "100%", display: "flex" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#888794",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                      marginRight: "auto",
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "black",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    LKR{" "}
                    {(
                      Number(product?.price) * Number(count) +
                        Number(shippingFee) || 0
                    ).toFixed(2)}
                  </p>
                </div>
              )}

              {deliveryAddress && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "#db3502",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    *This order will be shipped to below address
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: "black",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    <i>{deliveryAddress}</i>
                  </p>
                </div>
              )}

              <Autocomplete
                disablePortal
                id="free-solo-demo"
                onInputChange={handleChange}
                value={inputValue}
                freeSolo
                size="small"
                options={predictions?.map((option: any) => option?.description)}
                sx={{ width: "100%", marginTop: "1rem" }}
                renderInput={(params: any) => (
                  <TextField {...params} label="Delivery Address" />
                )}
              />

              <div style={{ marginTop: "1rem", width: "100%" }}>
                <MapComponent />
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
