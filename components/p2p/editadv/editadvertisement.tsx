import React, { useEffect, useState } from "react";
import EditPaymentMethod from "./editPaymentMethod";
import EditResponse from "./editResponse";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { truncateNumber } from "@/libs/subdomain";
import { currencyFormatter } from "@/components/snippets/market/buySellCard";
import { toast, ToastContainer } from "react-toastify";

/**
 * Props for the EditAdvertisement component.
 * 
 * This interface defines the expected properties for the `EditAdvertisement` component,
 * which is used to edit advertisements. It includes properties related to payment methods,
 * token list, user assets, and the advertisement to be edited.
 * 
 * @interface EditAdverstisementPropsData
 * 
 * @property {any} [masterPayMethod] - The list of available master payment methods. 
 * This is typically used to provide options for payment methods when editing an advertisement.
 * 
 * @property {any} [userPaymentMethod] - The list of payment methods associated with the current user. 
 * It is used to pre-select payment methods when editing an advertisement.
 * 
 * @property {any} [tokenList] - The list of available tokens for the advertisement.
 * This helps in selecting or filtering tokens when editing the advertisement.
 * 
 * @property {any} [assets] - The list of assets the user holds, used for selecting assets related to the advertisement.
 * 
 * @property {any} [editPost] - The advertisement data to be edited. This includes the details of the advertisement
 * that will be updated through the component.
 * 
 * @example
 * // Example usage of the EditAdverstisementPropsData interface:
 * const EditAdvertisementComponent = (props: EditAdverstisementPropsData) => {
 *   // Logic for handling payment methods, token list, and advertisement data
 * };
 */
interface EditAdverstisementPropsData {
  masterPayMethod?: any;
  userPaymentMethod?: any;
  tokenList?: any;
  assets?: any;
  editPost?: any;
}

const schema = yup.object().shape({
  token_id: yup.string().required("Please select asset that you want to sell."),
  price: yup
    .number()
    .positive("Price must be greater than '0'.")
    .required("Please enter amount.")
    .typeError("Please enter amount."),
});

