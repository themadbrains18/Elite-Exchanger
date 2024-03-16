import AddPayment from "@/components/snippets/addPayment";
import Successfull from "@/components/snippets/successfull";
import TradingPassword from "@/components/snippets/tradingPassword";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  p_method: yup.array().min(1, "Please select atleast 1 payment method").required().typeError("Please select atleast 1 payment method"),
  quantity: yup.number().positive().required("Please enter quantity to sell").typeError("Please enter quantity to sell"),
  min_limit: yup.number().positive().required("Please enter min limit amount").typeError("Please enter min limit amount"),
  max_limit: yup.number().positive().required("Please enter max limit amount").typeError("Please enter max limit amount"),
  payment_time: yup.string().optional().default('15'),
});

interface activeSection {
  step: number;
  setStep: any;
  setPaymentMethod?: any; //function call that in step 1
  masterPayMethod?: any;
  userPaymentMethod?: any;
  selectedAssets?: any;
  assetsBalance?: any;
  price?:any;
  editPost?:any;
}

const EditPaymentMethod = (props: activeSection) => {

  const [show, setShow] = useState(false)
  const [active, setActive] = useState(0)
  const [formMethod, setFormMethod] = useState();
  const [list, setList] = useState(props.userPaymentMethod);

  useEffect(()=>{
    setValue('quantity', props?.editPost?.quantity);
    setValue('min_limit',props?.editPost?.min_limit);
    setValue('max_limit',props?.editPost?.max_limit);

    let method:any = [];
    props.editPost.p_method.map((item:any)=>{
        // console.log(item);
        method.push(item?.upm_id);
    })

    setValue('p_method',method);

  },[props.editPost]);

  
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

  const onHandleSubmit = async (data: any) => {
    if (data.quantity > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficiant balance`,
      });
      setFocus('quantity');
      return;
    }
    props.setPaymentMethod(data);
    props.setStep(3);
  }

  const checkBalnce = (e: any) => {
    if (e.target.value > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficiant balance`,
      });
      return;
    }
    else {
      setValue('max_limit', props.price * e.target.value);
      clearErrors('quantity');
    }
  }

  return (
    <>
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="mt-40">
          <div className="p-[15px] md:p-40 border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="pb-6 border-b border-grey-v-3 sec-title dark:border-opacity-[15%]">Select Up to 5 methods</p>
            <div className="">
              {list?.map((item: any, index: any) => {
                return (
                  <div key={index} className="flex gap-30 py-20 md:mt-30">
                    <div>
                      <input type="checkbox" {...register('p_method')} name="p_method" id={`checkbox${item?.id}`} value={item?.id} className="hidden methods" />
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
                    ">
                      </label>
                    </div>
                    <div className="flex gap-10 items-center w-full max-w-[145px]">
                      <Image src={`${item?.master_payment_method?.icon}`} alt="payment image" width={32} height={32} />
                      <p className="sec-text !text-h-primary dark:!text-white !font-medium">{item?.pm_name}</p>
                    </div>
                    <p className="md:block hidden sec-text !text-banner-text dark:!text-white">({item?.pmObject?.phonenumber})</p>
                  </div>
                );
              })}
              {errors?.p_method && (
                <p style={{ color: "#ff0000d1" }}>{errors?.p_method?.message}</p>
              )}
              <div className="md:mt-50 mt-10">
                <button type="button" className="outline-button border-primary text-primary max-w-full sm:max-w-[176px] w-full" onClick={() => {
                  setShow(!show);
                  setActive(1)
                }}> + Add</button>
              </div>
            </div>
          </div>
          <div className="mt-30 md:p-40 p-[15px] border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="sec-title pb-20 border-b border-grey-v-2 dark:border-opacity-[15%]">Set Total Amount And Payment Method</p>
            <div className="mt-30 flex md:flex-row flex-col md:gap-30 gap-10">
              <div className="w-full">
                <p className="info-10-14">Total Qty</p>
                <div className="relative w-full mt-10">
                  {/* top dropdown input */}
                  <div className="border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                    <div className="flex items-center cursor-pointer">
                      <div className="w-full">
                        <input type="number" id="quantity" step={0.000001} {...register('quantity')} name="quantity" onChange={(e) => checkBalnce(e)} className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Quntity" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>{props?.selectedAssets?.symbol}</p>
                      </div>
                    </div>

                  </div>
                  {errors?.quantity && (
                    <p style={{ color: "#ff0000d1" }}>{errors?.quantity?.message}</p>
                  )}
                </div>
                <div className="mt-10">
                  <p className="info-10-14 text-end"> = {props.assetsBalance} {props?.selectedAssets?.symbol}</p>
                </div>
              </div>
              <div className="w-full">
                <p className="info-10-14">Min Order Limit</p>
                <div className="relative w-full mt-10">
                  {/* top dropdown input */}
                  <div className="border  border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                    <div className="flex items-center cursor-pointer ">
                      <div className="w-full">
                        <input type="number" id="min_limit" step={0.000001} {...register('min_limit')} name="min_limit" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Min. Amount" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>INR</p>
                      </div>
                    </div>
                  </div>
                  {errors?.min_limit && (
                    <p style={{ color: "#ff0000d1" }}>{errors?.min_limit?.message}</p>
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
                        <input type="number" id="max_limit" step={0.000001} {...register('max_limit')} name="max_limit" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Max. Amount" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>INR</p>
                      </div>
                    </div>
                  </div>
                  {errors?.max_limit && (
                    <p style={{ color: "#ff0000d1" }}>{errors?.max_limit?.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-30 md:p-40 p-[15px] border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="sec-title pb-20 border-b border-grey-v-2 dark:border-opacity-[15%]">Payment Time Limit</p>
            <div className="md:mt-30 py-20 px-10 flex gap-10 items-center">
              <Image src={`/assets/payment-methods/gpay.png`} alt="payment image" width={32} height={32} />
              <p className="sec-text !text-h-primary dark:!text-white !font-medium">Google Pay</p>
              <p className="sec-text !text-h-primary dark:!text-white">15 Minutes </p>
            </div>
            <div className="md:mt-50 mt-20 flex sm:gap-30 gap-10 sm:flex-row flex-col">
              <button type="button" className="solid-button2 max-w-full sm:max-w-[262px] w-full" onClick={() => { props?.setStep(1) }}>Previous</button>
              <button className="solid-button max-w-full  sm:max-w-[220px] w-full">Next</button>

            </div>
          </div>
        </div>
      </form>
      {active == 1 &&
        <AddPayment setShow={setShow} setActive={setActive} masterPayMethod={props.masterPayMethod} setFormMethod={setFormMethod} />
      }
      {active == 2 &&
        <TradingPassword setShow={setShow} setActive={setActive} formMethod={formMethod} setList={setList} list={setList} />
      }
      {active == 3 &&
        <Successfull setShow={setShow} setActive={setActive} type='success' />
      }
    </>
  );
};

export default EditPaymentMethod;
