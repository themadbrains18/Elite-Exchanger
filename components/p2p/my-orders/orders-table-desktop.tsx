import Context from '@/components/contexts/context';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

interface dataTypes {
    active: any;
    setOrderId?: any;
}

const OrdersTableDesktop = (props: dataTypes) => {

    const route = useRouter();
    const { mode } = useContext(Context);

    const [itemOffset, setItemOffset] = useState(0);

    const { status, data: session } = useSession();
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)


    let itemsPerPage = 10;


    useEffect(() => {
        getAllOrders(itemOffset);
    }, [itemOffset, props?.active]);


    const getAllOrders = async (itemOffset: number) => {
        try {
            if (itemOffset === undefined) {
                itemOffset = 0;
            }
            let userAllOrderList:any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/status?userid=${session?.user?.user_id}&status=${props?.active===1?"all":props?.active===2?"isProcess":props?.active===3?"isReleased":props?.active===4?"isCanceled":"all"}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
                method: "GET",
                headers: {
                  "Authorization": session?.user?.access_token
                },
              }).then(response => response.json());

              setTotal(userAllOrderList?.data?.total)
            setList(userAllOrderList?.data?.data);

        } catch (error) {
            console.log("error in get token list", error);

        }
    };
    const pageCount = Math.ceil(total / itemsPerPage);

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % total;
        setItemOffset(newOffset);

    };

    return (
        <>

            <div className='mt-20'>
                <table width="100%">
                    <thead>
                        <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Order Id</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Status</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Amount</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Qty </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5">
                                <div className="flex ">
                                    <p className="nav-text-sm">Date / Time </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                          list.length>0 && list?.map((item: any, ind: number) => {
                                return (
                                    <Fragment key={ind}>
                                        <tr onClick={() => {
                                            props?.setOrderId(item?.id);
                                            route.push(`/p2p/my-orders?buy=${item?.id}`);
                                        }} className='cursor-pointer'>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'><span className={`${item?.type === "sell" ? "text-cancel" : "text-buy"}`}>{item?.type}</span>&nbsp;{item?.id}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className={`info-14-18   ${(item?.status === "isCompleted" || item?.status === "isReleased") && "!text-buy"}  ${item?.status === "isProcess" && "!text-body-primary"} ${item?.status === "isCanceled" && "!text-cancel"}`}>{item.status === "isProcess" ? "In Process" : item.status === "isReleased" ? "Released" : item.status === "isCompleted" ? "Completed" : "Canceled"}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{new Intl.NumberFormat().format(item?.spend_amount)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{new Intl.NumberFormat().format(item?.price)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item?.quantity?.toFixed(8)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{moment(item?.createdAt).format("YYYY-MM-DD hh:mm:ss A")}</p>
                                            </td>
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }
                        {list?.length === 0 &&
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
        </>
    )
}

export default OrdersTableDesktop;