const EditAdverstisement = (props: EditAdverstisementPropsData) => {
  const [show, setShow] = useState(1);
  const [step, setStep] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState(Object);
  const [inrPrice, setInrPrice] = useState(0);
  const [step1Data, setStep1Data] = useState(Object);
  const [step2Data, setStep2Data] = useState(Object);
  const [assetsBalance, setAssetsBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const assets = props.tokenList;
  const cash = ["INR"];

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /**
   * Effect hook that runs when `props.editPost` changes.
   * 
   * This hook filters the `tokenList` to find a token matching the `editPost.token_id`,
   * then sets the selected token, the price of the post, and adjusts the price type display.
   * 
   * @effect
   * - Fetches the corresponding token from the `tokenList` and sets it in the form.
   * - Sets the price of the advertisement post using `truncateNumber`.
   * - Determines the price type as either 'fixed' or 'variable' (1 or 2).
   * 
   * @param {Object} props - Component props, including `tokenList` and `editPost`.
   * @param {Object} props.tokenList - List of available tokens for selection.
   * @param {Object} props.editPost - The advertisement data being edited, including the `token_id` and `price`.
   */
  useEffect(() => {
    let token = props?.tokenList?.filter((e: any) => {
      return e.id === props.editPost?.token_id;
    });
    if (token?.length > 0) {
      selectToken(token[0]);
      setValue("price", truncateNumber(props?.editPost?.price, 4));
    }
    let type = props.editPost?.price_type === 'fixed' ? 1 : 2;
    setShow(type)
  }, [props.editPost]);

  /**
   * Selects a token from the list and fetches its current price in INR.
   * 
   * This function sets the token as the selected token, clears any form validation errors,
   * and fetches the price of the token in INR. It also sets the user's balance for the selected token
   * and updates the UI state accordingly.
   * 
   * @param {Object} item - The token item to be selected.
   * @param {string} item.id - The unique identifier of the token.
   * @param {string} item.symbol - The symbol of the token, used for API requests.
   * @param {string} item.tokenType - The type of the token (either 'global' or other).
   * @param {number} item.price - The token's price, used when it's not 'global'.
   * 
   * @returns {Promise<void>} - This function is asynchronous and does not return a value.
   * 
   * @throws {Error} - If any error occurs during the API call or data processing.
   */
  const selectToken = async (item: any) => {
    try {
      setValue("token_id", item?.id);
      clearErrors("token_id");
      setLoading(true);
      if (item?.tokenType === 'global') {
        let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
          }),
          body: JSON.stringify({
            currency: "INR",
            code: item?.symbol === 'BTCB' ? 'BTC' : item?.symbol === 'BNBT' ? 'BNB' : item?.symbol,
            meta: false
          }),
        });
        let data = await responseData.json();
        setLoading(false);
        setInrPrice(truncateNumber(data?.rate, 6));
      }
      else {
        let responseData = await fetch("https://api.livecoinwatch.com/coins/single", {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": `${process.env.NEXT_PUBLIC_PRICE_SINGLE_ASSET_KEY}`,
          }),
          body: JSON.stringify({
            currency: "INR",
            code: "USDT",
            meta: false
          }),
        });
        let data = await responseData.json();
        setInrPrice(truncateNumber(item?.price * data?.rate, 6))
      }


      setSelectedAssets(item);
      let balances = props?.assets?.filter((e: any) => {
        return e.token_id === item?.id && e.walletTtype === 'main_wallet';
      });


      setAssetsBalance(balances[0]?.balance);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
    }

  };

  /**
   * Sets the payment method data for the second step.
   * 
   * This function is used to set the payment method data when a user selects a payment method 
   * during the form submission process. It stores the data in the `step2Data` state.
   * 
   * @param {Object} data - The payment method data to be set for the second step.
   * @param {string} data.paymentMethod - The selected payment method.
   * @param {string} data.details - Additional details regarding the selected payment method.
   * 
   * @returns {void} - This function does not return a value.
   */
  const setPaymentMethod = (data: any) => {
    setStep2Data(data);
  };

  /**
   * Handles the form submission for step 1 and progresses to step 2.
   * 
   * This function is triggered when the form for the first step is submitted. It adds the price 
   * type (`'fixed'` or `'floating'`) based on the value of `show` and stores the form data in 
   * the `step1Data` state. Then, it triggers the progression to step 2 by setting the step state to `2`.
   * 
   * @param {Object} data - The form data submitted in step 1.
   * @param {string} data.price - The price entered by the user.
   * @param {string} data.token_id - The ID of the selected token.
   * @param {string} data.paymentMethod - The selected payment method.
   * 
   * @returns {void} - This function does not return a value.
   */
  const onHandleSubmit = (data: any) => {
    data.price_type = show === 1 ? 'fixed' : 'floating';
    setStep1Data(data);
    setStep(2);
  };

  return (
    <>
      <ToastContainer limit={1} position="top-center" />
      {step == 1 && (
        <div className="mt-30 md:mt-40">
          <p className="sec-title">Set Asset Type and Price</p>
          <form onSubmit={handleSubmit(onHandleSubmit)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}>
            <div className="mt-40 flex md:flex-row flex-col first-letter:  gap-30 items-start">
              <div className="max-w-[1048px] w-full">
                <div className=" md:p-40 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                  <p className="p-[15px] sec-title w-full md:pb-30 border-b border-grey-v-2 dark:border-opacity-20">
                    Asset
                  </p>
                  <div className="mt-20 mb-20 md:mb-0 md:mt-30 grid grid-cols-3 md:flex flex-wrap gap-x-10 gap-y-30 md:gap-20 p-10 md:p-0">
                    {assets?.map((item: any, index: any) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center md:mr-4 md:py-2 md:px-[18px] max-w-[130px] w-full"
                        >
                          <input
                            id={`radio${item.id}`}
                            {...register("token_id")}
                            disabled
                            onChange={() => selectToken(item)}
                            type="radio"
                            value={item.id}
                            name="token_id"
                            className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                          />
                          <label
                            htmlFor={`radio${item.id}`}
                            className="ml-2 md-text dark:!text-g-secondary  relative custom-radio 
                                pl-[30px] 
                                after:dark:bg-omega
                                after:bg-white
                                after:left-[0px]
                                after:w-[20px] 
                                after:h-[20px]
                                after:rounded-[50%] 
                                after:border after:border-beta
                                after:absolute
                                before:dark:bg-[transparent]
                                before:bg-white
                                before:left-[5px]
                                before:md:top-[calc(50%-7px)]
                                before:top-[calc(50%-4px)]
                                before:w-[10px] 
                                before:h-[10px]
                                before:rounded-[50%] 
                                before:absolute
                                before:z-[1]
                                "
                          >
                            {item?.symbol}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {errors?.token_id && (
                    <p className="errorMessage">
                      {errors?.token_id?.message}
                    </p>
                  )}
                </div>
                <div className="md:p-40 mt-30 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                  <p className="p-[15px] sec-title w-full pb-30 border-b border-grey-v-2 dark:border-opacity-20">
                    With Cash
                  </p>
                  <div className="mt-20 mb-20 md:mb-0 md:mt-30 grid grid-cols-3 md:flex flex-wrap gap-x-10 gap-y-30 md:gap-20 p-10 md:p-0">
                    {cash?.map((item, index) => {
                      // {console.log(selectedAssets?.price , inrPrice)} 
                      return (
                        <div
                          key={index}
                          className="flex items-center md:mr-4 md:py-2 md:px-[18px] cursor-pointer"
                        >
                          <input
                            id={`radio1${index}`}
                            type="radio"
                            checked
                            value=""
                            name="colored-radio2"
                            className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                          />
                          <label
                            htmlFor={`radio1${index}`}
                            className="md-text ml-2  dark:!text-bg-secondary relative custom-radio  cursor-pointer
                                    pl-[30px] 
                                    after:dark:bg-omega
                                    after:bg-white
                                    after:left-[0px]
                                    after:w-[20px] 
                                    after:h-[20px]
                                    after:rounded-[50%] 
                                    after:border after:border-beta
                                    after:absolute
                    
                                    before:dark:bg-[transparent]
                                    before:bg-white
                                    before:left-[5px]
                                    before:md:top-[calc(50%-7px)]
                                    before:top-[calc(50%-4px)]
                                    before:w-[10px] 
                                    before:h-[10px]
                                    before:rounded-[50%] 
                                    before:absolute
                                    before:z-[1]"
                          >
                            {item}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="max-[767px]:max-w-full max-[767px]:w-full p-[15px] md:p-40 border border-grey-v-1 dark:border-opacity-20 rounded-[6px]">
                <p className="sec-title">Price Type</p>
                <div className="items-center flex gap-20 md:gap-30 border-b border-grey-v-2">
                  <button
                    className={`info-14-18 max-[767px]:w-full max-[767px]:max-w-full   after:block after:top-full  after:h-[2px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${show === 1 &&
                      "border-primary after:w-[100%] after:bottom !text-primary"
                      }`}
                    onClick={() => {
                      setShow(1);
                      setValue('price', truncateNumber(props?.editPost?.price, 4))
                    }}
                    type="button"
                  >
                    <div className="flex items-center mr-4 md:justify-unset justify-center">
                      <input
                        id="radio--btn-1"
                        type="radio"
                        value=""
                        name="colored-radio-dd"
                        checked={show === 1 ? true : false}
                        className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                      />
                      <label
                        htmlFor="radio--btn-1"
                        className="
                          md-text py-[24px] px-[18px]  relative custom-radio  cursor-pointer
                          pl-[60px] 
                          after:dark:bg-omega
                          after:bg-white
                          after:lg:left-[29px]
                          after:left-[16px]
                          after:w-[20px] 
                          after:h-[20px]
                          after:rounded-[50%] 
                          after:border after:border-beta
                          after:absolute
                          before:dark:bg-[transparent]
                          before:bg-white
                          before:lg:left-[34px]
                          before:left-[21px]
                          before:md:top-[calc(50%-7px)]
                          before:top-[calc(50%-4px)]
                          before:w-[10px] 
                          before:h-[10px]
                          before:rounded-[50%] 
                          before:absolute
                          before:z-[1]
                          "
                      >
                        Fixed
                      </label>
                    </div>
                  </button>
                  <button
                    className={`info-14-18   max-[767px]:w-full max-[767px]:max-w-full after:block after:top-full  after:h-[2px] after:w-[0%] after:bg-primary cursor-pointer after:transition-all after:ease-linear after:duration-500 ${show === 2 &&
                      "border-primary after:w-[100%] after:bottom !text-primary"
                      }`}
                    onClick={() => {
                      setShow(2);
                      selectToken(selectedAssets);
                      let currentPrice = truncateNumber(inrPrice, 6)
                      setValue('price', currentPrice)
                    }}
                    type="button"
                  >
                    <div className="flex items-center mr-4  md:justify-unset justify-center">
                      <input
                        id="radio-btn2"
                        type="radio"
                        value=""
                        name="colored-radio-dd"
                        checked={show === 2 ? true : false}
                        className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"
                      />
                      <label
                        htmlFor="radio-btn2"
                        className="
                          md-text py-[24px] px-[18px] relative  custom-radio  cursor-pointer
                          pl-[60px] 
                          after:dark:bg-omega
                          after:bg-white
                          after:lg:left-[29px]
                          after:left-[16px]
                          after:w-[20px] 
                          after:h-[20px]
                          after:rounded-[50%] 
                          after:border after:border-beta
                          after:absolute
                          before:dark:bg-[transparent]
                          before:bg-white
                          before:lg:left-[34px]
                          before:left-[21px]
                          before:md:top-[calc(50%-7px)]
                          before:top-[calc(50%-4px)]
                          before:w-[10px] 
                          before:h-[10px]
                          before:rounded-[50%] 
                          before:absolute
                          before:z-[1]
                          "
                      >
                        Floating
                      </label>
                    </div>
                  </button>
                </div>
                <div className="md:py-50 py-20">
                  <div className="flex items-center justify-between gap-2 relative pb-[15px] border-b border-grey-v-1 dark:border-opacity-20">
                    <p className="info-14-18 dark:!text-white">Cuurent  Price</p>
                    {
                      selectedAssets?.price == undefined && loading === true ?
                        <div className='loader relative w-[35px] z-[2] h-[35px] top-0 right-0 border-[6px] border-[#d9e1e7] rounded-full animate-spin border-t-primary '></div>
                        :
                        <p className="sec-title md:!text-[18px] !text-[14px]">
                          ₹{" "}{currencyFormatter(truncateNumber(inrPrice, 6))}
                        </p>

                    }
                  </div>
                  {/* <div className="flex items-center justify-between gap-2 pt-[15px] ">
                    <p className="info-14-18 dark:!text-white">
                      Highest Order Price
                    </p>
                    <p className="sec-title md:!text-[18px] !text-[14px]">
                      ₹ 79.29
                    </p>
                  </div> */}
                  <div className="md:mt-30 mt-20">
                    <p className="info-10-14">{show === 1 ? "Fixed (INR)" : "Floating (INR)"}</p>
                    <input
                      type="number" onWheel={(e) => (e.target as HTMLElement).blur()}
                      step={0.000001}
                      {...register("price", { required: true })}
                      name="price"
                      disabled={show === 2 ? true : false}
                      placeholder="Enter Amount"
                      className="py-[14px] px-[15px] border rounded-5 border-grey-v-1 mt-[10px] w-full bg-[transparent] dark:border-opacity-20 outline-none info-16-18"
                    />
                  </div>
                  {errors?.price && (
                    <p className="errorMessage">
                      {errors?.price?.message}
                    </p>
                  )}
                  <p className="py-2 info-10-14 text-right">Bal: {truncateNumber(assetsBalance, 6)}</p>

                </div>
                <button className="solid-button w-full text-center">
                  Next
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {step === 2 && (
        <EditPaymentMethod
          step={step}
          setStep={setStep}
          setPaymentMethod={setPaymentMethod}
          masterPayMethod={props.masterPayMethod}
          userPaymentMethod={props.userPaymentMethod}
          selectedAssets={selectedAssets}
          assetsBalance={assetsBalance}
          price={step1Data.price}
          editPost={props.editPost}
        />
      )}
      {step === 3 && (
        <EditResponse
          step={step}
          setStep={setStep}
          step1Data={step1Data}
          step2Data={step2Data}
          editPost={props.editPost}
        />
      )}
    </>
  );
};

export default EditAdverstisement;
