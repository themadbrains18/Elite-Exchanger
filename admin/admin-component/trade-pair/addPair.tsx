import Context from "@/components/contexts/context";
import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";
import React, { useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { AES } from "crypto-js";
import { useSession } from "next-auth/react";

interface ActiveSession {
  data: any;
  show: boolean;
  setShow: Function;
  refreshPairList?:any;
  session?:any;
}

type PairSubmitForm = {
  tokenOne: string;
  tokenTwo: string;
  symbolOne: string;
  symbolTwo: string;
  maker?: number;
  taker?: number;
  min_trade: number;
};

const schema = yup.object().shape({
  tokenOne: yup.string().required("Please enter symbol"),
  tokenTwo: yup.string().required("Please enter symbol"),
  symbolOne: yup.string().required("Please enter symbol"),
  symbolTwo: yup.string().required("Please enter symbol"),
  maker: yup.number().optional().default(0),
  taker: yup.number().optional().default(0),
  min_trade: yup.number().positive("Please enter min trade amount").required("Please enter min trade amount").typeError("Please enter coin minimum trade limit"),
  max_trade: yup.number().positive("Please enter min trade amount").required("Please enter max trade amount").typeError("Please enter coin maximum trade limit"),

});

const AddPair = (props: ActiveSession) => {
  const { mode } = useContext(Context);
  const {data:session} =useSession()

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

  const setCurrency = (symbol: any, dropdown: number) => {
    // console.log(symbol, dropdown, "==hdkfjh");
    if (dropdown === 1) {
      setValue("tokenOne", symbol?.id);
      setValue("symbolOne", symbol?.symbol);
      clearErrors("tokenOne");
    } else {

      setValue("tokenTwo", symbol?.id);
      setValue("symbolTwo", symbol?.symbol);
      clearErrors("tokenTwo");
    }
  };

  const onHandleSubmit = async (data: any) => {
    try {
      // console.log("=hii",data);
      
      if (getValues("tokenOne") === getValues("tokenTwo")) {
        setError("tokenTwo", { message: "Same tokens are not allowed" })
      }
      else {
        data.status = true;
        const ciphertext = AES.encrypt(
          JSON.stringify(data),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
  
        let res = await fetch(`/api/pair/create`, {
          headers: {
            "Content-type": "application/json",
            Authorization: session?.user?.access_token || "",
          },
          method: "POST",
          mode: "cors",
          body: JSON.stringify(record),
        });
        let result = await res.json();
        // console.log(result);
        if (result?.data?.status === 200) {
          toast.success(result?.data?.data?.message);
          props.refreshPairList();
          setTimeout(() => {
            props?.setShow(false);
          }, 1000);
        }
        if (result?.data?.status === 409) {
          toast.warning(result?.data?.data?.message);
          setTimeout(() => {
            props?.setShow(false);
          }, 1000);
        }
      }
    } catch (error) {
      console.log("error in create trade pair",error);

    }
  
  };

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[607px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Add Pair Form</p>
        <svg
          onClick={() => {
            props?.setShow(false);
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
        <div className=" relative mb-20">
          <p className="sm-text mb-2">Select Coin</p>
          <FilterSelectMenuWithCoin
            data={props?.data}
            border={true}
            setCurrency={setCurrency}
            dropdown={1}
          />
          {errors?.tokenOne && (
            <p style={{ color: "#ff0000d1" }}>{errors?.tokenOne?.message}</p>
          )}
        </div>

        <div className=" relative ">
          <p className="sm-text mb-2">Select Coin</p>
          <FilterSelectMenuWithCoin
            data={props?.data}
            border={true}
            setCurrency={setCurrency}
            dropdown={2}
          />
          {errors?.tokenTwo && (
            <p style={{ color: "#ff0000d1" }}>{errors?.tokenTwo?.message}</p>
          )}
        </div>
        <div className=" relative ">
          <p className="sm-text mb-2">Maker fee</p>
          <input
            type="text"
            {...register("maker")}
            name="maker"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.maker && (
            <p style={{ color: "#ff0000d1" }}>{errors?.maker?.message}</p>
          )}
        </div>
        <div className=" relative ">
          <p className="sm-text mb-2">Taker fee</p>
          <input
            type="text"
            {...register("taker")}
            name="taker"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.taker && (
            <p style={{ color: "#ff0000d1" }}>{errors?.taker?.message}</p>
          )}
        </div>
        <div className=" relative ">
          <p className="sm-text mb-2">Minimum trade amount</p>
          <input
            type="text"
            {...register("min_trade")}
            name="min_trade"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.min_trade && (
            <p style={{ color: "#ff0000d1" }}>{errors?.min_trade?.message}</p>
          )}
        </div>
        <div className=" relative ">
          <p className="sm-text mb-2">Maximum trade amount</p>
          <input
            type="text"
            {...register("max_trade")}
            name="min_trade"
            placeholder="Please enter limit case fee"
            className="sm-text input-cta2 w-full"
          />
          {errors?.max_trade && (
            <p style={{ color: "#ff0000d1" }}>{errors?.max_trade?.message}</p>
          )}
        </div>
        <button className="solid-button w-full mt-30">Submit</button>
      </form>
    </div>
  );
};

export default AddPair;
