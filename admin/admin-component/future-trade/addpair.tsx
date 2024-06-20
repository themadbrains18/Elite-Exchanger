import Context from "@/components/contexts/context";
import FilterSelectMenuWithCoin from "@/components/snippets/filter-select-menu-with-coin";
import React, { useContext, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

interface ActiveSession {
  data: any;
  show: boolean;
  setShow: Function;
  refreshPairList?: any;
}


const schema = yup.object().shape({
  coin_id: yup.string().required("Please enter symbol"),
  usdt_id: yup.string().required("Please enter symbol"),
  coin_symbol: yup.string().required("Please enter symbol"),
  usdt_symbol: yup.string().required("Please enter symbol"),
  coin_fee: yup.number().notRequired().default(0),
  usdt_fee: yup.number().notRequired().default(0),
  coin_min_trade: yup.number().positive('Coin minimum trade must be greater than 0').required("Please enter coin minimum trade limit").typeError("Please enter coin minimum trade limit"),
  usdt_min_trade: yup.number().positive('USDT minimum trade must be greater than 0').required("Please enter usdt minimum trade limit").typeError("Please enter usdt minimum trade limit"),
});

const FutureAddPair = (props: ActiveSession) => {
  const { mode } = useContext(Context);

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

  useEffect(()=>{
    setValue('coin_fee',0);
    setValue('usdt_fee',0);
  },[]);

  const setCurrency = (symbol: any, dropdown: number) => {
    if (dropdown === 1) {
      setValue("coin_id", symbol?.id);
      setValue("coin_symbol", symbol?.symbol);
      clearErrors("coin_id");
    } else {

      setValue("usdt_id", symbol?.id);
      setValue("usdt_symbol", symbol?.symbol);
      clearErrors("usdt_id");
    }
  };

  const onHandleSubmit = async (data: any) => {
    try {
      if (getValues("coin_id") === getValues("usdt_id")) {
        setError("usdt_id", { message: "Same tokens are not allowed" })
      }
      else {
        data.status = true;
        let res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/future/create`, {
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        });
        let result = await res.json();
        if (result?.status === 200) {
          toast.success(result.message);
          props.refreshPairList();
          setTimeout(() => {
            props?.setShow(false);
          }, 1000);
        }
        if (result?.status === 409) {
          toast.warning(result.message);
          setTimeout(() => {
            props?.setShow(false);
          }, 1000);
        }
      }
    } catch (error) {
      console.log("error in add future pair",error);
      
    }
   
  };

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[400px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
          {errors?.coin_id && (
            <p className="errorMessage">{errors?.coin_id?.message}</p>
          )}
        </div>

        <div className=" relative mb-20">
          <p className="sm-text mb-2">Select Coin</p>
          <FilterSelectMenuWithCoin
            data={props?.data}
            border={true}
            setCurrency={setCurrency}
            dropdown={2}
          />
          {errors?.usdt_id && (
            <p className="errorMessage">{errors?.usdt_id?.message}</p>
          )}
        </div>
        <div className=" relative mb-20">
          <p className="sm-text mb-2">Coin Fee</p>
          <input
            type="text"
            {...register("coin_fee")}
            name="coin_fee"
            placeholder="Please enter Coin fee"
            className="sm-text input-cta2 w-full"
          />
          {/* {errors?.coin_fee && (
            <p className="errorMessage">{errors?.coin_fee?.message}</p>
          )} */}
        </div>
        <div className=" relative mb-20">
          <p className="sm-text mb-2">USDT Fee</p>
          <input
            type="text"
            {...register("usdt_fee")}
            name="usdt_fee"
            placeholder="Please enter USDT fee"
            className="sm-text input-cta2 w-full"
          />
          {/* {errors?.usdt_fee && (
            <p className="errorMessage">{errors?.usdt_fee?.message}</p>
          )} */}
        </div>
        <div className=" relative mb-20">
          <p className="sm-text mb-2">Coin Minimum trade amount</p>
          <input
            type="text"
            {...register("coin_min_trade")}
            name="coin_min_trade"
            placeholder="Please enter coin minimum limit"
            className="sm-text input-cta2 w-full"
          />
          {errors?.coin_min_trade && (
            <p className="errorMessage">{errors?.coin_min_trade?.message}</p>
          )}
        </div>
        <div className=" relative mb-20">
          <p className="sm-text mb-2">USDT Minimum trade amount</p>
          <input
            type="text"
            {...register("usdt_min_trade")}
            name="usdt_min_trade"
            placeholder="Please enter USDt minimum limit"
            className="sm-text input-cta2 w-full"
          />
          {errors?.usdt_min_trade && (
            <p className="errorMessage">{errors?.usdt_min_trade?.message}</p>
          )}
        </div>
        <button className="solid-button w-full mt-30">Submit</button>
      </form>
    </div>
  );
};

export default FutureAddPair;
