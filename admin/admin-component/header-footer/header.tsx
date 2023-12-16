import AdminIcons from '../../admin-snippet/admin-icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

const DashboardHeader = () => {


  let Headingsdata = [
    {
      "linktext":"Dashboard Analysis",
      "link":"/"
    },
    {
      "linktext":"Sub Admins Report",
      "link":"/sub-admin"
    },
    {
      "linktext":"User Details Overview..",
      "link":"/user"
    },
    {
      "linktext":"User Details",
      "link":"/user/details"
    },
    {
      "linktext":"Token Overview..",
        "link":"/token"
    },
    {
      "linktext":"KYC Documents",
      "link":"/kyc"
    },
    {
      "linktext":"Wallet / Assets",
      "link":"/wallet"
    },
    {
      "linktext":"Whithdrawals Report",
      "link":"/whithdrawals"
    },
    {
      "linktext":"Report",
      "link":"/reports"
    },
    {
      "linktext":"Support",
      "link":"/support"
    },
    {
      "linktext":"Settings",
      "link":"/settings"
    },
]
  const router=useRouter()
  
  
  return ( 
    <header className='bg-white shadow-[0px_5px_8px_0px_#464e5f05] z-[9] dark:shadow-[0px_5px_8px_0px_#464e5f05] dark:bg-grey-v-4  fixed top-0 w-full right-0 w-full max-w-[calc(100%-240px)] py-[30px] px-[24px]'>
      <div className='flex items-center justify-between'>
        <div>
          {
            Headingsdata.map((elem,ind)=>{
              return(
                <Fragment key={ind}>
                  {
                    router.pathname === (elem.link === '/' ? '/admin': '/admin'+ elem.link)  &&
                    <h2 className='admin-component-heading !text-[24px]'>{elem.linktext }</h2>
                  }
                </Fragment>
              )
            })
          }
            {/* <p className='admin-nav-text !text-[14px] dark:!text-[#ffffff80] !text-table-heading'>With all of the styling tool options available in today`s market</p> */}
        </div>
        <div className='flex items-center gap-30'>
          <div>
            {/* <div className="border rounded-[8px] hidden md:flex gap-[10px] border-[#D6D6E0] dark:border-[#ffffff3b]  min-w-[300px] w-full py-[13px] px-[12px] ">
              <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" />
              <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
            </div> */}
          </div>
          <div className='cursor-pointer'>
            <AdminIcons type='bell' hover={false} active={false} />
          </div>
          <div className='flex items-center gap-10'>
            <Image src="/assets/admin/Avatar.png" alt="search" width={40} height={40} />
            <div>
              <p className='admin-body-text'>Allie Grater</p>
              <p className='admin-body-text !text-table-heading'>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader