import ReactPaginate from "react-paginate";
import Image from "next/image";
import IconsComponent from "../icons";
import { useContext, useMemo, useState } from "react";
import Context from "../../contexts/context";
import { useRouter } from "next/router";

import Deposit from "../deposit";
import { currencyFormatter } from "./buySellCard";
import Link from "next/link";

interface propsData {
    coins: any,
    session: any,
    networks: any
}

// interface propsData {
//     coins: any
// }

const Future = (props: propsData) => {

    const [itemOffset, setItemOffset] = useState(0);
    const [show1, setShow1] = useState(0);
    const router = useRouter();
    const { mode } = useContext(Context)
    const [token, setToken] = useState(Object);
    const [imgSrc, setImgSrc] = useState(false);

    let itemsPerPage = 10;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = props.coins.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(props.coins.length / itemsPerPage);

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % props.coins.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table width="100%" className="lg:min-w-[1018px] w-full">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                            <th className="lg:sticky bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="text-start !text-[12px] md:!text-[14px]nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-5">
                                <div className="flex">
                                    <p className="text-start !text-[12px] md:!text-[14px] nav-text-sm md:nav-text-lg dark:text-gamma">Last Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>

                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start !text-[12px] md:!text-[14px] nav-text-sm md:nav-text-lg dark:text-gamma">24h Low </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start !text-[12px] md:!text-[14px] nav-text-sm md:nav-text-lg dark:text-gamma">24h High </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start !text-[12px] md:!text-[14px] nav-text-sm md:nav-text-lg dark:text-gamma">24h Change</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-center !text-[12px] md:!text-[14px] nav-text-sm md:nav-text-lg dark:text-gamma">Trade</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.length > 0 && currentItems?.map((item: any, index: any) => {
                            let marketPrice = item?.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5);
                            
                            let change = ((item?.price - item?.hlocv?.open) / item?.hlocv?.open) * 100;

                            if (item?.hlocv?.open === 0) {
                                change = 0.00;
                            }
                            return (
                                <tr key={index} className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => router.push(`/future/${item?.coin_symbol}${item?.usdt_symbol}`)}>

                                    <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky bg-white dark:bg-d-bg-primary">
                                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                            <Image src={`${imgSrc ? '/assets/history/Coin.svg' : item?.image}`} width={30} height={30} alt="coins" onError={() => setImgSrc(true)} className={`${item?.symbol === "XRP" && "bg-white rounded-full"}`} />

                                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                                <p className="info-14-18 dark:text-white">{item?.symbol}</p>
                                                {/* <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="info-14-18 !text-[14px] md:!text-[16px] dark:text-white  ">${currencyFormatter(item?.price)}</p>
                                    </td>


                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 !text-[14px] md:!text-[16px] dark:text-white">${currencyFormatter(Number(item?.hlocv?.low).toFixed(4))}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 !text-[14px] md:!text-[16px] dark:text-white">${currencyFormatter(Number(item?.hlocv?.high)?.toFixed(4))}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <div className={`flex items-center gap-[4px] flex-wrap`}>
                                            <p className={`footer-text-secondary  ${Number(item?.hlocv?.changeRate) > 0 ? '!text-buy' : '!text-sell'}`}>{Number(item?.hlocv?.changeRate) > 0 ? '+' : ''}{item?.hlocv?.changeRate !== undefined ? (Number(item?.hlocv?.changeRate) * 100).toFixed(3) : '0.0'}%</p>

                                            {Number(item?.hlocv?.changeRate) > 0 &&
                                                <IconsComponent type="high" active={false} hover={false} />
                                            }
                                            {Number(item?.hlocv?.changeRate) < 0 &&
                                                <IconsComponent type="low" active={false} hover={false} />
                                            }
                                        </div>

                                    </td>
                                    <td>
                                        {/* <button onClick={() => router.push(`/future/${item?.futuretradepair?.coin_symbol}${item?.futuretradepair?.usdt_symbol}`)} className=" w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                            <IconsComponent type="openInNewTab" hover={false} active={false} />
                                        </button> */}
                                        <a href={`/future/${item?.futuretradepair?.coin_symbol}${item?.futuretradepair?.usdt_symbol}`} className=" w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                            <IconsComponent type="openInNewTab" hover={false} active={false} />
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                        {currentItems?.length === 0 &&
                            <tr>
                                <td colSpan={6}>
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
                <div className="flex pt-[25px] items-center justify-end">
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
            }
            {
                show1 === 1 &&
                <>
                    <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
                    <Deposit setShow1={setShow1} networks={props.networks} session={props.session} token={token} />
                </>
            }
        </>
    )
}

export default Future;