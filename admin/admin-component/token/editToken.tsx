import FiliterSelectMenu from "@/components/snippets/filter-select-menu";
import Context from "../../../components/contexts/context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

interface activeSection {
    setEditShow: Function;
    networkList: any;
    editToken?: any;
    refreshTokenList?:any;
}

type UserSubmitForm = {
    symbol: string;
    decimal: number;
    price?: number;
    fullName: string;
    image: any;
    minimum_withdraw: string;
    tokenType: string;
    min_price?: number;
    max_price?: number;
    network: {
        checked?: boolean;
        id?: string | any;
        fee?: string | any;
        contract?: string | any;
    }[];
};

const requiredNetworkSchema = yup.object().shape({
    checked: yup.boolean().optional(),
    id: yup.string().required('This field id required'),
    fee: yup.string().required('Fee is required field'),
    contract: yup.string().required('This field is required'),
}).required();

const networkSchema = yup.object().shape({
    checked: yup.boolean().optional(),
    id: yup.string(),
    fee: yup.string(),
    contract: yup.string(),
});

const schema = yup.object().shape({
    symbol: yup.string().min(3).required("Please enter symbol"),
    decimal: yup.number().max(20).positive().typeError("Please enter decimal"),
    price: yup.number().positive().typeError("Price must be a number"),
    fullName: yup.string().min(3).required("Please enter full name of token"),
    image: yup.mixed().optional(),
    minimum_withdraw: yup
        .string()
        .required("Please enter minimum withdraw amount of token"),
    tokenType: yup.string().required("Please select token type"),
    min_price: yup.number().positive().typeError("Min Price must be a number"),
    max_price: yup
        .number()
        .positive()
        .typeError("Max Price must be a number")
        .moreThan(yup.ref("min_price"), "Max Value must be greater than Min Price"),
    network: yup.array().of(
        yup.lazy(value => {
            const { checked } = value // Get the value of checked field
            if (checked === true) {
                return requiredNetworkSchema
            }
            else {
                return networkSchema
            }
        })
    )

});

