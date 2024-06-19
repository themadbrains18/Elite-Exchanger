import { useEffect, useState } from "react";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";

interface propsData {
  coins: any;
  refreshTokenList?:any;
}

const AddedTokens = (props: propsData) => {

  let newCoins = props.coins.filter((item: any) => {
    return item.tokenType === 'mannual'
  });

  function formatDate(date: any) {
    const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options)
  }

  const updateStatus = async (data: any) => {
    try {
      let responseStatus = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/token/change/status`, {
        headers: {
          "content-type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(data),
      }).then((response) => response.json());
  
      if (responseStatus) {
        props.refreshTokenList(responseStatus);
      }
    } catch (error) {
      console.log("error update token status ",error);

    }
   

  }

  return (
    <section className="py-6 px-5 rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex gap-10 justify-between mb-[15px]">
        <p className="admin-component-heading">Recently Added Coins</p>
        <div className="p-1 rounded-5 dark:bg-[#1B283F] bg-[#f3f6f9b3]">
          <AdminIcons type="settings" hover={false} active={false} />
        </div>
      </div>
      <div className="max-h-[240px]  h-full overflow-y-auto ">
        <table width="100%">
          <thead className="sticky top-0 dark:bg-grey-v-4 bg-white">
            <tr>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Full Name
              </th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Price
              </th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                24H
              </th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Status
              </th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Wallet
              </th>
            </tr>
          </thead>
          <tbody>
            {newCoins && newCoins?.length>0 && newCoins?.map((item: any, index: number) => {
              return (
                <tr
                  key={index}
                  className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] dark:hover:bg-[#90caf929]"
                >
                  <td className="px-1 py-[10px] flex gap-[10px] items-center admin-table-data">
                    <Image
                      src={`${item.image}`}
                      width={24}
                      height={24}
                      alt="coins"
                    />
                    <div>
                      <p>{item?.symbol}</p>
                      <p className="admin-table-heading">{item?.fullName}</p>
                    </div>
                  </td>
                  <td className="admin-table-data">${item?.price}</td>
                  <td className="admin-table-data">
                    <span className="dark:bg-[#0bb7831f] bg-[#D7F9EF] py-[2px] px-1 rounded-5 flex w-max">
                      <p className="text-xs font-public-sans font-medium leading-5 text-[#0BB783]">
                        5%
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M14.0416 5.70833L15.2416 6.90833L11.1749 10.975L8.43328 8.23333C8.10828 7.90833 7.58328 7.90833 7.25828 8.23333L2.25828 13.2417C1.93328 13.5667 1.93328 14.0917 2.25828 14.4167C2.58328 14.7417 3.10828 14.7417 3.43328 14.4167L7.84161 10L10.5833 12.7417C10.9083 13.0667 11.4333 13.0667 11.7583 12.7417L16.4166 8.09167L17.6166 9.29167C17.8749 9.55 18.3249 9.36667 18.3249 9V5.41667C18.3333 5.18333 18.1499 5 17.9166 5H14.3416C13.9666 5 13.7833 5.45 14.0416 5.70833Z"
                          fill="#0BB783"
                        />
                      </svg>
                    </span>
                  </td>
                  <td className="admin-table-data">
                    <div className="flex gap-[5px] items-center">
                      <div
                        className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === true
                          ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                          : "dark:bg-[#F44336] bg-[#F64E60]"
                          }`}
                      ></div>
                      <p
                        className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === true
                          ? "dark:text-[#66BB6A] text-[#0BB783]"
                          : "dark:text-[#F44336] text-[#F64E60]"
                          }`}
                      >
                        {item?.status == false ? "Inactive" : "Active"}
                      </p>
                    </div>

                  </td>

                  <td className="">
                    <div className="inline-flex items-center gap-10">
                      <button onClick={() => updateStatus(item)}
                        className={`admin-outline-button ${item?.status == false
                          ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                          : "dark:text-[#F44336] text-[#F64E60] !border-[#f64e6080] dark:!border-[#f443361f]"
                          } !px-[10px] !py-[4px] whitespace-nowrap	`}
                      >
                        {item?.status == false  ? "Activate " : "Inactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AddedTokens;
