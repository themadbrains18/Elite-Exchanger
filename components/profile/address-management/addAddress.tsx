import React, { useContext, useRef, useState } from "react";
import Context from "../../contexts/context";
import Image from "next/image";
import FiliterSelectMenu from "../../snippets/filter-select-menu";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ConfirmPopup from "@/pages/customer/profile/confirm-popup";
import Verification from "../../snippets/verification";
import clickOutSidePopupClose from "../../snippets/clickOutSidePopupClose";
import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";

const schema = yup.object().shape({
  tokenID: yup.string().optional().default(""),
  networkId: yup.string().optional().default(""),
  label: yup.string().required("This field is required.").max(20),
  address: yup.string().required("This field is required.").max(50),
});

interface activeSection {
  setActive: Function;
  refreshData: Function;
  networks: any;
  token: any;
  active: any;
  session: any;
}

type UserSubmitForm = {
  tokenID: string;
  networkId: string;
  address: string;
  label: string;
  user_id?: string;
  status?: boolean;
  username?: string;
  otp?: string;
  step?: number;
};
const AddAddress = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedCoin, setSelectedCoin] = useState();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const [enable, setEnable] = useState(1);
  const [sendOtpRes, setSendOtpRes] = useState<any>();
  const [disable, setDisable] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);
  const [unSelectCoinError, setUnSelectCoinError] = useState('');

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // console.log(props?.networks, "== props?.networks");


  const list = props?.networks.filter((item: any) => {
    if (process.env.NEXT_PUBLIC_APPLICATION_MODE === "dev") {
      return item.network === "testnet";
    } else {
      return item.network === "mainnet";
    }
  });

  const getNetworkDetail = (network: any) => {
    setSelectedNetwork(network?.id);
    clearErrors("networkId");
  };
  const filterNetworkListByCoin = (token: any) => {
    setSelectedCoin(token?.id);
    clearErrors("tokenID");
    setUnSelectCoinError("")
  };

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {
      if (selectedCoin === "") {
        setError("tokenID", {
          type: "custom",
          message: "Please select coin.",
        });
        return;
      } else {
        if(selectedCoin!==undefined){
          data.tokenID = selectedCoin;
          clearErrors("tokenID");
          setUnSelectCoinError("")
        }
      }
      if (selectedNetwork === "") {
        setError("networkId", {
          type: "custom",
          message: "Please select network.",
        });
        return;
      } else {
        data.networkId = selectedNetwork;
        clearErrors("networkId");
      }
      setDisable(true);
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number;
      data.user_id = props.session?.user?.user_id;
      data.label = data?.label;
      data.address = data?.address
      data.status = true;
      data.username = username
      data.otp = "string";
      data.step = 1;

      // console.log(data,"==data");
      

      if (session !== null && session?.user !== undefined) {
        const ciphertext = AES.encrypt(
          JSON.stringify(data),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/address`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": props?.session?.user?.access_token
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());

        if (response?.data?.status === 200) {
          // toast.success(response?.data?.data);
          setAddressVerified(true);
          setTimeout(() => {
            setFormData(data);
            setDisable(false);
            setEnable(2);
          }, 1000);
        }
        else {
          toast.error(response?.data?.data, { autoClose: 2000 });
          setTimeout(() => {
            setDisable(false);
          }, 3000);
        }
      }
      else {
        setDisable(false);
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);
      }

    } catch (error) {
      console.log(error);
      setDisable(false);
    }
  };

  const snedOtpToUser = async () => {
    try {
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number

      let obj = {
        username: username,
        address: formData?.address,
        networkId: formData?.networkId,
        tokenID: formData?.tokenID,
        user_id: formData?.user_id,
        label: formData?.label,
        status: formData?.status,
        otp: "string",
        step: 2
      }

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/address`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": props?.session?.user?.access_token
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());

        if (response?.data?.status === 200) {
          toast.success(response?.data?.data?.message);
          setSendOtpRes(response?.data?.data?.otp);
          setTimeout(() => {
            setEnable(3);
          }, 500)
        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }
    } catch (error) {

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      let request = {
        username: username,
        address: formData?.address,
        networkId: formData?.networkId,
        tokenID: formData?.tokenID,
        user_id: formData?.user_id,
        label: formData?.label,
        status: formData?.status,
        otp: otp,
        step: 3
      }
      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": props?.session?.user?.access_token
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      if (response.data.status === 200) {
        toast.success("Whitelist address created successfully.");

        setTimeout(() => {
          reset();
          props.setActive(false);
          props.refreshData();
        }, 3000);

      } else {
        toast.error(response?.data?.data?.message !== undefined ? response?.data?.data?.message : response?.data?.data);
      }
    } catch (error) {

    }
  }

  const closePopup = () => {
    props?.setActive(false);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      {/* <ToastContainer position="top-right" limit={1} /> */}
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80`}
      ></div>
      {enable === 1 && (
        <div ref={wrapperRef} className="max-h-[614px] lg:max-h-fit overflow-y-auto max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between pb-[10px] md:pb-[15px] border-b border-grey-v-2 dark:border-opacity-[15%] dark:border-beta">
            <p className="sec-title">Add Withdrawal Address</p>
            <svg
              onClick={() => {
                props.setActive(false);
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
          <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="py-30 md:py-10">
              <div className="mb-[15px] md:mb-5">
                <label className="sm-text ">Address label</label>
                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex rounded-5 p-[11px] md:p-[15px]">
                  <input
                    type="text"
                    {...register("label")}
                    name="label"
                    maxLength={20}
                    placeholder="Enter Address Label"
                    className="outline-none max-w-[355px] sm-text w-full bg-[transparent]"
                  />


                </div>
                {errors.label && (
                  <p className="errorMessage">{errors.label.message}</p>
                )}
                {/* <p className="mt-[10px] text-end text-buy sm-text">
                  Valid Address
                </p> */}
              </div>

              {
        props?.token &&
        <div className="relative max-w-full  w-full mt-20">
            <label className="sm-text mb-[10px] block">Coin</label>
          <FilterSelectMenuWithCoin
            data={props?.token}
            border={true}
            dropdown={1}
            filterNetworkListByCoin={filterNetworkListByCoin}
          />
          {unSelectCoinError!=="" && <p className="errorMessage">{unSelectCoinError}</p>}
        </div>
      }
              <div className="my-20">
                <label className="sm-text mb-[10px] block">Network</label>
                <FiliterSelectMenu
                  data={list}
                  placeholder="Select Network type"
                  auto={false}
                  widthFull={true}
                  onNetworkChange={getNetworkDetail}
                  depositToken={selectedCoin} setUnSelectCoinError={setUnSelectCoinError}
                />
                {errors.networkId && (
                  <p className="errorMessage">{errors.networkId.message}</p>
                )}
              </div>

              <div className="mb-[15px] md:mb-5">
                <label className="sm-text ">Destination Address</label>
                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex rounded-5 p-[11px] md:p-[15px]">
                  <input
                    type="text"
                    {...register("address")}
                    name="address"
                    maxLength={50}
                    placeholder="Enter Address"
                    className="outline-none max-w-[355px] sm-text w-full bg-[transparent]"
                  />
                  {addressVerified === true &&
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Icon">
                        <path id="Mask" fillRule="evenodd" clipRule="evenodd" d="M20.997 11.7865H21C21.551 11.7865 21.999 12.2325 22 12.7835C22.008 15.4545 20.975 17.9695 19.091 19.8635C17.208 21.7575 14.7 22.8045 12.029 22.8125H12C9.33905 22.8125 6.83605 21.7805 4.94905 19.9035C3.05505 18.0205 2.00805 15.5125 2.00005 12.8415C1.99205 10.1695 3.02505 7.6555 4.90905 5.7615C6.79205 3.8675 9.30005 2.8205 11.971 2.8125C12.766 2.8245 13.576 2.9045 14.352 3.0905C14.888 3.2205 15.219 3.7605 15.089 4.2975C14.96 4.8335 14.417 5.1635 13.883 5.0355C13.262 4.8855 12.603 4.8225 11.977 4.8125C9.84005 4.8185 7.83305 5.6565 6.32705 7.1715C4.82005 8.6865 3.99405 10.6985 4.00005 12.8355C4.00605 14.9725 4.84405 16.9785 6.35905 18.4855C7.86905 19.9865 9.87105 20.8125 12 20.8125H12.023C14.16 20.8065 16.167 19.9685 17.673 18.4535C19.18 16.9375 20.006 14.9265 20 12.7895C19.999 12.2375 20.445 11.7875 20.997 11.7865ZM8.29325 12.1056C8.68425 11.7146 9.31625 11.7146 9.70725 12.1056L11.9513 14.3496L18.2482 7.15361C18.6123 6.74061 19.2432 6.69661 19.6593 7.06061C20.0742 7.42361 20.1162 8.05561 19.7523 8.47161L12.7523 16.4716C12.5702 16.6796 12.3102 16.8026 12.0332 16.8126H12.0002C11.7353 16.8126 11.4812 16.7076 11.2933 16.5196L8.29325 13.5196C7.90225 13.1286 7.90225 12.4966 8.29325 12.1056Z" fill='#00ff00' />
                      </g>
                    </svg>
                  }

                </div>
                {errors.address && (
                  <p className="errorMessage">{errors.address.message}</p>
                )}

              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" className="solid-button2 w-full" onClick={() => { props?.setActive(false) }}>Cancel</button>
              <button disabled={disable} className={`solid-button w-full flex items-center justify-center ${disable === true ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {disable === true &&
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                }
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {enable === 2 && (
        <ConfirmPopup
          setEnable={setEnable}
          setShow={props.setActive}
          type="number"  onWheel={(e) => (e.target as HTMLElement).blur()} 
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
        />
      )}

      {enable === 3 && (
        <Verification
          setEnable={setEnable}
          type="email"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
          snedOtpToUser={snedOtpToUser}
          sendOtpRes={sendOtpRes}
          setShow={props.setActive}
        />
      )}

    </>
  );
};

export default AddAddress;
