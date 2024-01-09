import Context from "@/components/contexts/context";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loader from "@/components/snippets/loader";

interface propData{
  type?:any
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
  

const ReferalHistory = (props:propData) => {
  const [list, setList] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const {data:session}= useSession()

  const [isLoading,setIsLoading] = useState(false)

  let itemsPerPage = 10;

  useEffect(() => {
    getReferal(itemOffset);
  }, [itemOffset]);

  const getReferal = async (itemOffset: number) => {
    try {
      setIsLoading(true)
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
      let referalDetail=[]
      
      if(props?.type==="details"){
          referalDetail = await fetch(
              `/api/referal?user_id=${router?.query?.id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`,
              {
                method: "GET",
                headers: {
                  "Authorization": session?.user?.access_token || ""
              },
              }
            ).then((response) => response.json());
       
      }
  
  
      setList(referalDetail?.data?.data);
      setTotal(referalDetail?.data?.total);
      setIsLoading(false)
    } catch (error) {
      console.log("error in fetching referal details",error);

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
      isLoading
      ?
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

                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Referal User ID</p>
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
                    <p>Created At</p>
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
                    <p>Username</p>
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
                    <p>Invite Id</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {list !== null &&
                list !== undefined &&
                list?.length > 0 &&
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

                      <td className="admin-table-data !text-admin-primary">
                        #{item?.id.split("").splice(0, 9)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">
                        {item?.email !== null ? item?.email : item?.number}
                      </td>
                      <td className="admin-table-data">{item?.refeer_code}</td>
                    </tr>
                  );
                })}

              {(list === null ||
                list === undefined ||
                list?.length === 0) && (
                <tr>
                  <td colSpan={7}>
                    <div
                      className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}
                    >
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
              )}
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

    }
    </>
  );
};

export default ReferalHistory;
