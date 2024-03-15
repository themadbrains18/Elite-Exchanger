import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../contexts/context";
import Image from "next/image";
import FiliterSelectMenu from "../filter-select-menu";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import clickOutSidePopupClose from "../clickOutSidePopupClose";

const schema = yup.object().shape({
    time: yup.string().required("This field is required"),
    amount: yup
        .number()
        .positive()
        .required("This field is required")
        .typeError("Enter value must be number and positive value"),
});

interface activeSection {
    setShow1: Function;
    session: any;
    token: any;
    selectedCoinBalance: number;
    refreshData: any;
}

const StakingModel = (props: activeSection) => {
    const { mode } = useContext(Context);
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState();
    const [enable, setEnable] = useState(1);
    const [timeLock, setTimeLock] = useState(Object);

    const [totalStaked, setTotalStaked] = useState();

    useEffect(() => {
        getUserStakedByToken()
    }, [props.token]);

    const getUserStakedByToken = async () => {
        try {
            let tokenid = props?.token?.id;
    
            let staked = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking?userid=${session?.user?.user_id}&tokenid=${tokenid}`, {
                method: "GET",
                headers: {
                    "Authorization": session?.user?.access_token
                },
            }).then(response => response.json());
    
            setTotalStaked(staked.data[0].total === null ? 0 : staked.data[0].total);
            
        } catch (error) {
            console.log("error in token stake",error);
            
        }
    }

    let {
        register,
        setValue,
        handleSubmit,
        watch,
        clearErrors,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onHandleSubmit = async (data: any) => {
        try {

            if (data.amount > props.selectedCoinBalance) {
                toast.error('Insufficiant balance');
                return
            }
            if (data.amount < props?.token?.token_stakes[0]?.minimum_amount) {
                toast.error('Please enter amount greater than minimum amount');
                return
            }

            let obj = {
                "user_id": session?.user?.user_id,
                "token_id": props?.token?.id,
                "amount": data.amount,
                "apr": props?.token?.token_stakes[0]?.apr,
                "time_log": timeLock?.duration,
                "time_format": data?.time
            }

            const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
            let record = encodeURIComponent(ciphertext.toString());

            let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token
                },
                body: JSON.stringify(record)
            })

            let res = await responseData.json();

            if (res.data.status === 200) {
                toast.success(res?.data?.data?.message);
                props.refreshData();
                props.setShow1(0);
            }
            else {
                toast.error(res?.data?.data?.message);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const onTimeChange = (data: any) => {
        setTimeLock(data);
        setValue('time', data?.time);
        clearErrors('time');
    }

    const closePopup = () => {
        props.setShow1(0);
      }
      const wrapperRef = useRef(null);
      clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <>
            <ToastContainer position="top-right" />
            {enable === 1 && (
                <div ref={wrapperRef} className="max-h-[614px] lg:max-h-fit overflow-y-auto max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <div className="flex items-center justify-between pb-[10px] md:pb-[15px] border-b border-grey-v-2 dark:border-opacity-[15%] dark:border-beta">
                        <p className="sec-title">Staking Token</p>
                        <svg
                            onClick={() => {
                                props.setShow1(0);
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
                                fill={mode === "dark" ? "#fff" : "#000"}
                                d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                          c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                          l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          C61.42,57.647,61.42,54.687,59.595,52.861z"
                            />
                        </svg>
                    </div>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <div className="py-30 md:py-10">
                            {/* Available balance */}
                            <div className="mb-[15px] md:mb-5">
                                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex justify-between rounded-5 p-[11px] md:p-[15px]">
                                    <div className="flex gap-2 ">
                                        <Image
                                            src="/assets/history/coin.svg"
                                            width={25}
                                            height={25}
                                            alt="coins"
                                        />
                                        <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-1">
                                            <p className="info-14-18 dark:text-white">
                                                {props?.token?.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="sm-text">Available {props.selectedCoinBalance}</p>
                                </div>
                            </div>

                            {/* current stake amount */}
                            <div className="mb-[15px] md:mb-5">
                                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex justify-between rounded-5 p-[11px] md:p-[15px]">
                                    <div className="flex gap-2 ">
                                        <Image
                                            src="/assets/history/coin.svg"
                                            width={25}
                                            height={25}
                                            alt="coins"
                                        />
                                        <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-1">
                                            <p className="info-14-18 dark:text-white">
                                                {props?.token?.symbol} Staked
                                            </p>
                                        </div>
                                    </div>
                                    <p className="sm-text"> {totalStaked}</p>
                                </div>
                            </div>

                            <div className='flex items-center justify-between mb-[15px]'>
                                <p className='info-16-22 !text-black dark:!text-white !font-mediumn'>Minimum Amount</p>
                                <p className='info-14-16 text-grey'>{props?.token?.token_stakes.length > 0 && props?.token?.token_stakes[0]?.minimum_amount} {props?.token?.symbol} </p>
                            </div>
                            <div className='flex items-center justify-between mb-[15px]'>
                                <p className='info-16-22 !text-black dark:!text-white !font-mediumn'>APR</p>
                                <p className='info-14-16 text-grey'>{props?.token?.token_stakes.length > 0 && props?.token?.token_stakes[0]?.apr}%</p>
                            </div>

                            <div className='flex items-center justify-between mb-[15px]'>
                                <p className='info-16-22 w-full !text-black dark:!text-white !font-mediumn'>Time Lock</p>
                                <FiliterSelectMenu
                                    data={props?.token?.token_stakes[0]?.lockTime}
                                    placeholder="Select Time"
                                    auto={false}
                                    widthFull={true}
                                    onTimeChange={onTimeChange}
                                    type="userstaking"
                                />
                            </div>
                            {errors.time && (
                                <p style={{ color: "red" }}>{errors.time.message}</p>
                            )}

                            {timeLock?.time !== undefined &&
                                <div className="">
                                    <label className="sm-text ">Amount</label>
                                    <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                                        <input
                                            type="text"
                                            {...register("amount")}
                                            name="amount"
                                            placeholder="Enter Amount"
                                            className="outline-none sm-text w-full bg-[transparent]"
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p style={{ color: "red" }}>{errors.amount.message}</p>
                                    )}

                                </div>
                            }

                        </div>
                        <button type="submit" className="solid-button w-full">
                            Stake
                        </button>
                    </form>

                </div>
            )}
        </>
    );
};

export default StakingModel;
