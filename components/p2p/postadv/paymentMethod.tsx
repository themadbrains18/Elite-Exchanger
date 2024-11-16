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
import { truncateNumber } from "@/libs/subdomain";
import AuthenticationModelPopup from "@/components/snippets/authenticationPopup";

/**
 * Validation schema for the form data using Yup.
 * This schema validates the payment method, quantity, limits, and payment time.
 */
const schema = yup.object().shape({
  /**
   * Validation for payment methods.
   * - If the value is an array, each item must be a string with at least one character.
   * - The array must have a minimum of 1 item and a maximum of 5 items.
   * - If the value is not an array, it must be a string with at least one character.
   */
  p_method: yup.lazy((val) =>
    Array.isArray(val)
      ? yup
        .array()
        .of(yup.string().min(1, "Please select atleast '1' payment method.").required()).max(5, "Only '5' payment methods are allowed.")
        .required("Please select '1' payment method.")
      : yup.string().min(1).required("Please select '1' payment method.")
  ),
  // yup.array().of(yup.string().min(1).required()).required().nullable(),
  /**
  * Validation for quantity field.
  * - Must be a positive number greater than 0.
  * - Required field.
  */
  quantity: yup
    .number()
    .positive("Quantity must be greater than '0'.")
    .required("Please enter quantity to sell.")
    .typeError("Please enter quantity to sell."),
  /**
 * Validation for minimum limit field.
 * - Must be a positive number greater than 0.
 * - Required field.
 */
  min_limit: yup
    .number()
    .positive("Minimum limit must be greater than '0'.")
    .required("Please enter min limit amount.")
    .typeError("Please enter min limit amount."),
  /**
 * Validation for maximum limit field.
 * - Must be a positive number greater than 0.
 * - Required field.
 */
  max_limit: yup
    .number()
    .positive("Maximum limit must be greater than '0'.")
    .required("Please enter max limit amount.")
    .typeError("Please enter max limit amount."),
  /**
 * Validation for payment time field.
 * - Optional field.
 * - Defaults to "15" if not provided.
 */
  payment_time: yup.string().optional().default("15"),
});

/**
 * Props for managing the payment method selection and asset details in different steps of the form.
 * 
 * @interface PaymentMethodProps
 * @property {number} [step] - The current step in the process (optional).
 * @property {function} [setStep] - A function to update the current step (optional).
 * @property {function} [setPaymentMethod] - A function to update the selected payment method, typically used in step 1 (optional).
 * @property {any} [masterPayMethod] - A list of available master payment methods (optional).
 * @property {any} [userPaymentMethod] - The payment methods already selected by the user (optional).
 * @property {any} [selectedAssets] - The assets that the user has selected for the transaction (optional).
 * @property {any} [assetsBalance] - The user's available asset balance (optional).
 * @property {any} [price] - The price or value associated with the asset or transaction (optional).
 * @property {any} [page] - The page or context from which the component is being used, typically for conditional rendering (optional).
 * @property {any} [userPosts] - The user posts related to the payment method or transaction (optional).
 * 
 * @example
 * <PaymentMethod 
 *   step={1} 
 *   setStep={setStepFunction} 
 *   setPaymentMethod={setPaymentMethodFunction} 
 *   masterPayMethod={masterMethods} 
 *   userPaymentMethod={userMethods} 
 *   selectedAssets={selectedAssets} 
 *   assetsBalance={500} 
 *   price={1000} 
 *   page="payment" 
 *   userPosts={userPosts} 
 * />
 */
interface PaymentMethodProps {
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

const PaymentMethod = (props: PaymentMethodProps) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [formMethod, setFormMethod] = useState();
  const [list, setList] = useState([]);
  const [id, setId] = useState();
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState(0.000000);
  const [minInputValue, setMinInputValue] = useState(0.000000);
  const [maxInputValue, setMaxInputValue] = useState(0.000000);
  const [verified, setVerified] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [reduceValue, setReduceValue] = useState<Number | any>(props.assetsBalance || 0);
  // let list = props.userPaymentMethod;

  const router = useRouter();

  /**
 * Retrieves the payment method name based on the provided payment method ID.
 *
 * @param {string} pmid - The ID of the payment method to look up.
 * @returns {string} - The name of the payment method if found, otherwise an empty string.
 */
  const getPaymentMethodName = (pmid: string) => {
    // Find the payment method in the masterPayMethod list that matches the given ID
    const method = props.masterPayMethod.find((method: any) => method.id === pmid);
    // Return the payment method name if found, otherwise return an empty string
    return method ? method.payment_method : "";
  };

