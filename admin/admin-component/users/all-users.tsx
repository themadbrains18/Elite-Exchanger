import { useSession } from "next-auth/react";
import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import FiliterSelectMenu from "@/components/snippets/filter-select-menu";
import ReactPaginate from "react-paginate";
import Context from "@/components/contexts/context";
import { AES } from "crypto-js";

interface usersList {
  users:any | [];
  networks: any;
  session: any;
}

const AllUsers = (props: usersList) => {
  const session = useSession();
  const [list, setList] = useState([]);
  const [active, setActive] = useState(1);
  const [netwoks, setNetworks] = useState(props?.networks);
  const [wallets, setWallet] = useState<any>();
  const router = useRouter();
  const [itemOffset, setItemOffset] = useState(0);
  const { mode } = useContext(Context);
  const [total, setTotal] = useState(0);

  let itemsPerPage = 10;

  useEffect(() => {
    getToken(itemOffset);
  }, [itemOffset]);

  const getToken = async (itemOffset: number) => {
    try {
      if (itemOffset === undefined) {
        itemOffset = 0;
      }
      let users = await fetch(
        `/api/user/all?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Authorization": props?.session?.user?.access_token
        },
        }
      ).then((response) => response.json());
  
  
      setList(users?.data?.data);
      setTotal(users?.data?.total);
      
    } catch (error) {
      console.log("error in get token list",error);
      
    }
  };
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };
  function formatDate(date: Date) {
    const options: {} = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  const updateStatus = async (data: any) => {
    try {
      data.statusType = data.statusType === true ? false : true;
      const ciphertext = AES.encrypt(JSON.stringify(data), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record =  encodeURIComponent(ciphertext.toString());
      let updated = await fetch(
        `/api/user/status`,
        {
          headers: {
            "content-type": "application/json",
            "Authorization": props?.session?.user?.access_token
          },
          method: "PUT",
          body: JSON.stringify(record),
        }
      ).then((response) => response.json());
      setList(updated?.data?.result);
      
    } catch (error) {
      console.log("error in update user status",error);
      
    }
  };

  const filterData = (e: any) => {
    if (e.target.innerHTML === "Active") {
      let data = props?.users?.filter((e: any) => e.statusType === true);
      setList(data);
    } else if (e.target.innerHTML === "Blocked") {
      let data = props?.users?.filter((e: any) => e.statusType === false);
      setList(data);
    } else {
      setList(props?.users);
    }
  };

  const refreshTransaction = async (network: any) => {
    try {
      let address = "";
      Object.keys(wallets?.wallets[0]?.wallets).filter((e) => {
        // console.log(wallets, "===wallets");
  
        if (e === network?.walletSupport) {
          address = wallets.wallets[0]?.wallets[e]?.address;
        }
      });
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_APIURL}/user/scan/${address}/${network?.chainId}/${wallets?.id}`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "GET",
        }
      );
  
      let data = await response.json();
      // console.log(data);
      
    } catch (error) {
      console.log("error in refresh transaction",error);
      
    }
  };

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
              filterData(e);
            }}
          >
            All Users
          </button>
          <button
            className={`${
              active === 2 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(2);
              filterData(e);
            }}
          >
            Active
          </button>
          <button
            className={`${
              active === 3 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(3);
              filterData(e);
            }}
          >
            Blocked
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
                Full Name
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
                  <p>Created</p>
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
                  <p>Referal Code</p>
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
                  <p>Refer By</p>
                  <Image
                    src="/assets/history/uparrow.svg"
                    className="rotate-[180deg] "
                    width={15}
                    height={15}
                    alt="uparrow"
                  />
                </div>
              </th>
              {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                      <div className='flex items-center gap-[5px]'>
                        <p>token</p>
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th> */}
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                <div className="flex items-center gap-[5px]">
                  <p>In BTC</p>
                  <Image
                    src="/assets/history/uparrow.svg"
                    className="rotate-[180deg] "
                    width={15}
                    height={15}
                    alt="uparrow"
                  />
                </div>
              </th>
              {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Holdings</th> */}
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                Status
              </th>
              <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {list &&
              list.length > 0 &&
              list?.map((item: any, index: number) => {
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
                    <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                      <Image
                        src={`/assets/admin/Avatar.png`}
                        width={32}
                        height={32}
                        alt="avtar"
                      />
                      <p>{item?.email}</p>
                    </td>
                    <td className="admin-table-data">
                      #{item?.id.split("").splice(0, 5)}
                    </td>

                    <td className="admin-table-data">
                      {formatDate(item?.createdAt)}
                    </td>
                    <td className="admin-table-data">{item?.own_code}</td>
                    <td className="admin-table-data">{item?.refeer_code}</td>
                    <td className="admin-table-data">$15,300</td>
                    {/* <td className="admin-table-data">
                    ${item?.holdings}
                  </td> */}
                    <td className="admin-table-data">
                      <div className="flex gap-[5px] items-center">
                        <div
                          className={`w-[7px] h-[7px] mr-[5px] rounded-full ${
                            item?.statusType === true
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : "dark:bg-[#F44336] bg-[#F64E60]"
                          }`}
                        ></div>
                        <p
                          className={`text-[13px] font-public-sans font-normal leading-5 ${
                            item?.statusType === true
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : "dark:text-[#F44336] text-[#F64E60]"
                          }`}
                        >
                          {item?.statusType === true ? "Active" : "Blocked"}
                        </p>
                      </div>
                    </td>
                    <td className="w-[30%]">
                      <div className="inline-flex items-center gap-10">
                        {/* <button className='admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	'>On Hold</button> */}
                        <button
                          className={`admin-outline-button ${
                            item?.statusType === false
                              ? "dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f]"
                              : "!text-[#F44336] !border-[#f443361f]"
                          }  !px-[10px] !py-[4px] whitespace-nowrap	`}
                          onClick={() => {
                            updateStatus(item);
                          }}
                        >
                          {item?.statusType === false ? "Active" : "Blocked"}
                        </button>
                        <button
                          onClick={() => {
                            router.push({
                              pathname: "/user/details",
                              query: { id: item?.id },
                            });
                          }}
                          className="admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	"
                        >
                          View Details
                        </button>
                        <div
                          onClick={() => {
                            setWallet(item);
                          }}
                        >
                          <FiliterSelectMenu
                            data={netwoks}
                            placeholder="Refresh Transaction"
                            auto={false}
                            widthFull={true}
                            onDocumentChange={refreshTransaction}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="flex pt-[25px] items-center justify-end">
        <ReactPaginate
          className={`history_pagination ${
            mode === "dark" ? "paginate_dark" : ""
          }`}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default AllUsers;
