import { createRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { setuser } from "../slices/userSlice";
import { updateProfile } from "firebase/auth";
import Heading from "../styleComponents/Heading";
//
const Profilemodal = () => {
  //
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("");
  const cropperRef = createRef();
  const navigate = useNavigate();
  const storage = getStorage();
  const userdata = useSelector((state) => state.setuser.user);
  const storageRef = ref(storage, userdata.uid);
  const dispatch = useDispatch();
  //
  const handleprofilepickinput = (e) => {
    let files;
    if (e.target) {
      files = e.target.files;
    }
    //
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
    //
  };
  //

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      uploadString(storageRef, cropData, "data_url").then((snapshot) => {
        // console.log("Uploaded a data_url string!");
        //
        getDownloadURL(ref(storage, userdata?.uid))
          .then((url) => {
            updateProfile(userdata, {
              photoURL: url,
            });
            dispatch(setuser({ ...userdata, photoURL: url }));
            //
            localStorage.setItem(
              "userinfo",
              JSON.stringify({ ...userdata, photoURL: url })
            );
          })
          //
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });

        //
        setTimeout(() => {
          navigate("/home");
        }, 1000);
        //
      });
    }
  };

  //
  const handlecancelmodal = () => {
    navigate("/home");
  };
  //
  // image upload ta validation kora lagble

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="w-auto h-auto bg-secondari rounded-lg overflow-hidden px-6 py-6 shadow-lg border-[1px] border-solid border-primari">
        <Heading>Update your profile</Heading>
        {image && (
          <div>
            <div className="h-[150px] w-[150px] mx-auto rounded-full overflow-hidden">
              <div className="img-preview h-full w-full" />
            </div>
            <div className="h-[200px] w-[200px] mt-5  mx-auto overflow-hidden ">
              <Cropper
                style={{ height: "100%", width: "100%" }}
                ref={cropperRef}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
              />
            </div>
          </div>
        )}
        <input onChange={handleprofilepickinput} type="file" className="mt-4" />
   
        <div>
        <button
            onClick={getCropData}
            className="bg-green py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
          >
            Upload
          </button>
          <button
            onClick={handlecancelmodal}
            className="bg-red py-1 text-secondari rounded-[30px] font-medium w-full mt-3"
          >
            Cancel
          </button>
        </div>
       
      </div>
    </section>
  );
};

export default Profilemodal;
