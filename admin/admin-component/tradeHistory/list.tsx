import AdminIcons from "@/admin/admin-snippet/admin-icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface allData {
  marketOrders: any;
}

function formatDate(date: Date) {
  const options: {} = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

const List = (props: allData) => {
  const [active, setActive] = useState(1);
  const [openOrders, setOpenOrders] = useState([]);
  const [spotOrders, setSpotOrders] = useState([]);

  useEffect(() => {

    let openList:any=[]
    let spotList:any=[]
    props?.marketOrders.map((item:any)=>{
        if(item?.status=== true){
            spotList?.push(item)
        }
        else if(item?.status=== false && item?.isCanceled===false){
            openList.push(item)
            
        }
    })
    setSpotOrders(spotList)
    setOpenOrders(openList)
  }, []);

  

  return (
    <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex items-center justify-between  mb-[26px]">
        <div className="flex items-center gap-[15px]">
          <button
            className={`${
              active === 1 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(1);
            }}
          >
            Trade History
          </button>
          <button
            className={`${
              active === 2 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(2);
            }}
          >
            Spot orders
          </button>
          <button
            className={`${
              active === 3 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(3);
            }}
          >
            Open Orders
          </button>
        </div>
        <div className="flex items-center gap-10">
          <p className="admin-table-data">
            <span className="dark:text-[#ffffffb3]">1&nbsp;</span>Item selected
          </p>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="download" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="deleteIcon" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="SearchIcon" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="settings" hover={false} active={false} />
          </div>
        </div>
      </div>
      {active === 1 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                              relative
                              
                              after:w-20
                              after:h-20
                              after:border-[2px]
                              after:border-[#B5B5C3]
                              after:rounded-[4px]
                              after:block
    
                              before:w-[12px]
                              before:h-[6px]
                              before:border-l-[2px]
                              before:border-b-[2px]
                              border:dark:border-[#212121]
                              border:border-[#fff]
                              before:absolute
                              before:left-[4px]
                              before:top-[6px]
                              before:rotate-[-45deg]
                              before:hidden
                            "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Order Id
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Coin</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Order Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>Price</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Amount
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Total Quantity
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {props?.marketOrders !== null &&
                props?.marketOrders?.length > 0 &&
                props?.marketOrders?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                              relative
                              
                              after:w-20
                              after:h-20
                              after:border-[2px]
                              after:border-[#B5B5C3]
                              after:rounded-[4px]
                              after:block
    
                              before:w-[12px]
                              before:h-[6px]
                              before:border-l-[2px]
                              before:border-b-[2px]
                              border:dark:border-[#212121]
                              border:border-[#fff]
                              before:absolute
                              before:left-[4px]
                              before:top-[6px]
                              before:rotate-[-45deg]
                              before:hidden
                            "
                        ></label>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <div>
                          <p className="admin-table-data">
                            {item?.token?.symbol}
                          </p>
                          {/* <p className="admin-table-heading">{item?.token}</p> */}
                        </div>
                      </td>

                      <td className="admin-table-data ">
                        <p className="max-w-[100px] w-full overflow-hidden text-ellipsis">
                          {item?.order_type}
                        </p>
                      </td>
                      <td className="admin-table-data">
                        $
                        {item?.token !== null
                          ? item?.token?.price.toFixed(4)
                          : item?.global_token?.price.toFixed(4)}
                      </td>
                      <td className="admin-table-data">
                        ${item.volume_usdt.toFixed(2)}
                      </td>
                      <td className="admin-table-data">{item.token_amount}</td>
                      <td className="admin-table-data">
                        <p className={`info-14-18 `}></p>

                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                              item.status === true
                                ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                : item.isCanceled === true
                                ? "!bg-[#F44336] "
                                : "dark:bg-[#90CAF9] bg-[#3699FF] "
                            }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5  ${
                              item.status === true
                                ? "dark:text-[#66BB6A] text-[#0BB783]"
                                : item.isCanceled === true
                                ? "!text-[#F44336] "
                                : "dark:text-[#90CAF9] text-[#3699FF]"
                            }`}
                          >
                            {item?.status === false
                              ? item?.isCanceled === true
                                ? "Canceled"
                                : "Pending"
                              : "Success"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {(props?.marketOrders === null ||
                props?.marketOrders.length === 0) && (
                <tr>
                  <td colSpan={9}>
                    <div
                      className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}
                    >
                      <Image
                        src="/assets/refer/empty.svg"
                        alt="emplty table"
                        width={107}
                        height={104}
                      />
                      <p> No Record Found </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {active === 2 && (
       <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
       <table width="100%">
         <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
           <tr>
             <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
               <input id="mainCheckbox" type="checkbox" className="hidden" />
               <label
                 htmlFor="mainCheckbox"
                 className="
                           relative
                           
                           after:w-20
                           after:h-20
                           after:border-[2px]
                           after:border-[#B5B5C3]
                           after:rounded-[4px]
                           after:block
 
                           before:w-[12px]
                           before:h-[6px]
                           before:border-l-[2px]
                           before:border-b-[2px]
                           border:dark:border-[#212121]
                           border:border-[#fff]
                           before:absolute
                           before:left-[4px]
                           before:top-[6px]
                           before:rotate-[-45deg]
                           before:hidden
                         "
               ></label>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               Order Id
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
               <div className="flex items-center gap-[5px]">
                 <p>User ID</p>
                 <Image
                   src="/assets/history/uparrow.svg"
                   className="rotate-[180deg] "
                   width={15}
                   height={15}
                   alt="uparrow"
                 />
               </div>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               <div className="flex items-center gap-[5px]">
                 <p>Date</p>
                 <Image
                   src="/assets/history/uparrow.svg"
                   className="rotate-[180deg] "
                   width={15}
                   height={15}
                   alt="uparrow"
                 />
               </div>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               <div className="flex items-center gap-[5px]">
                 <p>Coin</p>
                 <Image
                   src="/assets/history/uparrow.svg"
                   className="rotate-[180deg] "
                   width={15}
                   height={15}
                   alt="uparrow"
                 />
               </div>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
               <div className="flex items-center gap-[5px]">
                 <p>Order Type</p>
                 <Image
                   src="/assets/history/uparrow.svg"
                   className="rotate-[180deg] "
                   width={15}
                   height={15}
                   alt="uparrow"
                 />
               </div>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
               <div className="flex items-center gap-[5px]">
                 <p>Price</p>
                 <Image
                   src="/assets/history/uparrow.svg"
                   className="rotate-[180deg] "
                   width={15}
                   height={15}
                   alt="uparrow"
                 />
               </div>
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               Amount
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               Total Quantity
             </th>
             <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
               Status
             </th>
           </tr>
         </thead>
         <tbody>
           {spotOrders !== null &&
             spotOrders?.length > 0 &&
             spotOrders?.map((item: any, index: number) => {
               return (
                 <tr
                   key={index}
                   className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                 >
                   <td className="px-10 py-[14px] admin-table-data">
                     <input
                       id={`checbox-${index}-item`}
                       type="checkbox"
                       className="hidden"
                     />
                     <label
                       htmlFor={`checbox-${index}-item`}
                       className="
                           relative
                           
                           after:w-20
                           after:h-20
                           after:border-[2px]
                           after:border-[#B5B5C3]
                           after:rounded-[4px]
                           after:block
 
                           before:w-[12px]
                           before:h-[6px]
                           before:border-l-[2px]
                           before:border-b-[2px]
                           border:dark:border-[#212121]
                           border:border-[#fff]
                           before:absolute
                           before:left-[4px]
                           before:top-[6px]
                           before:rotate-[-45deg]
                           before:hidden
                         "
                     ></label>
                   </td>
                   <td className="admin-table-data !text-admin-primary">
                     #{item?.id.split("").splice(0, 5)}
                   </td>
                   <td className="admin-table-data !text-admin-primary">
                     #{item?.user_id.split("").splice(0, 5)}
                   </td>
                   <td className="admin-table-data">
                     {formatDate(item?.createdAt)}
                   </td>
                   <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                     <div>
                       <p className="admin-table-data">
                         {item?.token?.symbol}
                       </p>
                       {/* <p className="admin-table-heading">{item?.token}</p> */}
                     </div>
                   </td>

                   <td className="admin-table-data ">
                     <p className="max-w-[100px] w-full overflow-hidden text-ellipsis">
                       {item?.order_type}
                     </p>
                   </td>
                   <td className="admin-table-data">
                     $
                     {item?.token !== null
                       ? item?.token?.price.toFixed(4)
                       : item?.global_token?.price.toFixed(4)}
                   </td>
                   <td className="admin-table-data">
                     ${item.volume_usdt.toFixed(2)}
                   </td>
                   <td className="admin-table-data">{item.token_amount}</td>
                   <td className="admin-table-data">
                     <p className={`info-14-18 `}></p>

                     <div className="flex gap-[5px] items-center">
                       <div
                         className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                           item.status === true
                             ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                             : item.isCanceled === true
                             ? "!bg-[#F44336] "
                             : "dark:bg-[#90CAF9] bg-[#3699FF] "
                         }`}
                       ></div>
                       <p
                         className={`text-[13px] font-public-sans font-normal leading-5  ${
                           item.status === true
                             ? "dark:text-[#66BB6A] text-[#0BB783]"
                             : item.isCanceled === true
                             ? "!text-[#F44336] "
                             : "dark:text-[#90CAF9] text-[#3699FF]"
                         }`}
                       >
                         {item?.status === false
                           ? item?.isCanceled === true
                             ? "Canceled"
                             : "Pending"
                           : "Success"}
                       </p>
                     </div>
                   </td>
                 </tr>
               );
             })}

           {(spotOrders === null ||
             spotOrders?.length === 0) && (
             <tr>
               <td colSpan={9}>
                 <div
                   className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}
                 >
                   <Image
                     src="/assets/refer/empty.svg"
                     alt="emplty table"
                     width={107}
                     height={104}
                   />
                   <p> No Record Found </p>
                 </div>
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
      )}
      {active === 3 && (
      <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
      <table width="100%">
        <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
          <tr>
            <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
              <input id="mainCheckbox" type="checkbox" className="hidden" />
              <label
                htmlFor="mainCheckbox"
                className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
              ></label>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              Order Id
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
              <div className="flex items-center gap-[5px]">
                <p>User ID</p>
                <Image
                  src="/assets/history/uparrow.svg"
                  className="rotate-[180deg] "
                  width={15}
                  height={15}
                  alt="uparrow"
                />
              </div>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              <div className="flex items-center gap-[5px]">
                <p>Date</p>
                <Image
                  src="/assets/history/uparrow.svg"
                  className="rotate-[180deg] "
                  width={15}
                  height={15}
                  alt="uparrow"
                />
              </div>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              <div className="flex items-center gap-[5px]">
                <p>Coin</p>
                <Image
                  src="/assets/history/uparrow.svg"
                  className="rotate-[180deg] "
                  width={15}
                  height={15}
                  alt="uparrow"
                />
              </div>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
              <div className="flex items-center gap-[5px]">
                <p>Order Type</p>
                <Image
                  src="/assets/history/uparrow.svg"
                  className="rotate-[180deg] "
                  width={15}
                  height={15}
                  alt="uparrow"
                />
              </div>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
              <div className="flex items-center gap-[5px]">
                <p>Price</p>
                <Image
                  src="/assets/history/uparrow.svg"
                  className="rotate-[180deg] "
                  width={15}
                  height={15}
                  alt="uparrow"
                />
              </div>
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              Amount
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              Total Quantity
            </th>
            <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {openOrders !== null &&
            openOrders?.length > 0 &&
            openOrders?.map((item: any, index: number) => {
              return (
                <tr
                  key={index}
                  className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                >
                  <td className="px-10 py-[14px] admin-table-data">
                    <input
                      id={`checbox-${index}-item`}
                      type="checkbox"
                      className="hidden"
                    />
                    <label
                      htmlFor={`checbox-${index}-item`}
                      className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                    ></label>
                  </td>
                  <td className="admin-table-data !text-admin-primary">
                    #{item?.id.split("").splice(0, 5)}
                  </td>
                  <td className="admin-table-data !text-admin-primary">
                    #{item?.user_id.split("").splice(0, 5)}
                  </td>
                  <td className="admin-table-data">
                    {formatDate(item?.createdAt)}
                  </td>
                  <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                    <div>
                      <p className="admin-table-data">
                        {item?.token?.symbol}
                      </p>
                      {/* <p className="admin-table-heading">{item?.token}</p> */}
                    </div>
                  </td>

                  <td className="admin-table-data ">
                    <p className="max-w-[100px] w-full overflow-hidden text-ellipsis">
                      {item?.order_type}
                    </p>
                  </td>
                  <td className="admin-table-data">
                    $
                    {item?.token !== null
                      ? item?.token?.price.toFixed(4)
                      : item?.global_token?.price.toFixed(4)}
                  </td>
                  <td className="admin-table-data">
                    ${item.volume_usdt.toFixed(2)}
                  </td>
                  <td className="admin-table-data">{item.token_amount}</td>
                  <td className="admin-table-data">
                    <p className={`info-14-18 `}></p>

                    <div className="flex gap-[5px] items-center">
                      <div
                        className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                          item.status === true
                            ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                            : item.isCanceled === true
                            ? "!bg-[#F44336] "
                            : "dark:bg-[#90CAF9] bg-[#3699FF] "
                        }`}
                      ></div>
                      <p
                        className={`text-[13px] font-public-sans font-normal leading-5  ${
                          item.status === true
                            ? "dark:text-[#66BB6A] text-[#0BB783]"
                            : item.isCanceled === true
                            ? "!text-[#F44336] "
                            : "dark:text-[#90CAF9] text-[#3699FF]"
                        }`}
                      >
                        {item?.status === false
                          ? item?.isCanceled === true
                            ? "Canceled"
                            : "Pending"
                          : "Success"}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}

          {(openOrders === null || openOrders === undefined ||
            openOrders?.length === 0) && (
            <tr>
              <td colSpan={9}>
                <div
                  className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}
                >
                  <Image
                    src="/assets/refer/empty.svg"
                    alt="emplty table"
                    width={107}
                    height={104}
                  />
                  <p> No Record Found </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
};

export default List;
