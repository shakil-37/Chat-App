import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileImage from "../styleComponents/ProfileImage";
import SideNav from "./SideNav";
import { BsSearch } from "react-icons/bs";
import Name from "../styleComponents/Name";
import Peragraph from "../styleComponents/Peragraph";
import Heading from "../styleComponents/Heading";
//
const FriendRequest = () => {
  //
  const db = getDatabase();
  const [friendrequest, setrequest] = useState([]);
  const userdata = useSelector((state) => state.setuser.user);
  const [FriendRequestSearcData, setFriendRequestSearcData] = useState([]);
  // const navigate = useNavigate();
  // console.log(FriendRequestSearcData);
  //
  // FriendRequest data get start
  useEffect(() => {
    const RequestRef = ref(db, "request/");
    onValue(RequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().receverId === userdata.uid) {
          list.push({ ...item.val(), Id: item.key });
        }
      });
      setrequest(list);
    });
  }, []);
  // FriendRequest data get end

  // Friend data send start
  const Friend = (item) => {
    set(push(ref(db, "friends/")), {
      ...item,
    })
      .then(() => {
        remove(ref(db, "request/" + item.Id));
      })
      .then(() => {
        // navigate("/friends");
      });
  };

  // Friend data send end
  //
  // FriendRequest cancel function start
  const CancelRequest = (item) => {
    remove(ref(db, "request/" + item.Id));
  };
  // FriendRequest cancel function end
  //
  // HandleSearchFriendRequest function start
  const HandleSearchFriendRequest = (e) => {
    let list = [];
    friendrequest.filter((item) => {
      if (
        item.senderName.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        list.push(item);
      }
    });
    setFriendRequestSearcData(list);
  };
  // HandleSearchFriendRequest function end
  //
  return (
    <section className="flex">
      <SideNav />
      <div className="px-4 w-full">
        <Heading>Friend Request</Heading>
        <div className="relative">
          <BsSearch className="absolute top-[50%] right-8 text-xl translate-y-[-50%]" />
          <input
            onChange={HandleSearchFriendRequest}
            type="text"
            placeholder="Search User"
            className="px-4 py-2 rounded-md outline-none border-[1px] w-full"
          />
        </div>
        <ul
          role="list"
          className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
        >
          {FriendRequestSearcData.length > 0 ? (
            FriendRequestSearcData.map((item, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-x-6  border-[1px] border-solid border-primari rounded-lg px-4 py-4"
                >
                  <ProfileImage imageid={item.senderId} />

                  <div>
                    <Name>{item.senderName}</Name>

                    <Peragraph>
                      Lorem ipsum dolor sit amet consectetur
                    </Peragraph>
                    <button
                      className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => Friend(item)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => CancelRequest(item)}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              );
            })
          ) : //
          friendrequest.length > 0 ? (
            friendrequest.map((item, i) => {
              return (
                <li
                key={i}
                className="flex items-center gap-x-6  border-[1px] border-solid border-primari rounded-lg px-4 py-4"
              >
                <ProfileImage imageid={item.senderId} />

                <div>
                  <Name>{item.senderName}</Name>

                  <Peragraph>
                    Lorem ipsum dolor sit amet consectetur
                  </Peragraph>
                  <button
                    className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                    onClick={() => Friend(item)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                    onClick={() => CancelRequest(item)}
                  >
                    Cancel
                  </button>
                </div>
              </li>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <h1 className="text-2xl font-primari text-primari font-bold">
                !Opps No Request
              </h1>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default FriendRequest;
