import React, { useContext, useLayoutEffect, useState } from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import Context from "../contexts/context";
import moment from "moment";

interface propsData {
  watchList?: any;
}

const CoinList = (props: propsData) => {

  const { mode } = useContext(Context)
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [imgSrc, setImgSrc] = useState(false);

  let data = props?.watchList;

  let itemsPerPage = 10;

  useLayoutEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data?.slice(itemOffset, endOffset);
    setCurrentItems(currentItems);
  }, [])


  const pageCount = Math.ceil(data?.length / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % data?.length;
    setItemOffset(newOffset);
  };

  const filterData = async (e: any) => {
    let search = e.target.value;
    const endOffset = itemOffset + itemsPerPage;
    let currentItems;
    if (search !== "") {
      let data = props?.watchList.filter((item: any) => {
        return item?.token !== null ? item?.token?.symbol.toLowerCase().includes(e.target.value.toLowerCase()) : item?.global_token?.symbol.toLowerCase().includes(e.target.value.toLowerCase());
      })
      currentItems = (data && data?.length > 0) ? data.slice(itemOffset, endOffset) : [];
    }
    else {
      currentItems = (props?.watchList && props?.watchList?.length > 0) ? props?.watchList.slice(itemOffset, endOffset) : [];
    }
    setCurrentItems(currentItems);

  }

  return (
    <section className="">
      <div className="p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
        <div className="flex gap-5 justify-between mb-[20px]">
          <div>
            <p className="sec-title">Watchlist</p>
          </div>
          <div className="border w-full rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px]  py-[13px] px-[10px] ">
            <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
            <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" onChange={(e) => filterData(e)} />
          </div>

        </div>
        {/* <div className="flex mt-40 justify-between gap-[20px] flex-wrap xl:flex-nowrap mb-[20px]">
          <div className="hidden md:flex gap-30 ">
            <div className="flex items-center cursor-pointer gap-30 group py-[15px] bg-primary px-5 rounded-5">
              <p className="nav-text-lg text-white">WatchList</p>
              <IconsComponent type="downArrow" hover={true} active={true} />
            </div>
            <div className="min-w-[52px] min-h-[52px] flex py-[15px] px-[15px] bg-grey rounded-5 dark:bg-black-v-1">
              <Image src='/assets/market/add.svg' className="m-auto" width={22} height={22} alt="add" />
            </div>

          </div>
          <div className="flex items-center gap-5 justify-between xl:justify-end">
            <div className="p-[5px] md:block hidden">
              <Image src='/assets/market/wallet.svg' width={24} height={24} alt="wallet" className="" />
            </div>
            <div className="p-[5px]">
              <Image src='/assets/market/grid.svg' width={24} height={24} alt="grid" className="" />
            </div>
            <div className="border w-full rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px]  py-[13px] px-[10px] ">
              <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
              <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" />
            </div>
          </div>
        </div> */}
        <div className="overflow-x-auto">

          <table width="100%" className="lg:min-w-[1018px] w-full">
            <thead>
              <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">

                <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                  <div className="flex ">
                    <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin Name</p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th>
                <th className=" py-5">
                  <div className="flex  lg:justify-start justify-end">
                    <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin Price</p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th>
                <th className="max-[1023px]:hidden py-5">
                  <div className="flex lg:justify-start justify-end">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Created At</p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th>
                {/*<th className="max-[1023px]:hidden py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">24h High </p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th>
                <th className="max-[1023px]:hidden py-5">
                  <div className="flex">
                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">24h Low </p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th>
                <th className="max-[1023px]:hidden py-5">
                  <div className="flex">
                    <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Chart</p>
                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                  </div>
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item: any, index: number) => {
                return (
                  <tr key={index} className="rounded-5 group hover:bg-[#FEF2F2] dark:hover:bg-black-v-1 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/chart/${item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}`
                    }}>
                    <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                      <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                        <Image src={imgSrc ? '/assets/history/Coin.svg' : item?.token !== null ? item?.token?.image : item?.global_token?.image} width={30} height={30} alt="coins" onError={() => setImgSrc(true)} />
                        <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                          <p className="info-14-18 dark:text-white">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                          <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className=" lg:text-start text-end">
                      <p className="info-14-18 dark:text-white">${item?.token !== null ? item?.token?.price : item?.global_token?.price}</p>
                    </td>
                    <td className="max-[1023px]:hidden">
                      <div className={` items-center gap-[10px] flex`}>
                        <p className={`info-14-18 dark:text-white `}>{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                        <IconsComponent type={item.status} active={false} hover={false} />
                      </div>
                    </td>

                    {/*<td className="max-[1023px]:hidden">
                      <p className="info-14-18 dark:text-white block">${item.high}</p>
                    </td>
                    <td className="max-[1023px]:hidden">
                      <p className="info-14-18 dark:text-white block ">${item.low}</p>
                    </td>
                    <td className="max-[1023px]:hidden">
                      <div className="info-14-18 min-w-[114px] w-full dark:text-white">
                        <Image src="/assets/market/Graph.svg" width={114} height={48} alt="graph" />
                      </div>
                    </td> */}

                  </tr>
                );
              })}

              {currentItems && currentItems?.length === 0 &&
                <tr>
                  <td colSpan={3}>
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
          <p className="info-12 md:footer-text !text-gamma">{currentItems?.length} assets</p>

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
      </div>
    </section>
  );
};

export default CoinList;
