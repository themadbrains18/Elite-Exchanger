import AdminIcons from "@/admin/admin-snippet/admin-icons";
import React, { useContext, useEffect, useState } from "react";
import AddList from "./add";
import EditModel from "./editModel";
import { ToastContainer } from "react-toastify";
import Context from "@/components/contexts/context";
import { useSession } from "next-auth/react";
import { AES } from "crypto-js";

interface Session {
  list?: any;
}

const MaintenanceList = (props: Session) => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [editItem, setEditItem] = useState(Object);
  const { mode } = useContext(Context);
  const { data: session } = useSession();

  useEffect(() => {
    getToken();
  }, [show]);

  const refreshPairList = () => {
    getToken();
  };

  const getToken = async () => {
    try {
      let pairList = await fetch(`/api/sitemaintenance`, {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token || "",
        },
      }).then((response) => response.json());

      setItemList(pairList?.data);
    } catch (error) {
      console.log("error in get list of messages for site maintenance", error);
    }
  };

  const updateStatus = async (data: any) => {
    try {
        const ciphertext = AES.encrypt(
            JSON.stringify(data),
            `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
          ).toString();
          let record = encodeURIComponent(ciphertext.toString());
          let responseStatus = await fetch(`/api/sitemaintenance`, {
            headers: {
              "content-type": "application/json",
              Authorization: session?.user?.access_token || "",
            },
            method: "PUT",
            body: JSON.stringify(record),
          }).then((response) => response.json());
      
          // console.log(responseStatus, "==responseStatus");
      
          if (responseStatus) {
            refreshPairList();
          }
    } catch (error) {
      console.log("error in update status  for site maintenance", error);
        
    }
   
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${
          show || editShow ? "opacity-80 visible" : "opacity-0 invisible"
        }`}
      ></div>
      <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
        <div className="flex items-center justify-between  mb-[26px]">
          <div className="flex items-center gap-[15px]">
            <p className="admin-component-heading">Site Maintenance</p>
          </div>
          <div className="flex items-center gap-10">
            <p className="admin-table-data">
              <span className="dark:text-[#ffffffb3]">1&nbsp;</span>Item
              selected
            </p>
            <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
              <AdminIcons type="download" hover={false} active={false} />
            </div>
            <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
              <AdminIcons type="deleteIcon" hover={false} active={false} />
            </div>

            <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
              <AdminIcons type="settings" hover={false} active={false} />
            </div>
            <button
              className="admin-solid-button flex gap-1 items-center"
              onClick={() => {
                setShow(true);
              }}
            >
              <AdminIcons type="dollar" hover={false} active={false} />
              <span>Add Site Maintenance Message </span>
            </button>
          </div>
        </div>
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                                                relative
                                                
                                                after:w-20
                                                after:h-20
                                                after:border-[2px]
                                                after:border-[#B5B5C3]
                                                after:rounded-[4px]
                                                after:block

                                                before:w-[12px]
                                                before:h-[6px]
                                                before:border-l-[2px]
                                                before:border-b-[2px]
                                                border:dark:border-[#212121]
                                                border:border-[#fff]
                                                before:absolute
                                                before:left-[4px]
                                                before:top-[6px]
                                                before:rotate-[-45deg]
                                                before:hidden
                                            "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Title
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Message</p>
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Status</p>
                  </div>
                </th>

                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {itemList &&
                itemList.length > 0 &&
                itemList?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                                                        relative
                                                        
                                                        after:w-20
                                                        after:h-20
                                                        after:border-[2px]
                                                        after:border-[#B5B5C3]
                                                        after:rounded-[4px]
                                                        after:block

                                                        before:w-[12px]
                                                        before:h-[6px]
                                                        before:border-l-[2px]
                                                        before:border-b-[2px]
                                                        border:dark:border-[#212121]
                                                        border:border-[#fff]
                                                        before:absolute
                                                        before:left-[4px]
                                                        before:top-[6px]
                                                        before:rotate-[-45deg]
                                                        before:hidden
                                                    "
                        ></label>
                      </td>

                      <td className="admin-table-data">{item?.title}</td>
                      <td className="admin-table-data">{item?.message}</td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                              item?.down_status == true
                                ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                : "dark:bg-[#F44336] bg-[#F64E60]"
                            }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${
                              item?.down_status == true
                                ? "dark:text-[#66BB6A] text-[#0BB783]"
                                : "dark:text-[#F44336] text-[#F64E60]"
                            }`}
                          >
                            {item?.down_status == false ? "Inactive" : "Active"}
                          </p>
                        </div>
                      </td>
                      <td className="">
                        <div className="inline-flex items-center gap-10">
                          <button
                            onClick={() => updateStatus(item)}
                            className={`admin-outline-button ${
                              item?.down_status == 0
                                ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                                : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                            } !px-[10px] !py-[4px] whitespace-nowrap	`}
                          >
                            {item?.down_status == 0
                              ? "Activate "
                              : "Inactivate"}
                          </button>

                          <button
                            className="admin-outline-button dark:text-[#90CAF9] text-[#3699FF] dark:border-[#90CAF9] border-[#3699FF] !px-[10px] !py-[4px] whitespace-nowrap"
                            onClick={(e) => {
                              setEditShow(true);
                              setEditItem(item);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <AddList
          data={props?.list}
          show={show}
          setShow={setShow}
          refreshPairList={refreshPairList}
          session={session}
        />
      )}
      {editShow && (
        <EditModel
          setEditShow={setEditShow}
          editPair={editItem}
          refreshPairList={refreshPairList}
          session={session}
        />
      )}
    </>
  );
};

export default MaintenanceList;
