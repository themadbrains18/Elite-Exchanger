import Image from 'next/image';
import React from 'react'

const KycHead = () => {
  return (
    <div className='grid grid-cols-3 gap-[24px]'>
        <div className='p-20 bg-[#ffa7261f] rounded-10'>
            <p className='admin-component-heading mb-[5px]'>Total KYC User</p>
            <div className='flex items-center justify-between mb-[8px]'>
                <p className='admin-nav-text'>KYC</p>
                <p className='admin-nav-text'>70%</p>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 dark:bg-gray-700 mb-[20px]">
                <div className="w-[45%] bg-[#FFA726] h-2.5 rounded-full "></div>
            </div>
            <div className='flex items-center justify-between'>
                <Image src='/assets/admin/AvatarGroup.png' alt='image-description' width={83} height={32} />
                <p className='admin-nav-text'>21,9545</p>

            </div>
        </div>
        
        <div className='p-20 bg-[#0288d11f] rounded-10'>
            <p className='admin-component-heading mb-[5px]'>Total KYC User</p>
            <div className='flex items-center justify-between mb-[8px]'>
                <p className='admin-nav-text'>KYC</p>
                <p className='admin-nav-text'>70%</p>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 dark:bg-gray-700 mb-[20px]">
                <div className="w-[45%] bg-[#90CAF9] h-2.5 rounded-full "></div>
            </div>
            <div className='flex items-center justify-between'>
                <Image src='/assets/admin/AvatarGroup.png' alt='image-description' width={83} height={32} />
                <p className='admin-nav-text'>21,9545</p>

            </div>
        </div>
        
        <div className='p-20 bg-[#f443361f] rounded-10'>
            <p className='admin-component-heading mb-[5px]'>Total KYC User</p>
            <div className='flex items-center justify-between mb-[8px]'>
                <p className='admin-nav-text'>KYC</p>
                <p className='admin-nav-text'>70%</p>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 dark:bg-gray-700 mb-[20px]">
                <div className="w-[45%] bg-[#F44336] h-2.5 rounded-full "></div>
            </div>
            <div className='flex items-center justify-between'>
                <Image src='/assets/admin/AvatarGroup.png' alt='image-description' width={83} height={32} />
                <p className='admin-nav-text'>21,9545</p>

            </div>
        </div>

    </div>
  )
}

export default KycHead;