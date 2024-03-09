import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setuser } from "../slices/userSlice";
import { MdNavigateNext } from "react-icons/md";
import {
  AiOutlineCloudUpload,
  AiOutlineUser,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import { BiHomeAlt } from "react-icons/bi";
import { BsFillChatFill } from "react-icons/bs";
import { GiThreeFriends } from "react-icons/gi";
import { BiBlock } from "react-icons/bi";
import { RiGroup2Fill } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { getDatabase, onValue, ref } from "firebase/database";

//

const SideNav = () => {
  //new code start
  const user = useSelector((state) => state.setuser.user);
  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setmodal] = useState(false);
  const [istoggle, setistoggle] = useState(false);
  const [FriendRequest, setFriendRequest] = useState([]);
  // console.log(FriendRequest);
  // nav toggle function  start
  const handletoggle = () => {
    setistoggle(!istoggle);
  };
  // nv toggle function end

  // Logout function start
  const handlesignout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userinfo");
        navigate("/");
        dispatch(setuser(null));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };
  //  Logout function end
  const handlemodal = () => {
    setmodal(!modal);
    if (modal) {
      navigate("/profilemodal");
    } else {
      navigate("/home");
    }
  };
  // Modal function end

  // friend Request data get start
  useEffect(() => {
    const RequestRef = ref(db, "request");
    onValue(RequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().receverId === user.uid) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequest(list);
    });
  }, []);
  // friend Request data det end

  //

  return (
    <section className="bg-green">
      <div
        className={` text-center relative py-6 ${
          istoggle ? "w-[200px]" : "w-[80px]"
        } h-screen`}
      >
        <div className="absolute right-[-16px] top-[8px] bg-primari px-1 py-1 rounded-full shadow-lg">
          <MdNavigateNext
            onClick={handletoggle}
            className="cursor-pointer text-2xl text-secondari"
          />
        </div>

        {istoggle ? (
          <div className="w-[80px] h-[80px] overflow-hidden rounded-full  border-[3px] border-secondari shadow-sm mx-auto   group relative hover:bg-primari transition-all shadow-secondari">
            <img
              className="w-full cursor-pointer"
              src={user?.photoURL}
              alt="profile"
            />
            <AiOutlineCloudUpload
              onClick={handlemodal}
              className="text-xl absolute top-[50%] left-[50%] translate-x-[-50%]	translate-y-[-50%] hidden group-hover:block w-[50%] h-[50%] cursor-pointer"
            />
          </div>
        ) : (
          <div className="w-[50px] h-[50px] overflow-hidden rounded-full  border-[3px] border-secondari shadow-sm mx-auto  group  relative hover:bg-primari transition-all shadow-secondari">
            <img
              className="w-full cursor-pointer"
              src={user?.photoURL}
              alt="profile"
            />
            <AiOutlineCloudUpload
              onClick={handlemodal}
              className="text-lg absolute top-[50%] left-[50%] translate-x-[-50%]	translate-y-[-50%] hidden group-hover:block w-[50%] h-[50%] cursor-pointer"
            />
          </div>
        )}

        {istoggle ? (
          <h1 className="capitalize my-2 font-bold text-xl text-secondari font-secondari">
            {user.displayName}
          </h1>
        ) : (
          <h1 className="capitalize my-2 font-semibold text-lg text-secondari font-secondari">
            {user.displayName}
          </h1>
        )}

        <ul className="mt-10 py-5">
          <li className="py-2 hover:bg-secondari rounded-lg my-2 text-center">
            {istoggle ? (
              <NavLink
                to="/home"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Home
              </NavLink>
            ) : (
              <BiHomeAlt className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/userlist"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                User
              </NavLink>
            ) : (
              <AiOutlineUser className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 relative">
            {istoggle ? (
              <NavLink
                to="/friendrequest"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Request
              </NavLink>
            ) : (
              <AiOutlineUserSwitch className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
            {istoggle ? null : FriendRequest.length > 0 ? (
              <div className="absolute bg-red h-[25px] w-[25px] top-1 right-1 rounded-full  flex justify-center items-center">
                <p className="text-secondari font-primari text-lg">
                  {FriendRequest.length}
                </p>
              </div>
            ) : null}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/message"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Messanger
              </NavLink>
            ) : (
              <BsFillChatFill className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/friends"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Friends
              </NavLink>
            ) : (
              <GiThreeFriends className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/blocklist"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Block
              </NavLink>
            ) : (
              <BiBlock className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/group"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Group
              </NavLink>
            ) : (
              <RiGroup2Fill className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <NavLink
                to="/settings"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending text-black "
                    : isActive
                    ? "active text-secondari font-semibold  font-primari text-xl hover:text-primari"
                    : "font-semibold font-primari"
                }
              >
                Settings
              </NavLink>
            ) : (
              <AiFillSetting className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
          <li className="py-2 hover:bg-secondari rounded-lg my-2 ">
            {istoggle ? (
              <button
                onClick={handlesignout}
                className="font-medium text-xl text-primari font-primari"
              >
                Log out
              </button>
            ) : (
              <MdOutlineLogout className="inline-block text-2xl text-secondari hover:text-primari" />
            )}
          </li>
        </ul>
        {/*  */}
      </div>
    </section>
  );
};

export default SideNav;
