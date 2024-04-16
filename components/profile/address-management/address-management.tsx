import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import { AES } from "crypto-js";
import moment from "moment";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AddAddress from "./addAddress";
import { Tooltip } from "react-tooltip";
import ConfirmationModel from "@/components/snippets/confirmation";
import { useQRCode } from "next-qrcode";
import clickOutSidePopupClose from "@/components/snippets/clickOutSidePopupClose";

interface fixSection {
  showActivity?: boolean;
  setShowActivity: Function;
  // activity?: any;
}
const AddressManagement = (props: fixSection) => {
  const [active, setActive] = useState(false);
  const { mode } = useContext(Context);
  const [itemOffset, setItemOffset] = useState(0);
  const { status, data: session } = useSession()
  const [data, setData] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [list, setList] = useState([]);
  const [confirm, setConfirm] = useState(0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('Are you sure you want to delete from your address book?');
  const [title, setTitle] = useState('Are you sure you want to delete this address?');
  const [postId, setPostId] = useState('');
  const [address, setAddress] = useState('');
  const [showSVG, setShowSVG] = useState(false);
  const [btnDisabledCopy, setBtnDisabledCopy] = useState(false);
  const { SVG } = useQRCode();

  useEffect(() => {
    getAllNetworks()
    getAllTokens()
    getAllWhitelistAddress()
  }, [])


  const getAllNetworks = async () => {
    try {
      let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/network`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());

      // console.log(activity.data,'-----activity data');
      setData(activity?.data);
    } catch (error) {

    }
  }
  const getAllTokens = async () => {
    try {
      let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
        method: "GET"
      }).then(response => response.json());

      // console.log(activity.data,'-----activity data');
      setTokens(tokenList?.data);
    } catch (error) {

    }
  }
  const getAllWhitelistAddress = async () => {
    try {
      let address = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/address/list`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());

      // console.log(address.data,'-----address data');
      setList(address?.data);
    } catch (error) {

    }
  }

  const updateStatus = async (data: any) => {
    try {
      const ciphertext = AES.encrypt(JSON.stringify(data), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let responseStatus = await fetch(
        `/api/address/update`,
        {
          headers: {
            "content-type": "application/json",
            "Authorization": session?.user?.access_token
          },
          method: "PUT",
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      // console.log(responseStatus, "==responseStatus");

      if (responseStatus) {
        getAllWhitelistAddress();
      }

    } catch (error) {
      console.log(error, "error in pair update");

    }
  };
  const actionPerform = async () => {

    if (status === 'authenticated') {
      let obj = {
        address_id: postId,
        user_id: session?.user?.user_id
      }

      const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let postResponse: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/address/deleteAddress`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(record)
      }).then(response => response.json());

      if (postResponse?.data) {
        toast.success('Address delted successfully', { autoClose: 2000 });
        getAllWhitelistAddress();
        setConfirm(0);
        setShow(false);
      }
      else {
        toast.error(postResponse?.data)
      }
    }
    else if (status === 'unauthenticated') {
      toast.error('Unauthorized user!!')
      signOut();
    }
  }

  const copyCode = (address: string) => {
    setBtnDisabledCopy(true);
    const input = document.createElement('textarea')
    input.value = address
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)

    toast.success('Address Copied', { autoClose: 2000 });
    setTimeout(() => {
      setBtnDisabledCopy(false);
    }, 3000);
  }


  const closePopup = () => {
    setShowSVG(false)
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });

  return (
    <>
      {/* <ToastContainer /> */}
      <section className="lg:p-40 p-[15px] bg-white dark:bg-d-bg-primary rounded-10">
        <div
          className="mb-5 flex gap-2 cursor-pointer"
          onClick={() => {
            // props.setShow(0);
            props?.setShowActivity(false);
          }}
        >
          <IconsComponent type="backIcon" hover={false} active={false} />
          <p className="nav-text-sm">Back</p>
        </div>
        <div className="flex gap-5 justify-between mb-[40px]">
          <p className="sec-title">Address Management</p>
          <div className="flex gap-2 items-center">
            <button onClick={() => {
              if (session?.user?.TwoFA === true) {

                setActive(true)
              }
              else {
                toast.warning('Request failed. Google Two Factor Authentication has not been activated. Please check and try again', { position: 'top-center' })
              }

            }} className=" solid-button w-full hover:bg-primary-800">
              Add address
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table width="100%" className="min-w-[1018px] w-full">
            <thead>
              <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                <th className="lg:sticky bg-white dark:bg-d-bg-primary py-5">
                  <div className="flex ">
                    <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">
                      Address label
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className=" py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Coin
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className=" py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Address
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className=" py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Network Type
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>

                <th className=" py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Status
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className=" py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                      Action
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 && list?.map((item: any, index: any) => {
                return (
                  <>
                    <tr>
                      <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky bg-white dark:bg-d-bg-primary">
                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                          {/* <Image src={`/assets/security/${item.image}`} width={30} height={30} alt="coins" /> */}
                          <p className="info-14-18 dark:text-white !leading-[30px]">
                            {item?.label}
                          </p>
                        </div>
                      </td>
                      <td className="">
                        <p className={`info-14-18 dark:text-white `}>{item?.global_token ? item?.global_token?.symbol : item?.token?.symbol}</p>
                      </td>

                      <td >
                        <div className="flex items-center gap-[5px]">
                          <p id="my-anchor-element" className={`info-14-18 dark:text-white cursor-pointer ${btnDisabledCopy === true ? '!cursor-not-allowed' : ''}`} onClick={() => {
                            btnDisabledCopy === false ? copyCode(item?.address) : '';
                          }}>
                            {item?.address.slice(0, 8)}{'*'.repeat(5)}{item?.address.slice(-8)}
                          </p>
                          <span data-tooltip-id="my-tooltip" className="relative cursor-pointer"
                            onClick={() => { setShowSVG(true), setAddress(item?.address) }} >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"

                              className="cursor-pointer"
                            >
                              <g clip-path="url(#clip0_6686_27482)">
                                <path d="M3.11161 5.25445H5.25447V3.11159H3.11161V5.25445ZM13.9598 8.46875H15.0312V11.817H13.9598V10.7455H12.8884V9.54019H11.8169V8.46875H12.8884V9.54019H13.9598V8.46875ZM10.7455 10.7455H12.8884V12.8884H13.9598V13.9598H15.0313V15.0313H12.8884V13.9598H11.817V11.817H10.7455V12.8884H9.5402V13.9599H10.7455V15.0313H8.46877V8.4688H10.7455V9.54023H9.5402V11.817H10.7455V10.7456V10.7455ZM0.96875 15.0312H7.39731V8.46875H0.96875V15.0312ZM2.04019 9.54017H6.32589V13.9598H2.04019V9.54017ZM3.11161 12.8884H5.25447V10.7455H3.11161V12.8884ZM8.46875 0.96875V7.39731H15.0312V0.96875H8.46875ZM13.9598 6.32589H9.54016V2.04019H13.9598V6.32589ZM0.96875 7.39731H7.39731V0.96875H0.96875V7.39731ZM2.04019 2.04019H6.32589V6.32589H2.04019V2.04019ZM12.8884 3.11161H10.7455V5.25447H12.8884V3.11161Z" fill={mode === "dark" ? "white" : "black"}></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_6686_27482">
                                  <rect width="16" height="16" fill="white"></rect>
                                </clipPath>
                              </defs>
                            </svg>


                          </span>
                        </div>
                        <Tooltip
                          id="my-tooltip"
                          render={({ content, activeAnchor }) => (
                            <SVG
                              text={`${item?.address !== '' ? item?.address : 'Test Qr Code'}`}
                              options={{
                                width: 100,
                                color: {
                                  dark: '#000000',
                                  light: '#ffffff',
                                },

                              }}
                            />
                          )}
                          // style={{ backgroundColor: , }}
                        />
                        <Tooltip anchorSelect="#my-anchor-element" content={item?.address} />
                      </td>

                      <td className="">
                        <p className="info-14-18 dark:text-white">
                          {item.network.fullname}
                        </p>
                      </td>

                      {/* <td> <button
                        onClick={() => updateStatus(item)}
                        className={`admin-outline-button ${item?.status == false
                          ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                          : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                          } !px-[10px] !py-[4px] whitespace-nowrap	`}
                      >
                        {item?.status == false ? "Activate " : "Inactivate"}
                      </button></td> */}

                      <td className="bg-white dark:bg-d-bg-primary py-5 cursor-pointer">
                        {/* {item?.status === true ? 'Active' : 'InActive'} */}

                        <div className="flex items-center justify-start w-full" >
                          <label htmlFor={item?.id} className="flex items-center cursor-pointer">
                            <input type="checkbox" id={item?.id} className="sr-only peer" checked={item?.status} onChange={() => { updateStatus(item) }} />
                            <div className={`block relative bg-[#CCCED9] w-[50px] h-[25px] p-1 rounded-full before:absolute before:top-[3px] before:bg-blue-600 before:w-[19px] before:h-[19px] before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-[27px] before:bg-white peer-checked:!bg-primary peer-checked:before:!bg-white `} ></div>
                          </label>
                        </div>
                      </td>
                      <td>
                        <button onClick={() => { setConfirm(1); setShow(true); setPostId(item?.id) }}>
                          <IconsComponent type='deleteIcon' hover={false} active={false} />
                        </button>
                      </td>

                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {
        active &&
        <AddAddress active={active} setActive={setActive} networks={data} session={session} refreshData={getAllWhitelistAddress} token={tokens} />
      }
      {confirm == 1 &&
        <ConfirmationModel setActive={setConfirm} setShow={setShow} title={title} message={message} show={show} actionPerform={actionPerform} />
      }
      {showSVG && (
        <>
          <div
            className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80`}
          ></div>
          <div ref={wrapperRef} className="fixed rounded-10 bg-white dark:bg-omega p-[20px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[200px] h-full z-[10] max-w-[400px] w-full ">

            <div className="flex items-center justify-end">

              <svg
                onClick={() => {
                  setShowSVG(false);
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

            <div className="shadow-2xl flex justify-center max-w-fit w-full mx-auto">
              <SVG
                text={`${address !== '' ? address : 'Test Qr Code'}`}
                options={{
                  width: 150,
                  color: {
                    dark: '#000000',
                    light: '#ffffff',
                  },

                }}
              />

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddressManagement;
