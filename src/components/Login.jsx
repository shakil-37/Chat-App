import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setuser } from "../slices/userSlice";
//
const Login = () => {
  //
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // input state start
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // input state end
  // input error state start
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // input errorstate end
  // password showhide state start
  const [showhiderepassword, setshowhiderepassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  // password showhide state end
  // name & email & password regex start
  //  password regex set korte hoibo
  // const Emailregex =
  //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // name & email & password regex end

  // input value take function start
  const handleemail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlepassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setShowForgot(false);
  };
  // input value take function end
  // passwordhideshow function start
  const hideshow = () => {
    setshowhiderepassword(!showhiderepassword);
  };
  // passwordshohide function end

  // login function start
  const handlelogin = (event) => {
    event.preventDefault();
    if (!email) {
      setEmailError("Email Requerd");
    }
    if (!password) {
      setPasswordError("Password Requerd");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const userdata = userCredential.user;
          localStorage.setItem("userinfo", JSON.stringify(userdata));
          dispatch(setuser(userdata));
          alert("login succes");
          navigate("/home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode == "auth/invalid-login-credentials") {
            setPasswordError("Wrong Password");
            setShowForgot(true);
          }
          console.log(errorCode);
          console.log(errorMessage);
        });
    }
  };

  // login function end

  //
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="border-[1px] border-solid border-primari rounded-md px-4 py-4">
        <h1 className="font-bold font-primary text-3xl text-center ">
          Became a batter experience with me
        </h1>
        <form onSubmit={handlelogin} className="mt-4 text-center">
          <div className=" relative">
            <input
              onChange={handleemail}
              className="w-full px-6 py-3  rounded-md	shadow-md

"
              type="email"
              placeholder="inter your email"
              id="email"
              name="email"
              value={email}
            />
          </div>
          <p className="mt-2 text-red">{emailError}</p>

          <div className="mt-4 relative">
            {showhiderepassword ? (
              <FaRegEye
                onClick={hideshow}
                className="absolute inset-y-2/4	 right-6 translate-y-[-50%] text-lg cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={hideshow}
                className="absolute inset-y-2/4	 right-6 translate-y-[-50%] text-lg cursor-pointer"
              />
            )}

            <input
              onChange={handlepassword}
              value={password}
              className="w-full px-6 py-3  rounded-md	shadow-md

"
              type={showhiderepassword ? "text" : "password"}
              placeholder="inter your password"
              id="password"
              name="password"
            />
          </div>
          <p className="mt-2 text-red">{passwordError}</p>
          <button
            type="submit"
            className="bg-green py-2 text-secondari rounded-[30px] font-medium w-full mt-2"
          >
            Log In
          </button>
          <div className="flex justify-between">
            {showForgot && (
              <Link to="/forgetpassword" className="font-medium  text-red mt-3">
                Forget Password
              </Link>
            )}

            <Link to="/" className="font-medium text-black mt-3">
              Registration
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};
// FaRegEyeSlash
export default Login;
