import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import SelectDropdown from "../snippet/select-dropdown";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import clickOutSidePopupClose from "@/components/snippets/clickOutSidePopupClose";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  amount: yup.number().positive('Amount must be positive number').required('This field is required').typeError('This field is required'),
  token_id: yup.string().required('This field is required'),
});

interface showPopup {
  popupMode?: number;
  setPopupMode?: any;
  setOverlay?: any;
  overlay?: boolean;
  assets?: any;
  refreshWalletAssets?: any;
  wallet_type?: string
}
const TransferModal = (props: showPopup) => {
  const { status, data: session } = useSession();
  let { mode } = useContext(Context);
  const [coinList, setCoinList] = useState([]);
  const [Spot, setSpot] = useState("Spot");
  const [future, setFuture] = useState("Futures");
  const [userAsset, setUserAsset] = useState(Object);
  const [selectedCoin, setSelectedCoin] = useState("");
  // const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [coinDefaultValue, setCoinDefaultValue] = useState('Select Token')

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
    resolver: yupResolver(schema)
  });

  function setValues() {
    if (Spot == "Spot") {
      setFuture("Spot");
      setSpot("Futures");
    } else {
      setFuture("Futures");
      setSpot("Spot");
    }

    filterAsset(selectedCoin, Spot === "Spot" ? "Futures" : "Spot");
  }

  useEffect(() => {

    let coins: any = [];
    props?.assets?.filter((item: any) => {
      if (item?.walletTtype === props.wallet_type) {
        coins.push(
          item?.token !== null
            ? item?.token?.symbol
            : item?.global_token?.symbol
        );
      }
    });
    setCoinList(coins);

    if(props?.wallet_type==="future_wallet"){
      setFuture("Spot");
      setSpot("Futures");
    }

    setTimeout(() => {
      if (errors.amount) {
        clearErrors('amount')
      }
      if (errors.token_id) {
        clearErrors('token_id')
      }
    }, 3000);
  }, [props?.assets, errors,props?.wallet_type]);

  const filterAsset = (symbol: string, type: string) => {
    if (type == "Spot") {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        return item?.walletTtype === props.wallet_type && token?.symbol === symbol;
      });
      setUserAsset(asset[0]);
      setValue('token_id', asset[0]?.token_id);
      clearErrors('token_id')
    } else {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        return (
          item?.walletTtype === "future_wallet" && token?.symbol === symbol
        );
      });
      setUserAsset(asset[0]);
      setValue('token_id', asset[0]?.token_id);
      clearErrors('token_id')
    }

    setSelectedCoin(symbol);
  };

  const onHandleSubmit = async (data: any) => {
    try {

      if (data?.amount > userAsset?.balance) {
        setError("amount", {
          type: "custom",
          message: `Insufficiant balance`,
        });
        return;
      }

      let obj = {
        user_id: session?.user?.user_id,
        from: Spot === "Spot" ? "main_wallet" : "future_wallet",
        to: future === "Futures" ? "future_wallet" : "main_wallet",
        token_id: data?.token_id,
        balance: data?.amount,
      };

      setBtnDisabled(true);
      let assetReponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.user?.access_token,
          },
          body: JSON.stringify(obj),
        }
      ).then((response) => response.json());

      if (assetReponse?.data?.status === 200) {
        toast.success(assetReponse?.data.data.message, { autoClose: 2000 });
        setValue('amount', 0);
        setValue('token_id', '');
        setCoinDefaultValue('Select Token');
        setSelectedCoin('');
        setUserAsset(null);
        setTimeout(() => {
          props?.refreshWalletAssets && props?.refreshWalletAssets();
          props.setOverlay(false);
          props.setPopupMode(0);
          setBtnDisabled(false);
        }, 3000);

      } else {
        toast.error(assetReponse?.data?.data?.message !== undefined ? assetReponse?.data?.data?.message : assetReponse?.data?.data, { autoClose: 2000 });
        setTimeout(() => {
          setBtnDisabled(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error in transfer modal", error);
    }
  };

  const closePopup = () => {
    props.setOverlay(false);
    props.setPopupMode(0);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });



  return (
    <div ref={wrapperRef}
      className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[550px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${props.popupMode === 3
        ? "top-[50%] opacity-1 visible"
        : "top-[52%] opacity-0 invisible"
        } left-[50%] translate-x-[-50%] translate-y-[-50%]`}
    >
      <div className="flex items-center justify-between mb-[20px]">
        <p className="sec-title !text-[20px]">Transfer</p>
        <svg
          onClick={() => {
            props.setOverlay(false);
            props.setPopupMode(0);
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
      <div className="flex border-b dark:border-[#373d4e] border-[#e5e7eb] w-full">
        <div className="w-full max-w-[calc(100%-100px)]">
          <div className="flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]">
            <p className="top-label min-w-[80px] text-center">From</p>
            <p className="top-label dark:!text-white !text-black">{Spot}</p>
          </div>
          <div className="flex items-center gap-[20px] border dark:border-[#373d4e] border-[#e5e7eb] w-full py-[12px]">
            <p className="top-label min-w-[80px] text-center">To</p>
            <p className="top-label dark:!text-white !text-black">{future}</p>
          </div>
        </div>
        <div
          onClick={() => {
            setValues();
          }}
          className="dark:bg-[#373d4e] bg-[#e5ecf0] w-full flex h-[96px]  max-w-[100px] border dark:border-[#373d4e] border-[#e5e7eb] cursor-pointer "
        >
          <div className="rotate-[90deg]">
            <IconsComponent type="transferIcon" />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="flex items-center justify-between px-[12px] py-[12px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[25px] relative">
          <SelectDropdown
            list={coinList}
            defaultValue={coinDefaultValue}
            setCoinDefaultValue={setCoinDefaultValue}
            fullWidth={true}
            whiteColor={true}
            filterAsset={filterAsset}
            Spot={Spot}
            {...register('token_id')}
          />
        </div>
        {errors?.token_id && (
          <p style={{ color: "#ff0000d1" }}>{errors?.token_id?.message}</p>
        )}
        <div className="flex items-center bg-[#e5ecf0] dark:bg-[#373d4e] p-[11px] mt-[25px] rounded-[5px] dark:text-white text-black justify-between">
          <input
            type="number"
            step={0.000001}
            {...register('amount')}
            name="amount"
            className="outline-none  bg-[#e5ecf0] dark:bg-[#373d4e]"
            placeholder="0"
            onChange={(e: any) => {
              const value = e.target.value;
              if (/^\d*\.?\d{0,6}$/.test(value)) {
                setAmount(value);
              }
            }}
          />
          <p className="top-label dark:!text-primary cursor-pointer" onClick={() => setValue('amount', userAsset !== undefined && userAsset !== null ? userAsset?.balance?.toFixed(6) : 0)}>All</p>
        </div>
        {errors?.amount && (
          <p style={{ color: "#ff0000d1" }}>{errors?.amount?.message}</p>
        )}

        <p className="top-label !text-[16px] mt-[15px]">
          Available{" "}
          {userAsset !== undefined && userAsset !== null ? userAsset?.balance?.toFixed(6) : 0}{" "}
          {selectedCoin}
        </p>
        <button
          disabled={status === "unauthenticated" ? true : false || btnDisabled}
          className={`border bg-primary hover:bg-primary-800 text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[10.5px] px-[10px] w-full max-w-full mt-[15px] ${status === "unauthenticated" || btnDisabled === true
            ? "cursor-not-allowed opacity-50"
            : ""
            }`}
        >{btnDisabled &&
          <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
          </svg>
          }
          Transfer
        </button>
      </form>
    </div>
  );
};

export default TransferModal;
