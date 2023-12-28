import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Context from "../contexts/context";
import SecurityVerification from "./securityVerification";
import QRCode from "qrcode";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { AES } from "crypto-js";


interface activeSection {
  setShow: any;
  setEnable:Function;
  session:any;
  setGoogleAuth:Function;
}

const GoogleAuth = (props:activeSection) => {
  // console.log(props?.session,"==props?.session?.secret");

  const { mode } = useContext(Context);
  const [active,setActive]= useState(false)
  const [qrImg, setImage] = useState('');
  const [secret, setSecret] = useState(props?.session?.user?.secret!==undefined && JSON.parse(props?.session?.user?.secret));

  

  useEffect(() => {
    QRCode.toDataURL(secret.otpauth_url, (err, image_data:any) => {
      setImage(image_data);
    })
  },[])


  const sendOtp = async () => {
    try {
      
        let obj = {};
        // let type =  props.session?.user.email!=='null'?'email':'number'
       let username= props.session?.user.email !== "null"
              ? props.session?.user.email
              : props.session?.user?.number;
          obj = {
            username: username,
            otp: "string",
          }
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());

        let userExist = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/user/googleAuth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: props?.session?.user?.access_token,
            },
            body: JSON.stringify(record),
          }
        );
        let res = await userExist.json();
          
        if (res.data.data !== undefined) {

          console.log(res.data.data);
          
          toast.success(res.data.data);
          props?.setGoogleAuth(true)
          setTimeout(()=>{
            setActive(!active)
          },1000)
        }
      //   props.formData.step = 2;
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
    <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
      <div className="flex items-center justify-between">
        <p className="sec-title">Google Authenticator</p>
        <svg
          onClick={() => {
            props.setShow(false);
            props?.setEnable(0)
          }}
          enableBackground="new 0 0 60.963 60.842"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 60.963 60.842"
          xmlSpace="preserve"
          className="max-w-[18px] cursor-pointer w-full"
        >
          <path
            fill={mode === "dark" ? "#fff" : "#000"}
            d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                            c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                            l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                            C61.42,57.647,61.42,54.687,59.595,52.861z"
          />
        </svg>
      </div>
      <div className="py-30 md:py-40">
        <div className="py-[10px]">
          <p className="info-14-18 text-center dark:text-white text-black">Scan Qr From Google Authenticator App</p>
          <div className="mt-[15px] p-5 max-w-[154px] bg-white rounded-5 shadow-card mx-auto">
            <Image src={qrImg} width={154} height={154} alt="QR" />
          </div>
        </div>
      

        <div className="pt-5 md:pt-30">
          <div className="mt-[5px] md:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
            <p className="sec-text text-ellipsis overflow-hidden">{secret?.base32}</p>
            <button className="solid-button py-2 sec-text font-normal" onClick={()=>{navigator.clipboard.writeText(secret?.base32); toast.success('copy to clipboard')}}>Copy</button>
          </div>
        </div>
      </div>
      <div className="flex gap-[20px]">
          <button className="solid-button2 w-full "  onClick={() => {
            props.setShow(false);
            props?.setEnable(0)
          }}>Cancel</button>
          <button className="solid-button px-[51px] w-full" onClick={()=>{sendOtp()}}>Next</button>
        </div>
    </div>
    {
      active &&
      <SecurityVerification  setShow={props?.setShow} setEnable={props.setEnable} setActive={setActive} session={props?.session} setGoogleAuth={props.setGoogleAuth}/>
    }
    </>
  );
};

export default GoogleAuth;
