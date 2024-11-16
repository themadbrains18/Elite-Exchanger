import Context from '@/components/contexts/context';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import { formatDate, truncateNumber } from '@/libs/subdomain';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';

/**
 * Defines the properties for the `OrdersTable` component.
 *
 * @interface OrdersTableProps
 */
interface OrdersTableProps {
    /**
    * Indicates the active state or item, can be of any type.
    * @type {any}
    */
    active: any;
    /**
    * Optional function or callback to set the current order ID.
    * @type {any | undefined}
    */
    setOrderId?: any;
    /**
    * Optional payment ID for the order.
    * @type {string | undefined}
    */
    paymentId?: string;
    /**
   * Optional string representing the first currency.
   * @type {string | undefined}
   */
    firstCurrency?: string;
    /**
     * Optional string representing the start date of the order.
     * @type {string | undefined}
     */
    startDate?: string;
    /**
     * Represents the user's selected payment method, can be of any type.
     * @type {any}
     */
    userPaymentMethod?: any;
    /**
     * Represents the selected token for the order, can be of any type.
     * @type {any}
     */
    selectedToken?: any;
}

const OrdersTableDesktop = (props: OrdersTableProps) => {

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

    /**
     * Fetches all orders when certain dependencies change, such as item offset, active state,
     * selected token, or start date.
     *
     * This effect runs when any of the dependencies (`itemOffset`, `props.active`, 
     * `props.selectedToken`, or `props.startDate`) change, triggering a call to `getAllOrders` 
     * with the current `itemOffset`.
     *
     * @function useEffect
     * @param {void} - The effect has no explicit parameters.
     * @returns {void} - It does not return anything.
     */
    useEffect(() => {
        getAllOrders(itemOffset);
    }, [itemOffset, props?.active, props?.selectedToken, props?.startDate]);

    /**
     * Fetches all orders for the user based on the provided filters (status, token, date).
     *
     * This function calls an API to fetch orders based on the user's selected token, start date,
     * active status, and the current offset. It then updates the order list and total count 
     * based on the response.
     *
     * @function getAllOrders
     * @param {number} itemOffset - The current offset for pagination of the order list.
     * @returns {void} - It does not return anything, but it updates the order list and total count state.
     */
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

    /**
     * Handles the page click event for pagination and updates the offset.
     *
     * This function calculates the new offset based on the selected page index and 
     * updates the `itemOffset` state accordingly to fetch the next set of items 
     * from the API or data source.
     *
     * @function handlePageClick
     * @param {object} event - The page click event, typically from a pagination component.
     * @param {number} event.selected - The selected page index (zero-based).
     * @returns {void} - It does not return anything, but it updates the `itemOffset` state.
     */
    const handlePageClick = async (event: any) => {
        // Calculate the new offset based on the selected page index
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
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{formatDate(item?.createdAt, "yyyy-MM-dd HH:mm:ss a")}</p>
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