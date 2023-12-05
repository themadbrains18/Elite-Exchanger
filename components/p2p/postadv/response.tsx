import React from "react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AES from 'crypto-js/aes';
import { useRouter } from "next/router";

const schema = yup.object().shape({
  condition: yup.string().optional().default(''),
  status: yup.string().optional().default(''),
  notes: yup.string().optional().default(''),
  auto_reply: yup.string().optional().default('')
});

interface activeSection {
  step: number;
  setStep: any;
  step1Data?: any;
  step2Data?: any;
}

const Response = (props: activeSection) => {
  const condition = ["Complete KYC", "Registered 0 day(s) ago", "Holding More The 0.01 BTC"];
  const status = ["Online Right Now", "Online, Manually later"]

  const { data: session } = useSession();
  const route = useRouter();

  console.log(props.step2Data,'=======payment method form');
  
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

    let p_method = [];

    for (const pm of props?.step2Data?.p_method) {
      let obj = { "upm_id": pm };
      p_method.push(obj);
    }

    let formData = {
      "user_id": session?.user?.user_id,
      "token_id": props.step1Data?.token_id,
      "price": props.step1Data?.price,
      "quantity": props.step2Data?.quantity,
      "min_limit": props.step2Data?.min_limit,
      "max_limit": props.step2Data?.max_limit,
      "p_method": p_method,
      "payment_time": props.step2Data?.payment_time,
      "condition": data?.condition,
      "status": false,
      "notes": data?.notes,
      "auto_reply": data?.auto_reply,
      "fundcode": '123456'
    }

    const ciphertext = AES.encrypt(JSON.stringify(formData), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
    let record = encodeURIComponent(ciphertext.toString());

    let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/p2p/postad`, {
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
      const websocket = new WebSocket('ws://localhost:3001/');
      let post = {
        ws_type: 'post'
      }
      websocket.onopen = () => {
        websocket.send(JSON.stringify(post));
      }
      toast.success(res.data.data.message);
      route.push('/p2p/my-advertisement');
    }
    else {
      toast.error(res.data.data);
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
                  <input type="text" id="notes" {...register('notes')} name="notes" className="sm-text pr-10 max-w-none placeholder:text-disable-clr  dark:bg-d-bg-primary  bg-transparent  outline-none bg-transparent w-full   dark:text-white" placeholder="Type " />
                </div>
              </div>
              {errors?.notes && (
                <p style={{ color: "#ff0000d1" }}>{errors?.notes?.message}</p>
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
            <p className="sec-title pb-30 border-b border-grey-v-2 dark:border-opacity-[15%]">Countercry Conditions</p>
            <div className="mt-30 flex md:flex-row flex-col gap-30 md:gap-50 justify-between">
              <div className="w-full">
                {condition?.map((item, index) => {
                  return (
                    <div key={index} className="mb-10 md:mb-20 cursor-pointer">
                      <input id={`radio${item}`} type="radio" {...register('condition')} onChange={() => selectCondition(item)} value={item} name="colored-radio" className="w-5 h-5 hidden bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
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
                    before:top-[calc(50%-9px)]
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

              <div className="w-full">
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
                before:top-[calc(50%-9px)]
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
              </div>

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
            <button className="solid-button max-w-[220px] w-full">Post</button>
          </div>
        </div>
      </form>
    </>

  );
};

export default Response;
