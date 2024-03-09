import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import ProfileImage from "../styleComponents/ProfileImage";
import SideNav from "./SideNav";
import { BsSearch } from "react-icons/bs";
import Heading from "../styleComponents/Heading";
import Name from "../styleComponents/Name";
import Email from "../styleComponents/Email";
import Peragraph from "../styleComponents/Peragraph";

//
const Userlist = () => {
  //
  const db = getDatabase();
  const [userlistdata, setuserlistdata] = useState([]);
  const [request, setrequest] = useState([]);
  const reduxdata = useSelector((state) => state.setuser.user);
  const [Friends, setFriends] = useState([]);
  const [Block, SetBlock] = useState([]);
  const [userlistSearchData, setuserlistSearchData] = useState([]);

  // Userlist data  get start
  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      const list = [];
      snapshot.forEach((item) => {
        if (reduxdata.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });

      setuserlistdata(list);
    });
  }, []);
  // Userlist data get end

  // FriendRequest send start
  const Addfriend = (item) => {
    set(push(ref(db, "request/")), {
      senderName: reduxdata.displayName,
      senderId: reduxdata.uid,
      receverName: item.username,
      receverId: item.id,
    });
  };
  // FriendRequest send end
  //
  // FriendRequest function start
  useEffect(() => {
    const requestRef = ref(db, "request/");
    onValue(requestRef, (snapshot) => {
      let requestlist = [];
      snapshot.forEach((request) => {
        requestlist.push(request.val().senderId + request.val().receverId);
      });
      setrequest(requestlist);
    });
  }, []);
  // FriendRequest function end

  //Friends collection data get start
  useEffect(() => {
    const FriendsRef = ref(db, "friends");
    onValue(FriendsRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().receverId + item.val().senderId);
        // console.log(item.val().receverId + item.val().senderId;)
      });
      setFriends(list);
    });
  }, []);
  // Friends collection data get end

  //  Block user data get start
  useEffect(() => {
    const BlockRef = ref(db, "block/");
    onValue(BlockRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().BlockId + item.val().BlockById);
      });
      SetBlock(list);
    });
  }, []);
  // Block user data get end
  // Handle User Search function start
  const HandleSearchUser = (e) => {
    let list = [];
    userlistdata.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        list.push(item);
      }
    });
    setuserlistSearchData(list);
  };
  // Handle User Search function end
  //

  return (
    <section className="flex">
      <SideNav />
      <div className="px-4 w-full">
        <Heading>User List</Heading>
        <div className="relative">
          <BsSearch className="absolute top-[50%] right-8 text-xl translate-y-[-50%]" />
          <input
            onChange={HandleSearchUser}
            type="text"
            placeholder="Search User"
            className="px-4 py-2 rounded-md outline-none border-[1px] w-full"
          />
        </div>
        <ul
          role="list"
          className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-3  mt-6"
        >
          {userlistSearchData.length > 0 ? (
            userlistSearchData.map((user, id) => {
              return (
                <li
                  key={id}
                  className="flex items-center gap-x-6 border-[1px] border-solid border-primari rounded-lg px-4 py-4"
                >
                  <ProfileImage imageid={user.id} />
                  <div>
                    <Name>{user.username}</Name>
                    <Email>{user.email}</Email>
                    <Peragraph>Lorem ipsum dolorlit. Facilis, amet?</Peragraph>
                    {Block.includes(reduxdata.uid + user.id) ||
                    Block.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Blocked
                      </button>
                    ) : Friends.includes(reduxdata.uid + user.id) ||
                      Friends.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-black py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Already Friend
                      </button>
                    ) : request.includes(reduxdata.uid + user.id) ||
                      request.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Send
                      </button>
                    ) : (
                      <button
                        className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                        onClick={() => Addfriend(user)}
                      >
                        Add Frind
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          ) : userlistdata.length > 0 ? (
            userlistdata.map((user, id) => {
              return (
                <li
                  key={id}
                  className="flex items-center gap-x-6 border-[1px] border-solid border-primari rounded-lg px-4 py-4"
                >
                  <ProfileImage imageid={user.id} />
                  <div>
                    <Name>{user.username}</Name>
                    <Email>{user.email}</Email>
                    <Peragraph>Lorem ipsum dolorlit. Facilis, amet?</Peragraph>
                    {Block.includes(reduxdata.uid + user.id) ||
                    Block.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Blocked
                      </button>
                    ) : Friends.includes(reduxdata.uid + user.id) ||
                      Friends.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-black py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Friend
                      </button>
                    ) : request.includes(reduxdata.uid + user.id) ||
                      request.includes(user.id + reduxdata.uid) ? (
                      <button className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Send
                      </button>
                    ) : (
                      <button
                        className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                        onClick={() => Addfriend(user)}
                      >
                        Add Frind
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <div>
              <h1 className="text-2xl font-primari text-primari font-bold">
                !Opps No User
              </h1>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Userlist;
