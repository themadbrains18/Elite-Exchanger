import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '../snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';


interface propsData {
  filter: string;
}

const WithdrawList = (props: propsData) => {

  const [currentItems, setCurrentItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const { mode } = useContext(Context)
  const { status, data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(0);
  let itemsPerPage = 10;

  useEffect(() => {
    getWithdrawData()

  }, [itemOffset, props?.filter])

  async function getWithdrawData() {
    let withdrawList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=all&date=all`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    setTotal(withdrawList?.data?.total)
    if (props?.filter !== "") {
      let data = withdrawList?.data?.data.filter((item: any) => {
        return item.symbol.toLowerCase().includes(props?.filter.toLowerCase());
      })
      setCurrentItems(data);
    }
    else {
      setCurrentItems(withdrawList?.data?.data);

    }

  }


  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };

  function formattDate(date: any) {
    const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table width="100%" className="lg:min-w-[1000px] w-full">
          <thead>
            <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
              <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                <div className="flex ">
                  <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex  lg:justify-start justify-end ">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className="max-[1023px]:hidden py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Date / Time</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className="py-5">
                <div className="flex justify-end">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: number) => {
              return (
                <tr key={index} className="rounded-5 group dark:hover:bg-black-v-1 hover:bg-[#FEF2F2] cursor-pointer">
                  <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px]  w-full">
                      {/* <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" /> */}
                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                        <p className="info-14-18 dark:text-white">{item.symbol}</p>
                        <p className="info-14-18 !text-[10px] lg:hidden">{formattDate(item?.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white  lg:text-start text-end">{currencyFormatter(truncateNumber(item?.amount, 8))}</p>
                  </td>
                  <td className="max-[1023px]:hidden">
                    <p className="info-14-18 dark:text-white">{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss")}</p>
                  </td>
                  <td className=" text-end">
                    <p className={`info-14-18  ${item?.status == "success" ? "text-buy" : item?.status == "pending" ? "text-primary" : "text-cancel"}`}>{item?.status == "success" ? "Success" : item?.status == "pending" ? "Pending" : "Rejected"}</p>
                  </td>
                </tr>
              );
            })}

            {currentItems && currentItems?.length === 0 &&
              <tr>
                <td colSpan={4}>
                  <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                    <Image
                      src="/assets/refer/empty.svg"
                      alt="emplty table"
                      width={107}
                      height={104}
                    />
                    <p > No Record Found </p>
                  </div>

                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div className="flex pt-[25px] items-center justify-between">
        {/* <p className="info-12 md:footer-text !text-gamma">{total} assets</p> */}
        {
          pageCount > 1 &&
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
            forcePage={currentPage}
          />
        }
      </div>
    </>
  )
}

export default WithdrawList