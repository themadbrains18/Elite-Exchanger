import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import AddPaymentModal from "./addPaymentModal";
import ReactPaginate from "react-paginate";
import { useSession } from "next-auth/react";
import Context from "@/components/contexts/context";

const PaymentList = () => {
  const [open, setOpen] = useState(false)
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const { data: session } = useSession()
  const [list, setList] = useState([])
  const { mode } = useContext(Context)
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

      let tokenList = await fetch(`/api/payment/list`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token || ''
        },
      }).then(response => response.json());
      setList(tokenList?.data)

    } catch (error) {
      console.log("get all token list error in admin", error);

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


        }
      })
    }
  }
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  const updateStatus = async (data: any) => {
    try {

      data.status = data.status === true ? false : true
      let responseStatus = await fetch(`/api/payment/list`, {
        headers: {
          "Authorization": session?.user?.access_token || ''
        },
        method: "PUT",
        body: JSON.stringify(data),
      }).then((response) => response.json());

      if (responseStatus) {
        getToken(itemOffset)
      }

    } catch (error) {
      console.log("error in token status update", error);

    }
  }

  return (
    <>
      <div className="py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
        <div className="flex items-center justify-between  mb-[26px]">
          <div className="flex items-center gap-[15px]">
            <p className="admin-component-heading">All Payment Methods</p>
          </div>
          <div className="flex items-center gap-10">


            <button className="admin-solid-button flex gap-1 items-center" onClick={() => { setOpen(true) }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 17.25C13.275 17.25 16.7925 13.995 17.2125 9.825C17.2575 9.3825 16.905 9 16.4625 9C16.08 9 15.7575 9.285 15.72 9.66C15.39 13.08 12.5025 15.75 9 15.75C6.66 15.75 4.5975 14.5575 3.39 12.75H4.5C4.9125 12.75 5.25 12.4125 5.25 12C5.25 11.5875 4.9125 11.25 4.5 11.25H1.5C1.0875 11.25 0.75 11.5875 0.75 12V15C0.75 15.4125 1.0875 15.75 1.5 15.75C1.9125 15.75 2.25 15.4125 2.25 15V13.7475C3.7425 15.8625 6.21 17.25 9 17.25ZM9 0.75C4.725 0.75 1.2075 4.005 0.7875 8.175C0.75 8.6175 1.095 9 1.5375 9C1.92 9 2.2425 8.715 2.28 8.34C2.61 4.92 5.4975 2.25 9 2.25C11.34 2.25 13.4025 3.4425 14.61 5.25H13.5C13.0875 5.25 12.75 5.5875 12.75 6C12.75 6.4125 13.0875 6.75 13.5 6.75H16.5C16.9125 6.75 17.25 6.4125 17.25 6V3C17.25 2.5875 16.9125 2.25 16.5 2.25C16.0875 2.25 15.75 2.5875 15.75 3V4.2525C14.2575 2.1375 11.79 0.75 9 0.75ZM8.34 4.41C8.34 4.0425 8.64 3.75 9 3.75C9.36 3.75 9.66 4.0425 9.66 4.41V4.6875C10.4625 4.83 10.9725 5.2575 11.28 5.6625C11.535 5.9925 11.4 6.4725 11.01 6.6375C10.74 6.75 10.425 6.66 10.245 6.4275C10.035 6.1425 9.66 5.85 9.045 5.85C8.52 5.85 7.6875 6.1275 7.6875 6.8925C7.6875 7.605 8.3325 7.875 9.6675 8.3175C11.4675 8.94 11.925 9.855 11.925 10.905C11.925 12.87 10.05 13.2525 9.66 13.32V13.5975C9.66 13.9575 9.3675 14.2575 9 14.2575C8.6325 14.2575 8.34 13.965 8.34 13.5975V13.2825C7.8675 13.17 6.8925 12.825 6.3225 11.7075C6.15 11.3775 6.345 10.9425 6.69 10.8075C6.9975 10.6875 7.365 10.8 7.5225 11.0925C7.7625 11.55 8.235 12.12 9.1125 12.12C9.81 12.12 10.5975 11.76 10.5975 10.9125C10.5975 10.1925 10.0725 9.8175 8.8875 9.39C8.0625 9.0975 6.375 8.6175 6.375 6.9075C6.375 6.8325 6.3825 5.1075 8.34 4.6875V4.41Z"
                  fill="#ffffff"
                ></path>
              </svg>
              <span>Add Payment Method</span>
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
                  Image
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Payment Method</p>
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Region</p>
                  </div>
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
                        src={`${item.icon}`}
                        width={32}
                        height={32}
                        alt="avtar"
                      />

                    </td>

                    <td className="admin-table-data">{item?.payment_method}</td>
                    <td className="admin-table-data">{item?.region}</td>

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
                        <button onClick={() => { updateStatus(item) }}
                          className={`admin-outline-button ${item?.status == false
                            ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                            : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                            } !px-[10px] !py-[4px] whitespace-nowrap	`}
                        >
                          {item?.status == false ? "Activate " : "Inactivate"}
                        </button>

                        {/* <button className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap" >
                            Edit Method
                          </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
      </div>
      {open &&
        <AddPaymentModal setOpen={setOpen} />
      }
    </>
  );
};

export default PaymentList;
