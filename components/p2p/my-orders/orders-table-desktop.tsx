import Context from '@/components/contexts/context';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

interface dataTypes {
    active: any;
    setOrderId?: any;
    paymentId?: string;
    firstCurrency?: string;
    startDate?: string;
    userPaymentMethod?: any;
    selectedToken?: any;
}

const OrdersTableDesktop = (props: dataTypes) => {
    // console.log(props.selectedToken,"========selectedToken");

    const route = useRouter();
    const { mode } = useContext(Context);

    const [itemOffset, setItemOffset] = useState(0);

    const { status, data: session } = useSession();
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)


    let itemsPerPage = 10;
    useEffect(() => {
        setItemOffset(0); // Reset itemOffset to 0 when filters change
    }, [props.active, props.selectedToken, props.startDate]);


    useEffect(() => {
        getAllOrders(itemOffset);
    }, [itemOffset, props?.active, props?.selectedToken, props?.startDate]);

    // console.log(session?.user.user_id)


    const getAllOrders = async (itemOffset: number) => {
        try {
            if (itemOffset === undefined) {
                itemOffset = 0;
            }
            let currency = props?.selectedToken !== undefined && props?.selectedToken !== "" ? props?.selectedToken?.id : "all"
            let date = props?.startDate !== undefined && props?.startDate !== "" ? new Date(props?.startDate).toISOString() : "all"
            let userAllOrderList: any = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/status?userid=${session?.user?.user_id}&status=${props?.active === 1 ? "all" : props?.active === 2 ? "isProcess" : props?.active === 3 ? "isReleased" : props?.active === 4 ? "isCanceled" : "all"}&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}&currency=${currency || "all"}&date=${date}`, {
                method: "GET",
                headers: {
                    "Authorization": session?.user?.access_token
                },
            }).then(response => response.json());

            if (userAllOrderList?.data?.total <= 10) {
                setItemOffset(0)
            }
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
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Asset/Type</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Status</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Amount</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Price</p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Qty </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                            <th className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                <div className="flex ">
                                    <p className="nav-text-sm">Date / Time </p>
                                    <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list && list?.length > 0 && list?.map((item: any, ind: number) => {

                                return (

                                    <Fragment key={ind}>
                                        <tr onClick={() => {
                                            props?.setOrderId(item?.id);
                                            route.push(`/p2p/my-orders?buy=${item?.id}`);
                                        }} className='cursor-pointer'>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">

                                                <p className='info-14-18 !text-nav-primary dark:!text-white'><span className={`${item?.sell_user_id === session?.user.user_id ? "text-cancel" : "text-buy"} capitalize`}>{item?.sell_user_id === session?.user.user_id ? "Sell" : "Buy"}</span>&nbsp;{item?.receive_currency}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                                <p className={`info-14-18   ${(item?.status === "isCompleted" || item?.status === "isReleased") && "!text-buy"}  ${item?.status === "isProcess" && "!text-body-primary"} ${item?.status === "isCanceled" && "!text-cancel"}`}>{item.status === "isProcess" ? "In Process" : item.status === "isReleased" ? "Released" : item.status === "isCompleted" ? "Completed" : "Canceled"}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{currencyFormatter(item?.spend_amount)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{currencyFormatter(item?.price)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{truncateNumber(item?.quantity, 6)}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5 w-[16%]">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{formatDate(item?.createdAt,"yyyy-MM-dd HH:mm:ss a")}</p>
                                            </td>
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }
                        {list && list?.length === 0 &&
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
                        renderOnZeroPageCount={null}
                        forcePage={Math.floor(itemOffset / itemsPerPage)} />
                </div>
            }
        </>
    )
}

export default OrdersTableDesktop;