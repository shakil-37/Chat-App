import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//

const Forgetpassword = () => {
  // input state start
  const [email, setEmail] = useState("");
  // input state end
  // input error state start
  const [emailError, setEmailError] = useState("");
  // input error state end
  // input value take function start
  const handleemail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  // input value take function end
  // email regex start
  const Emailregex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // email regex end
  const auth = getAuth();
  // forget password function start
  const forgetPassword = (event) => {
    event.preventDefault();
    if (!email) {
      setEmailError("Email-Requerd");
    } else if (!Emailregex.test(email)) {
      setEmailError("Email is invalid");
    }

    if (Emailregex.test(email) && email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          console.log("password reset succes");
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          // ..
        });
    }
  };
  // forget password function end

  //
  return (
    <section className="flex justify-center items-center h-screen">
      <div className="border-[1px] border-solid rounded-md border-black px-4 py-4">
        <h2 className="font-bold text-2xl text-black">Lorem ipsum dolor sit, amet ipi elite.</h2>
        <form onSubmit={forgetPassword} className="mt-6">
          <div>
            <input
              onChange={handleemail}
              type="email"
              placeholder="inter your email"
              className="px-6 py-3 rounded-md w-full shadow-md"
            />
          </div>
          <p className="text-red mt-3 text-center">
            {emailError}
          </p>
            <button
              type="submit"
              className="bg-green py-2 text-secondari rounded-[30px] font-medium w-full mt-3"
            >
              Send
            </button>
            <Link
              to="/login"
              className="mt-4 block text-center font-medium"
            >
              Back to login
            </Link>
        
        </form>
      </div>
    </section>
  );
};

export default Forgetpassword;
