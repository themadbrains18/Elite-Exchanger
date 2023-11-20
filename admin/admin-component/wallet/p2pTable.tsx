import Context from "@/components/contexts/context";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";


interface propData{
  type?:string
}

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

const P2PTable = (props:propData) => {
  const [list, setList] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  let itemsPerPage = 10;

  useEffect(() => {
    getToken(itemOffset);
  }, [itemOffset]);

  const getToken = async (itemOffset: number) => {
    if (itemOffset === undefined) {
      itemOffset = 0;
    }
    let order=[]
    if(props?.type==="details"){
      order = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/p2p/all/${router?.query?.id}/${itemOffset}/${itemsPerPage}`, {
        method: "GET",
      
      }).then(response => response.json());
    }
    else{
      order = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/p2p/admin/all/${itemOffset}/${itemsPerPage}`, {
        method: "GET",
      
      }).then(response => response.json());
    }
     
    setList(order?.data);
    setTotal(order?.total);
  };
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  return (
    <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
   
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
                    <p>Seller User ID</p>
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
                    <p>Buyer User ID</p>
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
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
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
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Quantity</p>
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
                    <p>Spend Amount</p>
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
                  Recieve Amount
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Payment Method
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Type
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
                {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {list !== null && list !== undefined && list?.length > 0 &&
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
                        <Image
                          src={`${item?.token !== null ? item?.token?.image : item?.global_token?.image}`}
                          width={32}
                          height={32}
                          alt="avtar"
                        />
                        <div>
                          <p>{item?.token !== null ? item?.token?.fullName : item?.global_token?.fullName}</p>
                          <p className="admin-table-heading">
                            {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}
                          </p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.sell_user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.buy_user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.price}</td>
                      <td className="admin-table-data">{item?.quantity}</td>
                      <td className="admin-table-data">
                        {item?.spend_amount} {item?.spend_currency}
                      </td>
                      <td className="admin-table-data">
                        {item?.receive_amount} {item?.receive_currency}
                      </td>
                      <td className="admin-table-data">{item?.p_method}</td>
                      <td className="admin-table-data">{item?.type}</td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === "Approved"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                                : "dark:bg-[#F44336] bg-[#F64E60]"
                              }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === "Approved"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:text-[#90CAF9] text-[#3699FF] "
                                : "dark:text-[#F44336] text-[#F64E60]"
                              }`}
                          >
                            {item?.status}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {(list === null || list === undefined || list?.length === 0) &&
                <tr>
                  <td colSpan={12}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
                      <Image
                        src="/assets/refer/empty.svg"
                        alt="emplty table"
                        width={107}
                        height={104}
                      />
                      <p className="sm-text"> No Record Found </p>
                    </div>

                  </td>
                </tr>
              }
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

export default P2PTable;
