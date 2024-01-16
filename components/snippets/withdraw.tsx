import React, { useContext, useState } from "react";
import Context from "../contexts/context";
import Image from "next/image";
import FiliterSelectMenu from "./filter-select-menu";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import ConfirmPopup from "@/pages/customer/profile/confirm-popup";
import Verification from "./verification";

const schema = yup.object().shape({
  networkId: yup.string().optional().default(""),
  withdraw_wallet: yup.string().required("This field is required"),
  amount: yup
    .number()
    .positive()
    .required("This field is required")
    .typeError("Enter value must be number and positive value"),
});

interface activeSection {
  setShow1: Function;
  networks: any;
  session: any;
  token: any;
  selectedCoinBalance: number;
  refreshData: any;
}

type UserSubmitForm = {
  networkId: string;
  withdraw_wallet: string;
  amount: number;
  user_id?: string;
  tokenID?: string;
  tokenName?: string;
  symbol?: string;
  fee?: string;
  status?: string;
  type?: string;
  username?: string;
  otp?: string;
  step?: number;

};
const Withdraw = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<UserSubmitForm | null>();
  const [enable, setEnable] = useState(1);

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(schema),
  });

  const list = props?.networks.filter((item: any) => {
    if (process.env.NEXT_PUBLIC_APPLICATION_MODE === "dev") {
      return item.network === "testnet";
    } else {
      return item.network === "mainnet";
    }
  });

  const getNetworkDetail = (network: any) => {
    setSelectedNetwork(network?.id);
    clearErrors("networkId");
  };

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {

      if (selectedNetwork === "") {
        setError("networkId", {
          type: "custom",
          message: "Please select network",
        });
      } else {
        data.networkId = selectedNetwork;
        clearErrors("networkId");
      }
      if (data.amount > props.selectedCoinBalance) {
        setError("amount", {
          type: "custom",
          message: "Insufficient balance.",
        });
        return;
      }

      if(data?.amount <= props?.token?.withdraw_fee){
        setError("amount", {
          type: "custom",
          message: "Please enter amount more than your transaction fee.",
        });
        return;
      }

      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number;

      data.username = username;
      data.user_id = props.session?.user?.user_id;
      data.tokenID = props.token?.id;
      data.tokenName = props.token?.fullName;
      data.symbol = props.token?.symbol;
      data.fee = props?.token?.withdraw_fee.toString();
      data.status = "pending";
      data.type = "global";
      data.otp = "string";
      data.step = 1;

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(
          JSON.stringify(data),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/withdraw`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": props?.session?.user?.access_token
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());

        if (response?.data?.status === 200) {
          toast.success(response?.data?.data);

          setTimeout(() => {
            setFormData(data);
            setEnable(2);
          }, 1000);
        }
        else {
          toast.error(response?.data?.data);
          if (response?.data?.data === 'Unuthorized User') {
          }
        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }

    } catch (error) {
      console.log(error);
    }
  };

  const snedOtpToUser = async () => {
    try {
      let username = props.session?.user.email !== 'null' ? props.session?.user.email : props.session?.user?.number

      let obj = {
        username: username,
        withdraw_wallet: formData?.withdraw_wallet,
        networkId: formData?.networkId,
        user_id: formData?.user_id,
        tokenID: formData?.tokenID,
        tokenName: formData?.tokenName,
        symbol: formData?.symbol,
        fee: formData?.fee,
        status: formData?.status,
        type: formData?.type,
        amount: formData?.amount,
        otp: "string",
        step: 2
      }

      if (status === 'authenticated') {
        const ciphertext = AES.encrypt(
          JSON.stringify(obj),
          `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
        );
        let record = encodeURIComponent(ciphertext.toString());
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/withdraw`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": props?.session?.user?.access_token
            },
            body: JSON.stringify(record),
          }
        ).then((response) => response.json());

        if (response?.data?.status === 200) {
          toast.success(response?.data?.data)
          setTimeout(() => {
            setEnable(3);
          }, 1000)
        }
      }
      else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }
    } catch (error) {

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        props.session?.user.email !== "null"
          ? props.session?.user.email
          : props.session?.user?.number;

      let request = {
        username: username,
        withdraw_wallet: formData?.withdraw_wallet,
        networkId: formData?.networkId,
        user_id: formData?.user_id,
        tokenID: formData?.tokenID,
        tokenName: formData?.tokenName,
        symbol: formData?.symbol,
        fee: formData?.fee,
        status: formData?.status,
        type: formData?.type,
        amount: formData?.amount,
        otp: otp,
        step: 3
      }
      const ciphertext = AES.encrypt(
        JSON.stringify(request),
        `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`
      );
      let record = encodeURIComponent(ciphertext.toString());
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": props?.session?.user?.access_token
          },
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());

      if (response.data.status === 200) {
        toast.success("Withdraw request sent successfully");
        const websocket = new WebSocket('ws://localhost:3001/');
        let withdraw = {
          ws_type: 'user_withdraw',
          user_id: props?.session?.user?.user_id,
          type: 'withdraw',
          message: {
            message: `You've successfully withdrawn ${response?.data?.data?.amount} ${response?.data?.data?.symbol} from your account. 
          Your withdrawal address: ${response?.data?.data?.withdraw_wallet}  
          Token: ${response?.data?.data?.symbol}`
          },
          data: response?.data?.data
        }
        websocket.onopen = () => {
          websocket.send(JSON.stringify(withdraw));
        }
        setTimeout(() => {
          reset();
          props.setShow1(false);
          props.refreshData();
        }, 3000);

      } else {
        toast.error(response.data.data);
      }
    } catch (error) {

    }
  }

  return (
    <>
      <ToastContainer position="top-right" />
      {enable === 1 && (
        <div className="max-h-[614px] lg:max-h-fit overflow-y-auto max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex items-center justify-between pb-[10px] md:pb-[15px] border-b border-grey-v-2 dark:border-opacity-[15%] dark:border-beta">
            <p className="sec-title">Withdraw Coin From Wallet to Another</p>
            <svg
              onClick={() => {
                props.setShow1(false);
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
                fill={mode === "dark" ? "#fff" : "#000"}
                d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                          c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                          l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                          C61.42,57.647,61.42,54.687,59.595,52.861z"
              />
            </svg>
          </div>
          <form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="py-30 md:py-10">
              <div className="mb-[15px] md:mb-5">
                <label className="sm-text ">Select Coin</label>
                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex justify-between rounded-5 p-[11px] md:p-[15px]">
                  <div className="flex gap-2 ">
                    <Image
                      src="/assets/history/coin.svg"
                      width={25}
                      height={25}
                      alt="coins"
                    />
                    <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-1">
                      <p className="info-14-18 dark:text-white">
                        {props?.token?.fullName}
                      </p>
                      <p className="info-12 !text-primary py-0 md:py-[2px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">
                        {props?.token?.symbol}
                      </p>
                    </div>
                  </div>
                  <p className="sm-text">Available ${props.selectedCoinBalance}</p>
                </div>
                <p className="mt-[10px] text-end sm-text">Transfer Network</p>
              </div>
              <div className="my-20">
                <label className="sm-text mb-[10px] block">Network</label>
                <FiliterSelectMenu
                  data={list}
                  placeholder="Select Network type"
                  auto={false}
                  widthFull={true}
                  onNetworkChange={getNetworkDetail}
                />
                {errors.networkId && (
                  <p style={{ color: "red" }}>{errors.networkId.message}</p>
                )}
              </div>

              <div className="mb-[15px] md:mb-5">
                <label className="sm-text ">Destination Address</label>
                <div className="border border-grey-v-1 dark:border-opacity-[15%] mt-[10px]  gap-[15px] items-center flex rounded-5 p-[11px] md:p-[15px]">
                  <input
                    type="text"
                    {...register("withdraw_wallet")}
                    name="withdraw_wallet"
                    placeholder="Enter Address"
                    className="outline-none max-w-[355px] sm-text w-full bg-[transparent]"
                  />
                  <Image
                    src="/assets/payment/reenter.svg"
                    width={24}
                    height={24}
                    alt="reenter"
                  />
                </div>
                {errors.withdraw_wallet && (
                  <p style={{ color: "red" }}>{errors.withdraw_wallet.message}</p>
                )}
                <p className="mt-[10px] text-end text-buy sm-text">
                  Valid Address
                </p>
              </div>
              <div className="">
                <label className="sm-text ">Amount</label>
                <div className="border border-grey-v-1 dark:border-opacity-[15%]  rounded-5 p-[11px] md:p-[15px]">
                  <input
                    type="text"
                    {...register("amount")}
                    name="amount"
                    placeholder="Enter Amount"
                    className="outline-none sm-text w-full bg-[transparent]"
                  />
                </div>
                {errors.amount && (
                  <p style={{ color: "red" }}>{errors.amount.message}</p>
                )}
                <p className="mt-[10px] text-end sm-text">
                  Transaction Fee {props?.token?.withdraw_fee} {props?.token?.symbol}
                </p>
                {/* {getValues('amount') > 0 &&
                  <p className="mt-[10px] text-end sm-text">
                    You received {getValues('amount') - props?.token?.withdraw_fee} {props?.token?.symbol}
                  </p>
                } */}

              </div>
            </div>
            <button type="submit" className="solid-button w-full">
              Proceed Withdrawal
            </button>
          </form>

          <div className="pt-30 md:pt-10">
            <p className="nav-text-sm text-black dark:text-white mb-[10px]">
              Disclaimer
            </p>
            <div className="h-[1px] w-full bg-grey-v-2 mb-[10px]"></div>
            <p className="info-10-14">
              Please cross-check the destination address. Withdrawals to Smart
              Contract Addresses, payments or participation in ICOs/Airdrops are
              not supported and will be lost forever. Withdrawal requests cannot
              be cancelled after submission.
            </p>
          </div>
        </div>
      )}

      {enable === 2 && (
        <ConfirmPopup
          setEnable={setEnable}
          type="number"
          data={formData}
          session={props?.session}
          snedOtpToUser={snedOtpToUser}
        />
      )}

      {enable === 3 && (
        <Verification
          setEnable={setEnable}
          type="number"
          data={formData}
          session={props?.session}
          finalOtpVerification={finalOtpVerification}
        />
      )}

    </>
  );
};

export default Withdraw;
