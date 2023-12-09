import { children, createContext, useState } from "react";

export const ctx = createContext();

function AuthContextProvider({children}){
    const [isAuth, setIsAuth] = useState(false);

 return (   <ctx.Provider value={{isAuth, setIsAuth}} >
    {children}
 </ctx.Provider>)
}



export default AuthContextProvider;