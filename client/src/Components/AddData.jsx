import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddData() {
  const navigate = useNavigate();

  const [hotelName, sethotelName] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [hotelCountry, setHotelCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const addNewUser = async (event) => {
    event.preventDefault();
    try {
      let response = await fetch("http://localhost:8080/addHotelData", {
        method: "POST",
        body: JSON.stringify({
          hotelName: hotelName,
          hotelCity: hotelCity,
          cityCode: cityCode,
          hotelCountry: hotelCountry,
          countryCode: countryCode,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      response = await response.json();
      console.log("response", response);

      sethotelName("");
      setHotelCity("");
      setCityCode("");
      setHotelCountry("");
      setCountryCode("");
      toast.success("New Hotel Data Added");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("New Hotel Data Additon Failed");
    }
  };

  return (
    <div
      style={{
        margin: "0",
        padding: "0",
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Form.Floating className="mb-3">
        <Form.Control
          id="nameInput"
          type="text"
          placeholder="Enter Hotel Name"
          value={hotelName}
          onChange={(e) => {
            sethotelName(e.target.value);
          }}
        />
        <label htmlFor="nameInput">Hotel Name</label>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control
          id="cityInput"
          type="text"
          placeholder="Enter Hotel City"
          value={hotelCity}
          onChange={(e) => {
            setHotelCity(e.target.value);
          }}
        />
        <label htmlFor="cityInput">Hotel City</label>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control
          id="cityCodeInput"
          type="text"
          placeholder="Enter City Code"
          value={cityCode}
          onChange={(e) => {
            setCityCode(e.target.value);
          }}
        />
        <label htmlFor="cityCodeInput">City Code</label>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control
          id="countryInput"
          type="text"
          placeholder="Enter Hotel Country"
          value={hotelCountry}
          onChange={(e) => {
            setHotelCountry(e.target.value);
          }}
        />
        <label htmlFor="countryInput">Hotel Country</label>
      </Form.Floating>

      <Form.Floating className="mb-3">
        <Form.Control
          id="countryCodeInput"
          type="text"
          placeholder="Enter Country Code"
          value={countryCode}
          onChange={(e) => {
            setCountryCode(e.target.value);
          }}
        />
        <label htmlFor="countryCodeInput">Country Code</label>
      </Form.Floating>

      <div>
        <Button
          disabled={
            hotelName === "" ||
            hotelCity === "" ||
            cityCode === "" ||
            hotelCountry === "" ||
            countryCode === ""
          }
          onClick={addNewUser}
          variant="primary"
        >
          Add Data
        </Button>
      </div>
    </div>
  );
}

export default AddData;
