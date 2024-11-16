import AddPayment from "@/components/snippets/addPayment";
import Successfull from "@/components/snippets/successfull";
import TradingPassword from "@/components/snippets/tradingPassword";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { truncateNumber } from "@/libs/subdomain";
import { ToastContainer } from "react-toastify";

const schema = yup.object().shape({
  p_method: yup.array().min(1, "Please select atleast '1' payment method.").required().max(5, "Only '5' payment methods are allowed.").typeError("Please select atleast '1' payment method."),
  quantity: yup.number().positive("Quantity must be greater than '0'.").required("Please enter quantity to sell.").typeError("Please enter quantity to sell."),
  min_limit: yup.number().positive("Quantity must be greater than '0'.").required("Please enter min limit amount.").typeError("Please enter min limit amount."),
  max_limit: yup.number().positive("Quantity must be greater than '0'.").required("Please enter max limit amount.").typeError("Please enter max limit amount."),
  payment_time: yup.string().optional().default('15'),
});

/**
 * Props interface for the EditPaymentMethod component.
 * 
 * This interface defines the structure of the props that are passed to the `EditPaymentMethod` 
 * component. It includes information for managing form steps, payment methods, asset balances, 
 * and edit post data.
 * 
 * @interface EditPaymentMethodProps
 * @property {number} step - The current step in the form process.
 * @property {function} setStep - A function to update the current step.
 * @property {function} [setPaymentMethod] - A function to set the payment method in step 1 (optional).
 * @property {any} [masterPayMethod] - The master payment method data (optional).
 * @property {any} [userPaymentMethod] - The user's selected payment method data (optional).
 * @property {any} [selectedAssets] - The assets selected for the payment method (optional).
 * @property {any} [assetsBalance] - The balance of the selected assets (optional).
 * @property {any} [price] - The price related to the payment method or asset (optional).
 * @property {any} [editPost] - The data for the post to be edited (optional).
 */
interface EditPaymentMethodProps {
  step: number;
  setStep: any;
  setPaymentMethod?: any; //function call that in step 1
  masterPayMethod?: any;
  userPaymentMethod?: any;
  selectedAssets?: any;
  assetsBalance?: any;
  price?: any;
  editPost?: any;
}

