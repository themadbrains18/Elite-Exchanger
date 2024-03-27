import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import { AES } from "crypto-js";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AddAddress from "./addAddress";

interface fixSection {
  showActivity?: boolean;
  setShowActivity: Function;
  // activity?: any;
}
const AddressManagement = (props: fixSection) => {
  const [active, setActive] = useState(false);
  const { mode } = useContext(Context);
  const [itemOffset, setItemOffset] = useState(0);
  const { data: session } = useSession()
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);

  useEffect(()=>{
  getAllNetworks()
  getAllWhitelistAddress()
  },[])


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
  const getAllWhitelistAddress = async () => {
    try {
      let address = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/address/list?user_id=${session?.user?.user_id}`, {
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
  

  return (
    <>
      <ToastContainer />
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
            <button onClick={()=>{
                setActive(true)
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
                    Whitelist
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
                    Network
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
              {list?.map((item: any, index: any) => {
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
                        <p className={`info-14-18 dark:text-white ${item?.status===true?'text-dark-green':'text-red-dark'}`}>{item?.status===true?"Active":"Inactive"}</p>
                      </td>

                      <td className="">
                        <p className="info-14-18 dark:text-white">
                          {item.address}
                        </p>
                      </td>
                      <td className="">
                        <p className="info-14-18 dark:text-white">
                     {item.network.fullname}
                        </p>
                      </td>

                      <td> <button
                            onClick={() => updateStatus(item)}
                            className={`admin-outline-button ${item?.status == false
                              ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                              : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                              } !px-[10px] !py-[4px] whitespace-nowrap	`}
                          >
                            {item?.status == false ? "Activate " : "Inactivate"}
                          </button></td>
                    
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
<AddAddress active={active} setActive={setActive} networks={data} session={session} refreshData={getAllWhitelistAddress}/>
      }
    </>
  );
};

export default AddressManagement;
