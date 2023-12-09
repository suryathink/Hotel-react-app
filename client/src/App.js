import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import PrivateComp from './Components/Context/Privateroute';
import SignUp from "./Components/Signup";
import SignIn from "./Components/Login";
import Home from "./Components/Home";
import AddData from "./Components/AddData";
import ForgotPassword from "./Components/ForgotPassword";
import VerifyOTP from "./Components/VerifyOTP";

function App() {
  return <div className="App">
  <ToastContainer/>
         <Routes>
     <Route path = "/" element = {<PrivateComp ><Home/></PrivateComp>} />
     <Route path = "/signup" element = {<SignUp/>} />
     <Route path = "/login" element = {<SignIn/>} />
     <Route path = "/addData" element = {<PrivateComp><AddData/></PrivateComp>} />
     <Route path = "/home" element = {<PrivateComp><Home/></PrivateComp>} />
     <Route path = "/forgotPassword" element = {<ForgotPassword/>} />
     <Route path = "/verifyOTP" element = {<VerifyOTP/>} />
     <Route path = "*" element = {<SignUp/>} />
     </Routes>
  </div>;
}

export default App;
