import FiliterSelectMenu from "@/components/snippets/filter-select-menu";
import Context from "../../../components/contexts/context";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

interface activeSection {
    setEditStackShow: Function;
    token_id?: any;
    data?: any;
    refreshTokenList?:any;
}

const schema = yup.object().shape({
    apr: yup.number().required("This field is required"),
    minimum_amount: yup
        .number()
        .positive('Minimum amount must be greater than 0')
        .typeError("Amount must be a number")
        .required("Please provide  minimum amount."),
    lockTime: yup.array().of(
        yup.object().shape({
            duration: yup
                .number()
                .positive('Duration must be greater than 0')
                .typeError("Time Duration must be a number")
                .required("Please provide time limit."),
            time: yup.string().required("This field  is required"),
        })
    ),

});

const EditStake = (props: activeSection) => {
    const { mode } = useContext(Context);

    let {
        register,
        setValue,
        handleSubmit,
        reset,
        setError,
        getValues,
        clearErrors,
        formState,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { fields: lockTimefields, append: lockTimeappend, remove: lockTimeremove } = useFieldArray({
        name: "lockTime",
        control,
    });

    const [emptyData, SetEmptyData] = useState({
        minimum_amount: 0,
        apr: "",
        lockTime: [],
    });

    useEffect(() => {
        createForm();
    }, []);

    const createForm = (async () => {
        if (props.data.length > 0) {
            SetEmptyData(props.data);
            setValue('minimum_amount', props.data[0].minimum_amount);
            setValue('apr', props.data[0].apr);
            for (const dur of props.data[0].lockTime) {
                lockTimeremove();
            }
            
            Object.entries(props.data[0]).forEach((entry) => {
                const [key, value] = entry;
                if (key === "lockTime") {
                    let timeDuration:any = value;
                    for (const dur of timeDuration) {
                        lockTimeappend({ duration: dur.duration, time: dur.time });
                    }
                }
                
            });
        }
    });

    const timePeriod = [
        {
            value: "years",
            label: "Years",
        },
        {
            value: "months",
            label: "Months",
        },
        {
            value: "days",
            label: "Days",
        },
    ];


    const onHandleSubmit = async (data: any) => {
        try {

            data.token_id = props.token_id;

            let res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/staking/admin/create`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data),
            });

            let response = await res.json();

            if (response?.result) {
                toast.success(response?.message);
                props.refreshTokenList(response?.result);
                reset();
                props.setEditStackShow(false);
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error, "token stake auth");
        }
    };

    const onTimeChange = (value: string, index: any) => {
        setValue(`lockTime.${index}.time`, value);
        clearErrors('lockTime');
    }

    return (
        <>
            <div className="max-w-[calc(100%-30px)] md:max-w-[730px] max-h-[94vh] w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex items-center justify-between ">
                    <p className="sec-title">Add Token Stake</p>
                    <svg
                        onClick={() => {
                            props?.setEditStackShow(false);
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
                <form onSubmit={handleSubmit(onHandleSubmit)}>
                    <div className="pt-30">

                        <div className="mb-[10px]">
                            <label className="sm-text ">Minimum Amount</label>
                            <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                                <input
                                    type="text"
                                    placeholder="Enter Minimum Amount"
                                    className="outline-none sm-text w-full bg-[transparent]"
                                    {...register("minimum_amount")}
                                />
                            </div>
                            {errors?.minimum_amount && (
                                <p className="errorMessage">{errors?.minimum_amount?.message}</p>
                            )}
                        </div>
                        <div className="mb-[10px]">
                            <label className="sm-text ">APR</label>
                            <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                                <input
                                    type="text"
                                    placeholder="Enter Maximum Price"
                                    className="outline-none sm-text w-full bg-[transparent]"
                                    {...register("apr")}
                                />
                            </div>
                            {errors?.apr && (
                                <p className="errorMessage">{errors?.apr?.message}</p>
                            )}
                        </div>
                        <div className="mb-[10px] ">
                            <label className="sm-text ">Time Duration</label>
                        </div>
                        {lockTimefields && lockTimefields.length>0 &&lockTimefields?.map((item: any, i: number) => {
                            return <div className="mb-[10px] flex gap-[30px] md:flex-row flex-col">
                                <div className="w-full">
                                    <div className="border border-grey-v-1 dark:border-opacity-[15%] w-full rounded-5 md:px-[15px] text-center py-[8px]">
                                        <input
                                            type="text"
                                            placeholder="Enter Duration Time"
                                            className="outline-none sm-text w-full bg-[transparent]"
                                            {...register(`lockTime.${i}.duration`)}
                                        />

                                    </div>
                                    {errors.lockTime !== undefined &&
                                        <p className="errorMessage">{errors.lockTime[i]?.duration?.message}</p>
                                    }
                                </div>
                                <div className="w-full">
                                    <FiliterSelectMenu
                                        data={timePeriod}
                                        placeholder="Select Time"
                                        auto={false}
                                        widthFull={true}
                                        onTimeChange={onTimeChange}
                                        type="stake"
                                        dropdown={i}
                                        value={item?.time}
                                    />
                                    {errors.lockTime !== undefined &&
                                        <p className="errorMessage">{errors.lockTime[i]?.time?.message}</p>
                                    }
                                </div>

                                <div className="btn-box">
                                    {lockTimefields.length !== 1 && <button type="button"
                                        className="admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap"
                                        onClick={() => lockTimeremove(i)}>Remove</button>}
                                </div>

                            </div>
                        })}

                        <div className="btn-box mb-[10px] text-end">
                            {lockTimefields.length < 3 && <button type="button"
                                className="dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f] admin-outline-button"
                                onClick={() => lockTimeappend({ duration: 0, time: '' })}>Add</button>}
                        </div>

                    </div>

                    <button className="solid-button w-full">Submit</button>
                </form>
            </div>
        </>

    );
};

export default EditStake;
