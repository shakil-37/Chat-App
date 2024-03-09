import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import ProfileImage from "../styleComponents/ProfileImage";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Name from "../styleComponents/Name";
import Peragraph from "../styleComponents/Peragraph";
import Heading from "../styleComponents/Heading"
//
const BlockList = () => {
  //
  const db = getDatabase();
  const reduxData = useSelector((state) => state.setuser.user);
  const [BlockList, SetBlockList] = useState([]);
  const [BlockListSearchData, setBlockListSearchData] = useState([]);
  const navigate = useNavigate();
  // console.log(BlockListSearchData);

  // block user data get start
  useEffect(() => {
    const BlockListRef = ref(db, "block/");
    onValue(BlockListRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (reduxData.uid == item.val().BlockById) {
          list.push({
            Block: item.val().Block,
            BlockId: item.val().BlockId,
            Id: item.key,
          });
        }
        SetBlockList(list);
      });
    });
  }, []);
  // block user data get end

  //Unblock function start

  const HandleUnblock = (item) => {
    return set(push(ref(db, "friends/")), {
      senderName: item.Block,
      senderId: item.BlockId,
      receverName: reduxData.displayName,
      receverId: reduxData.uid,
    })
      .then(() => {
        return remove(ref(db, "block/" + item.Id));
      })
      .then(() => {
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      });
  };
  // Unblock function end
  //
  // HandleSearchBlock function start
  const HandleSearchBlock = (e) => {
    let list = [];
    BlockList.filter((item) => {
      if (item.Block.toLowerCase().includes(e.target.value.toLowerCase())) {
        list.push(item);
      }
    });
    setBlockListSearchData(list);
  };
  // HandleSearchBlock function end
  //

  //
  return (
    <section className="flex">
      <SideNav />
      <div className="px-4 w-full">
        <Heading>
          Block List
        </Heading>
        <div className="relative">
          <BsSearch className="absolute top-[50%] right-8 text-xl translate-y-[-50%]"/>
          <input
            onChange={HandleSearchBlock}
            type="text"
            placeholder="Search User"
            className="px-4 py-2 rounded-md outline-none border-[1px] w-full"
          />
        </div>
        <ul
          role="list"
          className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
        >
          {BlockListSearchData.length > 0 ? (
            BlockListSearchData.map((item, i) => {
              return (
                <li
                  key={i}
                  className="flex items-center gap-x-6 border-[1px] border-solid border-primari rounded-lg px-4 py-4"
                >
                  <ProfileImage imageid={item.BlockId} />
                  <div>
                    <Name>{item.Block}</Name>
                    <Peragraph>
                      Lorem, ipsum dolor sit amet consectetur adipisicing.
                    </Peragraph>
                    <button
                      className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => HandleUnblock(item)}
                    >
                      Unblock
                    </button>
                  </div>
                </li>
              );
            })
          ) : //
          BlockList.length > 0 ? (
            BlockList.map((item, i) => {
              return (
                <li
                key={i}
                className="flex items-center gap-x-6  border-[1px] border-solid border-primari rounded-lg px-4 py-4"
              >
                <ProfileImage imageid={item.BlockId} />
                <div>
                  <Name>{item.Block}</Name>
                  <Peragraph>
                    Lorem, ipsum dolor sit amet consectetur adipisicing.
                  </Peragraph>
                  <button
                    className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                    onClick={() => HandleUnblock(item)}
                  >
                    Unblock
                  </button>
                </div>
              </li>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <h1 className="text-2xl font-primari text-primari font-bold">
                !Opps No Block
              </h1>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
};

export default BlockList;
