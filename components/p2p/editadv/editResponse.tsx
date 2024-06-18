import React, { useEffect, useState } from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import { useRouter } from "next/router";
import { useWebSocket } from "@/libs/WebSocketContext";

const schema = yup.object().shape({
  condition: yup.string().optional().default(''),
  status: yup.string().optional().default(''),
  remarks: yup.string().optional().default(''),
  auto_reply: yup.string().optional().default('')
});

interface activeSection {
  step: number;
  setStep: any;
  step1Data?: any;
  step2Data?: any;
  editPost?: any;
}

const EditResponse = (props: activeSection) => {
  const condition = [{ name: "Complete KYC", value: "complete_kyc" }, { name: "Holding More Than 0.01 BTC", value: "min_btc" }];
  // sconst status = ["Online Right Now", "Online, Manually later"]

  const { data: session } = useSession();
  const route = useRouter();
  const [disable, setDisable] = useState(false);

  const wbsocket = useWebSocket();

  useEffect(() => {
    setValue('remarks', props?.editPost?.remarks);
    setValue('auto_reply', props?.editPost?.auto_reply);
    if (props?.editPost?.complete_kyc) {
      setValue('condition', 'complete_kyc');
    } else if (props?.editPost?.min_btc) {
      setValue('condition', 'min_btc');
    }
  }, [props?.editPost])

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
    defaultValues: { condition: '', status: '' },
  });

  const onHandleSubmit = async (data: any) => {
    try {
      setDisable(true);

      let p_method = [];

      for (const pm of props?.step2Data?.p_method) {
        let obj = { "upm_id": pm };
        p_method.push(obj);
      }

      let formData = {
        "id": props?.editPost?.id,
        "user_id": session?.user?.user_id,
        "token_id": props.step1Data?.token_id,
        "price": props.step1Data?.price,
        "price_type":props.step1Data?.price_type,
        "quantity": props.step2Data?.quantity,
        "min_limit": props.step2Data?.min_limit,
        "max_limit": props.step2Data?.max_limit,
        "p_method": p_method,
        "payment_time": props.step2Data?.payment_time,
        "condition": data?.condition,
        "status": false,
        "remarks": data?.remarks,
        "auto_reply": data?.auto_reply,
        "complete_kyc": data?.condition === "complete_kyc" ? true : false,
        "min_btc": data?.min_btc == "min_btc" ? true : false,
        "fundcode": '123456'
      }

      const ciphertext = AES.encrypt(JSON.stringify(formData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/editadvertisement`, {
        method: "POST",
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(record)
      })

      let res = await responseData.json();

      if (res.data.status === 200) {
        if (wbsocket) {
          let post = {
            ws_type: 'post'
          }
          wbsocket.send(JSON.stringify(post));
        }
        toast.success("Post Ad update successfully",{autoClose:2000});
        setTimeout(()=>{
          setDisable(false);
        },3000)

        route.push('/p2p/my-advertisement');
      }
      else {
        toast.error(res.data.data,{autoClose:2000});
        setTimeout(()=>{
          setDisable(false);
        },3000)

      }
    } catch (error) {
      console.log(error, "=errorin ad post");
      setDisable(false);
    }

    // var formData = new FormData();
    // formData.append("user_id", session?.user?.user_id);

    // formData.append("token_id", props.step1Data?.token_id);
    // formData.append("price", props.step1Data?.price);

    // formData.append("quantity", props.step2Data?.quantity);
    // formData.append("min_limit", props.step2Data?.min_limit);
    // formData.append("max_limit", props.step2Data?.max_limit);
    // formData.append("p_method", JSON.stringify(p_method));
    // formData.append("payment_time", props.step2Data?.payment_time);

    // formData.append("condition", data?.condition);
    // formData.append("status", data?.status);
    // formData.append("notes", data?.notes);
    // formData.append("auto_reply", data?.auto_reply);

  }

  const selectCondition = (item: any) => {
    setValue('condition', item)
  }

  const selectStatus = (item: any) => {
    setValue('status', item)
  }


  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="mt-40">
          <div className="mt-30 p-20 md:p-40 border rounded-10 border-grey-v-2 dark:border-opacity-[15%]">
            <p className="sec-title pb-30 border-b border-grey-v-2 dark:border-opacity-[15%]">Set Remarks and Automatic Response</p>
            <div className="mt-30 flex md:flex-row flex-col gap-30">
              <div className="w-full">
                <p className="info-10-14">Remarks (Optional)</p>
                <div className="border mt-10 border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                  <input type="text" id="remarks" {...register('remarks')} name="remarks" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Type " />
                </div>
              </div>
              {errors?.remarks && (
                <p style={{ color: "#ff0000d1" }}>{errors?.remarks?.message}</p>
              )}
              <div className="w-full">
                <p className="info-10-14">Auto-Reply (Optional)</p>
                <div className="border mt-10 border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[13px] px-[15px]">
                  <input type="text" id="auto_reply" {...register('auto_reply')} name="auto_reply" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Type " />
                </div>
              </div>
              {errors?.auto_reply && (
                <p style={{ color: "#ff0000d1" }}>{errors?.auto_reply?.message}</p>
              )}
            </div>
          </div>
          <div className="mt-30 p-40 border rounded-10 border-grey-v-2 dark:border-opacity-[15%]">
            <p className="sec-title pb-30 border-b border-grey-v-2  dark:border-opacity-[15%]">Countercry Conditions</p>
            <div className="mt-30 flex md:flex-row flex-col gap-30 md:gap-50 justify-between">
              <div className="w-full">
                {condition?.map((item, index) => {
                  return (
                    <div key={index} className="mb-10 md:mb-20 cursor-pointer">
                      <input id={`radio${item}`} type="radio" {...register('condition')}  onChange={() => selectCondition(item.value)} value={item?.value} name="colored-radio" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                      <label
                        htmlFor={`radio${item}`}
                        className="
                    cursor-pointer
                    ml-2 md-text dark:!text-g-secondary relative custom-radio 

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
                        {item?.name}
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* <div className="w-full">
                <p className="sm-text mb-20">Status</p>
                <div>
                  {status?.map((item, index) => {
                    return (
                      <div key={index} className="mb-10 md:mb-20 cursor-pointer">
                        <input id={`radio1${item}`} type="radio" {...register('status')} onChange={() => selectStatus(item)} value={item} name="colored-radio2" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                        <label
                          htmlFor={`radio1${item}`}
                          className="
                cursor-pointer
                ml-2 md-text dark:!text-g-secondary relative custom-radio 

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
                          {item}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div> */}

            </div>
            {errors?.condition && (
              <p style={{ color: "#ff0000d1" }}>{errors?.condition?.message}</p>
            )}
            {errors?.status && (
              <p style={{ color: "#ff0000d1" }}>{errors?.status?.message}</p>
            )}
          </div>
          <div className="mt-50 flex gap-30">
            <button type="button"
              className="solid-button2 max-w-[262px] w-full"
              onClick={() => {
                props?.setStep(2);
              }}
            >
              Previous
            </button>
            <button disabled={disable} className={`solid-button max-w-[220px] text-center w-full ${disable === true ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {disable === true &&
                <svg className="w-5 h-5 mx-auto text-white animate-spin " xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              }
              {disable === false &&
                <>Post</>
              }

            </button>
          </div>
        </div>
      </form>
    </>

  );
};

export default EditResponse;
