import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import profileDemu from "../images/profile.jpg";

//
const Registration = () => {
  //
  const auth = getAuth();
  const navigate = useNavigate();
  // const user = useSelector((state) => state.setuser.user);
  const db = getDatabase();
  //  input state start
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");
  //  input state  end
  //  input errorstate start
  const [fullnameerror, setfullnameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [repassworderror, setrepassworderror] = useState("");
  //  input errorstate end
  // showhidepassword state start
  const [showhidepassword, setshowhidepassword] = useState(false);
  const [showhiderepassword, setshowhiderepassword] = useState(false);
  // showhidepassword state end
  // form loder start

  // form loder end

  // input value take function start
  const handlefullname = (e) => {
    setfullname(e.target.value);
    setfullnameerror("");
  };
  //
  const handelemail = (e) => {
    setemail(e.target.value);
    setemailerror("");
  };
  //
  const handlepassword = (e) => {
    setpassword(e.target.value);
    setpassworderror("");
  };
  //
  const handelrepassword = (e) => {
    setrepassword(e.target.value);
    setrepassworderror("");
  };
  // input value take function end
  // showhide password function start
  const handleshowhidepassword = () => {
    setshowhidepassword(!showhidepassword);
  };
  //
  const handleshowhiderepassword = () => {
    setshowhiderepassword(!showhiderepassword);
  };
  // showhide password function end

  // name & email & password regex start
  //  password regex set korte hoibo
  const Nameregex = /^[a-zA-Z ]+$/;
  const Emailregex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // name & email & password regex end

  // registration function start
  // const registration = (event) => {
  //   event.preventDefault();
  //   if (!fullname) {
  //     setfullnameerror("Name Requerd");
  //   } else if (!Nameregex.test(fullname)) {
  //     setfullnameerror("Name is not valid");
  //   }
  //   //
  //   if (!email) {
  //     setemailerror("Email Requerd");
  //   }
  //   //
  //   else if (!Emailregex.test(email)) {
  //     setemailerror("Email not valid");
  //   }
  //   //
  //   if (!password) {
  //     setpassworderror("Password Requerd");
  //   }
  //   //

  //   if (!repassword) {
  //     setrepassworderror("Re-Password Requerd");
  //   }
  //   //
  //   else if (password !== repassword) {
  //     setrepassworderror("Re- Password error");
  //   }
  //   //
  //   if (
  //     fullname &&
  //     email &&
  //     password &&
  //     repassword &&
  //     password == repassword &&
  //     Nameregex.test(fullname) &&
  //     Emailregex.test(email)
  //   ) {
  //     createUserWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //         updateProfile(auth.currentUser, {
  //           displayName: fullname,
  //           photoURL: profileDemu,
  //         })
  //           .then(() => {
  //             set(ref(db, "users/" + auth.currentUser.uid), {
  //               username: fullname,
  //               email: email,
  //               // profile_picture : imageUrl
  //             });
  //           })
  //           .then(() => {
  //             alert("Register succes");
  //           })
  //           .catch((error) => {
  //             // An error occurred
  //             const errorCode = error.code;
  //             const errorMessage = error.message;
  //             console.log(errorCode);
  //             console.log(errorMessage);
  //           });
  //         //
  //         setTimeout(() => {
  //           navigate("/login");
  //         }, 1500);
  //         //
  //       })
  //       //
  //       .catch((error) => {
  //         const errorCode = error.code;
  //         const errorMessage = error.message;

  //         // ..
  //       });
  //   }
  // };
  // registration function end

  //

  const registration = (event) => {
    event.preventDefault();
    if (!fullname) {
      setfullnameerror("Name Requerd");
    } else if (!Nameregex.test(fullname)) {
      setfullnameerror("Name is not valid");
    }
    //
    if (!email) {
      setemailerror("Email Requerd");
    }
    //
    else if (!Emailregex.test(email)) {
      setemailerror("Email not valid");
    }
    //
    if (!password) {
      setpassworderror("Password Requerd");
    }
    //

    if (!repassword) {
      setrepassworderror("Re-Password Requerd");
    }
    //
    else if (password !== repassword) {
      setrepassworderror("Re- Password error");
    }
    //
    if (
      fullname &&
      email &&
      password &&
      repassword &&
      password == repassword &&
      Nameregex.test(fullname) &&
      Emailregex.test(email)
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          //
          updateProfile(auth.currentUser, {
            displayName: fullname,
            photoURL: profileDemu,
          });
          //
          set(ref(db, "users/" + auth.currentUser.uid), {
            username: fullname,
            email: email,
            profile_picture: profileDemu,
          });
          //
          confirm("register succes");
          // ...
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          if (errorCode == "auth/email-already-in-use") {
            setemailerror("This email already use");
          }
          // ..
        });
      //
    }
  };
  //

  //
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="border-[1px] border-solid border-primari rounded-md px-4 py-4">
        <h1 className="font-bold font-primary text-3xl text-center">
          Became a batter experience with me
        </h1>

        <h3 className="text-center text-primari font-normal mt-4 text-lg">
          Or connect with us
        </h3>
        <ul className="flex justify-center gap-2 mt-3">
          <li className="px-2 py-2 rounded-full border-[1px] border-primari">
            <a href="facebook">Facebook</a>
          </li>
          <li className="px-2 py-2 rounded-full border-[1px] border-primari">
            <a href="Git Hub">Git Hub</a>
          </li>
          <li className="px-2 py-2 rounded-full border-[1px] border-primari">
            <a href="LinkDen">Link Den</a>
          </li>
        </ul>

        <form onSubmit={registration} className="px-3 text-center">
          <div className="mt-5">
            <input
              value={fullname}
              onChange={handlefullname}
              type="text"
              name="fullname"
              id="fullname"
              className="px-6 py-3  w-full rounded-md	shadow-md"
              placeholder="Full Name"
            />
          </div>
          <p className="mt-2 text-red">{fullnameerror}</p>
          <div className="my-3">
            <input
              value={email}
              onChange={handelemail}
              type="email"
              name="email"
              id="email"
              className="px-6 py-3 w-full rounded-md	shadow-md

