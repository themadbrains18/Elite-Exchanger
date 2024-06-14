import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TransferModal from '../future/popups/transfer-modal';


interface propsData {
    filter: string;
}

const FutureList = (props: propsData) => {
    const [currentItems, setCurrentItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [total, setTotal] = useState(0)
    const { mode } = useContext(Context)
    const { status, data: session } = useSession();
    const [popupMode, setPopupMode] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCoin, setSelectedCoin] = useState(Object);
    const [show1, setShow1] = useState(0);
    const [selectedCoinBalance, setSelectedCoinBalance] = useState(0.00);
    const router = useRouter();

    let itemsPerPage = 10;

    const setHeight = (e: any) => {
        let parent = e.currentTarget.closest(".iconParent");
        let parentHeight = parent.nextElementSibling.scrollHeight;
        parent.classList.toggle("show");
        if (parent.classList.contains("show")) {
            parent.nextElementSibling.setAttribute("style", `height:${parentHeight}px; overflow-x:auto`);
        } else {
            parent.nextElementSibling.removeAttribute("style");
        }
    }

    useEffect(() => {
        getFutureWalletData()

    }, [itemOffset, props?.filter, popupMode])

    async function getFutureWalletData() {
        let spotHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets/type?type=future_wallet&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

        setTotal(spotHistory?.data?.totalLength)
        if (props?.filter !== "") {
            let data = spotHistory?.data?.data.filter((item: any) => {
                return item?.token !== null ? item?.token?.symbol.toLowerCase().includes(props?.filter.toLowerCase()) : item?.global_token?.symbol.toLowerCase().includes(props?.filter.toLowerCase());
            })
            setCurrentItems(data);
        }
        else {
            setCurrentItems(spotHistory?.data?.data);

        }

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
                                    <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-5">
                                <div className="flex  lg:justify-start justify-center ">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Avbl. Balance</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-5">
                                <div className="flex lg:justify-start justify-end">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-5 max-[1023px]:hidden ">
                                <div className="flex">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="py-5 max-[1023px]:hidden ">
                                <div className="flex lg:justify-start justify-end ">
                                    <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />

                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: number) => {
                            // ================================
                            // Trade button enable or disable
                            // ================================
                            let tradeCusrsor = false;
                            if (item.token !== null && item?.token?.futuretradepair !== null) {
                                tradeCusrsor = true;
                            }
                            if (item.global_token !== null && item?.global_token?.futuretradepair !== null) {
                                tradeCusrsor = true;
                            }
                            return (
                                <tr key={index} className="rounded-5 group ">
                                    <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                                            <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" />
                                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                                {/* <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(5)}</p>
                                    </td>
                                    <td className="lg:text-start text-end">
                                        <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 dark:text-white">${(item.token !== null ? item?.token?.price * item?.balance : item?.global_token?.price * item?.balance).toFixed(2)}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden ">
                                        <div className="flex items-center gap-[20px]">

                                            <button onClick={() => {
                                                setSelectedCoinBalance(item?.balance);
                                                setPopupMode(3);
                                                setShow1(4);
                                                setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                                            }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                                <span className="text-primary block">Transfer</span>
                                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                                            </button>

                                            <button onClick={() => router.push(`/future/${item?.token !== null ? item?.token?.futuretradepair?.coin_symbol : item?.global_token?.futuretradepair?.coin_symbol}${item?.token !== null ? item?.token?.futuretradepair?.usdt_symbol : item?.global_token?.futuretradepair?.usdt_symbol}`)} disabled={!tradeCusrsor} className={` max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                                <span className="text-primary block">Trade</span>
                                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );

                        })}

                        {currentItems && currentItems?.length === 0 &&
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
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>

                        <div className="flex items-center lg:justify-start justify-center ">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Balance</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>

                        <div className="flex items-center lg:justify-start justify-end">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>

                    </div>

                    {/* table content */}
                    <div className="">
                        {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: number) => {
                            // ================================
                            // Trade button enable or disable
                            // ================================
                            let tradeCusrsor = false;
                            if (item.token !== null && item?.token?.futuretradepair !== null) {
                                tradeCusrsor = true;
                            }
                            if (item.global_token !== null && item?.global_token?.futuretradepair !== null) {
                                tradeCusrsor = true;
                            }
                            return (
                                <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                                    <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                                            <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={28} height={28} alt="coins" className="max-w-[20px] md:max-w-[30px] w-full" />
                                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(2)}</p>
                                    </div>
                                    <div className="iconParent lg:text-start text-end flex items-center justify-between">
                                        <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                                        <div onClick={(e) => { setHeight(e) }}>
                                            <IconsComponent type="downArrow" hover={false} active={false} />
                                        </div>
                                    </div>
                                    <div className={`fullWidthContent`}>
                                        <div className="flex items-center gap-[10px] justify-center pb-[10px] overflow-x-auto">

                                            <button onClick={() => {
                                                setSelectedCoinBalance(item?.balance);
                                                setPopupMode(3);
                                                setShow1(4);
                                                setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                                            }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                                <span className="text-primary block">Transfer</span>
                                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                                            </button>
                                            <button onClick={() => router.push(`/future/${item?.token !== null ? item?.token?.futuretradepair?.coin_symbol : item?.global_token?.futuretradepair?.coin_symbol}${item?.token !== null ? item?.token?.futuretradepair?.usdt_symbol : item?.global_token?.futuretradepair?.usdt_symbol}`)} disabled={!tradeCusrsor} className={` max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                                <span className="text-primary block">Trade</span>
                                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {currentItems && currentItems?.length === 0 &&
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
                <p className="info-12 md:footer-text !text-gamma">{currentItems?.length} assets</p>
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
            {
                show1 === 4 &&
                <>
                    <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
                    <TransferModal setOverlay={setShow1} setPopupMode={setPopupMode} popupMode={popupMode} assets={currentItems} wallet_type="future_wallet"/>
                </>
            }
        </>
    )
}

export default FutureList