import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import profileDemu from "../images/profile.jpg";
//
const ProfileImage = ({ imageid }) => {
  const [Image, setImage] = useState("");
  const stroge = getStorage();
  const imageRef = ref(stroge, imageid);
  // Profile Image get start
  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        setImage(url);
      })
      .catch((error) => {
        // Handle any errors
        console.log(error);
      });
  }, [imageid]);

  // ProfileImage get end
  //
  return (
    
    <div className="avatar">
      <div className="max-w-[100px] min-w-auto rounded-full overflow-hidden border-[1px] border-solid border-green">
        <img src={Image ? Image : profileDemu} className="w-fll h-full object-cover" />
      </div>
    </div>
  );
};

export default ProfileImage;
