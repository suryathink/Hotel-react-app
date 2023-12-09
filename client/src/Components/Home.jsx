import React, { useState, useEffect,useContext } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ctx } from "./Context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { setIsAuth } = useContext(ctx);

  const handleLogout = async () => {
    const backendUrl = `https://lazy-lime-mackerel-veil.cyclic.app/`;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Clear the token from localStorage.
        toast.success("Logout successful");
        setIsAuth(false);
        navigate("/login");
      } else {
        const data = await response.json();

        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error occurred during logout.");
    }
  };

  const getData = async () => {
    try {
      let result = await fetch(`https://lazy-lime-mackerel-veil.cyclic.app/getData`);
      result = await result.json();
      setData(result);

      console.log("Result", result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <br />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Link to="/addData">
          <Button variant="primary" size="lg" active>
            Add Hotel Data
          </Button>
        </Link>
        <Button onClick={handleLogout} variant="primary" size="lg" active>
          LogOut
        </Button>
      </div>
      <br />
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Serial Number</TableCell>
                <TableCell align="center">Hotel Code</TableCell>
                <TableCell align="center">Hotel name</TableCell>
                <TableCell align="center">Hotel City</TableCell>
                <TableCell align="center">City Code</TableCell>
                <TableCell align="center">Hotel Country</TableCell>
                <TableCell align="center">Country Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, i) => (
                <TableRow
                  key={i + 1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {row?.hotelCode}
                  </TableCell>
                  <TableCell align="center">{row?.hotelName}</TableCell>
                  <TableCell align="center">{row?.hotelCity}</TableCell>
                  <TableCell align="center">{row?.cityCode}</TableCell>
                  <TableCell align="center">{row?.hotelCountry}</TableCell>
                  <TableCell align="center">{row?.countryCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br />
    </div>
  );
};

export default Home;
