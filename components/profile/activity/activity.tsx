import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import { AES } from "crypto-js";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface fixSection {
  showActivity?: boolean;
  setShowActivity: Function;
  // activity?: any;
}
const Activity = (props: fixSection) => {
  const [active, setActive] = useState(1);
  const { mode } = useContext(Context);
  const [itemOffset, setItemOffset] = useState(0);
  const { data: session } = useSession()
  const [data, setData] = useState([]);

  const clearActivity = async () => {

    let obj = {
      user_id: session?.user?.user_id
    }

    const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
    let record = encodeURIComponent(ciphertext.toString());

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/user/activity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.user?.access_token,
        },
        body: JSON.stringify(record)
      }
    ).then((response) => response.json());


    if (response) {
      toast.success(response?.data),
      setData([]);
    }

  };

  useEffect(() => {
    // setData(props?.activity);
    getActivityData();
  }, []);

  const getActivityData = async () => {
    try {
      let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${session?.user?.user_id}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());

      console.log(activity.data,'-----activity data');
      setData(activity?.data);
    } catch (error) {

    }
  }

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
          <p className="sec-title">Activity log</p>
          <div className="flex gap-2 items-center">
            {/* <div className="border w-full rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px]  py-[13px] px-[10px] ">
              <Image
                alt="search"
                loading="lazy"
                width="24"
                height="24"
                decoding="async"
                data-nimg="1"
                src="/assets/history/search.svg"
              />
              <input
                type="search"
                placeholder="Search"
                className="nav-text-sm !text-beta outline-none bg-[transparent] w-full"
              />
            </div> */}
            <button className=" solid-button w-full hover:bg-primary-800" onClick={() => clearActivity()}>
              Clear All
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
                      Device
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
                      IP Address
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
                      Location
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
                      Date / Time
                    </p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                {/* <th className=" py-5">
                <div className="flex justify-end">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">
                    Device
                  </p>
                  <Image
                    src="/assets/history/uparrow.svg"
                    width={15}
                    height={15}
                    alt="uparrow"
                  />
                </div>
              </th> */}
              </tr>
            </thead>
            <tbody>
              {data?.map((item: any, index: any) => {
                return (
                  <>
                    <tr>
                      <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky bg-white dark:bg-d-bg-primary">
                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                          {/* <Image src={`/assets/security/${item.image}`} width={30} height={30} alt="coins" /> */}
                          <p className="info-14-18 dark:text-white !leading-[30px]">
                            {item?.browser}/{item.deviceType}
                          </p>
                        </div>
                      </td>
                      <td className="">
                        <p className="info-14-18 dark:text-white">{item.ip}</p>
                      </td>

                      <td className="">
                        <p className="info-14-18 dark:text-white">
                          {item.location}
                        </p>
                      </td>
                      <td className="">
                        <p className="info-14-18 dark:text-white">
                          {moment(item.lastLogin).format("YYYY-MM-DD HH:mm:ss A")}
                        </p>
                      </td>
                      {/* <td className=" !text-end">
                      <p className="info-14-18 inline-block py-[5px] px-[9px] rounded-[4px]  ">
                        {item.deviceType}
                      </p>
                    </td> */}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Activity;
