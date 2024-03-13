import Image from "next/image";
import React, { useContext, useLayoutEffect, useState } from "react";
import Context from "../contexts/context";
import FiliterSelectMenu from "./filter-select-menu";
import { useQRCode } from 'next-qrcode';
import FilterSelectMenuWithCoin from "./filter-select-menu-with-coin";
import { toast, ToastContainer } from "react-toastify";

interface activeSection {
  setShow1: Function;
  networks: any;
  session: any;
  coinList?: any;
  token?: any;
}

const Deposit = (props: activeSection) => {

  const [address, setWalletAddress] = useState('');
  const [list, setNetworkList] = useState([]);
  const [depositToken, setDepositToken] = useState(props?.token);
  const { SVG } = useQRCode();

  useLayoutEffect(() => {
    filterNetworkListByCoin(props.token);
  }, []);

  const filterNetworkListByCoin = async (token: any) => {
    let networks: any = [];
    if (token) {
      for await (const nw of token?.networks) {
        for (const l of props?.networks) {
          if (nw.id === l.id) {
            if (process.env.NEXT_PUBLIC_APPLICATION_MODE === 'dev') {
              networks.push(l);
            }
            else {
              networks.push(l);
            }
          }
        }
      }
    }
    setDepositToken(token);
    setNetworkList(networks);
  }

  const { mode } = useContext(Context);

  const getAddress = async (network: any) => {
    try {
      let wallet = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/wallet?user_id=${props.session.user.user_id}&network=${network?.walletSupport}`, {
        method: "GET",
        headers: {
          "Authorization": props?.session?.user?.access_token
        },
      }).then(response => response.json());

      setWalletAddress(wallet.address);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[510px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
      <div className="flex items-center justify-between">
        <p className="sec-title">{depositToken?.symbol} Deposit Address</p>
        <svg
          onClick={() => {
            props.setShow1(0);
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
      {
        props?.coinList &&
        <div className="relative max-w-full  w-full mt-20">
          <FilterSelectMenuWithCoin
            data={props?.coinList}
            border={true}
            dropdown={1}
            filterNetworkListByCoin={filterNetworkListByCoin}
          />
        </div>
      }
      <div className="mt-20">
        <FiliterSelectMenu data={list} placeholder="Select Network type" auto={true} widthFull={true} onNetworkChange={getAddress} />
      </div>

      <div className="py-30 md:py-10">
        <div className="py-[10px]">
          <p className="info-14-18 text-center dark:text-white text-black">Scan QR code to Deposit</p>
          <div className="mt-[15px] max-w-[154px] rounded-5 shadow-card mx-auto">
            <SVG
              text={`${address !== '' ? address : 'Test Qr Code'}`}
              options={{
                width: 150,
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
              }}
            />
          </div>
        </div>
        <div className="pt-5 md:pt-30 ">
          <p className="nav-text-sm text-black dark:text-white pb-[15px] text-center">Disclaimer</p>
          <div className="h-[1px] w-full bg-grey-v-2 mb-[10px]"></div>
          <p className="info-12 text-center">Please deposit only {depositToken?.symbol} assets to this address. If you deposit any other coins, it will be lost forever.</p>
        </div>

        <div className="pt-5 md:pt-30">
          <p className="sm-text text-start md:text-center ">Destination</p>
          <div className="mt-[5px] md:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
            <p className="sec-text text-ellipsis overflow-hidden">{address}</p>
            <button className={`solid-button py-2 sec-text font-normal ${address === '' ? 'cursor-not-allowed' : 'cursor-pointer'} `}
              disabled={address === '' ? true : false} onClick={() => {
                // navigator.clipboard.writeText(address);
                const input = document.createElement('textarea')
                input.value = address
                document.body.appendChild(input)
                input.select()
                document.execCommand('copy')
                document.body.removeChild(input)
                toast.success('copy to clipboard')
              }}>Copy</button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-5 md:pt-30">
          <p className="nav-text-sm"> Minimum Deposit Amount</p>
          <p className="nav-text-sm"> {depositToken?.minimum_deposit}</p>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
