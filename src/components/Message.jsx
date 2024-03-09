import SideNav from "./SideNav";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "../styleComponents/ProfileImage";
import { AiOutlineAudio } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiLaughing } from "react-icons/bs";
import { setactive } from "../slices/activeslice";
import { FiPhone } from "react-icons/fi";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ModalImage from "react-modal-image";
import Heading from "../styleComponents/Heading";
import Name from "../styleComponents/Name";
import Peragraph from "../styleComponents/Peragraph";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// ref, uploadBytesResumable, getDownloadURL
const Message = () => {
  //
  const db = getDatabase();
  const dispatch = useDispatch();
  const [Friends, setFriends] = useState([]);
  const [FriendsSearchData, setFriendsSearchData] = useState([]);
  const [Groupdata, setGroupdata] = useState([]);
  const reduxdata = useSelector((state) => state.setuser.user);
  const chatuser = useSelector((state) => state.active.active);
  const [sendvalue, setsendvalue] = useState("");
  const [singlemsg, setsinglemsg] = useState([]);
  const stroge = getStorage();
  //

  // Friends collection data get start
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
  // Friends collection data get end
  //  mygroup data get start
  useEffect(() => {
    const MygroupRef = ref(db, "groups/");
    onValue(MygroupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (item.val().AdminId == reduxdata.uid) {
          list.push(item.val());
        }
      });
      setGroupdata(list);
    });
  }, []);
  // mygroup data get end
  //
  // HandleFriendSearchData function start
  const HandleFriendSearchData = (e) => {
    let list = [];
    Friends.filter((item) => {
      if (reduxdata.uid == item.receverId) {
        if (item.senderName.includes(e.target.value)) {
          list.push(item);
        }
      } else {
        if (item.receverName.includes(e.target.value)) {
          list.push(item);
        }
      }

      setFriendsSearchData(list);
    });
  };
  // HandleFriendSearchData function end
  //
  // HandleActive function start
  const HandleActive = (item) => {
    if (item.receverId == reduxdata.uid) {
      dispatch(
        setactive({
          Status: "single",
          Id: item.senderId,
          Name: item.senderName,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          Status: "single",
          Id: item.senderId,
          Name: item.senderName,
        })
      );
    } else {
      dispatch(
        setactive({
          Status: "single",
          Id: item.receverId,
          Name: item.receverName,
        })
      );
      localStorage.setItem(
        "active",
        JSON.stringify({
          Status: "single",
          Id: item.receverId,
          Name: item.receverName,
        })
      );
    }
  };
  // HandleActive function end
  //
  // HandlesendMessage function start
  const HandlesendMessage = () => {
    if (!sendvalue) {
      alert("msg box khali");
    } else if (chatuser?.Status == "single") {
      set(push(ref(db, "singlemsg/")), {
        message: sendvalue,
        msgsendId: reduxdata.uid,
        msgsendName: reduxdata.displayName,
        msgreceveId: chatuser.Id,
        msgreceveName: chatuser.Name,
        time: `${new Date().getHours() % 12 || 12}:${new Date().getMinutes()} ${
          new Date().getDate() >= 12 ? "Am" : "Pm"
        }/${new Date().getDate()}/ ${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()}`,
      })
        .then(() => {
          setsendvalue("");
          console.log("msg send succes");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  // HandlesendMessage function end
  // single msg data get start
  useEffect(() => {
    const singlemsgRef = ref(db, "singlemsg/");
    onValue(singlemsgRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          (item.val().msgsendId == reduxdata.uid &&
            item.val().msgreceveId == chatuser?.Id) ||
          (item.val().msgreceveId == reduxdata.uid &&
            item.val().msgsendId == chatuser?.Id)
        ) {
          list.push(item.val());
        }
      });
      setsinglemsg(list);
    });
  }, [chatuser?.Id]);
  // single msg data get end

  // MessageImgsend function start
  const MessageImgsend = (e) => {
    const msgimgRef = sref(stroge, "singlemsg/" + e.target.files[0]?.name);
    const uploadTask = uploadBytesResumable(msgimgRef, e.target.files[0]);
    //
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          // ...
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          set(push(ref(db, "singlemsg/")), {
            img: downloadURL,
            msgsendId: reduxdata.uid,
            msgsendName: reduxdata.displayName,
            msgreceveId: chatuser.Id,
            msgreceveName: chatuser.Name,
            time: `${
              new Date().getHours() % 12 || 12
            }:${new Date().getMinutes()} ${
              new Date().getDate() >= 12 ? "Am" : "Pm"
            }/${new Date().getDate()}/ ${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
          });
        });
      }
    );
    //
  };
  // MessageImgsend function end
  //
  return (
    <section className="flex">
      <SideNav />
      <div className="px-4 grid grid-cols-2">
        <div>
          <Tabs>
            <TabList>
              <Tab>Group</Tab>
              <Tab>Friend</Tab>
            </TabList>
            <TabPanel>
              <ul
                role="list"
                className="grid gap-x-2 gap-y-2 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 mt-6"
              >
                {Groupdata.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                    >
                      <ProfileImage imageid={item.AdminId} />
                      <Name>{item.Name}</Name>
                      <Peragraph>{item.Tittle}</Peragraph>
                      <button className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                        Message
                      </button>
                    </li>
                  );
                })}
              </ul>
            </TabPanel>
            <TabPanel>
              <div>
                <div className="relative">
                  <BsSearch className="absolute top-[50%] right-4 translate-y-[-50%]" />
                  <input
                    onChange={HandleFriendSearchData}
                    className="px-4 py-2 rounded-md border-[1px] w-full"
                    type="text"
                    placeholder="Search Friends"
                  />
                </div>

                <ul
                  role="list"
                  className="grid gap-x-2 gap-y-2 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 mt-6"
                >
                  {FriendsSearchData.length > 0
                    ? FriendsSearchData.map((item, i) => {
                        return (
                          <li
                            key={i}
                            className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                          >
                            <ProfileImage
                              imageid={
                                reduxdata?.uid == item.receverId
                                  ? item.senderId
                                  : item.receverId
                              }
                            />
                            {item.receverId == reduxdata.uid ? (
                              <Name>{item.senderName}</Name>
                            ) : (
                              <Name> {item.receverName}</Name>
                            )}

                            <button
                              onClick={() => HandleActive(item)}
                              className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                            >
                              Message
                            </button>
                          </li>
                        );
                      })
                    : Friends.map((item, i) => {
                        return (
                          <li
                            key={i}
                            className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                          >
                            <ProfileImage
                              imageid={
                                reduxdata?.uid == item.receverId
                                  ? item.senderId
                                  : item.receverId
                              }
                            />

                            {item.receverId == reduxdata?.uid ? (
                              <Name>{item.senderName}</Name>
                            ) : (
                              <Name>{item.receverName}</Name>
                            )}

                            <button
                              onClick={() => HandleActive(item)}
                              className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                            >
                              Message
                            </button>
                          </li>
                        );
                      })}
                </ul>
              </div>
            </TabPanel>
          </Tabs>
        </div>
        <div>
          {chatuser?.Status == "single" ? (
            <div>
              <div className="flex justify-between items-center px-4">
                <ProfileImage imageid={chatuser.Id} />
                <div>
                  <Name>{chatuser?.Name}</Name>
                  <Peragraph>{chatuser?.Status}</Peragraph>
                </div>
                <FiPhone className="text-2xl" />
              </div>
              {singlemsg.map((item, i) => {
                return item.msgsendId == reduxdata.uid ? (
                  item.message ? (
                    <div key={i} className="text-right">
                      <div className="chat chat-end">
                        <div className="chat-bubble">
                          <h1 className="font-secondari  font-normal text-secondari text-base">
                            {item.message}
                          </h1>
                        </div>
                      </div>
                      <p>{item.time}</p>
                    </div>
                  ) : (
                    <div key={i} className="mt-2 text-right">
                      <div className="inline-block w-[250px] h-[200px]  rounded-lg px-1 py-1 overflow-hidden">
                        <ModalImage
                          small={item.img}
                          large={item.img}
                          alt="Hello World!"
                        />
                      </div>
                      <p>{item.time}</p>
                    </div>
                  )
                ) : item.message ? (
                  <div className="text-left " key={i}>
                    <div className="chat chat-start">
                      <div className="chat-bubble">
                        <h1 className="font-secondari font-normal text-secondari text-base">
                          {item.message}
                        </h1>
                      </div>
                    </div>
                    <p>{item.time}</p>
                  </div>
                ) : (
                  <div className="mt-2 text-left" key={i}>
                    <div className="inline-block w-[250px] h-[200px] rounded-lg px-1 py-1 overflow-hidden ">
                      <ModalImage
                        small={item.img}
                        large={item.img}
                        alt="Hello World!"
                      />
                    </div>
                    <p>{item.time}</p>
                  </div>
                );
              })}
              <div className="sticky left-0  bottom-0 flex items-center bg-[#F2F3F4] py-1 w-full">
                <div className="flex w-[15%] justify-between px-2">
                  <AiOutlineAudio className="cursor-pointer text-2xl" />
                  <label>
                    <input
                      onChange={MessageImgsend}
                      type="file"
                      className="hidden"
                    />
                    <CiImageOn className="cursor-pointer text-2xl" />
                  </label>
                  <BsEmojiLaughing className="cursor-pointer text-2xl" />
                </div>
                <div className="w-[70%]">
                  <input
                    value={sendvalue}
                    onChange={(e) => setsendvalue(e.target.value)}
                    className="w-full py-2  px-10 outline-none"
                    type="text"
                    placeholder="Write message"
                  />
                </div>
                <div className="w-[15%] text-center">
                  <button
                    onClick={HandlesendMessage}
                    className="font-secondari text-lg px-4 cursor-pointer font-semibold text-black"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            //
            <div className="flex justify-center items-center h-full">
              <h1 className="text-2xl font-primari text-primari font-bold">
                !Opps No Chat
              </h1>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Message;
