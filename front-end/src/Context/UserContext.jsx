// import React from 'react';
// import { useState } from "react";
// import API from "../api";
// import axios from "axios";

// export const userContext = React.createContext();
// export default function UserContent({children}) {
//     const [user, setUser] = useState(null);
//   const userLogin = async (userData) => {
//   try {
//     const res = await axios.post(API.login, userData);

//     localStorage.setItem("token", res.data.token);
//     localStorage.setItem("user", JSON.stringify(res.data.user));

//     setUser(res.data.user);
//     return res.data.user;
//   } catch (err) {
//     console.error("LOGIN FAILED:", err.response?.data);
//     throw err;
//   }
// };


//      const userRegister = async(userData)=>{
//         try{
//             const res = await axios.post(API.register, userData);
//             setUser(res.data.user);
//             localStorage.setItem("token", res.data.token);
//             localStorage.setItem("user", JSON.stringify(res.data.user));
//             return res.data.user;
//         }catch(err){
//             console.log(err);
//         }
//      }
//        const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };
//   return (
//     <userContext.Provider value={{ userLogin, userRegister ,user, logout }}>
//       {children}
//     </userContext.Provider>
//   )
// }
import React, { useState, useEffect } from 'react';
import API from "../api";
import axios from "axios";

export const userContext = React.createContext();

export default function UserContent({ children }) {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const userLogin = async (userData) => {
    try {
      const res = await axios.post(API.login, userData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("LOGIN FAILED:", err.response?.data);
      throw err;
    }
  };

  const userRegister = async (userData) => {
    try {
      const res = await axios.post(API.register, userData);
      
      // Check if token exists in response
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("REGISTRATION FAILED:", err.response?.data);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <userContext.Provider value={{ userLogin, userRegister, user, logout }}>
      {children}
    </userContext.Provider>
  );
}