const EditToken = (props: activeSection) => {
    const { mode } = useContext(Context);
    const [tokenImage, setTokenImage] = useState("");
    const [tokenImg, setTokenImg] = useState("");

    // console.log(props.editToken, '=======token ');

    useEffect(() => {
        setValue('symbol', props?.editToken?.symbol);
        setValue('fullName', props?.editToken?.fullName);
        setValue('decimal', props?.editToken?.decimals);
        setValue('max_price', props?.editToken?.max_price);
        setValue('min_price', props?.editToken?.min_price);
        setValue('minimum_withdraw', props?.editToken?.minimum_withdraw);
        setValue('price', props?.editToken?.price);
        setValue('tokenType', props?.editToken?.tokenType);
        setTokenImage(props?.editToken?.image);

        let index = 0;
        for (const net of props.networkList) {

            let previous = props.editToken.networks.filter((e: any) => {
                return e?.id === net?.id
            })

            if (previous.length > 0) {
                setValue(`network.${index}.id`, previous[0].id);
                setValue(`network.${index}.checked`, true);
                setValue(`network.${index}.fee`, previous[0].fee);
                setValue(`network.${index}.contract`, previous[0].contract);
            }
            index++;
        }
    },[]);

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
    } = useForm<UserSubmitForm>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    let data = [
        {
            fullname: "Mannual",
            value: "mannual",
        },
        {
            fullname: "Global",
            value: "global",
        },
    ];

    const clickHandler = (e: any, index: any) => {
        e?.currentTarget?.classList?.toggle("active");
        clearErrors('network');
    };

    const getTokenType = (document: any) => {
        setValue("tokenType", document?.value as string);
        clearErrors("tokenType");
    };

    const handleFileChange = async (e: any) => {
        let files = e.target.files[0];
        setValue("image", files);
        setTokenImg(files);
        clearErrors("image");
        if(files){
            var reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onloadend = function (e: any) {
                setTokenImage(reader?.result as string);
            }.bind(this);
        }
        
    };

    const onHandleSubmit = async (data: UserSubmitForm) => {
        try {
            let networks: any = [];

            let networkChecked = data?.network.filter((item: any) => {
                return item.checked === true
            })
            if (networkChecked.length === 0) {
                setError("network", {
                    type: "custom",
                    message: `Please select atleast one network`,
                });
                return;
            }
            networks = data?.network.filter((e) => {
                if (e.checked == true) {
                    return e;
                }
            });

            networks.forEach(function (v: any) {
                delete v.checked;
            });

            // Parse the JSON string back to an array
            var formData = new FormData();
            formData.append("symbol", data?.symbol);
            formData.append("decimals", data?.decimal?.toString() || "");
            formData.append("image", tokenImg);
            formData.append("minimum_withdraw", data?.minimum_withdraw);
            formData.append("fullName", data?.fullName);
            formData.append("price", data?.price?.toString() || "");
            formData.append("tokenType", data?.tokenType);
            formData.append("min_price", data?.min_price?.toString() || "");
            formData.append("max_price", data?.max_price?.toString() || "");
            formData.append("networks", JSON.stringify(networks));
            formData.append("type", "admin");
            formData.append('id',props.editToken?.id);

            let res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/token/edit`, {
                method: "POST",
                body: formData,
            });

            let result = await res.json();

            if (result) {
                toast.success("Token edit successfully!.");
                reset();
                setTokenImage("");
                setValue("tokenType", "");
                props?.setEditShow(false);
                props.refreshTokenList(result);
            } else {
                toast.error(result.data.data);
            }
        } catch (error) {
            console.log(error, "kyc auth");
        }
    };

    return (
        <div className="max-w-[calc(100%-30px)] md:max-w-[730px] max-h-[94vh] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex items-center justify-between ">
                <p className="sec-title">Token Form</p>
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
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className="pt-30">
                    <div className="mb-[10px]">
                        <label className="sm-text ">Symbol Name</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("symbol")}
                            />
                        </div>
                        {errors?.symbol && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.symbol?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Decimal</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("decimal")}
                            />
                        </div>
                        {errors?.decimal && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.decimal?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Price</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("price")}
                            />
                        </div>
                        {errors?.price && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.price?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Image</label>

                        <div
                            className={`border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px] ${tokenImage !== "" && "border-none"
                                } `}
                        >
                            <label htmlFor="tokenimage">
                                <Image
                                    src={tokenImage}
                                    alt="token image"
                                    width={50}
                                    height={50}
                                    className={`${tokenImage == "" ? "hidden" : "flex"}`}
                                />
                            </label>
                            <input
                                id="tokenimage"
                                type="file"
                                placeholder="Enter Amount"
                                className={`outline-none sm-text w-full bg-[transparent] ${tokenImage === "" ? "opacity-100" : "opacity-0 h-0"
                                    }`}
                                onChange={(e) => handleFileChange(e)}
                            />
                        </div>
                        {errors?.image && (
                            <p style={{ color: "#ff0000d1" }}>
                                {errors?.image.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Full Name</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Full Name of token"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("fullName")}
                            />
                        </div>
                        {errors?.fullName && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.fullName?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Minimum Withdraw</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Amount"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("minimum_withdraw")}
                            />
                        </div>
                        {errors?.minimum_withdraw && (
                            <p style={{ color: "#ff0000d1" }}>
                                {errors?.minimum_withdraw?.message}
                            </p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Minimum Price</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Minimum Price"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("min_price")}
                            />
                        </div>
                        {errors?.min_price && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.min_price?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Maximum Price</label>
                        <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                            <input
                                type="text"
                                placeholder="Enter Maximum Price"
                                className="outline-none sm-text w-full bg-[transparent]"
                                {...register("max_price")}
                            />
                        </div>
                        {errors?.max_price && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.max_price?.message}</p>
                        )}
                    </div>
                    <div className="mb-[10px]">
                        <label className="sm-text ">Token Type</label>
                        <FiliterSelectMenu
                            data={data}
                            placeholder="Select Token Type"
                            auto={false}
                            widthFull={true}
                            onDocumentChange={getTokenType}
                            value={props.editToken?.tokenType}
                        />
                        {errors?.tokenType && (
                            <p style={{ color: "#ff0000d1" }}>{errors?.tokenType?.message}</p>
                        )}
                    </div>
                    <div className="pt-[30px]">
                        {props?.networkList?.map((item: any, index: any) => {
                            // const fieldName = `network[${index}]`;
                            let previous = props.editToken.networks.filter((e: any) => {
                                return e?.id === item?.id
                            })

                            return (
                                <>
                                    <div key={index} className="mb-5 all-user-table ">
                                        <input
                                            id={`checbox-${index + 1}-item-token`}
                                            type="checkbox"
                                            className={`hidden checkboxes ${previous.length > 0 ? 'active' : ''}`}
                                            {...register(`network.${index}.checked`)}
                                            onClick={(e: any) => {
                                                clickHandler(e, index);
                                                setValue(`network[${index}].id`, item?.id);
                                            }}
                                        />
                                        <label
                                            htmlFor={`checbox-${index + 1}-item-token`}
                                            className=" pl-[35px] cursor-pointer
                                                    relative
                                                    sm-text
                                                    after:w-20
                                                    after:h-20
                                                    after:border-[2px]
                                                    after:border-[#B5B5C3]
                                                    after:rounded-[4px]
                                                    after:block
                                                    after:absolute
                                                    after:top-0

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
                                                    before:hidden
                                                    "
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
                                                    <p style={{ color: "red" }}>
                                                        {errors?.network?.[index]?.fee?.message}
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
                                                    <p style={{ color: "red" }}>
                                                        {errors?.network?.[index]?.contract?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            );
                        })}
                        {errors?.network && (
                            <p style={{ color: "red" }}>{errors?.network.message}</p>
                        )}
                    </div>
                </div>

                <button className="solid-button w-full">Submit</button>
            </form>
        </div>
    );
};

export default EditToken;
