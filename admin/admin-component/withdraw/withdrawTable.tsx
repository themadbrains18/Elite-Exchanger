import Context from "@/components/contexts/context";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";


interface propData{
  type?:string,
  name?:string
}

function formatDate(date: Date) {
  const options: {} = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

const WithdrawTable = (props:propData) => {
  const router = useRouter()
  const [list, setList] = useState([]);
  const [filterlist, setFilterList] = useState([]);
  const [active, setActive] = useState(1);

  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [total, setTotal] = useState(0);
  const {data:session} = useSession()

  let itemsPerPage = 10;

  useEffect(() => {
    getToken(itemOffset);
  }, [itemOffset]);

  const getToken = async (itemOffset: number) => {
    try {
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
       let withdraw=[];
       
      if(props?.type==="details"){
         withdraw = await fetch(`/api/withdraw/listById?user_id=${router?.query?.id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token || ""
        },
        
        }).then(response => response.json());
      }
      else{
         withdraw = await fetch(`/api/withdraw/allList?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token || ""
        },
        
        }).then(response => response.json());
  
      }
      setFilterList(withdraw?.data?.data)
      setList(withdraw?.data?.data);
      setTotal(withdraw?.data?.total);
      
    } catch (error) {
      console.log("error in fetching withdraw details",error);

    }
  };
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };



  const filterData = (e: any) => {
    if (e.target.innerHTML === "Pending") {
      let data = filterlist?.filter((e: any) => e.status === "pending");
      setList(data);
    } else if (e.target.innerHTML === "Rejected") {
      let data = filterlist?.filter((e: any) => e.isReject === true);
      setList(data);
    } else {
      setList(filterlist);
    }
  };
  return (
    <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className={`${props?.name==="wallet"?'hidden':'flex'} items-center justify-between  mb-[26px]`}>
        <div className="flex items-center gap-[15px]">
          <button
            className={`${
              active === 1 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(1);
              filterData(e);
            }}
          >
            All
          </button>
          <button
            className={`${
              active === 2 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(2);
              filterData(e);
            }}
          >
            Pending
          </button>
          <button
            className={`${
              active === 3 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(3);
              filterData(e);
            }}
          >
            Rejected
          </button>
        </div>
        <div className="flex items-center gap-10">
          <p className="admin-table-data">
            <span className="dark:text-[#ffffffb3]">1&nbsp;</span>Item selected
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
                Coin
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
             { props?.name==="wallet" && <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                <div className="flex items-center gap-[5px]">
                  <p>TxId</p>
                  <Image
                    src="/assets/history/uparrow.svg"
                    className="rotate-[180deg] "
                    width={15}
                    height={15}
                    alt="uparrow"
                  />
                </div>
              </th>}
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                <div className="flex items-center gap-[5px]">
                  <p>Network</p>
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
                  <p>Amount</p>
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
                Wallet Address
              </th>
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                Status
              </th>
              {
                 props?.name!=='wallet' && 
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                Action
              </th>
              }
            </tr>
          </thead>
          <tbody>
            {list &&
              list.length > 0 &&
              list?.map((item: any, index: number) => {
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
                      {/* <Image
                        src={`/assets/admin/${item?.coin}`}
                        width={32}
                        height={32}
                        alt="avtar"
                        /> */}
                      <div>
                        <p>{item?.tokenName}</p>
                        <p className="admin-table-heading">{item?.symbol}</p>
                      </div>
                    </td>
                    <td className="admin-table-data !text-admin-primary">
                      #{item?.user_id.split("").splice(0, 5)}
                    </td>

                    <td className="admin-table-data">
                      {formatDate(item?.createdAt)}
                    </td>
                  {props?.name==="wallet" &&  <td className="admin-table-data">{item?.tx_hash}</td>}
                    <td className="admin-table-data">
                      {item?.network?.fullname}
                    </td>

                    <td className="admin-table-data">{item?.amount}</td>
                    <td className="admin-table-data ">
                      <div className="max-w-[94px] w-full overflow-hidden text-ellipsis">
                        {item?.withdraw_wallet}
                      </div>
                    </td>
                    <td className="admin-table-data">
                      <div className="flex gap-[5px] items-center">
                        <div
                          className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                            item?.status === "success"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : item?.status === "pending"
                              ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                              : "dark:bg-[#F44336] bg-[#F64E60]"
                          }`}
                        ></div>
                        <p
                          className={`text-[13px] font-public-sans font-normal leading-5 ${
                            item?.status === "success"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : item?.status === "pending"
                              ? "dark:text-[#90CAF9] text-[#3699FF] "
                              : "dark:text-[#F44336] text-[#F64E60]"
                          }`}
                        >
                          {item?.status === "success"
                            ? "Approved"
                            : item?.status === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </p>
                      </div>
                      {/* <span className={`border ${item?.status==="Active"?'border-[#0bb78380] dark:border-[#66bb6a1f] ':'border-[#f64e6080] dark:border-[#f443361f] '}   py-[3px] px-1 rounded-[6px] flex w-max`}>
                    <p className={`text-[13px] font-public-sans font-normal leading-[18px] ${item?.status==='Active'?'text-[#0BB783] dark:text-[#66BB6A]':'dark:text-[#F44336] text-[#F64E60]'} `}>
                    {item?.status}
                    </p>
                    
                  </span> */}
                    </td>
                    {
                      props?.name!=='wallet' &&
                    <td className="w-[20%]">
                      <div className="inline-flex items-center gap-10">
                        <button className="admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	">
                          On Hold
                        </button>
                        <button className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap	">
                          Blocked
                        </button>
                      </div>
                    </td>
                    }
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
        />
      </div>
    </div>
  );
};

export default WithdrawTable;
