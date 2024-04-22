import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import moment from 'moment';


const ConvertList = () => {

    const [currentItems, setCurrentItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [total, setTotal] = useState(0)
    const { mode } = useContext(Context)
    const { status, data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(0);
    let itemsPerPage = 2;
  
    useEffect(() => {
      getConvertData()
  
    }, [itemOffset])

    async function getConvertData() {
        let convertList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/convertlist?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Authorization": session?.user?.access_token
          },
        }).then(response => response.json());
    
        setTotal(convertList?.data?.total)
        // if (props?.filter !== "") {
        //   let data = withdrawList?.data?.data.filter((item: any) => {
        //     return item.coinName.split('/')[1].toLowerCase().includes(props?.filter.toLowerCase());
        //   })
        //   setCurrentItems(data);
        // }
        // else{
        setCurrentItems(convertList?.data?.data);
    
        //   }
    
      }
    
    
      const pageCount = Math.ceil(total / itemsPerPage);
    
      const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        setItemOffset(newOffset);
        setCurrentPage(event.selected);
      };
  return (
    <>
    <div className="overflow-x-auto">
      {/* This is for desktop version */}
      <table width="100%" className="lg:min-w-[1000px] w-full max-[1023px]:hidden">
        <thead>
          <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
            <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
              <div className="flex ">
                <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Conversion Time</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th>
            <th className=" py-5">
              <div className="flex  lg:justify-start justify-center ">
                <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Converted</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th>
            <th className="py-5">
              <div className="flex lg:justify-start justify-end">
                <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Received</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th>
            <th className="py-5 max-[1023px]:hidden ">
              <div className="flex">
                <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fees</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th>
            <th className="py-5 max-[1023px]:hidden ">
              <div className="flex ">
                <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Conversion rate</p>
                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length > 0 && currentItems?.map((item: any, index: number) => {
            return (
              <tr key={index} className="rounded-5 group ">
                <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                  <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                    {/* <Image src={`${item.createdAt}`} width={30} height={30} alt="coins" /> */}
                    <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                      <p className="info-14-18 dark:text-white">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.converted}</p>
                </td>
                <td className="lg:text-start text-end">
                  <p className="info-14-18 dark:text-white">{item?.received}</p>
                </td>
                <td className="max-[1023px]:hidden">
                  <p className="info-14-18 dark:text-white">Zero Transaction fees</p>
                </td>
                <td className="max-[1023px]:hidden">
                  <p className="info-14-18 dark:text-white">{item?.conversion_rate}</p>
                </td>
           
              </tr>
            );

          })}

          {currentItems.length === 0 &&
            <tr>
              <td colSpan={5}>
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
      {/* This is for responsive Version */}
      <div className="lg:hidden">
        {/* table head */}
        <div className="grid grid-cols-3 gap-[10px] border-b border-t border-grey-v-3 dark:border-opacity-[15%]">

          <div className="flex items-center py-5">
            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">time</p>
            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
          </div>

          <div className="flex items-center lg:justify-start justify-center ">
            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Converted</p>
            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
          </div>

          <div className="flex items-center lg:justify-start justify-end">
            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Received</p>
            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
          </div>

        </div>

        {/* table content */}
        <div className="">
          {currentItems && currentItems.length > 0 && currentItems?.map((item: any, index: number) => {
            return (
              <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                  <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                    <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                      <p className="info-14-18 dark:text-white">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.converted}</p>
                </div>
                <div className="iconParent lg:text-start text-end flex items-center justify-between">
                  <p className="info-14-18 dark:text-white">{item?.received}</p>

                </div>
              </div>
            );
          })}
          {currentItems && currentItems.length === 0 &&
            <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
              <Image
                src="/assets/refer/empty.svg"
                alt="emplty table"
                width={107}
                height={104}
              />
              <p > No Record Found </p>
            </div>
          }
        </div>
      </div>
    </div>
    <div className="flex pt-[25px] items-center justify-between">
      <p className="info-12 md:footer-text !text-gamma">{total} assets</p>
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
    </div>
  </>
  )
}

export default ConvertList
