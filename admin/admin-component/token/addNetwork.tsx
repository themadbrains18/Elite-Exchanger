import Context from "../../../components/contexts/context";
import React, {  useContext, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";

interface activeSection {
    setNetworkShow: Function;
    networkList: any;
    editToken: any;
    getToken: any;
    itemOffset: any;
}

type UserSubmitForm = {
    network: {
        checked: boolean;
        id?: string | any;
        fee?: string | any;
        contract?: string | any;
    }[];
};

const requiredNetworkSchema = yup
    .object()
    .shape({
        checked: yup.boolean().optional(),
        id: yup.string().required("This field id required."),
        fee: yup.string().required("Fee is required field."),
        contract: yup.string().required("This field is required."),
    })
    .required();

const networkSchema = yup.object().shape({
    checked: yup.boolean().optional(),
    id: yup.string(),
    fee: yup.string(),
    contract: yup.string(),
});

const schema = yup.object().shape({
    network: yup.array().of(
        yup.lazy((value) => {
            const { checked } = value; // Get the value of checked field
            if (checked === true) {
                return requiredNetworkSchema;
            } else {
                return networkSchema;
            }
        })
    ),
});

const AddNetwork = (props: activeSection) => {
    const { mode } = useContext(Context);
    const {data:session} = useSession()

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

    const clickHandler = (e: any, index: any) => {
        e?.currentTarget?.classList?.toggle("active");
        clearErrors("network");
    };

    useEffect(() => {

        let index = 0;
        for (const net of props.networkList) {

            

            let previous = props?.editToken?.networks !== null && props?.editToken?.networks?.filter((e: any) => {
                return e?.id === net?.id
            })

            if (previous?.length > 0) {
                setValue(`network.${index}.id`, previous[0].id);
                setValue(`network.${index}.checked`, true);
                setValue(`network.${index}.fee`, previous[0].fee);
                setValue(`network.${index}.contract`, previous[0].contract);
            }
            index++;
        }
    }, []);

    const onHandleSubmit = async (data: any) => {
        try {
            let networks: any = [];

            let networkChecked = data?.network.filter((item: any) => {
                return item.checked === true;
            });
            if (networkChecked?.length === 0) {
                setError("network", {
                    type: "custom",
                    message: `Please select atleast one network.`,
                });
                return;
            }
            networks = data?.network.filter((e:any) => {
                if (e.checked == true) {
                    return e;
                }
            });

            networks.forEach(function (v: any) {
                delete v.checked;
            });

            let obj = {
                "id": props?.editToken?.id,
                "networks": JSON.stringify(networks),
                "type": "admin"
            }

            const ciphertext = AES.encrypt(
                JSON.stringify(obj),
                `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
              );
              let record = encodeURIComponent(ciphertext.toString());
        

            let res = await fetch(`/api/token/network`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": session?.user?.access_token || ""
                },
                body: JSON.stringify(record),
            });

            let result = await res.json();

            if (result.data.networks !== null) {
                toast.success("token add Successfully");
                props.getToken(props?.itemOffset);
                reset();
                props.setNetworkShow(false);
            } else {
                toast.error(result.data.data);
            }
        } catch (error) {
            console.log(error, "kyc auth");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="max-w-[calc(100%-30px)] md:max-w-[730px] overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex items-center justify-between ">
                    <p className="sec-title">Token Chain Set</p>
                    <svg
                        onClick={() => {
                            props?.setNetworkShow(false);
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

                        <div className="pt-[30px]">
                            {props?.networkList && props?.networkList?.length>0 && props?.networkList?.map((item: any, index: number) => {
                                let previous = props?.editToken?.networks !== null && props?.editToken?.networks.filter((e: any) => {
                                    return e?.id === item?.id
                                })
                                return (
                                    <>
                                        <div key={index} className="mb-5 all-user-table ">
                                            <input
                                                id={`checbox-${index + 1}-item-token`}
                                                type="checkbox"
                                                className={`hidden checkboxes ${previous?.length > 0 ? 'active' : ''}`}
                                                {...register(`network.${index}.checked`)}
                                                onClick={(e: any) => {
                                                    clickHandler(e, index);
                                                    setValue(`network.${index}.id`, item?.id);
                                                }}
                                            />
                                            <label
                                                htmlFor={`checbox-${index + 1}-item-token`}
                                                className={`pl-[35px] cursor-pointer
                                                        relative
                                                        after:w-20
                                                        after:h-20
                                                        after:border-[2px]
                                                        after:border-[#B5B5C3]
                                                        after:rounded-[4px]
                                                        after:block
                                                        after:absolute
                                                        after:top-0
                                                        sm-text
                                                        before:w-[12px]
                                                        before:h-[6px]
                                                        before:z-[1]
                                                        before:border-l-[2px]
                                                        before:border-b-[2px]
                                                        border:dark:border-[#212121]
                                                        border:border-[#fff]
                                                        before:absolute
                                                        before:left-[4px]
                                                        before:top-[6px]
                                                        before:rotate-[-45deg]
                                                        before:hidden`
                                                }
                                            >
                                                {item?.fullname}({item?.symbol})
                                            </label>
                                            <div className="network_info  gap-[15px] justify-between py-0 hidden  ">
                                                <div className="w-full">
                                                    <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px] w-full ">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Fee"
                                                            className="outline-none sm-text w-full bg-[transparent]"
                                                            {...register(`network.${index}.fee`)}
                                                        />
                                                    </div>
                                                    {errors?.network?.[index]?.fee && (
                                                        <p  className="errorMessage">
                                                            {errors?.network[index]?.fee?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-full">
                                                    <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px] w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Contract"
                                                            className="outline-none sm-text w-full bg-[transparent]"
                                                            {...register(`network.${index}.contract`)}
                                                        />
                                                    </div>
                                                    {errors?.network?.[index]?.contract && (
                                                        <p  className="errorMessage">
                                                            {errors?.network[index]?.contract?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                            {errors?.network && (
                                <p  className="errorMessage">{errors?.network.message}</p>
                            )}
                        </div>
                    </div>

                    <button className="solid-button w-full">Submit</button>
                </form>
            </div>
        </>

    );
};

export default AddNetwork;
