import Context from "@/components/contexts/context";
import React, { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";
import SelectDropdown from "@/components/future/snippet/select-dropdown";

interface ActiveSession {
    data: any;
    setInviteShow: Function;
    refreshPairList?: any;
}

const schema = yup.object().shape({
    name: yup.string().required("Please enter program name."),
    description: yup.string().required("Please enter program short description."),
    amount: yup.number().required("Please enter total amount for program.").typeError('Please enter total amount for program.'),
    type: yup.string().required("Please enter program name."),
    deposit : yup.number().required("Please enter amount for deposit by user.").typeError('Please enter amount for deposit by user.'),
    trade : yup.number().required("Please enter amount for trade by user.").typeError('Please enter amount for trade by user.'),

});

const AddInviteProgram = (props: ActiveSession) => {
    const { mode } = useContext(Context);
    const { data: session } = useSession()

    let {
        register,
        setValue,
        handleSubmit,
        watch,
        reset,
        setError,
        getValues,
        clearErrors,
        formState,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    let typeList = ['Bounce', 'coupen','Rewards']

    const onHandleSubmit = async (data: any) => {
        try {
            data.status = true;
            data.referProgram_id = props.data.id;
            data.token_id = props.data.token_id;
            const ciphertext = AES.encrypt(
                JSON.stringify(data),
                `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
            );
            let record = encodeURIComponent(ciphertext.toString());

            let res = await fetch(`/api/referal/invite`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: session?.user?.access_token || "",
                },
                method: "POST",
                mode: "cors",
                body: JSON.stringify(record),
            });
            let result = await res.json();
            if (result?.data?.status === 200) {
                toast.success(result?.data?.data?.message);
                props.refreshPairList();
                setTimeout(() => {
                    props?.setInviteShow(false);
                }, 1000);
            }
            if (result?.data?.status === 409) {
                toast.warning(result?.data?.data?.message);
                setTimeout(() => {
                    props?.setInviteShow(false);
                }, 1000);
            }
        } catch (error) {
            console.log("error in create trade pair", error);

        }
    };

    const onCoinDropDownChange=(text:string)=>{
        setValue('type', text);
        clearErrors('type');
    }

    return (
        <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[607px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center justify-between ">
                <p className="sec-title">Add Referral Program Form</p>
                <svg
                    onClick={() => {
                        props?.setInviteShow(false);
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
                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Deposit Amount</p>
                    <input
                        type="number"  
                        {...register("deposit")}
                        name="deposit"
                        placeholder="Please enter amount of deposit "
                        className="sm-text input-cta2 w-full"
                    />
                    {errors?.deposit && (
                        <p className="errorMessage">{errors?.deposit?.message}</p>
                    )}
                </div>
                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Trade Amount</p>
                    <input
                        type="number"  
                        {...register("trade")}
                        name="trade"
                        placeholder="Please enter amount of trade"
                        className="sm-text input-cta2 w-full"
                    />
                    {errors?.trade && (
                        <p className="errorMessage">{errors?.trade?.message}</p>
                    )}
                </div>
                <div className=" relative ">
                    <p className="sm-text mb-3 mt-3">Type</p>
                    {/* <input
                        type="text"
                        {...register("type")}
                        name="type"
                        placeholder="Please enter program invite type"
                        className="sm-text input-cta2 w-full"
                    /> */}
                    <div className="flex items-center justify-between px-[12px] py-[12px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[25px] relative">
                        <SelectDropdown onCoinDropDownChange={onCoinDropDownChange}
                            list={typeList}
                            defaultValue="Select Type"
                            fullWidth={true}
                            whiteColor={true}
                        />
                    </div>

                    {errors?.type && (
                        <p className="errorMessage">{errors?.type?.message}</p>
                    )}
                </div>

                <button className="solid-button w-full mt-30">Submit</button>
            </form>
        </div>
    );
};

export default AddInviteProgram;
