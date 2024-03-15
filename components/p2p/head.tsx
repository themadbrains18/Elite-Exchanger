import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import BuySellExpress from "./express/buySellExpress";
import AuthenticationModelPopup from "../snippets/authenticationPopup";

const Head = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  // const [active, setActive] = useState(1);

  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  // console.log(session?.user,'p2p head ',status);

  let autherizedTabs = [
    {
      linkText: "Buy",
      linkUrl: "/p2p/buy",
    },
    // {
    //   linkText: "Sell",
    //   linkUrl: "/p2p/postad",
    // },

    {
      linkText: "User Center",
      linkUrl: "/p2p/user-center",
    },
    {
      linkText: "My Order",
      linkUrl: "/p2p/my-orders",
    },
    {
      linkText: "My Advertisement",
      linkUrl: "/p2p/my-advertisement",
    },
    {
      linkText: "Post Advertisement",
      linkUrl: "/p2p/postad",
    },
  ];
  const tabsLinks = [
    {
      linkText: "Buy",
      linkUrl: "/p2p/buy",
    },
    // {
    //   linkText: "Sell",
    //   linkUrl: "/p2p/sell",
    // },
    // {
    //   linkText:"FAQ",
    //   linkUrl:"/p2p/faq"
    // }
  ];

  return (
    <>
      {/* top heading and brief */}
      <div className="flex items-center justify-between">
        <div>
          <Link href='/p2p/buy'
            className={`${!router.pathname.includes('/p2p/express')
              ? "bg-primary !text-white"
              : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
              } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
          >
            P2P Process
          </Link>
          <Link href='/p2p/express'
            className={`${router.pathname.includes('/p2p/express')
              ? "bg-primary !text-white"
              : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
              } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
          >
            {" "}
            Express
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto links_wrapper">
        {
          !router.pathname.includes('/p2p/express') &&
          <div className="flex items-center gap-[10px] md:gap-30 mt-20 md:mt-30 w-max">
            {status === "authenticated" &&
              autherizedTabs.map((elem, ind) => {
                return (
                  <Fragment key={ind}>
                    <button onClick={()=>{
                      if(elem.linkUrl!=='/p2p/postad'){
                        router.push(elem.linkUrl)
                      }
                      else{
                        if(session?.user?.kyc !== 'approve' || session?.user?.TwoFA === false || (session?.user?.tradingPassword === '' || session?.user?.tradingPassword === null) || (session?.user?.email === '' || session?.user?.email === null)) {
                          setShow(true);
                          setActive(true);
                        }
                        else{
                          router.push(elem.linkUrl)
                        }
                      }
                    }}
                      // href={`${elem.linkUrl}`}
                      className={`${router.pathname.includes(elem.linkUrl)
                        ? "bg-primary !text-white"
                        : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
                        } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
                    >
                      {elem.linkText}
                    </button>
                  </Fragment>
                );
              })
            }
            {status !== "authenticated" &&
              tabsLinks.map((elem, ind) => {
                return (
                  <Fragment key={ind}>
                    <Link
                      href={`${elem.linkUrl}`}
                      className={`${router.pathname.includes(elem.linkUrl)
                        ? "bg-primary !text-white"
                        : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
                        } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
                    >
                      {elem.linkText}
                    </Link>
                  </Fragment>
                );
              })
            }
          </div>
        }
      </div>
      {show &&
          <AuthenticationModelPopup title='Confirmation' message='Please complete your kyc' setShow={setShow} setActive={setActive} show={show} />
      }
    </>
  );
};

export default Head;
