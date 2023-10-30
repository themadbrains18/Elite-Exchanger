import AdminIcons from '../../admin-snippet/admin-icons'
import Image from 'next/image'
import React from 'react'

const ReportTable = () => {
    let data=[
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Bitcoin',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Approved',
        }   ,
        {
          id:'#21426',
          coin:'coin2.svg',
          fullName:'Ethereum',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin3.svg',
          fullName:'Tron',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin4.svg',
          fullName:'Polygon',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin2.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Approved',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Tether',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin4.svg',
          fullName:'Binance USD',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin3.svg',
          fullName:'USD Coin',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Dogecoin',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }  , 
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }  , 
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Pending',
        }  , 
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   ,
        {
          id:'#21426',
          coin:'coin1.svg',
          fullName:'Binance',
          created:"17 Oct 2022",
          network:'BTC/Bitcoin',
          txid:'TSSEGCTPKdx....',
          token:"15365",
          amount:"1.5206 BTC",
          address:"Fc2qvwh8uur....",
          status:'Rejected',
        }   
      ]
  return (
    <div className=' mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4'>
      <div className='flex items-center justify-between  mb-[26px]'>
        <div className='flex items-center gap-[15px]'>
          <button className='admin-solid-button'>Deposit</button>
          <button className='admin-outline-button'>Withdraw</button>
          <button className='admin-outline-button'>Trading</button>
          <button className='admin-outline-button'>P2P</button>
        </div>
        <div className='flex items-center gap-10'>
          <p className='admin-table-data'><span className='dark:text-[#ffffffb3]'>1&nbsp;</span>Item selected</p>
          <div className='w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer'>
            <AdminIcons type="download" hover={false} active={false} />
          </div>
          <div className='w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer'>
            <AdminIcons type="deleteIcon" hover={false} active={false} />
          </div>
          <div className='w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer'>
            <AdminIcons type="SearchIcon" hover={false} active={false} />
          </div>
          <div className='w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer'>
            <AdminIcons type="settings" hover={false} active={false} />
          </div>
        </div>
      </div>
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
            <table width="100%">
              <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
                <tr>
                    <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                        <input id='mainCheckbox' type="checkbox" className='hidden' />
                        <label htmlFor="mainCheckbox" className='
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
                        '></label>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Coin</th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                      <div className='flex items-center gap-[5px]'>
                        <p>User ID</p>  
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                      <div className='flex items-center gap-[5px]'>
                        <p>Date</p>
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                      <div className='flex items-center gap-[5px]'>
                        <p>TxID</p>
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                      <div className='flex items-center gap-[5px]'>
                        <p>Network</p>
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                      <div className='flex items-center gap-[5px]'>
                        <p>Amount</p>
                        <Image src="/assets/history/uparrow.svg" className='rotate-[180deg] ' width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Wallet Address</th>   
                    <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Status</th>
                    {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Action</th> */}
                </tr>
              </thead>
              <tbody >
                {
                  data?.map((item,index)=>{
                    return(
                <tr key={index} className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]">
                    <td className="px-10 py-[14px] admin-table-data">
                        <input id={`checbox-${index}-item`} type="checkbox" className='hidden' />
                        <label htmlFor={`checbox-${index}-item`} className='
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
                        '></label>
                    </td>
                    <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <Image
                        src={`/assets/admin/${item?.coin}`}
                        width={32}
                        height={32}
                        alt="avtar"
                        />
                        <div>
                        <p>{item?.fullName}</p>
                        <p className='admin-table-heading'>{item?.token}</p>

                        </div>

                    
                    </td>
                    <td className="admin-table-data !text-admin-primary">
                        {item?.id}
                    </td>
                 
                  <td className="admin-table-data">
                 {item?.created}
                  </td>
                  <td className="admin-table-data">
                 {item?.txid}
                  </td>
                  <td className="admin-table-data">
                 {item?.network}
                  </td>
                  
                  <td className="admin-table-data">
                  ${item?.amount}
                
                  </td>
                  <td className="admin-table-data">
                    {item?.address}
                  </td>
                  <td className="admin-table-data">
                  <div className='flex gap-[5px] items-center'>
                        <div className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status==='Approved'?'dark:bg-[#66BB6A] bg-[#0BB783]':item?.status==='Pending'?'dark:bg-[#90CAF9] bg-[#3699FF] ':'dark:bg-[#F44336] bg-[#F64E60]'}`}></div>
                        <p className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status==='Approved'?'dark:text-[#66BB6A] text-[#0BB783]':item?.status==='Pending'?'dark:text-[#90CAF9] text-[#3699FF] ':'dark:text-[#F44336] text-[#F64E60]'}`}>{item?.status}</p>

                    </div>
                  {/* <span className={`border ${item?.status==="Active"?'border-[#0bb78380] dark:border-[#66bb6a1f] ':'border-[#f64e6080] dark:border-[#f443361f] '}   py-[3px] px-1 rounded-[6px] flex w-max`}>
                    <p className={`text-[13px] font-public-sans font-normal leading-[18px] ${item?.status==='Active'?'text-[#0BB783] dark:text-[#66BB6A]':'dark:text-[#F44336] text-[#F64E60]'} `}>
                    {item?.status}
                    </p>
                    
                  </span> */} 
                
                  </td>
                  {/* <td className='w-[20%]'>
                    <div className='inline-flex items-center gap-10'>
                      <button className='admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap	'>On Hold</button>
                      <button className='admin-outline-button !text-[#F44336] !border-[#f443361f] !px-[10px] !py-[4px] whitespace-nowrap	'>Blocked</button>
                 
                    </div>
                  </td> */}
                </tr>
    
                    )
                  })
                }
              </tbody>
            </table>
          </div>
    </div>
  )
}

export default ReportTable