"
              placeholder="Email"
            />
          </div>
          <p className="mt-2 text-red">{emailerror}</p>
          <div className="my-3 relative ">
            {showhidepassword ? (
              <FaRegEye
                onClick={handleshowhidepassword}
                className="text-lg cursor-pointer absolute inset-y-2/4	 right-6 translate-y-[-50%]"
              />
            ) : (
              <FaRegEyeSlash
                onClick={handleshowhidepassword}
                className="text-lg cursor-pointer absolute inset-y-2/4	 right-6 translate-y-[-50%]"
              />
            )}

            <input
              value={password}
              onChange={handlepassword}
              type={showhidepassword ? "text" : "password"}
              name="password"
              id="password"
              className="px-6 py-3 w-full rounded-md	shadow-md

"
              placeholder="Password"
            />
          </div>
          <p className="mt-2 text-red">{passworderror}</p>
          <div className="mt-3 mb-2 relative ">
            {showhiderepassword ? (
              <FaRegEye
                onClick={handleshowhiderepassword}
                className=" text-lg cursor-pointer absolute inset-y-2/4	 right-6 translate-y-[-50%]"
              />
            ) : (
              <FaRegEyeSlash
                onClick={handleshowhiderepassword}
                className=" text-lg cursor-pointer absolute inset-y-2/4 right-6 translate-y-[-50%]"
              />
            )}
            <input
              value={repassword}
              onChange={handelrepassword}
              type={showhiderepassword ? "text" : "password"}
              name="repassword"
              id="repassword"
              className="px-6 py-3 w-full rounded-md	shadow-md

"
              placeholder="Re-Password"
            />
          </div>
          <p className="mt-2 text-red">{repassworderror}</p>
          <div className="px-4 mt-4">
            <button
              type="submit"
              className="w-full bg-green py-2 text-secondari rounded-[30px] font-medium"
            >
              Creat an account
            </button>
          </div>
          <div className="text-right mt-4">
            <p className="text-center">
              I have already an account ?
              <Link to={"/login"} className="ml-4 font-medium">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Registration;
