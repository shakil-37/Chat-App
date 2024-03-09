import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import Heading from "../styleComponents/Heading";
const Home = () => {
  //
  const userdata = useSelector((state) => state.setuser.user);
  const navigate = useNavigate();
  // console.log(userdata);
  // userchaking start
  useEffect(() => {
    if (!userdata) {
      navigate("/login");
    }
  });
  // userchaking end
  return (
    <section>
      <div className="flex">
        <SideNav />
        <div className="px-4">
          <Heading>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi blanditiis maiores
          </Heading>
        </div>
      </div>
     
    </section>
  );
};

export default Home;
