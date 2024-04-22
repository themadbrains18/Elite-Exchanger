import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Context from '@/components/contexts/context';
import { useSession } from 'next-auth/react';
import ReactPaginate from 'react-paginate';

interface dataTypes {
    active: any;
    setOrderId?: any;
}
const OrdersTableMobile = (props: dataTypes) => {
    
    const route = useRouter();
    const { mode } = useContext(Context);

    const [itemOffset, setItemOffset] = useState(0);

    const { status, data: session } = useSession();
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)


    let itemsPerPage = 20;


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

    function formatDate(date: Date) {
        const options: {} = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return new Date(date).toLocaleDateString("en-US", options);
    }

    return (
        <>
            <div>
                {
                   list.length>0 && list?.map((item: any, ind: number) => {
                        return (
                            <Fragment key={ind}>
                                <div className='grid grid-cols-2 py-[15px] border-b-[0.5px]  dark:border-[#efefef26] border-grey-v-2' onClick={() => {
                                            props?.setOrderId(item?.id);
                                            route.push(`?buy=${item?.id}`);
                                        }}>
                                    <div className=''>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Order Id</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'><span className={`${item.type === "sell" ? "text-cancel" : "text-buy"}`}>{item.type}</span>&nbsp;{item.orderId}</p>
                                    </div>
                                    <div className='text-end'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Status</p>
                                        <p className={`info-14-18  ${(item.status === "isCompleted" || item.status === "isReleased") && "!text-buy"}  ${item.status === "isProcess" && "!text-body-primary"} ${item.status === "isCanceled" && "!text-cancel"}`}>{item.status === "isProcess" ? "In Process" : item.status === "isReleased" ? "Released" : item.status === "isCompleted" ? "Completed" : "Canceled"}</p>
                                    </div>
                                    <div className='mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Amount</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.spend_amount}</p>
                                    </div>
                                    <div className='text-end mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Price</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.price}</p>
                                    </div>
                                    <div className='mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Qty</p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity}</p>
                                    </div>
                                    <div className='text-end mt-[15px]'>
                                        <p className='sm-text !text-body-secondary dark:!text-beta !text-[12px]'>Date / Time </p>
                                        <p className='info-14-18 !text-nav-primary dark:!text-white'>{formatDate(item.createdAt)}</p>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }

            </div>

            {list.length === 0 &&
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

export default OrdersTableMobile;