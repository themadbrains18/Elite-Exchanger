import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react'

interface dataTypes {
    data: any;
    setOrderId?: any;
}

const OrdersTableDesktop = (props: dataTypes) => {

    const route = useRouter();
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
                            props.data.map((item: any, ind: number) => {
                                return (
                                    <Fragment key={ind}>
                                        <tr onClick={() => {
                                            props.setOrderId(item.id);
                                            route.push(`?buy=${item.id}`);
                                        }} className='cursor-pointer'>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'><span className={`${item.type === "sell" ? "text-cancel" : "text-buy"}`}>{item.type}</span>&nbsp;{item.id}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className={`info-14-18   ${(item.status === "isCompleted" || item.status === "isReleased")   && "!text-buy"}  ${item.status === "isProcess" && "!text-body-primary"} ${item.status === "isCanceled" && "!text-cancel"}`}>{item.status==="isProcess"?"In Process":item.status==="isReleased"?"Released":item.status==="isCompleted"?"Completed":"Canceled"}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.spend_amount}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.price}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.quantity}</p>
                                            </td>
                                            <td className="bg-white dark:bg-d-bg-primary py-5">
                                                <p className='info-14-18 !text-nav-primary dark:!text-white'>{item.receive_amount}</p>
                                            </td>
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default OrdersTableDesktop;