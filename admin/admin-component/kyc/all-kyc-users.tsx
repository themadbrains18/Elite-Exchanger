import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import DocumentsModal from "./documentsModal";
import ReactPaginate from "react-paginate";
import Context from "@/components/contexts/context";
import { useSession } from "next-auth/react";
import { AES } from "crypto-js";


function formatDate(date: Date) {
  const options: {} = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

const AllKycUsers = () => {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(1);
  const [show, setShow] = useState(false);
  const [allUsers, setAllUsers] = useState();
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { mode } = useContext(Context);
 const [total, setTotal] = useState(0);
 const {data: session} = useSession()

  let itemsPerPage = 10;

  useEffect(() => {
    getAllKyc(itemOffset);
  }, [itemOffset]);

  const getAllKyc = async (itemOffset: number) => {
    try {
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
      
      let users = await fetch(
        `/api/kyc/allUsers?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token || ''
        },
        }
      ).then((response) => response.json());
  
  
      setList(users?.data?.data);
      setTotal(users?.data?.total?.length);
    } catch (error) {
      console.log("error in fetch list of kyc ",error);
      
    }
  
  };
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };


  const handleUpdate = async (item: string, e: any) => {
    try {
      let actionKyc = e.currentTarget.innerHTML;

      // console.log(item,'--------kyc item');
      
      let obj = {
        userid: item,
        isVerified: actionKyc === "Approve" && true,
        isReject: actionKyc === "Reject" && true,
      };
      const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record =  encodeURIComponent(ciphertext.toString());
      let updated = await fetch(
        `/api/kyc/status`,
        {
          headers: {
            "Content-type": "application/json",
            "Authorization": session?.user?.access_token || ''
          },
          mode: "cors",
          method: "PUT",
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
  
      setList(updated?.data?.result);
    } catch (error) {
      console.log("error in update status of kyc user ",error);
      
    }
   
  };

  return (
    <>
      <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
        <div className="flex items-center justify-between  mb-[26px]">
          <div className="flex items-center gap-[15px]">
            <button
              className={`${
                active === 1 ? "admin-solid-button" : "admin-outline-button"
              }`}
              onClick={(e) => {
                setActive(1);
              }}
            >
              Pending
            </button>
            <button
              className={`${
                active === 2 ? "admin-solid-button" : "admin-outline-button"
              }`}
              onClick={(e) => {
                setActive(2);
              }}
            >
              Approved
            </button>
            <button
              className={`${
                active === 3 ? "admin-solid-button" : "admin-outline-button"
              }`}
              onClick={(e) => {
                setActive(3);
              }}
            >
              Rejected
            </button>
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
              <AdminIcons type="SearchIcon" hover={false} active={false} />
            </div>
            <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
              <AdminIcons type="settings" hover={false} active={false} />
            </div>
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
                  Full Name
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Country</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>DOC Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Front / Back
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {list &&
                list.length > 0 &&
                list?.map((item: any, index: number) => {
                  
                  if (active === 2 && item.isVerified === 0) {
                    return;
                  } else if (active === 3 && item.isReject === 0) {
                    return;
                  } else if (
                    active === 1 &&
                    (item.isReject === 1 || item.isVerified === 1)
                  ) {
                    return;
                  }

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
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_AVATAR_PROFILE}`}
                          width={32}
                          height={32}
                          alt="avtar"
                        />
                        <p>{item?.fname}</p>
                      </td>
                      <td className="admin-table-data">
                        #{item?.userid.split("").splice(0, 5)}
                      </td>

                      <td className="dark:!text-[#ffffffb3] admin-table-heading ">
                        <p className="max-w-[71px] w-full">
                          {formatDate(item?.createdAt)}
                        </p>
                      </td>
                      <td className="admin-table-data">{item?.country}</td>
                      <td className="admin-table-data">{item?.doctype}</td>
                      <td className="admin-table-data">
                        <button
                          onClick={() => {
                            setShow(true);
                            setAllUsers(item);
                          }}
                          className="dark:text-admin-primary-100 text-admin-primary"
                        >
                          Document
                        </button>
                      </td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                              item?.isVerified === 1
                                ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                : item?.isReject === 1
                                ? "dark:bg-[#F44336] bg-[#F64E60]"
                                : "dark:bg-[#90CAF9] bg-[#3699FF]"
                            }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${
                              item?.isVerified === 1
                                ? "dark:text-[#66BB6A] text-[#0BB783]"
                                : item?.isReject === 1
                                ? "dark:text-[#F44336] text-[#F64E60]"
                                : "dark:text-[#90CAF9] text-[#3699FF]"
                            }`}
                          >
                            {item?.isVerified === 1
                              ? "Approved"
                              : item?.isReject === 1
                              ? "Rejected"
                              : "Pending"}
                          </p>
                        </div>
                      </td>
                      {active === 1 && (
                        <td className="w-[20%]">
                          <div className="inline-flex items-center gap-10">
                            <button
                              className="admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	"
                              onClick={(e) => {
                                handleUpdate(item?.userid, e);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap"
                              onClick={(e) => {
                                handleUpdate(item?.userid, e);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                      {active === 2 && (
                        <td className="w-[20%]">
                          <div className="inline-flex items-center gap-10">
                            <button
                              className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap"
                              onClick={(e) => {
                                handleUpdate(item?.userid, e);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                      {active === 3 && (
                        <td className="w-[20%]">
                          <div className="inline-flex items-center gap-10">
                            <button
                              className="admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	"
                              onClick={(e) => {
                                handleUpdate(item?.userid, e);
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex pt-[25px] items-center justify-end">
          <ReactPaginate
            className={`history_pagination ${
              mode === "dark" ? "paginate_dark" : ""
            }`}
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            forcePage={currentPage}
          />
        </div>
      </div>
      {show && <DocumentsModal show={show} setShow={setShow} data={allUsers} />}
    </>
  );
};

export default AllKycUsers;
