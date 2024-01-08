import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React from "react";

interface propsData {
  coins: any
}
const NewList = (props:propsData) => {

  let newCoins = props?.coins?.filter((item: any) => {
    return item.tokenType === 'mannual'
  })
  function formatDate(date: any) {
    const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options)
  }

 
  return (
    <section className="py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex gap-10 justify-between mb-[15px]">
        <p className="admin-component-heading">New Listing Requests</p>
        <div className="p-1 rounded-5 dark:bg-[#1B283F] bg-[#f3f6f9b3]">
          <AdminIcons type="settings" hover={false} active={false} />
        </div>
      </div>
      <div className="max-h-[240px] h-full overflow-y-auto ">
        <table width="100%">
          <thead className="sticky top-0 dark:bg-grey-v-4 bg-white">
            <tr>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Name
              </th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Contract
              </th>
              {/* <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Email
              </th> */}
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {newCoins?.map((item:any, index:number) => {
              return (
                <tr
                  key={index}
                  className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a]  hover:bg-[#3699ff14] dark:hover:bg-[#90caf929]"
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
                  <td className="admin-table-heading !font-normal">
                  {item?.networks && item?.networks[0].contract}
                  </td>
                  {/* <td className="admin-table-data">
                    {item.email}
                  </td> */}
                  <td className="admin-table-heading">{formatDate(item?.createdAt)}</td>
                 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default NewList;
