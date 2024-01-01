"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "@/redux/features/userSlice";

const MapComponent = () => {
  const dispatch = useDispatch();
  const { lat, lng } = useSelector((state: any) => state.user);
  const mapRef: any = useRef(null);
  const markerRef: any = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyAjGMHi8Zh76yU9sjcukALxeyDy8GyDkik", // Replace with your API key
      version: "weekly", // Or any other supported version
    });

    loader
      .load()
      .then((google) => {
        const map: any = new google.maps.Map(mapRef.current, {
          center: { lat: 6.9271, lng: 79.8612 }, // Initial center (San Francisco)
          zoom: 8,
        });

        // Example: Add a marker
        //   let marker = new google.maps.Marker({
        //     position: { lat, lng },
        //     map: map,
        //     draggable: true,
        //   });

        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          draggable: true,
        });

        //   google.maps.event.addListener(map, 'dragend', () => {
        //     const newMarkerPosition = markerRef.current.getPosition().toJSON();
        //     dispatch(getLocation({ lat: newMarkerPosition.lat, lng: newMarkerPosition.lng }));
        //     console.log('Marker Dragged to:', newMarkerPosition);
        // });

        google.maps.event.addListener(markerRef.current, "dragend", () => {
          const newMarkerPosition = markerRef.current.getPosition().toJSON();
          dispatch(
            getLocation({
              lat: newMarkerPosition.lat,
              lng: newMarkerPosition.lng,
            })
          );
          console.log("Marker Dragged to:", newMarkerPosition);
        });

        //   google.maps.event.addListener(map, 'click', (event:any) => {
        //     // Get the clicked coordinates
        //     const clickedLocation = event.latLng.toJSON();
        //     dispatch(getLocation({"lat":clickedLocation?.lat,"lng":clickedLocation?.lng}))

        //     // Set marker position to the clicked location
        //     marker.setPosition(clickedLocation);
        //     // markerRef.current.setPosition(clickedLocation);
        //     console.log('Clicked Location:', clickedLocation);
        //   });

        google.maps.event.addListener(map, "click", (event: any) => {
          // Get the clicked coordinates
          const clickedLocation = event.latLng.toJSON();
          dispatch(
            getLocation({ lat: clickedLocation.lat, lng: clickedLocation.lng })
          );

          // Set marker position to the clicked location
          markerRef.current.setPosition(clickedLocation);
          console.log("Clicked Location:", clickedLocation);
        });
      })
      .catch((error: any) => {
        console.error("Error loading Google Maps:", error);
      });
  }, [lat, lng]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

export default MapComponent;
