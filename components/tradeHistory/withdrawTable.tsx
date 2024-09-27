import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '../snippets/market/buySellCard';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { formatDate } from '@/libs/subdomain';

interface propsData {
  filter: string,
  date: Date,
  coin: string,
  textToCopy?: string;
}

const WithdrawTable = (props: propsData) => {
  const { data: session } = useSession();
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const [totalRecord, setTotalRecord] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);


  const [imgSrc, setImgSrc] = useState(false);

  const { mode } = useContext(Context)

  let itemsPerPage = 10;

  

  useEffect(() => {
    getWithdrawData();
    // console.log(currentItems,"============currentItems");

  }, [itemOffset])

  useEffect(() => {

 if(session){
  getWithdrawData()
 }

  }, [props.coin, props.date,session])

  async function getWithdrawData() {
     let currency = props.coin !== undefined && props.coin !== "" ? props.coin : "all"
    let date = props.date !== undefined ? new Date(props.date).toISOString() : "all"
    let withdraw = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/withdraw/list?user_id=${session?.user?.user_id}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=${currency}&date=${date}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());

    // console.log(withdraw,"==============withdraw");

    setTotal(withdraw?.data?.total)



    if (withdraw?.data?.total <= 10) {
      setItemOffset(0)
    }
    if (withdraw?.data?.data?.message !== undefined) {
      withdraw = [];
    }
    else {
      // console.log("=here");

      withdraw = withdraw?.data?.data;
    }
    setTotalRecord(withdraw)
  }

  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  // Function to copy text to the clipboard
  const copyToClipboard = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
  };

  // Event handler for clicking an address
  const handleAddressClick = (text: string): void => {
    copyToClipboard(text);
    toast.success('Copied to clipboard!', { autoClose: 1500 });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Side</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Address</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Qty</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fee</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="hidden md:flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Network</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Tx_Hash</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>

              <th className=" py-5">
                <div className="flex">
                  <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                  <Image loading='lazy' src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {totalRecord && totalRecord?.length > 0 && totalRecord?.map((item: any, index: any) => {           
              return (
                <tr key={index}>
                  <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                      <Image loading='lazy' src={`${imgSrc ? '/assets/history/Coin.svg' : item.token !== null ? item?.token?.image : item?.global_token?.image}`} className={`${item?.symbol === "XRP" && "bg-white rounded-full "}`} width={30} height={30} alt="coins" onError={() => setImgSrc(true)} />
                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                        <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                        {/* <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.token !== null ?item?.token?.symbol : item?.global_token?.symbol}</p> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className=" items-center gap-5 py-[10px] md:py-[15px] px-0 md:px-[5px] md:flex hidden">
                      <div className={`p-0 md:p-[5px] rounded-5 bg-[transparent] md:bg-buy `}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                            className="fill-buy md:fill-white"
                          />
                        </svg>
                      </div>
                      <div className="hidden md:block">
                        <p className="info-14-18 dark:text-white">Withdraw</p>
                        <p className="info-10">{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss a")}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className={`info-14-18 dark:text-white ${loading ? 'cursor-not-allowed' : ''}`}
                    >
                      <button id={`my-anchorTmb-element-${index}`} className={`${loading ? 'pointer-events-none' : ''}`} onClick={() => {
                        setLoading(true);
                        handleAddressClick(item.withdraw_wallet);
                      }}>
                        {item?.withdraw_wallet.substring(0, 7) + '...'}
                      </button>

                    </p>
                    <Tooltip anchorSelect={`#my-anchorTmb-element-${index}`} content={item.withdraw_wallet} />
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white">{currencyFormatter(item?.amount)}</p>
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white md:block hidden">{item.fee}</p>
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white md:block hidden">{item?.network?.fullname}</p>
                  </td>
                  <td>
                    <p className={`info-14-18 dark:text-white ${loading ? 'cursor-not-allowed' : ''}`}>


                      <button id={`my-anchor-element-${index}`}  className={`${loading ? 'pointer-events-none' : ''}`} onClick={() => {
                        if(item.tx_hash && item.tx_hash !== null){
                          setLoading(true);
                          handleAddressClick(item.tx_hash);
                        }
                      }}>{item.tx_hash && item.tx_hash !== null && item.tx_hash.substring(0, 7) + '..'}</button>

                    </p>
                    <Tooltip anchorSelect={`#my-anchor-element-${index}`} content={item.tx_hash} />
                  </td>
                  <td>
                    <p className={`info-14-18  capitalize ${item?.status == "success" ? '!text-buy' : item?.status == "pending" ? '!text-primary' : ' !text-cancel'}`}>{item?.status}</p>
                  </td>
                </tr>
              );
            })}

            {totalRecord && totalRecord?.length === 0 &&
              <tr>
                <td colSpan={7}>
                  <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                    <Image loading='lazy'
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

export default WithdrawTable