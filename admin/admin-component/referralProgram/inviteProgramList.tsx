import Context from "@/components/contexts/context";
import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import SelectDropdown from "@/components/future/snippet/select-dropdown";
import Image from "next/image";

interface ActiveSession {
    data?: any;
    setInviteListShow: Function;
}

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

const InviteProgramList = (props: ActiveSession) => {
    const { mode } = useContext(Context);
    const { data: session } = useSession()



    return (
        <div className="max-w-[calc(100%-30px)] md:max-w-[700px] max-h-[607px] h-full  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center justify-between ">
                <p className="sec-title">Referral Event Invite List</p>
                <svg
                    onClick={() => {
                        props?.setInviteListShow(false);
                    }}
                    enableBackground="new 0 0 60.963 60.842"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 60.963 60.842"
                    xmlSpace="preserve"
                    className="max-w-[18px] cursor-pointer w-full"
                >
                    <path
                        fill={mode === "dark" ? "#fff" : "#9295A6"}
                        d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                              c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                              l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              C61.42,57.647,61.42,54.687,59.595,52.861z"
                    />
                </svg>
            </div>
            <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	mt-20">
                <table width="100%">
                    <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
                        <tr>
                            <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                                <input id="mainCheckbox" type="checkbox" className="hidden" />
                                <label
                                    htmlFor="mainCheckbox"
                                    className="
                                        relative
                                        
                                        after:w-20
                                        after:h-20
                                        after:border-[2px]
                                        after:border-[#B5B5C3]
                                        after:rounded-[4px]
                                        after:block
                
                                        before:w-[12px]
                                        before:h-[6px]
                                        before:border-l-[2px]
                                        before:border-b-[2px]
                                        border:dark:border-[#212121]
                                        border:border-[#fff]
                                        before:absolute
                                        before:left-[4px]
                                        before:top-[6px]
                                        before:rotate-[-45deg]
                                        before:hidden
                                        "
                                ></label>
                            </th>
                            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                                Event Name
                            </th>
                            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                                <div className="flex items-center gap-[5px]">
                                    <p>Amount</p>
                                </div>
                            </th>

                            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                                Created At
                            </th>

                            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                                Status
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {props.data &&
                            props.data.length > 0 &&
                            props.data?.map((item: any, index: number) => {
                                return (
                                    <tr
                                        key={index}
                                        className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                                    >
                                        <td className="px-10 py-[14px] admin-table-data">

                                            <label
                                                htmlFor={`checbox-${index}-item`}
                                                className="
                                                        relative
                                                        
                                                        after:w-20
                                                        after:h-20
                                                        after:border-[2px]
                                                        after:border-[#B5B5C3]
                                                        after:rounded-[4px]
                                                        after:block
                                
                                                        before:w-[12px]
                                                        before:h-[6px]
                                                        before:border-l-[2px]
                                                        before:border-b-[2px]
                                                        border:dark:border-[#212121]
                                                        border:border-[#fff]
                                                        before:absolute
                                                        before:left-[4px]
                                                        before:top-[6px]
                                                        before:rotate-[-45deg]
                                                        before:hidden
                                                        "
                                            ></label>
                                        </td>

                                        <td className="admin-table-data">{item?.name}</td>
                                        <td className="admin-table-data">{item?.amount}</td>
                                        <td className="admin-table-data">{formatDate(item?.createdAt)}</td>

                                        <td className="admin-table-data">
                                            <div className="flex gap-[5px] items-center">
                                                <div
                                                    className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status == true
                                                        ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                                        : "dark:bg-[#F44336] bg-[#F64E60]"
                                                        }`}
                                                ></div>
                                                <p
                                                    className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status == true
                                                        ? "dark:text-[#66BB6A] text-[#0BB783]"
                                                        : "dark:text-[#F44336] text-[#F64E60]"
                                                        }`}
                                                >
                                                    {item?.status == false ? "Inactive" : "Active"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="">
                                            <div className="inline-flex items-center gap-10">

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                        {(props.data === null || props.data === null || props.data?.length === 0) &&
                            <tr>
                                <td colSpan={5}>
                                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
                                        <Image
                                            src="/assets/refer/empty.svg"
                                            alt="emplty table"
                                            width={107}
                                            height={104}
                                        />
                                        <p className="sm-text"> No Record Found </p>
                                    </div>

                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InviteProgramList;
