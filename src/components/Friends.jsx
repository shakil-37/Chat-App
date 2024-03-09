import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import ProfileImage from "../styleComponents/ProfileImage";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Heading from "../styleComponents/Heading";
import Name from "../styleComponents/Name";
import Peragraph from "../styleComponents/Peragraph";

//
const Friends = () => {
  //
  const db = getDatabase();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const reduxdata = useSelector((state) => state.setuser.user);
  const [FriendsSearchData, setFriendsSearchData] = useState([]);
  console.log(FriendsSearchData);
  // frinds collection data get start
  useEffect(() => {
    const FriendRef = ref(db, "friends/");
    onValue(FriendRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          reduxdata.uid == item.val().receverId ||
          item.val().senderId == reduxdata.uid
        ) {
          list.push({ ...item.val(), Id: item.key });
        }
      });
      setFriends(list);
    });
  }, []);
  // friends collection data get end

  // Unfriend function start
  const handleUnfriend = (item) => {
    remove(ref(db, "friends/" + item.Id));
    // console.log(item);
  };
  // Unfriend function end

  // Block function start
  const Block = (item) => {
    if (reduxdata.uid === item.senderId) {
      set(push(ref(db, "block/")), {
        Block: item.receverName,
        BlockId: item.receverId,
        BlockBy: item.senderName,
        BlockById: item.senderId,
      })
        .then(() => {
          remove(ref(db, "friends/" + item.Id));
        })
        .then(() => {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        });
    } else {
      set(push(ref(db, "block/")), {
        Block: item.senderName,
        BlockId: item.senderId,
        BlockBy: item.receverName,
        BlockById: item.receverId,
      })
        .then(() => {
          remove(ref(db, "friends/" + item.Id));
        })
        .then(() => {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        });
    }
  };
  // Block function end
  //
  // HandleSearchFriend function start
  const HandleSearchFriend = (e) => {
    let list = [];
    friends.filter((item) => {
      if (
        item.senderName.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        list.push(item);
      }
    });
    setFriendsSearchData(list);
  };
  // HandleSearchFriend function end

  //
  return (
    <section className="flex">
      <SideNav />
      <div className="px-4 w-full">
        <Heading>Friend List</Heading>
        <div className="relative">
          <BsSearch className="absolute top-[50%] right-8 text-xl translate-y-[-50%]" />
          <input
            onChange={HandleSearchFriend}
            type="text"
            placeholder="Search User"
            className="px-4 py-2 rounded-md border-[1px] w-full"
          />
        </div>
        <ul
          role="list"
          className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
        >
          {FriendsSearchData.length > 0 ? (
            FriendsSearchData.map((item, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-x-6  border-[1px] border-solid border-primari rounded-lg px-4 py-4"
                >
                  <ProfileImage
                    imageid={
                      reduxdata.uid == item.receverId
                        ? item.senderId
                        : item.receverId
                    }
                  />

                  <div>
                    {item.receverId == reduxdata.uid ? (
                      <Name>{item.senderName}</Name>
                    ) : (
                      <Name>{item.receverName}</Name>
                    )}

                    <Peragraph>
                      Lorem ipsum dolor sit amet consectetur adipisicing.
                    </Peragraph>
                    <button
                      className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => handleUnfriend(item)}
                    >
                      Unfriend
                    </button>
                    <button
                      className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => Block(item)}
                    >
                      Block
                    </button>
                  </div>
                </li>
              );
            })
          ) : //
          friends.length > 0 ? (
            friends.map((item, i) => {
              return (
                <li
                key={i}
                className="flex items-center gap-x-6 border-[1px] border-solid border-primari rounded-lg px-4 py-4"
              >
                <ProfileImage
                  imageid={
                    reduxdata.uid == item.receverId
                      ? item.senderId
                      : item.receverId
                  }
                />

                <div>
                  {item.receverId == reduxdata.uid ? (
                    <Name>{item.senderName}</Name>
                  ) : (
                    <Name>{item.receverName}</Name>
                  )}

                  <Peragraph>
                    Lorem ipsum dolor sit amet consectetur adipisicing.
                  </Peragraph>
                  <button
                    className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                    onClick={() => handleUnfriend(item)}
                  >
                    Unfriend
                  </button>
                  <button
                    className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                    onClick={() => Block(item)}
                  >
                    Block
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

export default Friends;
