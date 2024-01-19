import Context from "@/components/contexts/context";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loader from "@/components/snippets/loader";

interface propData {
  type: string | undefined
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

const TradeTable = (props: propData) => {
  const [list, setList] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [total, setTotal] = useState(0);
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  let itemsPerPage = 10;

  useEffect(() => {
    getMarketDetails(itemOffset);
  }, [itemOffset]);

  const getMarketDetails = async (itemOffset: number) => {
    try {
      setIsLoading(true)
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
      let market = []
      if (props?.type === "details") {

        market = await fetch(`/api/market/list?user_id=${router?.query?.id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token || ""
          },

        }).then(response => response.json());

      }
      else {

        market = await fetch(`/api/market/list?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token || ""
          },
        }).then(response => response.json());
      }

      setList(market?.data?.data);
      setTotal(market?.data?.total);
      setIsLoading(false)

    } catch (error) {
      console.log("error in fetching market details", error);

    }
  };
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  return (
    <>
      {
        isLoading ?
          <Loader />
          :
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
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                      <div className="flex items-center gap-[5px]">
                        <p>Market Type</p>
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
                        <p>Order Type</p>
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
                        <p> Amount</p>
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
                            #{item?.user_id.split("").splice(0, 5)}
                          </td>
                          <td className="admin-table-data">
                            {formatDate(item?.createdAt)}
                          </td>
                          <td className="admin-table-data">{item?.market_type}</td>
                          <td className="admin-table-data">{item?.order_type}</td>
                          <td className="admin-table-data">
                            {item?.token_amount}
                          </td>
                          <td className="admin-table-data">
                            <div className="flex gap-[5px] items-center">
                              <div
                                className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === true
                                  ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                  : item?.status === false
                                    ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                                    : "dark:bg-[#F44336] bg-[#F64E60]"
                                  }`}
                              ></div>
                              <p
                                className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === true
                                  ? "dark:text-[#66BB6A] text-[#0BB783]"
                                  : item?.status === false
                                    ? "dark:text-[#90CAF9] text-[#3699FF] "
                                    : "dark:text-[#F44336] text-[#F64E60]"
                                  }`}
                              >
                                {item?.status === true ? 'Success' : 'Pending'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {(list === null || list === null || list?.length === 0) &&
                    <tr>
                      <td colSpan={8}>
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
                className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""
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
      }
    </>
  );
};

export default TradeTable;
