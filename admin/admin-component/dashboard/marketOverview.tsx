import { useSession } from 'next-auth/react';
import AdminIcons from '../../admin-snippet/admin-icons';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '@/components/contexts/context';
interface list {
  // coinList:any
}
const MarketOverview = (props:list) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const {data:session} = useSession()
  const { mode } = useContext(Context)
  let itemsPerPage = 10;

  useEffect(() => {
    getToken(itemOffset)
  }, [itemOffset])

  const getToken = async (itemOffset: number) => {
    if (itemOffset === undefined) {
      itemOffset = 0;
    }
    let tokenList = await fetch(`/api/token/list?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token || ""
    },
    }).then(response => response.json());
    setList(tokenList?.data?.data)
    setTotal(tokenList?.data?.total);
  }
  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
  };

  function formatDate(date: any) {
      const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options)
    }
      return (
        <section className="py-6 px-5 mt-6 rounded-10 bg-white dark:bg-grey-v-4">
          <div className="flex gap-10 justify-between mb-[15px]">
            <p className="admin-component-heading">Market Overview</p>
            {/* <div className="p-1 rounded-5 dark:bg-[#1B283F] bg-[#f3f6f9b3]">
              <AdminIcons type="settings" hover={false} active={false} />
            </div> */}
          </div>
          <div className="max-h-[400px] h-full overflow-y-auto ">
            <table width="100%">
              <thead className="sticky top-0 dark:bg-grey-v-4 bg-white">
                <tr>
                  <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Full Name</th>
                  <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Price</th>
                  <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">24H</th>
                  <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Added</th>
                  <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Graph</th>
                </tr>
              </thead>
              <tbody >
                {
                  list && list.length > 0 && list?.map((item:any,index:number)=>{
                    return(
                <tr key={index} className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a]  hover:bg-[#3699ff14] dark:hover:bg-[#90caf929]">
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
                  <td className="admin-table-data">
                 ${item?.price?.toFixed(2)}
                  </td>
                  <td className="admin-table-data">
                  <span className="dark:bg-[#0bb7831f] bg-[#D7F9EF] py-[2px] px-1 rounded-5 flex w-max">
                    <p className="text-xs font-public-sans font-medium leading-5 text-[#0BB783]">
                   +5%
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
                  {formatDate(item?.createdAt)}
                  </td>
                  <td>
                  <Image
                      src={`/assets/admin/Graph.svg`}
                      width={101}
                      height={35}
                      alt="coins"
                    />
                  </td>
                </tr>
    
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="flex pt-[25px] items-center justify-end">

          <ReactPaginate
            className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null} />
        </div>
        </section>
      );
}

export default MarketOverview