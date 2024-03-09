import { useSelector } from "react-redux";
import SideNav from "./SideNav";
import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { FiPlusCircle } from "react-icons/fi";
import ProfileImage from "../styleComponents/ProfileImage";
import Heading from "../styleComponents/Heading";
import Name from "../styleComponents/Name";
import Peragraph from "../styleComponents/Peragraph";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
//
const Group = () => {
  const ReduxData = useSelector((state) => state.setuser.user);
  const [MyGroupModal, SetMyGroupModal] = useState(false);
  const [GroupName, SetGroupName] = useState("");
  const [GroupTittle, SetGroupTittle] = useState("");
  const [GroupNameError, SetGroupNameError] = useState("");
  const [GroupTittleError, SetGroupTittleError] = useState("");
  const [MyGroupdata, SetMyGroupData] = useState([]);
  const [Groupdata, SetGroupData] = useState([]);
  const [dotmodal, setdotmodal] = useState([]);
  const [GroupRequestModal, setGroupRequestModal] = useState(false);
  const [GroupRequest, setGroupRequest] = useState([]);
  const [GroupJoinButton, setGroupJoinButton] = useState([]);
  const [GroupInfo, setGroupInfo] = useState([]);
  const [GroupInfoModal, setGroupInfoModal] = useState(false);
  const [MyGroupFilterData, setMyGroupFilterData] = useState([]);
  const [GroupFilterData, setGroupFilterData] = useState([]);
  const [GroupMember, setGroupMember] = useState([]);
  const db = getDatabase();
  //
  // MyGroupModal function start
  const HandleMyGroupModal = () => {
    setTimeout(() => {
      SetMyGroupModal(!MyGroupModal);
    }, 1000);
  };
  // MyGroupModal function end
  // GroupName take function start
  const HandleGroupName = (e) => {
    SetGroupName(e.target.value);
    SetGroupNameError("");
  };
  // GroupName take function end
  // GroupTittle take function start
  const HandleGroupTittle = (e) => {
    SetGroupTittle(e.target.value);
    SetGroupTittleError("");
  };
  // GroupTittle take function end
  //GroupCreat function start
  const HandleCreactGroup = () => {
    if (!GroupName) {
      SetGroupNameError("Name Requerd");
    }
    if (!GroupTittle) {
      SetGroupTittleError("Tittle Requerd");
    }

    if ((GroupName, GroupTittle)) {
      set(push(ref(db, "groups/")), {
        Name: GroupName,
        Tittle: GroupTittle,
        Admin: ReduxData.displayName,
        AdminId: ReduxData.uid,
      }).then(() => {
        setTimeout(() => {
          SetMyGroupModal(!MyGroupModal);
        }, 1000);
        SetGroupName("");
        SetGroupTittle("");
        console.log("Group Creat Succes");
      });
    }
  };
  //  GroupCreat function end
  // GroupCreatCancel function start
  const HandleCreactGroupCancel = () => {
    setTimeout(() => {
      SetMyGroupModal(!MyGroupModal);
    }, 1000);
  };
  // GroupCreatCancel function end
  // MyGroup data get start
  useEffect(() => {
    const MyGroupRef = ref(db, "groups/");
    onValue(MyGroupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (ReduxData.uid == item.val().AdminId) {
          list.push({ ...item.val(), Id: item.key });
        }
      });
      SetMyGroupData(list);
    });
  }, []);
  // MyGroup data get end
  // Group data get start
  useEffect(() => {
    const GroupRef = ref(db, "groups/");
    onValue(GroupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (ReduxData.uid !== item.val().AdminId) {
          list.push({ ...item.val(), Id: item.key });
        }
      });
      SetGroupData(list);
    });
  }, []);
  // Group data get start
  //
  // HandleMyGroupDot function start
  const HandleMyGroupDot = (i) => {
    setdotmodal((prev) => {
      if (prev.includes(i)) {
        return prev.filter((item) => item !== i);
      } else {
        return [...prev, i];
      }
    });
  };

  // HandleMyGroupDot function end
  //
  // HandleMyGroupDelet function start
  const HandleMyGroupDelet = (item) => {
    remove(ref(db, "groups/" + item.Id));
  };
  // HandleMyGroupDelet function end
  //
  // GroupRequestModal function start
  const HandleGroupRequestModal = (request) => {
    setGroupRequestModal(!GroupRequestModal);
    const grouprequestRef = ref(db, "grouprequest/");
    onValue(grouprequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          ReduxData.uid == item.val().grouprequestreceverID &&
          item.val().groupId == request.Id
        ) {
          list.push({ ...item.val(), Id: item.key });
        }
      });
      setGroupRequest(list);
    });
  };
  // GroupRequestModal function end
  //
  // HandleGroupJoinRequest function start
  const HandleGroupJoinRequest = (item) => {
    set(push(ref(db, "grouprequest/")), {
      grouprequestsenderId: ReduxData.uid,
      grouprequestsenderName: ReduxData.displayName,
      grouprequestreceverName: item.Admin,
      grouprequestreceverID: item.AdminId,
      groupId: item.Id,
      groupName: item.Name,
      grouptittle: item.Tittle,
    });
  };
  // HandleGroupJoinRequest function end
  //
  // grouprequestbutton data get start
  useEffect(() => {
    const grouprequestbutton = ref(db, "grouprequest/");
    onValue(grouprequestbutton, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(
          item.val().grouprequestsenderId +
            item.val().grouprequestreceverID +
            item.val().groupId
        );
      });
      setGroupJoinButton(list);
    });
  }, []);
  // grouprequestbutton data get end
  //
  // HandleGroupRequestDelet function start
  const HandleGroupRequestDelet = (item) => {
    remove(ref(db, "grouprequest/" + item.Id));
  };
  // HandleGroupRequestDelet function end
  //
  // HandleGroupRequestAccept function start
  const HandleGroupRequestAccept = (item) => {
    set(push(ref(db, "groupmembers/")), {
      ...item,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.Id));
    });
  };
  // HandleGroupRequestAccept function end
  //
  // HandleGroupInfo function start
  const HandleGroupInfo = (groupinfo) => {
    setGroupInfoModal(!GroupInfoModal);
    const GroupmembersRef = ref(db, "groupmembers/");
    onValue(GroupmembersRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          item.val().grouprequestreceverID == ReduxData.uid &&
          item.val().groupId == groupinfo.Id
        ) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupInfo(list);
    });
  };
  // HandleGroupInfo function end
  //
  // HandleMyGroupSearchValue function start
  const HandleMyGroupSearchValue = (e) => {
    let list = [];
    MyGroupdata.filter((item) => {
      if (item.Name.toLowerCase().includes(e.target.value.toLowerCase())) {
        list.push(item);
      }
    });
    setMyGroupFilterData(list);
  };
  // HandleMyGroupSearchValue function end
  //
  // HandleGroupSearchValue function start
  const HandleGroupSearchValue = (e) => {
    let list = [];
    Groupdata.filter((item) => {
      if (item.Name.toLowerCase().includes(e.target.value.toLowerCase())) {
        list.push(item);
      }
    });
    setGroupFilterData(list);
  };
  // HandleGroupSearchValue function end
  // Groupmember button data get start
  useEffect(() => {
    const GroupmemberRef = ref(db, "groupmembers/");
    onValue(GroupmemberRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(
          item.val().groupId +
            item.val().grouprequestreceverID +
            item.val().grouprequestsenderId
        );
      });
      setGroupMember(list);
    });
  }, []);
  // Groupmember button data get end
  //
  return (
    <section className="flex">
      <SideNav />
      <div className="w-full px-4">
        {GroupInfoModal ? (
          <div className="px-4">
            <Heading>Group Members</Heading>
            <ul
              role="list"
              className="grid gap-x-3 gap-y-2 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
            >
              {GroupInfo.length > 0 ? (
                GroupInfo.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="border-[1px] border-solid border-primari rounded-lg px-4 py-4 text-center"
                    >
                      <ProfileImage imageid={item.grouprequestsenderId} />
                      <Name>{item.grouprequestsenderName}</Name>
                      <Peragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing.
                      </Peragraph>
                    </li>
                  );
                })
              ) : (
                <div className=" flex justify-center items-center h-full">
                  <h1 className="text-2xl font-primari text-primari font-bold">
                    !Opps No Members
                  </h1>
                </div>
              )}
            </ul>
          </div>
        ) : GroupRequestModal ? (
          <div className="px-4">
            <Heading>Group Request</Heading>
            <ul
              role="list"
              className="grid gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
            >
              {GroupRequest.length > 0 ? (
                GroupRequest.map((item, i) => (
                  <li
                    key={i}
                    className="border-[1px] border-solid border-primari rounded-lg px-4 py-4 text-center"
                  >
                    <ProfileImage imageid={item.grouprequestsenderId} />
                    <Name>{item.grouprequestsenderName}</Name>
                    <button
                      className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => HandleGroupRequestAccept(item)}
                    >
                      Accenpt
                    </button>
                    <button
                      className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                      onClick={() => HandleGroupRequestDelet(item)}
                    >
                      Delet
                    </button>
                  </li>
                ))
              ) : (
                <div className=" flex justify-center items-center h-full">
                  <h1 className="text-2xl font-primari text-primari font-bold">
                    !Opps No Request
                  </h1>
                </div>
              )}
            </ul>
          </div>
        ) : MyGroupModal ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-auto h-auto bg-secondari rounded-lg overflow-hidden px-6 py-6 shadow-lg border-[1px] border-solid border-primari">
              <Heading>Creat new group</Heading>
              <div>
                <input
                  onChange={HandleGroupName}
                  type="text"
                  placeholder="Group Name"
                  className="px-4 py-2 rounded-md border-[1px] w-full"
                />
                <p className="text-center mt-2 text-red font-primari font-medium">
                  {GroupNameError}
                </p>
              </div>
              <div>
                <input
                  onChange={HandleGroupTittle}
                  type="text"
                  placeholder="Group Tittle"
                  className="px-4 py-2 rounded-md border-[1px] w-full"
                />
                <p className="text-center mt-2 text-red font-primari font-medium ">
                  {GroupTittleError}
                </p>
              </div>
              <div className="text-center mt-2">
                <button
                  onClick={HandleCreactGroup}
                  className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-2"
                >
                  Creat
                </button>
                <button
                  onClick={HandleCreactGroupCancel}
                  className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Tabs>
            <TabList>
              <Tab>
                <h1>MY GROUP</h1>
              </Tab>
              <Tab>
                <h1>All GROUP</h1>
              </Tab>
            </TabList>

            <TabPanel>
              <div className="w-full px-4">
                <hr className="mt-2" />
                <div className="flex items-center rounded-lg shadow-sm py-1">
                  <div className="w-[10%]">
                    <FiPlusCircle
                      onClick={HandleMyGroupModal}
                      className="text-2xl cursor-pointer text-green w-full max-h-2xl"
                    />
                  </div>
                  <div className="w-[90%] text-left px-6">
                    <Peragraph>Lets creat some crazy community</Peragraph>
                    <Name>Creat your own group</Name>
                  </div>
                </div>
                <div className="relative mt-2">
                  <BsSearch className="absolute top-[50%] right-4 text-xl translate-y-[-50%]" />
                  <input
                    onChange={HandleMyGroupSearchValue}
                    type="text"
                    placeholder="Enter Group Name"
                    className="px-4 py-2 rounded-md border-[1px] w-full"
                  />
                </div>
                <ul
                  role="list"
                  className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 mt-6"
                >
                  {MyGroupFilterData.length > 0 ? (
                    MyGroupFilterData.map((item, i) => {
                      return (
                        <li
                          key={i}
                          className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                        >
                          {!dotmodal.includes(i) ? (
                            <div className="w-full">
                              <ProfileImage imageid={item.AdminId} />
                              <div className="w-full">
                                <Name>{item.Name}</Name>
                                <Name>{item.Admin}</Name>
                                <button
                                  onClick={() => HandleMyGroupDot(i)}
                                  className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                                >
                                  Details
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full grid gap-1">
                              <Peragraph>More option</Peragraph>
                              <button
                                className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleGroupRequestModal(item)}
                              >
                                Request
                              </button>
                              <button
                                className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleGroupInfo(item)}
                              >
                                Info
                              </button>
                              <button
                                className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleMyGroupDelet(item)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })
                  ) : MyGroupdata.length > 0 ? (
                    MyGroupdata.map((item, i) => {
                      return (
                        <li
                          key={i}
                          className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                        >
                          {!dotmodal.includes(i) ? (
                            <div className="w-full">
                              <ProfileImage imageid={item.AdminId} />
                              <div className="w-full">
                                <Name>{item.Name}</Name>
                                <Name>{item.Admin}</Name>
                                <button
                                  onClick={() => HandleMyGroupDot(i)}
                                  className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                                >
                                  Details
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full grid gap-1">
                              <Peragraph>More option</Peragraph>
                              <button
                                className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleGroupRequestModal(item)}
                              >
                                Request
                              </button>
                              <button
                                className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleGroupInfo(item)}
                              >
                                Info
                              </button>
                              <button
                                className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-1"
                                onClick={() => HandleMyGroupDelet(item)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <div className=" flex justify-center items-center h-full">
                      <h1 className="text-2xl font-primari text-primari font-bold">
                        !Opps No Groups
                      </h1>
                    </div>
                  )}
                </ul>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="w-full px-4">
                <hr className="mt-2" />
                <Peragraph>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Earum
                </Peragraph>
                <div className="relative mt-2">
                  <BsSearch className="absolute top-[50%] right-4 text-xl translate-y-[-50%]" />
                  <input
                    onChange={HandleGroupSearchValue}
                    type="text"
                    placeholder="Enter Group Name"
                    className="px-4 py-2 rounded-md border-[1px] w-full"
                  />
                </div>
                <Peragraph>Suggested</Peragraph>
                <ul
                  role="list"
                  className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-y-4 xl:col-span-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 mt-6"
                >
                  {GroupFilterData.length > 0 ? (
                    GroupFilterData.map((item, i) => {
                      return (
                        <li
                          key={i}
                          className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                        >
                          <ProfileImage imageid={item.AdminId} />

                          <div className="w-full grid">
                            <div className="w-full">
                              <Name>{item.Name}</Name>
                              <Peragraph>{item.Admin}</Peragraph>
                              {GroupMember.includes(
                                item.Id + item.AdminId + ReduxData.uid
                              ) ? (
                                <button className="bg-black py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                                  Member
                                </button>
                              ) : GroupJoinButton.includes(
                                  ReduxData.uid + item.AdminId + item.Id
                                ) ? (
                                <button className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                                  Send
                                </button>
                              ) : (
                                <button
                                  onClick={() => HandleGroupJoinRequest(item)}
                                  className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                                >
                                  Join
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : Groupdata.length > 0 ? (
                    Groupdata.map((item, i) => {
                      return (
                        <li
                          key={i}
                          className="gap-x-4  border-[1px] border-solid border-primari rounded-lg px-3 py-3 text-center"
                        >
                          <ProfileImage
                            imageid={item.AdminId}
                            className="w-full"
                          />

                          <div className="w-full grid">
                            <div className="w-full">
                              <Name>{item.Name}</Name>
                              <Peragraph className="font-regular text-primari font-secondari">
                                {item.Admin}
                              </Peragraph>
                              {GroupMember.includes(
                                item.Id + item.AdminId + ReduxData.uid
                              ) ? (
                                <button className="bg-black py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                                  Member
                                </button>
                              ) : GroupJoinButton.includes(
                                  ReduxData.uid + item.AdminId + item.Id
                                ) ? (
                                <button className="bg-primari py-1 text-secondari rounded-[30px] font-medium w-full mt-3">
                                  Send
                                </button>
                              ) : (
                                <button
                                  onClick={() => HandleGroupJoinRequest(item)}
                                  className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
                                >
                                  Join
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <div className=" flex justify-center items-center h-full">
                      <h1 className="text-2xl font-primari text-primari font-bold">
                        !Opps No Groups
                      </h1>
                    </div>
                  )}
                </ul>
              </div>
            </TabPanel>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default Group;
