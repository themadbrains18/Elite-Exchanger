import AddPayment from "@/components/snippets/addPayment";
import Successfull from "@/components/snippets/successfull";
import TradingPassword from "@/components/snippets/tradingPassword";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import IconsComponent from "@/components/snippets/icons";
import { useSession } from "next-auth/react";
import ConfirmationModel from "@/components/snippets/confirmation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  p_method: yup.lazy((val) =>
    Array.isArray(val)
      ? yup
        .array()
        .of(yup.string().min(1).required())
        .required("Please select 1 payment method")
      : yup.string().min(1).required("Please select 1 payment method")
  ),
  // yup.array().of(yup.string().min(1).required()).required().nullable(),
  quantity: yup
    .number()
    .positive()
    .required("Please enter quantity to sell")
    .typeError("Please enter quantity to sell"),
  min_limit: yup
    .number()
    .positive()
    .required("Please enter min limit amount")
    .typeError("Please enter min limit amount"),
  max_limit: yup
    .number()
    .positive()
    .required("Please enter max limit amount")
    .typeError("Please enter max limit amount"),
  payment_time: yup.string().optional().default("15"),
});

interface activeSection {
  step?: number;
  setStep?: any;
  setPaymentMethod?: any; //function call that in step 1
  masterPayMethod?: any;
  userPaymentMethod?: any;
  selectedAssets?: any;
  assetsBalance?: any;
  price?: any;
  page?: any;
  userPosts?: any;
}

const PaymentMethod = (props: activeSection) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [formMethod, setFormMethod] = useState();
  const [list, setList] = useState([]);
  const [id, setId] = useState();
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState(0.000000);
  const [minInputValue, setMinInputValue] = useState(0.000000);
  const [maxInputValue, setMaxInputValue] = useState(0.000000);
  // let list = props.userPaymentMethod;

  const router = useRouter();

  useEffect(() => {
    getAllPayments();
    if (Object.keys(router?.query).length > 0) {
      let qty: any = router?.query?.qty;
      setValue("quantity", qty);
      setValue("max_limit", props.price * qty);
    }
  }, [router.query]);

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    setFocus,
    clearErrors,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getAllPayments = async () => {
    let userPaymentMethod = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());
    setList(userPaymentMethod?.data);
  };

  const onHandleSubmit = async (data: any) => {
    if (data.quantity > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficiant balance`,
      });
      setFocus("quantity");
      return;
    }
    if (data.p_method === "false") {
      setError("p_method", {
        type: "custom",
        message: `Please select at least 1 payment method`,
      });
      setFocus("p_method");
      return;
    }

    let ans = Array.isArray(data.p_method);
    if (ans === false) {
      data.p_method = [data.p_method];
    }
    props.setPaymentMethod(data);
    props.setStep(3);
  };

  const checkBalnce = (e: any) => {
    const value = e.target.value;

    // Check if the value matches the pattern (up to 5 digits after the decimal point)
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      setInputValue(value);
    }
    if (e.target.value > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficiant balance`,
      });
      return;
    } else {
      setValue("max_limit", props.price * e.target.value);
      setMaxInputValue(Number(props.price) * Number(e.target.value))
      clearErrors("quantity");
    }
  };

  const handleDelete = async () => {
    try {

      let paymentMethodRelation = [];
      for (const post of props?.userPosts) {
        post?.p_method.filter((itm: any) => {
          if (itm.upm_id === id) {
            paymentMethodRelation.push(itm);
          }
        })
      }

      if (paymentMethodRelation.length > 0) {
        toast.warning('you can`t remove this payment method because it related to your ads. In case you first edit your ads then remove payment method.');
        return;
      }

      let responseData = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: session?.user?.access_token,
          },
        }
      ).then((res) => res.json());
      // console.log(responseData, "==responseData");
      if (responseData?.data) {
        getAllPayments()
        toast.success("Payment method delete successfully");
        setTimeout(() => {
          setActive(0);
          setShow(false);

        }, 1000)
      } else {
        toast.error("Unable to delete");
      }
    } catch (error) {
      // toast.error(res?.data?.data);
      console.log(error, "=error");
    }
  };

  const checkInput = (e: any, type: string) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      type === "min" ? setMinInputValue(value) : setMaxInputValue(value);
    }
    if (type === "min") {
      value > maxInputValue ? setError('min_limit', { type: "custom", message: "Min Limit must be less than Max limit" }) : clearErrors('min_limit'); setMinInputValue(value)
    }
  }

