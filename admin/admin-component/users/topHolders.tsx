import AdminIcons from '../../admin-snippet/admin-icons';
import Image from 'next/image';
import React from 'react'

interface usersList {
  users: any;
}

const TopHolders = (props: usersList) => {
  return (
    <section className="py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex gap-10 justify-between mb-[15px]">
        <p className="admin-component-heading">Top Holders</p>
        <div className="p-1 rounded-5 dark:bg-[#1B283F] bg-[#f3f6f9b3]">
          <AdminIcons type="settings" hover={false} active={false} />
        </div>
      </div>
      <div className="max-h-[200px] h-full overflow-y-auto ">
        <table width="100%">
          <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px]">
            <tr>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">User ID</th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Full Name</th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Referal Code</th>
              <th className="p-[10px] text-start dark:!text-[#ffffffb3] admin-table-heading">Status</th>
            </tr>
          </thead>
          <tbody >
            {
              props?.users?.map((item: any, index: number) => {
                return (
                  <tr key={index} className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] dark:hover:bg-[#90caf929]">
                    <td className="admin-table-data">
                      #{item?.id.split("").splice(0, 5)}
                    </td>
                    <td className="px-1 py-[14px] flex gap-[10px] items-center admin-table-data">
                      <Image
                        src={`/assets/admin/Avatar.png`}
                        width={32}
                        height={32}
                        alt="avtar"
                      />
                      <p>{item?.email}</p>
                    </td>
                    <td className="admin-table-data">{item?.own_code}</td>
                    <td className="admin-table-data">
                      <div className="flex gap-[5px] items-center">
                        <div
                          className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.statusType === true
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : "dark:bg-[#F44336] bg-[#F64E60]"
                            }`}
                        ></div>
                        <p
                          className={`text-[13px] font-public-sans font-normal leading-5 ${item?.statusType === true
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : "dark:text-[#F44336] text-[#F64E60]"
                            }`}
                        >
                          {item?.statusType === true ? "Active" : "Blocked"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TopHolders