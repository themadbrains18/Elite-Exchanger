import ReactPaginate from "react-paginate";
import Image from "next/image";
import IconsComponent from "../icons";
import { useContext, useState } from "react";
import Context from "../../contexts/context";
import { useRouter } from "next/router";

interface propsData{
    coins:any
}

const AllCrypto = (props:propsData) => {

    const [itemOffset, setItemOffset] = useState(0);
    const router = useRouter();
    const { mode } = useContext(Context)

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
                                    <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin Name</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className=" py-5">
                                <div className="flex">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Coin Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Circulating Supply</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Total Supply </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Max Supply </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="max-[1023px]:hidden py-5">
                                <div className="flex">
                                    <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Chart</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length>0 && currentItems?.map((item: any, index: any) => {
                            return (
                                <tr key={index} className=" dark:hover:bg-black-v-1  group rounded-5 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => (item?.tradePair !== null ? router.push(`/chart/${item.symbol}`) : '')}>
                                    
                                    <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1 lg:sticky bg-white dark:bg-d-bg-primary">
                                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                            <Image src={item.image} width={30} height={30} alt="coins" />
                                            <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                                <p className="info-14-18 dark:text-white">{item.symbol}</p>
                                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="info-14-18 dark:text-white  ">${item.price.toFixed(8)}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <div className={` items-center gap-[10px] flex`}>
                                            <p className={`footer-text-secondary  ${item.status == "high" ? "!text-[#03A66D]" : "!text-[#DC2626]"}`}>{item.circulatingSupply}</p>
                                            <IconsComponent type={item.status} active={false} hover={false} />
                                        </div>
                                    </td>

                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 dark:text-white">${item.totalSupply}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 dark:text-white">${item.maxSupply}</p>
                                    </td>
                                    <td className="max-[1023px]:hidden">
                                        <p className="info-14-18 dark:text-white">
                                            <Image src="/assets/market/Graph.svg" width={114} height={48} alt="graph" />
                                        </p>
                                    </td>

                                </tr>
                            );
                        })}
                        {currentItems.length === 0 && 
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
            </div></>
    )
}

export default AllCrypto;