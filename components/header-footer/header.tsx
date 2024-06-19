import Image from "next/image";
import React, { use, useContext, useEffect, useState } from "react";
import HeaderLogo from "../svg-snippets/headerLogo";
import Link from "next/link";
import TradeIcon from "../svg-snippets/trade-icon";
import { Wallet } from "../svg-snippets/wallet-icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Context from "../contexts/context";
import ResponsiveSidebar from "./responsive-sidebar";

import { useRouter } from "next/router";
import SideBar from "../snippets/sideBar";
import { useSession } from "next-auth/react";
import IconsComponent from "../snippets/icons";
import Notification from "../snippets/notification";
import { useWebSocket } from "@/libs/WebSocketContext";

interface propsData {
  session: any;
}

const Header = (props: propsData) => {
  let { mode } = useContext(Context);
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<any>(null);
  const [notificationData, setNotificationData] = useState([]);
  const [spotTrade, SetSpotTrade] = useState([]);
  const [futureTrade, SetFutureTrade] = useState([]);
  const { status, data: session } = useSession();
  let [showMenu, setShowMenu] = useState(false);

  const [duserName, setduserName] = useState('');

  const linkList = [
    {
      name: "Buy Crypto",
      url: "/p2p/buy",
    },
    {
      name: "Market",
      url: "/market",
    },
    // {
    //   name: "WatchList",
    //   url: "/watchlist",
    // },
    {
      name: "Trades",
      url: "#",
      dropdown: true
    },
    {
      name: "Derivatives",
      url: "#",
      dropdown: true
    },
  ];

  const wbsocket = useWebSocket();

  useEffect(() => {
    socket();
  }, [wbsocket]);

  useEffect(() => {
    if (session !== undefined && session?.user !== undefined) {
      getUserBasicDetail();
      getUserNotification();
    }
    getTokenList();
  }, [session]);

  const socket = () => {
    if (wbsocket) {
      wbsocket.onmessage = (event) => {
        const data = JSON.parse(event.data).data;
        let eventDataType = JSON.parse(event.data).type;
        if (eventDataType === "user_notify") {
          getUserNotification();
        }
        if (eventDataType === "profile") {
          if (data?.user_id === session?.user?.user_id) {
            setUserDetail(data);
            if (data && data?.dName !== null) {
              setduserName(data?.dName);
            }
            else if (session?.user?.email !== null && session?.user?.email !== "") {
              let str = session?.user?.email.split('@');
              let substring = str[0].substring(0, 3);
              setduserName(substring + '****@' + str[1])
            }
            else if (session?.user?.number !== null && session?.user?.number !== "") {
              setduserName(session?.user?.number)
            }
          }
        }
      };
    }
  };

  const getUserNotification = async () => {
    let profileDashboard = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/notification?userid=${session?.user?.user_id}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token || ""
      },
    }).then(response => response.json());

    if (profileDashboard && profileDashboard?.data !== null) {
      let data = profileDashboard?.data?.filter((item: any) => {
        return item?.status === 0 || item?.status === false
      })
      setNotificationData(data)
    }
  }

  const getUserBasicDetail = async () => {
    let profileDashboard = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/profile/dashboard?userid=${session?.user?.user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: session?.user?.access_token || "",
        },
      }
    ).then((response) => response.json());

    if (profileDashboard) {
      setUserDetail(profileDashboard?.data);

      if (profileDashboard?.data && profileDashboard?.data?.dName !== null) {
        setduserName(profileDashboard?.data?.dName);
      }
      else if (session?.user?.email !== null && session?.user?.email !== "") {
        let str = session?.user?.email.split('@');
        let substring = str[0].substring(0, 3);
        setduserName(substring + '****@' + str[1])
      }
      else if (session?.user?.number !== null && session?.user?.number !== "") {
        setduserName(session?.user?.number)
      }
    }
  };

  const getTokenList = async () => {
    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
      method: "GET"
    }).then(response => response.json());
    // console.log(tokenList,"==hfjdhjfhdjfj");

    let spot = tokenList?.data?.filter((item: any) => {
      return item.tradepair !== null
    });

    SetSpotTrade(spot);

    let future = tokenList?.data?.filter((item: any) => {
      return item.futuretradepair !== null
    });
    // console.log(future,"===dshkjhd");

    SetFutureTrade(future);
  }

  return (
    <>
      {/* <ToastContainer limit={1} /> */}
      <header
        className={`${router?.pathname?.includes('/future/') ? 'py-[10px]' : 'py-[30px]'} z-[6] dark:bg-omega bg-white z-9 xl:rounded-none dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0 w-full rounded-b-[20px] border-b-0 md:border-b dark:border-[#25262a] border-[#e5e7eb]`}
      >
        <div className={`container ${router?.pathname?.includes('/future/') && '!max-w-full'}`}>
          {/* this is for desktop */}
          <div className="hidden lg:grid header-wrapper items-center justify-between">
            <div className={`flex items-center`}>
              <div className="pr-[20px] border-r border-delta">
                <Link href="/" className="min-w-[183px]">
                  <HeaderLogo />
                </Link>
              </div>

              <nav className="pl-[20px]">
                <ul className="flex items-center gap-[24px] xl:gap-[40px]">
                  {linkList.map((elem, index) => {
                    return (

                      <li key={index + elem?.name} className="relative group hover:pb-[20px] hover:mb-[-20px] ">
                        <Link
                          data-testid={elem?.name}
                          href={elem?.url}
                          className="md-text flex items-center gap-[5px] dark:text-d-nav-primary text-nav-primary whitespace-nowrap group-hover:!text-primary"
                        >
                          <span>{elem?.name}</span>
                          {
                            elem?.dropdown &&
                            <IconsComponent type="downArrow" chartPage={true} />
                          }
                        </Link>

                        {elem?.dropdown && elem?.name == 'Trades' &&
                          <div data-testid="trades-dropdown" className="absolute group-hover:top-[45px] top-[50px] opacity-0 invisible group-hover:!opacity-[1] group-hover:!visible duration-300 left-0 min-w-[300px] rounded-[12px] dark:bg-omega bg-white p-[15px] border dark:border-[#25262a] border-[#e5e7eb]">
                            <ul>
                              {spotTrade?.map((item: any, nesIndex: any) => {
                                return (
                                  <li key={nesIndex + Date.now()} className="mb-[10px]">
                                    {/* onClick={() => router.push({
                                        pathname: `/chart/${item?.tradepair?.symbolOne}`
                                      })} */}
                                    <Link href={`/chart/${item?.tradepair?.symbolOne}`}>
                                      <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full cursor-pointer" onClick={() => { router?.push(`/chart/${item?.tradepair?.symbolOne}`) }}>
                                        <Image src={`${item.image}`} width={30} height={30} alt="coins" className="min-w-[30px]" />
                                        <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                          <p className="info-14-18 dark:text-white">{item?.tradepair?.symbolOne}/{item?.tradepair?.symbolTwo}</p>
                                          <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.tradepair?.symbolOne}{item?.tradepair?.symbolTwo}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>

                          </div>
                        }
                        {elem?.dropdown && elem?.name == 'Derivatives' &&
                          <div className="absolute group-hover:top-[45px] top-[50px] opacity-0 invisible group-hover:!opacity-[1] group-hover:!visible duration-300 left-0 min-w-[300px] rounded-[12px] dark:bg-omega bg-white p-[15px] border dark:border-[#25262a] border-[#e5e7eb]">
                            <ul>
                              {futureTrade?.map((item: any, nesIndex: any) => {
                                let symbol = item?.futuretradepair?.coin_symbol === 'BTCB' ? 'BTC' : item?.futuretradepair?.coin_symbol === 'BNBT' ? 'BNB' : item?.futuretradepair?.coin_symbol
                                return (
                                  <li key={nesIndex + Date.now()} className="mb-[10px]">
                                    <Link href={`/future/${symbol}${item?.futuretradepair?.usdt_symbol}`}>
                                      <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                                        <Image src={`${item?.image}`} width={30} height={30} alt="coins" className="min-w-[30px]" />
                                        <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                          <p className="info-14-18 dark:text-white">{symbol}{item?.futuretradepair?.usdt_symbol}</p>
                                          <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.futuretradepair?.coin_symbol}{item?.futuretradepair?.usdt_symbol}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>

                          </div>
                        }
                      </li>
                    );
                  })}
                </ul>
              </nav>

            </div>
            <div className="w-full ">
              {/* if user not logged in */}

              {props.session === null || props.session === undefined ? (
                <div className="flex items-center gap-[30px] justify-end">
                  <Link
                    className="nav-text-lg text-[18px] !text-primary whitespace-nowrap dark:hover:!text-white hover:!text-black"
                    href="/login"
                  >
                    Sign In
                  </Link>
                  <Link
                    className={`solid-button !max-w-[161px] w-full text-center ${router?.pathname?.includes('/future/') && '!py-[12px]'}`}
                    href="/register"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-[24px] xl:gap-[30px] justify-end">
                  <Link
                    data-testid="trade-history"
                    className={`solid-button flex !bg-grey items-center group gap-[10px] dark:!bg-black-v-1  border dark:border-black-v-1 !text-nav-secondary hover:!border-primary  ${router?.pathname?.includes('/future/') && '!py-[12px]'}`}
                    href="/history"
                  >
                    <TradeIcon hover={true} />
                    <span className="group-hover:text-primary hidden xl:block">
                      Trade History
                    </span>
                  </Link>
                  <Link
                    data-testid="wallet"
                    className={`solid-button flex !bg-grey group items-center gap-[10px] dark:!bg-black-v-1 !text-nav-secondary border dark:border-black-v-1 hover:!border-primary  ${router?.pathname?.includes('/future/') && '!py-[12px]'}`}
                    href="/wallet"
                  >
                    <Wallet hover={true} />
                    <span className="group-hover:text-primary hidden xl:block">
                      Wallet
                    </span>
                  </Link>
                  <div className="profile-wrapper hover:pb-[32px] hover:mb-[-32px] relative">
                    <div className="flex items-center gap-[12px] cursor-pointer" >
                      <div data-testid="user-icon">
                        <Image
                          src={
                            userDetail === null || userDetail?.messgae !== undefined || userDetail?.image === null
                              ? `${process.env.NEXT_PUBLIC_AVATAR_PROFILE}`
                              :
                              userDetail?.image
                          }
                          alt="error"

                          width={32}
                          height={32}
                          className="rounded-full w-[40px] h-[40px] object-cover object-top"
                        />
                      </div>
                      <div>
                        <p id="username" data-testid="username" className="nav-text-lg !text-gamma hidden xl:block">
                          {userDetail !== null && duserName}
                        </p>
                        {props.session?.user?.kyc === 'approve' &&
                          <div className="flex justify-start text-center items-center gap-[3px]">
                            <IconsComponent type="kycComplete" hover={false} active={false} width={14} height={14} />
                            <p className="top-label !text-gamma hidden xl:block">Verified</p>
                          </div>

                        }
                        {props.session?.user?.kyc !== 'approve' &&
                          <div className="flex justify-start text-center items-center gap-[3px]" >
                            <IconsComponent type="kychold" hover={false} active={false} width={14} height={14} />
                            <p className="top-label !text-gamma hidden xl:block">Unverified</p>
                          </div>

                        }
                      </div>

                      <svg
                        className="hidden xl:block duration-300 arrow"
                        width={11}
                        height={7}
                        viewBox="0 0 11 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.40565 0.698781C1.04222 0.395349 0.502214 0.445064 0.198782 0.808497C-0.104651 1.17193 -0.0549358 1.71279 0.308498 2.01537L4.59427 6.30114C4.63455 6.33543 4.68255 6.35171 4.72713 6.37743C4.76227 6.398 4.79313 6.422 4.8317 6.43743C4.93199 6.47686 5.03656 6.5 5.14285 6.5C5.24913 6.5 5.35371 6.47686 5.45399 6.43743C5.49257 6.422 5.52342 6.398 5.55857 6.37743C5.60314 6.35171 5.65114 6.33543 5.69142 6.30114L9.97719 2.01537C10.3415 1.71279 10.3903 1.17193 10.0869 0.808497C9.78434 0.445064 9.24433 0.395349 8.88004 0.698781L6 3.81282L5.14292 4.6699L4.28377 3.81074L1.40565 0.698781Z"
                          fill="#9295A6"
                        />
                      </svg>


                    </div>
                    <div className="absolute top-[96px] opacity-0 invisible duration-300  right-[0px] hover:block dropdown_wrapper">
                      <SideBar profileSec={false} />
                    </div>
                  </div>
                  <div className="profile-wrapper hover:pb-[32px] hover:mb-[-32px] relative">
                    <div className="flex items-center gap-[12px] cursor-pointer">
                      <div data-testid="notification-icon" className="relative notification-icon" onClick={() => router?.push('/notification')}>
                        <IconsComponent
                          type="bell"
                          hover={false}
                          active={false}
                        />
                      </div>

                      <span className="w-20 h-20 text-center bg-primary-400 rounded-full absolute top-[-10px]  right-[-10px]">
                        <span data-testid="notification-count" className="nav-text-lg !text-white hidden xl:block mt-[-2px]">
                          {notificationData?.length}
                        </span>
                      </span>
                    </div>

                    {notificationData?.length > 0 &&
                      <div data-testid="notification-panel" className="absolute top-[96px] opacity-0 invisible duration-300  right-[0px] hover:block dropdown_wrapper notification-panel" >
                        <Notification notificationData={notificationData} getUserNotification={getUserNotification} />
                      </div>
                    }

                  </div>
                </div>
              )}
              {/* if user logged in */}
            </div>
          </div>
          {/* this is for mobile */}
          <div className="lg:hidden z-[9]">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/">
                  <HeaderLogo />
                </Link>
              </div>
              {showMenu === true ? (
                <div
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  <svg
                    width={16}
                    height={15}
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.73034 7.50031L15.0966 2.13406C15.5853 1.64531 15.5853 0.855312 15.0966 0.366562C14.6078 -0.122188 13.8178 -0.122188 13.3291 0.366562L7.96284 5.73281L2.59659 0.366562C2.10784 -0.122188 1.31784 -0.122188 0.829087 0.366562C0.340337 0.855312 0.340337 1.64531 0.829087 2.13406L6.19534 7.50031L0.829087 12.8666C0.340337 13.3553 0.340337 14.1453 0.829087 14.6341C1.07284 14.8778 1.39284 15.0003 1.71284 15.0003C2.03284 15.0003 2.35284 14.8778 2.59659 14.6341L7.96284 9.26781L13.3291 14.6341C13.5728 14.8778 13.8928 15.0003 14.2128 15.0003C14.5328 15.0003 14.8528 14.8778 15.0966 14.6341C15.5853 14.1453 15.5853 13.3553 15.0966 12.8666L9.73034 7.50031Z"
                      fill={mode == "dark" ? "white" : "#2B3144"}
                    />
                  </svg>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setShowMenu(true);
                  }}
                >
                  <svg
                    width={20}
                    height={14}
                    viewBox="0 0 20 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19 2C19.5523 2 20 1.55228 20 1C20 0.447715 19.5523 0 19 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H19ZM19 4C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H7C6.44772 6 6 5.55228 6 5C6 4.44772 6.44772 4 7 4H19ZM19 10C19.5523 10 20 9.55229 20 9C20 8.44771 19.5523 8 19 8H1C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10H19ZM19 14C19.5523 14 20 13.5523 20 13C20 12.4477 19.5523 12 19 12H7C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14H19Z"
                      className={`${mode == "dark" ? "fill-white" : "fill-[#2B3144]"
                        }`}
                      fill={mode == "dark" ? "white" : "#2B3144"}
                    />
                  </svg>
                </div>
              )}
            </div>
            <ResponsiveSidebar
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              session={props.session}
              userDetail={userDetail}
              spotTrade={spotTrade}
              futureTrade={futureTrade}
            />
          </div>
        </div>
      </header >
    </>
  );
};

export default Header;