return (
  <>
    <ToastContainer />
    <div
      className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"
        }`}
    ></div>
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="mt-40">
        <div className="p-[15px] md:p-40 border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
          <p className="pb-6 border-b border-grey-v-3 sec-title dark:border-opacity-[15%]">
            {props?.page !== "user-center"
              ? "Select Up to 5 methods"
              : "Payment Methods"}
          </p>
          <div className="">
            {list?.map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-30 py-20 md:mt-30"
                >
                  {props.page !== "user-center" && (
                    <div>
                      <input
                        type="checkbox"
                        {...register("p_method")}
                        name="p_method"
                        id={`checkbox${item?.id}`}
                        value={item?.id}
                        className="hidden methods"
                      />
                      <label
                        htmlFor={`checkbox${item?.id}`}
                        className="
                            relative 
                            cursor-pointer
                            after:block
                            after:md:w-30
                            after:w-[24px]
                            after:md:h-30
                            after:h-[24px]
                            after:border
                            after:border-grey-v-1
                            after:rounded-[5px]

                            before:md:w-[18px]
                            before:w-[16px]
                            before:block
                            before:md:h-[9px]
                            before:h-[7px]
                            before:absolute
                            before:md:top-[8px]
                            before:top-[7px]
                            before:md:left-[6px]
                            before:left-[4px]
                            before:border-b-[2px]
                            before:border-l-[2px]
                            before:border-primary
                            before:rotate-[-50deg]
                            before:opacity-0
                          "
                      ></label>
                    </div>
                  )}
                  <div className="flex gap-30 items-center justify-between w-full">
                    <div className="flex gap-30 items-center">
                      <div className="flex gap-10 items-center w-full max-w-[145px]">
                        <Image
                          src={`${item?.master_payment_method?.icon}`}
                          alt="payment image"
                          width={32}
                          height={32}
                        />
                        <p className="sec-text !text-h-primary dark:!text-white !font-medium">
                          {item?.pm_name}
                        </p>
                      </div>
                      <p className="md:block hidden sec-text !text-banner-text dark:!text-white">
                        ({item?.pmObject?.phonenumber})
                      </p>
                    </div>
                    <div
                      className={`${props.page === "user-center" ? "block" : "hidden"
                        } cursor-pointer`}
                      onClick={() => {
                        setShow(true);
                        setActive(4);
                        setId(item?.id);
                      }}
                    >
                      <IconsComponent type="deleteIcon" />
                    </div>
                  </div>
                </div>
              );
            })}
            {errors?.p_method && (
              <p style={{ color: "#ff0000d1" }}>
                {errors?.p_method?.message}
              </p>
            )}
            <div className="md:mt-50 mt-10">
              <button
                type="button"
                className="outline-button border-primary text-primary max-w-full sm:max-w-[176px] w-full"
                onClick={() => {
                  setShow(!show);
                  setActive(1);
                }}
              >
                {" "}
                + Add
              </button>
            </div>
          </div>
        </div>
        {props.page !== "user-center" && (
          <>
            <div className="mt-30 md:p-40 p-[15px] border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
              <p className="sec-title pb-20 border-b border-grey-v-2 dark:border-opacity-[15%]">
                Set Total Amount And Payment Method
              </p>
              <div className="mt-30 flex md:flex-row flex-col md:gap-30 gap-10">
                <div className="w-full">
                  <p className="info-10-14">Total Qty</p>
                  <div className="relative w-full mt-10">
                    {/* top dropdown input */}
                    <div className="border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                      <div className="flex items-center cursor-pointer">
                        <div className="w-full">
                          <input
                            type="number"
                            id="quantity"
                            step={0.000001}
                            value={inputValue}
                            {...register("quantity")}
                            name="quantity"
                            onChange={(e) => checkBalnce(e)}
                            className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white"
                            placeholder="Enter Quntity"
                          />
                        </div>

                        <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                          <p
                            className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}
                          >
                            {props?.selectedAssets?.symbol}
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors?.quantity && (
                      <p style={{ color: "#ff0000d1" }}>
                        {errors?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-10">
                    <p className="info-10-14 text-end">
                      {" "}
                      = {Number(props.assetsBalance).toFixed(6)} {props?.selectedAssets?.symbol}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <p className="info-10-14">Min Order Limit</p>
                  <div className="relative w-full mt-10">
                    {/* top dropdown input */}
                    <div className="border  border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                      <div className="flex items-center cursor-pointer ">
                        <div className="w-full">
                          <input
                            type="number"
                            id="min_limit"
                            step={0.000001}
                            {...register("min_limit")}
                            value={minInputValue}
                            onChange={(e) => { checkInput(e, 'min') }}
                            name="min_limit"
                            className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white"
                            placeholder="Enter Min. Amount"
                          />
                        </div>

                        <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                          <p
                            className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}
                          >
                            INR
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors?.min_limit && (
                      <p style={{ color: "#ff0000d1" }}>
                        {errors?.min_limit?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <p className="info-10-14">Max Order Limit</p>
                  <div className="relative w-full mt-10">
                    {/* top dropdown input */}
                    <div className="border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                      <div className="flex items-center cursor-pointer">
                        <div className="w-full">
                          <input
                            type="number"
                            id="max_limit"
                            step={0.000001}
                            {...register("max_limit")}
                            name="max_limit"
                            value={maxInputValue}
                            onChange={(e) => { checkInput(e, 'max') }}
                            className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white"
                            placeholder="Enter Max. Amount"
                          />
                        </div>

                        <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                          <p
                            className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}
                          >
                            INR
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors?.max_limit && (
                      <p style={{ color: "#ff0000d1" }}>
                        {errors?.max_limit?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-30 md:p-40 p-[15px] border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
              <p className="sec-title pb-20 border-b border-grey-v-2 dark:border-opacity-[15%]">
                Payment Time Limit
              </p>
              <div className="md:mt-30 py-20 px-10 flex gap-10 items-center">
                {/* <Image src={`/assets/payment-methods/gpay.png`} alt="payment image" width={32} height={32} />
                  <p className="sec-text !text-h-primary dark:!text-white !font-medium">Google Pay</p> */}
                <p className="sec-text !text-h-primary dark:!text-white">15 Minutes </p>
              </div>
              <div className="md:mt-50 mt-20 flex sm:gap-30 gap-10 sm:flex-row flex-col">
                <button
                  type="button"
                  className="solid-button2 dark:bg-black-v-1 dark:text-primary max-w-full sm:max-w-[262px] w-full"
                  onClick={() => {
                    props?.setStep(1);
                  }}
                >
                  Previous
                </button>
                <button className="solid-button max-w-full  sm:max-w-[220px] w-full">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
    {active == 1 && (
      <AddPayment
        setShow={setShow}
        setActive={setActive}
        masterPayMethod={props.masterPayMethod}
        setFormMethod={setFormMethod}
        list={list}
      />
    )}
    {active == 2 && (
      <TradingPassword
        setShow={setShow}
        setActive={setActive}
        formMethod={formMethod}
        setList={setList}
        list={setList}
      />
    )}
    {active == 3 && (
      <Successfull setShow={setShow} setActive={setActive} type="success" />
    )}
    {active === 4 && (
      <ConfirmationModel
        setActive={setActive}
        setShow={setShow}
        title="Confirm"
        message="Are you sure you want to delete this item?"
        actionPerform={handleDelete}
        show={show}
      />
    )}
  </>
);
};

export default PaymentMethod;
