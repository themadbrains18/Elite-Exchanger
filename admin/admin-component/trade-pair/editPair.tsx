import FilterSelectMenuWithCoin from '@/components/snippets/filter-select-menu-with-coin';
import React, { useContext, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Context from '@/components/contexts/context';
import { AES } from 'crypto-js';
import { useSession } from 'next-auth/react';

interface ActiveSession {
  editPair: any;
  data: any;
  setEditShow: Function;
  refreshPairList: any;
  session?:any
}

type PairSubmitForm = {
  tokenOne: string;
  tokenTwo: string;
  symbolOne: string;
  symbolTwo: string;
  maker: number;
  taker: number;
  min_trade: number;
};

const schema = yup.object().shape({
  tokenOne: yup.string().required("Please enter symbol."),
  tokenTwo: yup.string().required("Please enter symbol."),
  symbolOne: yup.string().required("Please enter symbol."),
  symbolTwo: yup.string().required("Please enter symbol."),
  maker: yup.number().notRequired(),
  taker: yup.number().notRequired(),
  min_trade: yup.number().positive("Minimum Trade must be greater than '0'.").required("Please enter symbol."),
});


const EditPair = (props: ActiveSession) => {
  const { mode } = useContext(Context);
  const {data:session} = useSession()
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

  useEffect(() => {
    setValue("tokenOne", props?.editPair?.tokenOne);
    setValue("tokenTwo", props?.editPair?.tokenTwo);
    setValue("symbolOne", props?.editPair?.symbolOne);
    setValue("symbolTwo", props?.editPair?.symbolTwo);
    setValue("maker",props?.editPair?.maker);
    setValue("taker",props?.editPair?.taker);
    setValue("min_trade",props?.editPair?.min_trade);
  }, [])


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
    // console.log(data);
    try {
      if (getValues("tokenOne") === getValues("tokenTwo")) {
        setError("tokenTwo", { message: "Same tokens are not allowed." })
      }
      else {
        data.id = props?.editPair?.id
        data.status = props?.editPair?.status == 0 ? false : true;
        const ciphertext = AES.encrypt(
          JSON.stringify(data),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let res = await fetch(`/api/pair/edit`, {
          headers: {
            "Content-type": "application/json",
            "Authorization": session?.user?.access_token
          },
          method: "POST",
          body: JSON.stringify(record),
        });
        let result = await res.json();
        // console.log(result);
        if (result?.data?.status === 200) {
          toast.success("Pair update successfully.");
          setTimeout(() => {
            props?.setEditShow(false);
            props.refreshPairList();
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error,"error in edit pair");
      
    }

   

  }

  return (
    <div className="max-w-[calc(100%-30px)] md:max-w-[500px] max-h-[400px] h-full overflow-y-auto  w-full p-5 md:px-30 md:py-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="flex items-center justify-between ">
        <p className="sec-title">Edit Pair Form</p>
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
      <form className="pt-30" onSubmit={handleSubmit(onHandleSubmit)}>
        <div className=" relative mb-20">
          <p className="sm-text mb-2">Select Coin</p>
          <FilterSelectMenuWithCoin
            data={props?.data}
            border={true}
            setCurrency={setCurrency}
            dropdown={1}
            value={props?.editPair?.symbolOne}
          />
          {errors?.tokenOne && (
            <p className="errorMessage">{errors?.tokenOne?.message}</p>
          )}
        </div>

        <div className=" relative ">
          <p className="sm-text mb-2">Select Coin</p>
          <FilterSelectMenuWithCoin
            data={props?.data}
            border={true}
            setCurrency={setCurrency}
            dropdown={2}
            value={props?.editPair?.symbolTwo}
          />
          {errors?.tokenTwo && (
            <p className="errorMessage">{errors?.tokenTwo?.message}</p>
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
            <p className="errorMessage">{errors?.maker?.message}</p>
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
            <p className="errorMessage">{errors?.taker?.message}</p>
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
            <p className="errorMessage">{errors?.min_trade?.message}</p>
          )}
        </div>
        <button className="solid-button w-full mt-30">Submit</button>
      </form>
    </div>
  )
}

export default EditPair