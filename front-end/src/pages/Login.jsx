import { useState } from "react";
// import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[sign,isSign]=useState(false);
//   const navigate = useNavigate();
//   const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!(email.includes("@gmail.com") || email.includes("@yahoo.com") || email.includes("@outlook.com"))){
        
        alert("Please enter a valid email address.");
        return;
    }
    // const res = await API.post("/auth/login", { email, password });
    const res = { data: { token: "mock-token" } };
    localStorage.setItem("token", res.data.token);
    // navigate("/dashboard");
  };
//   const emailValid = ()=>{
//     if(emailRegex.test(email)){
//         return true;
//     }    return false;
//   }
  

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="registerbox w-80 p-6 shadow">
        <h2 className="text-xl text-center  mb-4">Login</h2>
        { sign && <div className="input-divs">
        <input className="inputbar border p-2 w-full" placeholder="UserName" onChange={e=>setUsername(e.target.value)} required/>
        </div>}
        <div className="input-divs">
        <input className="inputbar border p-2 w-full    " placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div className="input-divs">   
        <input type="password" className="inputbar border p-2 w-full " placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <div>{!sign && <span className="text-sm text-blue-500 underline cursor-pointer " onClick={()=>isSign(!sign)}>Register</span>} {sign && <span  className="text-sm text-blue-500 underline cursor-pointer " onClick={()=>isSign(!sign)}>Login</span>   } </div>
        <button  className="bg-blue-500 submit-btn -4 hello text-white w-full p-2">Login</button>
      </form>
    </div>
  );
}
