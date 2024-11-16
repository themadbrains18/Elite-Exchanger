import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import { formatDate } from "@/libs/subdomain";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";

/**
 * Defines the properties (props) for the Activity component.
 * 
 * @interface ActivityProps
 * @property {boolean} [showActivity] - Optional flag to determine if the activity is visible.
 * @property {Function} setShowActivity - Function to toggle the visibility of the activity.
 */
interface ActivityProps {
  showActivity?: boolean;
  setShowActivity: Function;
}


const Activity = (props: ActivityProps) => {
  const [active, setActive] = useState(1);
  const { mode } = useContext(Context);
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  let itemsPerPage = 10;
  const { data: session } = useSession()
  const [data, setData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  let pageCount = Math.ceil(total / itemsPerPage);

  /**
 * Handles the page click event for pagination.
 * 
 * This function calculates the new offset based on the selected page number
 * and updates the state to reflect the new starting point for items to be displayed.
 *
 * @function handlePageClick
 * @param {any} event - The event object from the page click (contains the selected page number).
 * @returns {void} - This function doesn't return anything.
 */
  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  /**
   * Clears the user's activity and resets relevant state.
   * 
   * This function sends a POST request to the server to clear the user's activity based on their user ID,
   * then processes the server's response. Upon success, it resets the activity-related state and shows a success toast.
   *
   * @function clearActivity
   * @returns {Promise<void>} - This function doesn't return anything but performs side effects like clearing activity and updating state.
   */
  const clearActivity = async () => {

    let obj = { user_id: session?.user?.user_id }

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
      setTotal(0)
    }

  };

  /**
 * Fetches the activity data whenever the `itemOffset` value changes.
 * 
 * This `useEffect` hook runs whenever the `itemOffset` changes. It calls the `getActivityData` function to fetch the latest activity data based on the current `itemOffset`, which helps in paginating the activity list.
 *
 * @effect - Runs when the `itemOffset` state value changes.
 */
  useEffect(() => {
    getActivityData(itemOffset);
  }, [itemOffset]);

  /**
 * Fetches activity data from the server based on the current pagination parameters.
 * 
 * This function sends a GET request to the API endpoint `/profile/activity` with the `user_id`, `itemOffset`, and `itemsPerPage` parameters. It then updates the state variables `total` and `data` with the fetched activity data and total count of activities.
 *
 * @param itemOffset - The current offset for pagination, used to fetch the correct page of data.
 * @returns void - This function doesn't return a value, but updates the state.
 */
  const getActivityData = async (itemOffset: number) => {
    try {
      let activity = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/activity?userid=${session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());

      // console.log(activity.data,'-----activity data');
      setTotal(activity?.data?.totalLength)
      setData(activity?.data?.data);
    } catch (error) {

    }
  }

  return (
    <>
      {/* <ToastContainer /> */}
      <section className="lg:p-40 p-[15px] bg-white dark:bg-d-bg-primary rounded-10">
        <div
          className="mb-5 flex gap-2 cursor-pointer items-center"
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
            {data && data.length > 0 && (
              <button className=" solid-button w-full hover:bg-primary-800"
                onClick={() => { setConfirmDelete(true) }}
              >
                Clear History
              </button>
            )
            }
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
                      State
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
                  <div className="flex justify-end">
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
                          {item.region}
                        </p>
                      </td>
                      <td className="">
                        <p className="info-14-18 dark:text-white text-end">
                          {formatDate(item.loginTime, "yyyy-MM-dd HH:mm:ss a")}
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
        {
          pageCount > 1 &&
          <div className="flex pt-[25px] items-center justify-end">
            <ReactPaginate
              className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null} />
          </div>
        }
      </section>

      {/* confirm modal to clear history */}
      {
        confirmDelete && (
          <>
            <div className="bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible" onClick={() => { setConfirmDelete(false) }}></div>
            <div className="max-w-[calc(100%-30px)] md:max-w-[500px] w-full p-[40px]  z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <div className="flex items-center justify-between ">
                <p className="sec-title">Delete History</p>
                <svg
                  onClick={() => { setConfirmDelete(false) }}
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
                    fill={mode === "dark" ? "#fff" : "#9295A6"}
                    d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                                  c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                                  l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                                  l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                                  C61.42,57.647,61.42,54.687,59.595,52.861z"
                  />
                </svg>
              </div>
              <p className="text-[16px] md:text-[18px] dark:text-grey-v-1 leading-4 md:leading-5 text-center my-40">Are You Sure you want to clear all history?</p>
              <div className="grid grid-cols-2 items-center gap-10 mt-6">
                <button className="solid-button2 w-full" onClick={() => { setConfirmDelete(false) }}>Cancel</button>
                <button className="solid-button w-full" onClick={() => { clearActivity(); setConfirmDelete(false) }}>Delete</button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
};

export default Activity;