  /**
 * useEffect to handle initialization logic based on router query parameters.
 * - Fetches all payment methods.
 * - Sets form values when query parameters are present.
 *
 * Dependencies:
 * - Triggered whenever `router.query` changes.
 */
  useEffect(() => {
    // Fetch all payment methods without any filter initially
    getAllPayments('');
    // Check if there are query parameters in the router object
    if (Object.keys(router?.query).length > 0) {
      let qty: any = router?.query?.qty;
      let pmid: any = router?.query?.pmid;
      setValue("quantity", qty);
      setValue("max_limit", truncateNumber(props.price * qty, 6));
      setReduceValue(truncateNumber(props.assetsBalance - qty, 6))
      const paymentMethodName = getPaymentMethodName(pmid);
      // Fetch all payments filtered by the retrieved payment method name
      getAllPayments(paymentMethodName)

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

  /**
 * Fetches user payment methods and optionally selects a specific payment method by name.
 *
 * @param {string | undefined} name - The name of the payment method to be pre-selected. If empty, no selection is made.
 *
 * Functionality:
 * - Fetches the user's payment methods from the server.
 * - Sorts payment methods alphabetically by `pm_name`.
 * - Updates the `list` state with the sorted payment methods.
 * - If a payment method name is provided, it finds and selects that method.
 */
  const getAllPayments = async (name: string | undefined) => {
    // Fetch user payment methods from the API
    let userPaymentMethod = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token,
        },
      }
    ).then((response) => response.json());
    // Assuming `userPaymentMethod?.data` contains the payment methods array
    // Sort payment methods alphabetically by `pm_name`
    let sortedPaymentMethods = userPaymentMethod?.data.sort((a: any, b: any) => {
      if (a.pm_name < b.pm_name) return -1;
      if (a.pm_name > b.pm_name) return 1;
      return 0;
    });
    // Update the `list` state with sorted payment methods
    setList(sortedPaymentMethods);
    // If a specific payment method name is provided, select it
    if (name !== '') {
      let method: any = userPaymentMethod?.data?.find((item: any) => item?.pm_name === name)

      if (method) {
        // Set the value for the payment method field in the form
        setValue("p_method", method?.id)
        setSelectedMethods([method?.id]);

      }
    }
  };

