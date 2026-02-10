// /* eslint-disable no-unused-vars */
// import { useState ,useContext } from "react";
// // import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {userContext} from '../Context/UserContext'

// export default function Login() {
//   const usercontext = useContext(userContext);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const[sign,isSign]=useState(false);

//   const navigate = useNavigate();

//  const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !(
//         email.includes("@gmail.com") ||
//         email.includes("@yahoo.com") ||
//         email.includes("@outlook.com")
//       )
//     ) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     try {
//       if (sign) {
//         // REGISTER
//       const user=  await usercontext.userRegister({ username, email, password });
//       console.log(user);
      
//       } else {
//         // LOGIN
//       const user= await usercontext.userLogin({ email, password });
//       console.log(user);
//       }

//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="registerbox w-80 p-6 shadow">
//         <h2 className="text-xl text-center  mb-4"> {sign ? "Register" : "Login"}</h2>
//         { sign && <div className="input-divs">
//         <input className="inputbar border p-2 w-full" placeholder="UserName" onChange={e=>setUsername(e.target.value)} required/>
//         </div>}
//         <div className="input-divs">
//         <input className="inputbar border p-2 w-full    " placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
//         </div>
//         <div className="input-divs">   
//         <input type="password" className="inputbar border p-2 w-full " placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
//         </div>
//         <div>{!sign && <span className="text-sm text-blue-500 underline cursor-pointer " onClick={()=>isSign(!sign)}>Register</span>} {sign && <span  className="text-sm text-blue-500 underline cursor-pointer " onClick={()=>isSign(!sign)}>Login</span>   } </div>
//         <button  className="bg-blue-500 submit-btn -4 hello text-white w-full p-2">Login</button>
//       </form>
//     </div>
//   );
// }
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from '../Context/UserContext';

export default function Login() {
  const usercontext = useContext(userContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Better email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await usercontext.userRegister({ username, email, password });
      } else {
        await usercontext.userLogin({ email, password });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="registerbox w-80 p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Register" : "Login"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {isSignUp && (
          <div className="mb-4">
            <input
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 text-center">
          <span className="text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </span>
          <span
            className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-600"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "Login" : "Register"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white w-full p-2 rounded font-semibold transition"
        >
          {loading ? "Please wait..." : isSignUp ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}