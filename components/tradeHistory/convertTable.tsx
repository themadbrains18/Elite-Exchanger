import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/libs/subdomain';

interface propsData {
  date: Date,
  coin: string
}

const ConvertTable = (props: propsData) => {
  const { data: session, status } = useSession();
  const [currentItems, setCurrentItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const { mode } = useContext(Context)
  const [totalRecord, setTotalRecord] = useState([]);
  const [imgSrc, setImgSrc] = useState(false);

  let itemsPerPage = 10;

  useEffect(() => {
    getConvertData()
  }, [itemOffset]);





  async function getConvertData() {
    let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/converthistory?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    setTotalRecord(tradeHistory?.data?.data)
    if (props.coin !== "" && props.coin !== undefined) {
      let history = tradeHistory?.data?.data?.filter((item: any) => {
        return item.token_id === props.coin;
      });
      setTotal(history.length)
      setCurrentItems(history);
    }
    else {
      setTotal(tradeHistory?.data?.total)
      setCurrentItems(tradeHistory?.data?.data);

    }
  }

  useEffect(() => {

    let history: any = totalRecord;
    if (props.coin !== "" && props.coin !== undefined && history?.length > 0) {
      history = history?.filter((item: any) => {
        return item.token_id === props.coin;
      });
    }
    const targetDate = new Date(props.date).setHours(0, 0, 0, 0);
    const currentDate = new Date().setHours(0, 0, 0, 0);
    if (targetDate !== currentDate && history?.length > 0) {
      history = history?.filter((item: any) => {
        const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        return itemDate === targetDate;
      });
    }
    setCurrentItems(history);

  }, [props.coin, props.date])

  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table width="100%" className="md:min-w-[1200px]">
          <thead>
            <tr className="border-b border-grey-v-3 dark:border-opacity-[15%]">
              <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                <div className="flex ">
                  <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin</p>
                  <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Type</p>
                  <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Date & Time</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className=" md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Converted Amount</p>
                  <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              {/* <th className=" py-5">
              <div className="hidden md:flex">
                <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fee</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th> */}
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Total Balance</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>

            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: any) => {
              return (
                <tr key={index}>
                  <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                      <Image src={`${imgSrc ? '/assets/history/Coin.svg' : item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" onError={() => setImgSrc(true)} />

                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                        <p className="info-14-18 dark:text-white">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white  md:block ">{item?.type}</p>
                  </td>
                  <td>
                    <p className={`info-14-18 dark:text-white  md:block hidden`}>{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss")}</p>
                  </td>
                  <td>
                    <p className={`info-14-18 ${item?.type === 'Gain' ? '!text-dark-green' : '!text-red-dark'} md:block `}>{item?.amount}</p>
                  </td>
                  {/* <td>
                  <p className="info-14-18 dark:text-white md:block hidden">{item.fees}</p>
                </td> */}
                  <td>
                    <p className="info-14-18 dark:text-white md:block hidden">{item?.balance}</p>
                  </td>

                </tr>
              );
            })}

            {currentItems && currentItems?.length === 0 &&
              <tr>
                <td colSpan={7}>
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
      {
        pageCount > 1 &&
        <div className="flex pt-[25px] sticky left-0 items-center justify-end">

          <ReactPaginate
            className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            forcePage={Math.floor(itemOffset / itemsPerPage)} />
        </div>
      }
    </>
  )
}

export default ConvertTable
