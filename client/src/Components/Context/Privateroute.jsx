import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import { ctx } from "./AuthContext";

const PrivateComp = (props) =>{
    const { isAuth , SetIsAuth } = useContext(ctx);
     if (isAuth){
        return props.children
     }else{
        return <Navigate to="/login" />
     }

}

export default PrivateComp