  /**
 * Handles form submission with validation checks for payment methods, balance, and limits.
 *
 * @param {any} data - The form data submitted by the user.
 *
 * Validation:
 * - Ensures at least one payment method is selected.
 * - Checks if the quantity exceeds the user's available balance.
 * - Verifies that the minimum limit is less than the maximum limit.
 * - Converts a single payment method into an array if necessary.
 *
 * Actions:
 * - Sets errors for invalid fields.
 * - Updates payment methods and proceeds to the next step if validation passes.
 */
  const onHandleSubmit = async (data: any) => {
    // Ensure at least one payment method is selected
    if (data.p_method.length === 0 || data.p_method[0] === "false") {
      setError("p_method", {
        type: "custom",
        message: `Please select at least 1 payment method.`,
      });
      setFocus("p_method");
      return;
    }
    // Check for sufficient balance
    if (data.quantity > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficient balance.`,
      });
      setFocus("quantity");
      return;
    }
    // Ensure minimum limit is less than the maximum limit
    if (data.min_limit > data.max_limit) {
      setError("min_limit", {
        type: "custom",
        message: `Min limit must be less than max limit.`,
      });
      setFocus("min_limit");
      return;
    }

    let ans = Array.isArray(data.p_method);
    if (ans === false) {
      data.p_method = [data.p_method];
    }
    if (data.p_method.length === 0 || data.p_method[0] === "false" || data.p_method === "false") {
      setError("p_method", {
        type: "custom",
        message: `Please select at least 1 payment method.`,
      });
      setFocus("p_method");
      return;
    }

    props.setPaymentMethod(data);
    props.setStep(3);
  };

  /**
 * Validates user input for balance and calculates maximum limit.
 *
 * @param {any} e - The event triggered by the input change.
 *
 * Validation:
 * - Ensures the input value matches the decimal format (up to 6 digits after the decimal point).
 * - Checks if the input value exceeds the user's available balance.
 *
 * Actions:
 * - Updates the input value if valid.
 * - Sets or clears validation errors as needed.
 * - Calculates and updates the maximum limit based on the quantity and price.
 */

  const checkBalnce = (e: any) => {
    const value = e.target.value;

    // Check if the value matches the pattern (up to 5 digits after the decimal point)
    // Allow only values with up to 6 decimal places
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      setInputValue(value);
    }
    // Check if the entered value exceeds the available balance
    if (e.target.value > props.assetsBalance) {
      setError("quantity", {
        type: "custom",
        message: `Insufficient balance.`,
      });
      return;
    } else {
      // Calculate the maximum limit based on the entered value and price
      let maxLimit = truncateNumber(props.price * e.target.value, 6);
      setValue('max_limit', maxLimit);
      clearErrors('max_limit')
      setMaxInputValue(maxLimit)
      clearErrors('quantity');
    }
  };

  /**
 * Deletes a payment method after validating its relation to existing ads.
 *
 * Steps:
 * 1. Checks if the payment method is linked to any existing ads.
 * 2. Displays a warning toast if the method is associated with ads, preventing deletion.
 * 3. Sends a DELETE request to the API to remove the payment method if no associations are found.
 * 4. Provides user feedback via toast notifications for success or failure.
 *
 * @async
 */
  const handleDelete = async () => {
    try {
      // Array to track payment methods associated with active ads
      let paymentMethodRelation = [];

      // Check if the payment method is related to any ads
      for (const post of props?.userPosts?.data) {
        post?.p_method.filter((itm: any) => {
          if (itm.upm_id === id) {
            paymentMethodRelation.push(itm);
          }
        })
      }

      // Prevent deletion if the method is associated with ads
      if (paymentMethodRelation.length > 0) {
        toast.warning('You can`t remove this payment method because it related to your ads. In case you first change payment method in ad then remove payment method.', { autoClose: 2000 });
        return;
      }

      // Send DELETE request to remove the payment method
      let responseData = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/p2p/userpaymentmethod?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: session?.user?.access_token,
          },
        }
      ).then((res) => res.json());

      // Handle the response
      if (responseData?.data) {
        getAllPayments('')
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

  /**
 * Validates and updates input values for min and max limits.
 *
 * Steps:
 * 1. Validates the input against a pattern (up to 6 digits after the decimal point).
 * 2. Updates the respective state (`min` or `max`) based on the input type.
 * 3. Checks if the min value exceeds the max value and sets an error if applicable.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
 * @param {string} type - The type of input (`min` or `max`).
 */
  const checkInput = (e: any, type: string) => {
    const value = e.target.value;
    // Validate the input pattern (allow up to 6 decimal places)
    if (/^\d*\.?\d{0,6}$/.test(value)) {
      type === "min" ? setMinInputValue(value) : (value);
    }
    if (type === "min" && maxInputValue > 0) {
      value > maxInputValue ? setError('min_limit', { type: "custom", message: "Min limit must be less than max limit." }) : clearErrors('min_limit'); setMinInputValue(value)
    }
  }

  /**
 * Handles the change event for payment method checkboxes.
 *
 * Steps:
 * 1. Adds a payment method to the list if the checkbox is checked and the limit (5 methods) is not exceeded.
 * 2. Removes a payment method from the list if the checkbox is unchecked.
 * 3. Updates the state for selected methods and the corresponding form field (`p_method`).
 *
 * @param {React.ChangeEvent<HTMLInputElement>} e - The checkbox change event.
 */

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      if (selectedMethods.length < 5) {
        setSelectedMethods([...selectedMethods, value]);
        setValue('p_method', [...selectedMethods, value]);
      }
    } else {
      const newSelectedMethods = selectedMethods.filter((method) => method !== value);
      setSelectedMethods(newSelectedMethods);
      setValue('p_method', newSelectedMethods);
    }
  };

  /**
 * Determines if a checkbox should be disabled based on the selected methods.
 *
 * Logic:
 * - If the number of selected methods is 5 or more, only allow the currently selected checkboxes to remain enabled.
 * - Prevent selection of additional checkboxes when the limit is reached.
 *
 * @param {string} value - The value of the checkbox to evaluate.
 * @returns {boolean} - `true` if the checkbox should be disabled, `false` otherwise.
 */
  const isCheckboxDisabled = (value: string) => {
    return selectedMethods.length >= 5 && !selectedMethods.includes(value);
  };

  return (
    <>
      {props?.page === "user-center" && <ToastContainer position="top-center" limit={1} />}
      <div
        className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show || verified ? "opacity-80 visible" : "opacity-0 invisible"
          }`}
      ></div>
      <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}>
        <div className="mt-40">
          <div className="p-[15px] md:p-40 border rounded-10 border-grey-v-1 dark:border-opacity-[15%]">
            <p className="pb-6 border-b border-grey-v-3 sec-title dark:border-opacity-[15%]">
              {props?.page !== "user-center"
                ? "Select Up to 5 methods"
                : "Payment Methods"}
            </p>
            <div className="">
              {list && list?.length > 0 && list?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-20 py-20 md:mt-30"
                  >
                    {props.page !== "user-center" && (
                      <div>
                        <input
                          type="checkbox"
                          {...register("p_method")}
                          name="p_method"
                          id={`checkbox${item?.id}`}
                          value={item?.id}

                          defaultChecked={
                            selectedMethods.includes(item.id) ??
                            false
                          }
                          onChange={handleCheckboxChange}
                          disabled={isCheckboxDisabled(item.id)}
                          className="hidden methods"
                        />
                        <label
                          htmlFor={`checkbox${item?.id}`}
                          className={`
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
                          `}
                        ></label>
                      </div>
                    )}
                    <div className="flex gap-2 items-center justify-between w-full">
                      <div className={`flex gap-10 items-center ${isCheckboxDisabled(item.id) ? "disabled-text" : ""}`}>
                        <div className="flex gap-10 items-center w-full max-w-[145px]">

                          <p className="sec-text !text-h-primary dark:!text-white !font-medium">
                            {item?.pm_name}
                          </p>
                          <Image
                            src={`${item?.master_payment_method?.icon}`}
                            alt="payment image"
                            width={32}
                            height={32}
                          />
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
                <p className="errorMessage mt-3">
                  {errors?.p_method?.message}
                </p>
              )}
              <div className="md:mt-50 mt-10">
                <button
                  type="button"
                  className="outline-button border-primary text-primary max-w-full sm:max-w-[176px] w-full"
                  onClick={() => {
                    if ((session?.user?.tradingPassword === '' || session?.user?.tradingPassword === null)) {
                      setVerified(true);
                    }
                    else {
                      setShow(!show);
                      setActive(1);
                    }

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
                              type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                              id="quantity"
                              step={0.000001}
                              {...register("quantity")}
                              name="quantity"
                              onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^\d{0,10}(\.\d{0,6})?$/;
                                if (regex.test(value) || value === "") {
                                  checkBalnce(e);
                                } else {
                                  e.target.value = value.slice(0, -1);
                                }
                              }}
                              onInput={(e: any) => { setReduceValue(props.assetsBalance - Number(e.target.value)) }}
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
                        <p className="errorMessage">
                          {errors?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div className="mt-10">
                      <p className="info-10-14 text-end">
                        {" "}
                        = {truncateNumber(reduceValue, 6)} {props?.selectedAssets?.symbol}
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
                              type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                              id="min_limit"
                              step={0.000001}
                              {...register("min_limit")}
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
                        <p className="errorMessage">
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
                              disabled={true}
                              type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                              id="max_limit"
                              step={0.000001}
                              {...register("max_limit")}
                              name="max_limit"
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
                        <p className="errorMessage">
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
                  <p className="sec-text !text-h-primary dark:!text-white">15:00 Minutes </p>
                </div>
                <div className="md:mt-50 mt-20 flex sm:gap-30 gap-10 sm:flex-row flex-col">
                  <button
                    type="button"
                    className="w-full max-w-[200px] rounded-10 info-16-18  bg-grey-v-2 !text-primary hover:!text-white hover:bg-primary-800 py-[19px] px-[18px]"
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
          page="ad"
        />
      )}
      {active == 3 && (
        <Successfull setShow={setShow} setActive={setActive} type="success" hideVisibility={true} />
      )}
      {active === 4 && (
        <ConfirmationModel
          setActive={setActive}
          setShow={setShow}
          title="Confirm"
          message="Are you sure you want to delete this item?"
          actionPerform={handleDelete}
          show={show}
          hideVisibility={true}
        />
      )}

      {verified &&
        <AuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setVerified} setActive={setActive} show={verified} hideVisibility={true} />
      }
    </>
  );
};

export default PaymentMethod;