const EditPaymentMethod = (props: EditPaymentMethodProps) => {
  const [show, setShow] = useState(false)
  const [active, setActive] = useState(0)
  const [formMethod, setFormMethod] = useState();
  const [list, setList] = useState(props.userPaymentMethod);
  const [inputValue, setInputValue] = useState(props?.editPost?.quantity);
  const [minInputValue, setMinInputValue] = useState(props?.editPost?.min_limit);
  const [maxInputValue, setMaxInputValue] = useState(props?.editPost?.price !== props.price ? truncateNumber(props.price * props?.editPost?.quantity, 6) : truncateNumber(props?.editPost?.max_limit, 6));
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [reduceValue, setReduceValue] = useState<Number | any>(props.assetsBalance || 0);

  /**
   * `useEffect` hook to handle setting initial values and updating form data when the `editPost` prop changes.
   * 
   * This effect runs when the `props.editPost` changes and performs several operations:
   * - Sets the form values for `quantity` and `min_limit` from the `editPost` data.
   * - Computes the `reduceValue` based on `assetsBalance` (formatted to a maximum of 6 decimal places).
   * - Computes the `max_limit` based on either the provided `price` and `quantity` or the `editPost.max_limit`.
   * - Sorts the `userPaymentMethod` array by `pm_name` (payment method name).
   * - Sets the selected payment methods (`p_method`) from the `editPost` object.
   * - Updates the `p_method` form field with the selected methods.
   * 
   * The effect also formats and truncates certain values using the `truncateNumber` function to ensure the correct number of decimals for price and limits.
   */
  useEffect(() => {
    // console.log(props.assetsBalance,"=props.assetsBalance");
    setValue('quantity', props?.editPost?.quantity);
    setValue('min_limit', props?.editPost?.min_limit);
    let total = props.assetsBalance && props.assetsBalance.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];
    setReduceValue(total);
    let max_limit = props?.editPost?.price !== props.price ? truncateNumber(props.price * props?.editPost?.quantity, 6) : truncateNumber(props?.editPost?.max_limit, 6)
    setValue('max_limit', Number(truncateNumber(max_limit, 6)));

    let sortedPaymentMethods = props.userPaymentMethod?.sort((a: any, b: any) => {
      if (a.pm_name < b.pm_name) return -1;
      if (a.pm_name > b.pm_name) return 1;
      return 0;
    });

    setList(sortedPaymentMethods);

    let method: any = [];
    props.editPost.p_method?.map((item: any) => {
      // console.log(item);
      method.push(item?.upm_id);
    })

    setSelectedMethods(method)
    setValue('p_method', method);

  }, [props.editPost]);


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

  /**
   * Handles the form submission by validating the input data, checking balance constraints, and managing form flow.
   *
   * This function is triggered when the user submits the form. It performs the following:
   * 1. **Min-Max Limit Validation**: It checks if the `min_limit` is greater than the `max_limit`. If true, an error is set on the `min_limit` field and focus is set to it.
   * 2. **Balance Validation**: It ensures the `quantity` is within the user's available balance. If the balance is insufficient or the quantity exceeds the available balance, an error is set on the `quantity` field and focus is set to it.
   * 3. **Payment Method and Step Update**: If all validations pass, it updates the payment method and proceeds to the next step in the form flow.
   *
   * @param {any} data - The form data containing `min_limit`, `max_limit`, and `quantity`.
   */
  const onHandleSubmit = async (data: any) => {
    if (data.min_limit > data.max_limit) {
      setError("min_limit", {
        type: "custom",
        message: `Min limit must be less than max limit.`,
      });
      setFocus("min_limit");
      return;
    }
    if (data.quantity <= (props.assetsBalance + truncateNumber(Number(props?.editPost?.quantity), 6)) || data.quantity == props?.editPost?.quantity) {
      props.setPaymentMethod(data);
      props.setStep(3);
    }
    else {
      setError("quantity", {
        type: "custom",
        message: `Insufficient balance.`,
      });
      setFocus('quantity');
      return;
    }
  }

  /**
   * Handles input validation for the quantity field and calculates the max limit based on the input value.
   *
   * This function is triggered whenever the user enters a value in the quantity field. It performs the following:
   * 1. **Input Validation**: Ensures the value entered matches the pattern for numbers with up to 6 decimal places.
   * 2. **Balance Check**: Verifies if the entered quantity is within the user's available balance. If the balance is sufficient, it calculates and updates the `max_limit` field.
   * 3. **Error Handling**: If the balance is insufficient, it displays an error message on the `quantity` field and prevents further submission.
   *
   * @param {any} e - The event triggered by the input change containing the value entered by the user.
   */
  const checkBalnce = (e: any) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      setInputValue(value);
    }
    if (e.target.value <= (props.assetsBalance + truncateNumber(Number(props?.editPost?.quantity), 6)) || e.target.value == inputValue) {

      let maxLimit = truncateNumber(props.price * e.target.value, 6);

      setValue('max_limit', maxLimit);
      setMaxInputValue(maxLimit);
      clearErrors('quantity');

    }
    else {
      setValue('max_limit', props.price * e.target.value);
      setMaxInputValue(Number(props.price) * Number(e.target.value))
      setError("quantity", {
        type: "custom",
        message: `Insufficient balance.`,
      });
      return;
    }
  }

  /**
   * Handles input validation and updates for minimum and maximum limit fields.
   *
   * This function is triggered whenever the user enters a value in either the minimum or maximum limit fields.
   * It performs the following:
   * 1. **Input Validation**: Ensures the value entered matches the pattern for numbers with up to 6 decimal places.
   * 2. **Min-Max Validation**: If the minimum value is greater than the maximum value, an error message is shown.
   * 3. **Error Handling**: Clears the error if the condition is met (min value <= max value), otherwise, sets the error for `min_limit`.
   *
   * @param {any} e - The event triggered by the input change containing the value entered by the user.
   * @param {string} type - The type of the input field, either "min" for minimum limit or "max" for maximum limit.
   */
  const checkInput = (e: any, type: string) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      type === "min" ? setMinInputValue(value) : setMaxInputValue(value);
    }

    if (type === "min" && maxInputValue > 0) {
      value > maxInputValue ? setError('min_limit', { type: "custom", message: "Min limit must be less than max limit." }) : clearErrors('min_limit'); setMinInputValue(value)
    }
  }

  /**
   * Handles the change event for a checkbox input, updating the selected payment methods.
   *
   * This function is triggered when a user interacts with a checkbox. It adds or removes the payment method from 
   * the `selectedMethods` array based on whether the checkbox is checked or unchecked.
   * If the checkbox is checked and there are fewer than 5 selected methods, it adds the method to the list.
   * If the checkbox is unchecked, it removes the method from the list.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by the checkbox input.
   * @param {string} e.target.value - The value associated with the checkbox input, representing a payment method.
   * @param {boolean} e.target.checked - The checked state of the checkbox input, indicating whether it is selected or not.
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      if (selectedMethods.length < 5) {
        const newSelectedMethods = [...selectedMethods, value];
        setSelectedMethods(newSelectedMethods);
        setValue('p_method', newSelectedMethods);
      }
    } else {
      const newSelectedMethods = selectedMethods.filter((method) => method !== value);
      setSelectedMethods(newSelectedMethods);
      setValue('p_method', newSelectedMethods);
    }
  };

  /**
 * Determines if a checkbox should be disabled based on the number of selected payment methods.
 *
 * This function checks if the maximum limit of 5 selected payment methods has been reached. If the limit is
 * reached and the current method is not already selected, it disables the checkbox.
 *
 * @param {string} value - The value of the payment method associated with the checkbox.
 * @returns {boolean} - Returns `true` if the checkbox should be disabled (i.e., if the max limit is reached and the method is not selected), `false` otherwise.
 */
  const isCheckboxDisabled = (value: string) => {
    return selectedMethods.length >= 5 && !selectedMethods.includes(value);
  };

  return (
    <>
      {/* {props?.page === "user-center" && <ToastContainer position="top-center" limit={1} />} */}
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
      <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
        <div className="mt-40">
          <div className="p-[15px] md:p-40 border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="pb-6 border-b border-grey-v-3 sec-title dark:border-opacity-[15%]">Select Up to 5 methods</p>
            <div className="">
              {list?.map((item: any, index: any) => {
                return (
                  <div key={index} className="flex gap-20 py-20 md:mt-30">
                    <div>
                      <input type="checkbox" {...register('p_method')} name="p_method" id={`checkbox${item?.id}`} value={item?.id} className="hidden methods" onChange={handleCheckboxChange} checked={selectedMethods.includes(item?.id.toString())} disabled={isCheckboxDisabled(item?.id.toString())} />

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
                    <div className={`flex gap-10 items-center ${isCheckboxDisabled(item.id) ? "disabled-text" : ""}`}>
                      <p className="sec-text !text-h-primary dark:!text-white !font-medium">{item?.pm_name}</p>
                      <Image src={`${item?.master_payment_method?.icon}`} alt="payment image" width={32} height={32} />
                      <p className="md:block hidden sec-text !text-banner-text dark:!text-white">({item?.pmObject?.phonenumber})</p>
                    </div>
                  </div>
                );
              })}
              {errors?.p_method && (
                <p className="errorMessage mt-3">{errors?.p_method?.message}</p>
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
                        <input type="number"

                          id="quantity" step={0.000001} value={inputValue != 0 ? truncateNumber(inputValue, 6) : ''}  {...register('quantity')} name="quantity"
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onChange={(e) => {
                            let value: any = e.target.value;
                            const regex = /^\d{0,10}(\.\d{0,6})?$/;
                            if (regex.test(value) || value === "") {
                              let total = props.assetsBalance + Number(props?.editPost?.quantity);
                              let factor = Math.pow(10, 6);
                              let remaining: any = (Math.round(total * factor) - Math.round(value * factor)) / factor;
                              setReduceValue(remaining);
                              checkBalnce(e);
                            } else {
                              e.target.value = value.slice(0, -1);
                            }

                          }}
                          className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Quntity" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>{props?.selectedAssets?.symbol}</p>
                      </div>
                    </div>

                  </div>
                  {errors?.quantity && (
                    <p className="errorMessage">{errors?.quantity?.message}</p>
                  )}
                </div>
                <div className="mt-10">
                  <p className="info-10-14 text-end"> = {reduceValue} {props?.selectedAssets?.symbol}</p>
                </div>
              </div>
              <div className="w-full">
                <p className="info-10-14">Min Order Limit</p>
                <div className="relative w-full mt-10">
                  {/* top dropdown input */}
                  <div className="border  border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                    <div className="flex items-center cursor-pointer ">
                      <div className="w-full">
                        <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} id="min_limit" step={0.000001} value={minInputValue} {...register('min_limit')} onChange={(e) => { checkInput(e, 'min') }} name="min_limit" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Min. Amount" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>INR</p>
                      </div>
                    </div>
                  </div>
                  {errors?.min_limit && (
                    <p className="errorMessage">{errors?.min_limit?.message}</p>
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
                        <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} id="max_limit" step={0.000001} value={maxInputValue}{...register('max_limit')} onChange={(e) => { checkInput(e, 'max') }} name="max_limit" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Enter Max. Amount" />
                      </div>

                      <div className="pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] flex items-center">
                        <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text`}>INR</p>
                      </div>
                    </div>
                  </div>
                  {errors?.max_limit && (
                    <p className="errorMessage">{errors?.max_limit?.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-30 md:p-40 p-[15px] border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="sec-title pb-20 border-b border-grey-v-2 dark:border-opacity-[15%]">Payment Time Limit</p>
            <div className="md:mt-30 py-20 px-10 flex gap-10 items-center">
              {/* <Image src={`/assets/payment-methods/gpay.png`} alt="payment image" width={32} height={32} /> */}
              {/* <p className="sec-text !text-h-primary dark:!text-white !font-medium">Google Pay</p> */}
              <p className="sec-text !text-h-primary dark:!text-white">15:00 Minutes </p>
            </div>
            <div className="md:mt-50 mt-20 flex sm:gap-30 gap-10 sm:flex-row flex-col">
              <button type="button" className="w-full max-w-[200px] rounded-10 info-16-18  bg-grey-v-2 !text-primary hover:!text-white hover:!bg-primary-800 py-[19px] px-[18px]" onClick={() => { props?.setStep(1) }}>Previous</button>
              <button className="solid-button max-w-full  sm:max-w-[220px] w-full">Next</button>

            </div>
          </div>
        </div>
      </form>
      {active == 1 &&
        <AddPayment setShow={setShow} setActive={setActive} masterPayMethod={props.masterPayMethod} setFormMethod={setFormMethod} list={list} />
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
