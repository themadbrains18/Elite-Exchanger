import moment from 'moment';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';


interface propsData{
  filter:string
}


const DepositTable = (props:propsData) => {

    const { data: session, status } = useSession();
    const [currentItems, setCurrentItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [total,setTotal] = useState(0)
    const { mode } = useContext(Context)
  
    let itemsPerPage = 2;
  
    useEffect(()=>{    
      getDepositData()
  
    },[itemOffset,props?.filter])
  
  
    async function getDepositData(){
      let depositHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/deposit?user_id=${session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());
  
      setTotal(depositHistory?.data?.total)
      if (props?.filter !== "") {
        let data = depositHistory?.data?.data.filter((item: any) => {
          return item.coinName.split('/')[1].toLowerCase().includes(props?.filter.toLowerCase());
        })
        setCurrentItems(data);
      }
      else{
        setCurrentItems(depositHistory?.data?.data);

      }

    }
  
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
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Side</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                    
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Filled</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Total Qty.</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: any) => {
                        return (
                          <tr key={index} >
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                {/* <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" /> */}
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item.coinName.split('/')[1]}</p>
                                  <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-5 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <div className={`p-0 md:p-[5px] rounded-5 bg-[transparent] ${item.side === "Sell" ? "md:bg-sell" : "md:bg-buy"} `}>
                                  {item.side === "Buy" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                        className="fill-buy md:fill-white"
                                      />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.7558 5.55687C14.43 5.23104 13.9033 5.23104 13.5775 5.55687L6.66667 12.4677V7.81271C6.66667 7.35271 6.29417 6.97938 5.83333 6.97938C5.3725 6.97938 5 7.35271 5 7.81271V14.4794C5 14.9394 5.3725 15.3127 5.83333 15.3127H12.5C12.9608 15.3127 13.3333 14.9394 13.3333 14.4794C13.3333 14.0194 12.9608 13.646 12.5 13.646H7.845L14.7558 6.73521C15.0817 6.40937 15.0817 5.88271 14.7558 5.55687"
                                        className="fill-sell md:fill-white"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="hidden md:block">
                                  <p className="info-14-18 dark:text-white">{item.side}</p>
                                  <p className="info-10">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                                </div>
                                <div className="block md:hidden">
                                  <p className="info-14-18 dark:text-white">{item.type}</p>
                                  <p className="info-10">{item.amount}</p>
                                </div>
                              </div>
                            </td>
                           
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">Filled</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.amount}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.amount}</p>
                            </td>
                            <td>
                              <p className={`info-14-18  text-buy`}>Approved</p>
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
                <div className="flex pt-[25px] items-center justify-between">
                  <p className="info-12 md:footer-text !text-gamma">{currentItems.length} assets</p>

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
   </>
  )
}

export default DepositTable
