import AdminIcons from "@/admin/admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import AddToken from "./addToken";
import EditToken from "./editToken";
import ReactPaginate from "react-paginate";
import Context from "@/components/contexts/context";
import AddNetwork from "./addNetwork";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

interface Session {
  coinList?: any,
  networkList: any,
  refreshTokenList?: any
}
const AllCoins = (props: Session) => {

  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [networkShow, setNetworkShow] = useState(false);
  const [editToken, setEditToken] = useState(Object);
  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const { data: session } = useSession()

  let itemsPerPage = 10;

  useEffect(() => {
    getToken(itemOffset)
  }, [itemOffset])


  const getToken = async (itemOffset: number) => {
    try {
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
      if (total > 0 && total - itemOffset < 10) {
        itemsPerPage = total - itemOffset
      }

      let tokenList = await fetch(`/api/token/list?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token || ''
        },
      }).then(response => response.json());
      setList(tokenList?.data?.data)
      setTotal(tokenList?.data?.total);

    } catch (error) {
      console.log("get all token list error in admin", error);

    }
  }
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  const updateStatus = async (data: any) => {
    try {

      let obj = {
        id: data?.id,
        status: data?.status
      }
      let responseStatus = await fetch(`api/token/list`, {
        headers: {
          "Authorization": session?.user?.access_token || ''
        },
        method: "PUT",
        body: JSON.stringify(obj),
      }).then((response) => response.json());

      if (responseStatus) {
        getToken(itemOffset)
        props.refreshTokenList(responseStatus?.data);
      }

    } catch (error) {
      console.log("error in token status update", error);

    }

  }
  function selectAll() {
    let allInputs = document?.querySelectorAll('.admin-table-data > input');
    let mainInput = document?.querySelector('.admin-table-heading > input');
    if (mainInput) {
      mainInput.addEventListener("click", () => {
        for (let i of allInputs) {
          if (i instanceof HTMLInputElement) {
            console.log(i.value);
          }

          // i.click();
          // if(i === true){
          //   i.checked = false
          // }else{
          //   i.checked = true
          // }
        }
      })
    }
  }

  return (
    <>
      <ToastContainer limit={1} />
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${(show || editShow || networkShow) ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
      <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
        <div className="flex items-center justify-between  mb-[26px]">
          <div className="flex items-center gap-[15px]">
            <p className="admin-component-heading">All Coins</p>
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
              <AdminIcons type="settings" hover={false} active={false} />
            </div>
            <button className="admin-solid-button flex gap-1 items-center" onClick={() => { setShow(true) }}>
              <AdminIcons type="dollar" hover={false} active={false} />
              <span>Add Coin</span>
            </button>
          </div>
        </div>
        <div className="max-h-[600px]  h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    onClick={() => { selectAll() }}
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
                    <p>Contract</p>
                  </div>
                </th>

                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Market Cap</p>
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
                    <p>Volume</p>
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
                    <p>Price</p>
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
                  24h
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
              {list && list.length > 0 && list?.map((item: any, index: number) => {
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
                        src={`${item.image}`}
                        width={32}
                        height={32}
                        alt="avtar"
                      />
                      <div>
                        <p>{item?.symbol}</p>
                        <p className="admin-table-heading">{item?.fullName}</p>
                      </div>
                    </td>

                    <td className="admin-table-data">{item?.networks && item?.networks[0].contract}</td>
                    <td className="admin-table-data">{item?.maxSupply}</td>
                    <td className="admin-table-data">{item?.totalSupply}</td>
                    <td className="admin-table-data">${item?.price?.toFixed(2)}</td>
                    <td className="admin-table-data">
                      <span className="dark:bg-[#0bb7831f] bg-[#D7F9EF] py-[2px] px-1 rounded-5 flex w-max">
                        <p className="text-xs font-public-sans font-medium leading-5 text-[#0BB783]">
                          5%
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M14.0416 5.70833L15.2416 6.90833L11.1749 10.975L8.43328 8.23333C8.10828 7.90833 7.58328 7.90833 7.25828 8.23333L2.25828 13.2417C1.93328 13.5667 1.93328 14.0917 2.25828 14.4167C2.58328 14.7417 3.10828 14.7417 3.43328 14.4167L7.84161 10L10.5833 12.7417C10.9083 13.0667 11.4333 13.0667 11.7583 12.7417L16.4166 8.09167L17.6166 9.29167C17.8749 9.55 18.3249 9.36667 18.3249 9V5.41667C18.3333 5.18333 18.1499 5 17.9166 5H14.3416C13.9666 5 13.7833 5.45 14.0416 5.70833Z"
                            fill="#0BB783"
                          />
                        </svg>
                      </span>
                    </td>
                    {/* <td className="admin-table-data">{item?.created}</td> */}

                    <td className="admin-table-data">
                      <div className="flex gap-[5px] items-center">
                        <div
                          className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === true
                            ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                            : "dark:bg-[#F44336] bg-[#F64E60]"
                            }`}
                        ></div>
                        <p
                          className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === true
                            ? "dark:text-[#66BB6A] text-[#0BB783]"
                            : "dark:text-[#F44336] text-[#F64E60]"
                            }`}
                        >
                          {item?.status == false ? "Inactive" : "Active"}
                        </p>
                      </div>
                      {/* <span className={`border ${item?.status==="Active"?'border-[#0bb78380] dark:border-[#66bb6a1f] ':'border-[#f64e6080] dark:border-[#f443361f] '}   py-[3px] px-1 rounded-[6px] flex w-max`}>
                    <p className={`text-[13px] font-public-sans font-normal leading-[18px] ${item?.status==='Active'?'text-[#0BB783] dark:text-[#66BB6A]':'dark:text-[#F44336] text-[#F64E60]'} `}>
                    {item?.status}
                    </p>
                    
                  </span> */}
                    </td>
                    <td className="">
                      <div className="inline-flex items-center gap-10">
                        <button onClick={() => updateStatus(item)}
                          className={`admin-outline-button ${item?.status == false
                            ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                            : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                            } !px-[10px] !py-[4px] whitespace-nowrap	`}
                        >
                          {item?.status == false ? "Activate " : "Inactivate"}
                        </button>
                        {item?.tokenType === 'mannual' &&
                          <button className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap" onClick={(e) => { setEditShow(true); setEditToken(item) }}>
                            Edit Token
                          </button>
                        }
                        {item?.tokenType === 'global' &&
                          <button className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap" onClick={(e) => {
                            setNetworkShow(true);
                            setEditToken(item)
                          }}>
                            Add Network
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
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
              pageRangeDisplayed={1}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null} />
          </div>
        }
      </div>

      {
        show &&
        <AddToken setShow={setShow} networkList={props?.networkList} />
      }
      {
        editShow &&
        <EditToken setEditShow={setEditShow} networkList={props?.networkList} editToken={editToken} refreshTokenList={props.refreshTokenList} />
      }
      {networkShow &&
        <AddNetwork setNetworkShow={setNetworkShow} networkList={props?.networkList} editToken={editToken} getToken={getToken} itemOffset={itemOffset} />
      }
    </>
  );
};

export default AllCoins;
