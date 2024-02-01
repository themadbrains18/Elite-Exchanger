import Context from "@/components/contexts/context";
import IconsComponent from "@/components/snippets/icons";
import React, { useContext, useEffect, useState } from "react";
import SelectDropdown from "../snippet/select-dropdown";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

interface showPopup {
  popupMode?: number;
  setPopupMode?: any;
  setOverlay?: any;
  overlay?: boolean;
  assets?: any;
  refreshWalletAssets?: any;
}
const TransferModal = (props: showPopup) => {
  const { status, data: session } = useSession();
  let { mode } = useContext(Context);
  const [coinList, setCoinList] = useState([]);
  const [Spot, setSpot] = useState("Spot");
  const [future, setFuture] = useState("Futures");
  const [userAsset, setUserAsset] = useState(Object);
  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState(0);

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
      if (item?.walletTtype === "main_wallet") {
        coins.push(
          item?.token !== null
            ? item?.token?.symbol
            : item?.global_token?.symbol
        );
      }
    });

    setCoinList(coins);
    filterAsset(selectedCoin, "Spot");
  }, [props?.assets]);

  const filterAsset = (symbol: string, type: string) => {
    if (type == "Spot") {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        return item?.walletTtype === "main_wallet" && token?.symbol === symbol;
      });
      setUserAsset(asset[0]);
    } else {
      let asset = props?.assets?.filter((item: any) => {
        let token = item?.token !== null ? item?.token : item?.global_token;
        return (
          item?.walletTtype === "future_wallet" && token?.symbol === symbol
        );
      });
      setUserAsset(asset[0]);
    }

    setSelectedCoin(symbol);
  };

  const transferToWallet = async () => {
    try {
        if (amount === 0 || amount < 0) {
          toast.error("Transfer amount must be positive number");
          return;
        }
  
        let obj = {
          user_id: session?.user?.user_id,
          from: Spot === "Spot" ? "main_wallet" : "future_wallet",
          to: future === "Futures" ? "future_wallet" : "main_wallet",
          token_id: userAsset?.token_id,
          balance: amount,
        };
  
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
          toast.success(assetReponse?.data.data.message);
          props?.refreshWalletAssets();
          props.setOverlay(false);
          props.setPopupMode(0);
          setAmount(0);
        } else {
        }
        toast.error(assetReponse?.data.data);
    } catch (error) {
        console.log("error in transfer modal",error);
        
    }
  };

  return (
    <div
      className={`max-w-[calc(100%-30px)] duration-300 md:max-w-[550px] w-full p-5 md:p-[32px] z-10 fixed rounded-10 bg-white dark:bg-[#292d38] ${
        props.popupMode === 3
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
          className="dark:bg-[#373d4e] bg-[#e5ecf0] w-full flex h-[96px] w-full max-w-[100px] border dark:border-[#373d4e] border-[#e5e7eb] cursor-pointer "
        >
          <div className="rotate-[90deg]">
            <IconsComponent type="transferIcon" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-[12px] py-[12px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer mt-[25px] relative">
        <SelectDropdown
          list={coinList}
          defaultValue="USDT"
          fullWidth={true}
          whiteColor={true}
          filterAsset={filterAsset}
          Spot={Spot}
        />
      </div>
      <div className="flex items-center bg-[#e5ecf0] dark:bg-[#373d4e] p-[11px] mt-[25px] rounded-[5px] dark:text-white text-black justify-between">
        <input
          type="number"
          value={amount}
          className="outline-none  bg-[#e5ecf0] dark:bg-[#373d4e]"
          placeholder="Minumun transfer limit 0.01 USDT"
          onChange={(e) => {
            setAmount(parseFloat(e.target.value));
            if (parseFloat(e.target.value) > userAsset?.balance) {
              setIsError(true);
            } else {
              setIsError(false);
            }
          }}
        />
        <p className="top-label dark:!text-primary cursor-pointer">All</p>
      </div>
      <p
        className={`top-label !text-[16px] mt-[15px] ${
          isError === true ? "visible" : "hidden"
        }`}
        style={{ color: "red" }}
      >
        Insufficiant Balance
      </p>
      <p className="top-label !text-[16px] mt-[15px]">
        Available{" "}
        {userAsset !== undefined && userAsset !== null ? userAsset?.balance?.toFixed(8) : 0}{" "}
        {selectedCoin}
      </p>
      <button
        disabled={status === "unauthenticated" ? true : false || isError}
        onClick={transferToWallet}
        className={`border bg-[#13c2c2] text-white dark:border-[#616161] border-[#e5e7eb] text-[14px] rounded-[4px] py-[10.5px] px-[10px] w-full max-w-full mt-[15px] ${
          isError === true || status === "unauthenticated"
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        Transfer
      </button>
    </div>
  );
};

export default TransferModal;
