import Context from "@/components/contexts/context";
import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";

interface propsData {
    editPair: any;
    data: any;
    setEditShow: Function;
    refreshPairList: any;
}

const schema = yup.object().shape({
    name: yup.string().required("Please enter program name."),
    description: yup.string().required("Please enter program short description."),
    amount: yup.number().required("Please enter total amount for program.").typeError('Please enter total amount for program.'),
    token_id: yup.string().required("Please enter token which you give to user after refer."),
    start_date: yup
        .date()
        .transform(function (value, originalValue) {
            if (this.isType(value)) {
                return value;
            }
            return originalValue;
        })
        .typeError("Please enter a valid date.")
        .required()
        .min(new Date(), "Date cannot be in the past.")
    ,

    end_date: yup
        .date().min(
            yup.ref('start_date'),
            "End date can't be before Start date."
        )
        .transform(function (value, originalValue) {
            if (this.isType(value)) {
                return value;
            }
            return originalValue;
        })
        .typeError("Please enter a valid date.")
        .required()


});

const EditReferralProgram = (props: propsData) => {
    const { mode } = useContext(Context);
    const { data: session } = useSession()

    const [startDate, setStartDate] = useState(new Date(props?.editPair?.start_date));
    const [endDate, setEndDate] = useState(new Date(props?.editPair?.end_date));

    let {
        register,
        setValue,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setValue("name", props?.editPair?.name);
        setValue("description", props?.editPair?.description);
        setValue("amount", props?.editPair?.amount);
        setValue("token_id", props?.editPair?.token_id);
        setValue("start_date", new Date(props?.editPair?.start_date));
        setValue("end_date", new Date(props?.editPair?.end_date));

    }, [])

    const setCurrency = (symbol: any, dropdown: number) => {
        if (dropdown === 1) {
            setValue("token_id", symbol?.id);
            clearErrors("token_id");
        }
    };

    const handleStartDate = (date: any) => {
        setValue("start_date", date);
        clearErrors("start_date");
        setStartDate(date);
    };

    const handleEndDate = (date: any) => {
        setValue("end_date", date);
        clearErrors("end_date");
        setEndDate(date);
    };

    const onHandleSubmit = async (data: any) => {
        try {
            data.status = props?.editPair?.status == 0 ? false : true;;
            data.id = props?.editPair?.id;
            const ciphertext = AES.encrypt(
                JSON.stringify(data),
                `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
            );
            let record = encodeURIComponent(ciphertext.toString());

            let res = await fetch(`/api/referal/program`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: session?.user?.access_token || "",
                },
                method: "PUT",
                mode: "cors",
                body: JSON.stringify(record),
            });
            let result = await res.json();
            // console.log(result);
            if (result?.data?.result.length > 0) {
                toast.success(result?.data?.message);
                props.refreshPairList();
                setTimeout(() => {
                    props?.setEditShow(false);
                }, 1000);
            }
            if (result?.data?.status === 409) {
                toast.warning(result?.data?.data?.message);
                setTimeout(() => {
                    props?.setEditShow(false);
                }, 1000);
            }
        } catch (error) {
            console.log("error in create trade pair", error);

        }

    };

    return (
        <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[607px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center justify-between ">
                <p className="sec-title">Edit Referral Program Form</p>
                <svg
                    onClick={() => {
                        props?.setEditShow(false);
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
            <form className="pt-30" onSubmit={handleSubmit(onHandleSubmit)}>

                <div className=" relative ">
                    <p className="sm-text mb-3">Name</p>
                    <input
                        type="text"
                        {...register("name")}
                        name="name"
                        placeholder="Please enter program name"
                        className="sm-text input-cta2 w-full"
                    />
                    {errors?.name && (
                        <p className="errorMessage">{errors?.name?.message}</p>
                    )}
                </div>
                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Description</p>
                    <input
                        type="text"
                        {...register("description")}
                        name="description"
                        placeholder="Please enter program description"
                        className="sm-text input-cta2 w-full"
                    />
                    {errors?.description && (
                        <p className="errorMessage">{errors?.description?.message}</p>
                    )}
                </div>
                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Amount</p>
                    <input
                        type="number"
                        {...register("amount")}
                        name="amount"
                        placeholder="Please enter total amount of program"
                        className="sm-text input-cta2 w-full"
                    />
                    {errors?.amount && (
                        <p className="errorMessage">{errors?.amount?.message}</p>
                    )}
                </div>

                <div className=" relative mb-20">
                    <p className="sm-text mb-3 mt-3">Select Coin</p>
                    <FilterSelectMenuWithCoin
                        data={props?.data}
                        border={true}
                        setCurrency={setCurrency}
                        dropdown={1}
                    />
                    {errors?.token_id && (
                        <p className="errorMessage">{errors?.token_id?.message}</p>
                    )}
                </div>

                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Start Date</p>
                    <DatePicker
                        selected={startDate}
                        onChange={(date: any) => handleStartDate(date)}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        minDate={new Date()}
                        dropdownMode="select"
                        className="sm-text input-cta2 w-full focus:bg-primary-100 dark:focus:bg-[transparent]"
                    />
                    {errors?.start_date && (
                        <p className="errorMessage">{errors?.start_date.message}</p>
                    )}

                </div>

                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">End Date</p>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: any) => handleEndDate(date)}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        minDate={new Date()}
                        dropdownMode="select"
                        className="sm-text input-cta2 w-full focus:bg-primary-100 dark:focus:bg-[transparent]"
                    />
                    {errors?.end_date && (
                        <p className="errorMessage">{errors?.end_date?.message}</p>
                    )}
                </div>

                <button className="solid-button w-full mt-30">Submit</button>
            </form>
        </div>
    );
};

export default EditReferralProgram;
