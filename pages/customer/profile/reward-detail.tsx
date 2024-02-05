import React from 'react'

const RewardDetail = () => {
  return (
    <section className='px-[20px] py-[100px]'>
        <div className='max-w-[900px] w-full p-5 md:p-30 bg-[#fff] dark:bg-d-bg-primary rounded-10 m-auto border dark:border-[#25262a] border-[#e5e7eb] '>
            <p className="sec-title">Rewards Details</p>
            <div className='flex gap-[30px] mt-[30px]'>
                <div className='max-w-[65%] w-full'>
                    <div className='flex items-center gap-[15px] justify-between'>
                        <p className='info-14-18'>Reward ID</p>
                        <div className='flex items-center gap-[10px]'>
                            <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>27388</p>
                            <svg
                                className='cursor-pointer w-[20px]  min-w-[20px] h-[20px] min-h-[20px]'
                                view-box="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M9.33301 3.33301C8.22844 3.33301 7.33301 4.22844 7.33301 5.33301V7.33301H5.33301C4.22844 7.33301 3.33301 8.22844 3.33301 9.33301V14.6663C3.33301 15.7709 4.22844 16.6663 5.33301 16.6663H10.6663C11.7709 16.6663 12.6663 15.7709 12.6663 14.6663V12.6663H14.6663C15.7709 12.6663 16.6663 11.7709 16.6663 10.6663V5.33301C16.6663 4.22844 15.7709 3.33301 14.6663 3.33301H9.33301ZM14.6663 11.333H9.33301C8.96482 11.333 8.66634 11.0345 8.66634 10.6663V5.33301C8.66634 4.96482 8.96482 4.66634 9.33301 4.66634H14.6663C15.0345 4.66634 15.333 4.96482 15.333 5.33301V10.6663C15.333 11.0345 15.0345 11.333 14.6663 11.333ZM7.33301 8.66634V10.6663C7.33301 11.7709 8.22844 12.6663 9.33301 12.6663H11.333V14.6663C11.333 15.0345 11.0345 15.333 10.6663 15.333H5.33301C4.96482 15.333 4.66634 15.0345 4.66634 14.6663V9.33301C4.66634 8.96482 4.96482 8.66634 5.33301 8.66634H7.33301Z"
                                    fill="#81858C"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Description</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>Welcome Gifts</p>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Product</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>Derivatives</p>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Product Type</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>USDT Perpetual</p>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Trading Pairs</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>Only available for pairs with USDT as the quote currency.</p>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Reward Origin</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>Welcome Gifts</p>
                    </div>

                    <div className='relative flex items-center gap-[10px] mt-[20px] group'>
                        <p className='info-14-18 !text-primary'>How do I use it?</p>
                        
                        <svg
                            width={18}
                            height={19}
                            viewBox="0 0 18 19"
                            className='cursor-pointer info-wrapper'
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 2.75C5.27208 2.75 2.25 5.77208 2.25 9.5C2.25 13.2279 5.27208 16.25 9 16.25C12.7279 16.25 15.75 13.2279 15.75 9.5C15.75 5.77208 12.7279 2.75 9 2.75ZM0.75 9.5C0.75 4.94365 4.44365 1.25 9 1.25C13.5563 1.25 17.25 4.94365 17.25 9.5C17.25 14.0563 13.5563 17.75 9 17.75C4.44365 17.75 0.75 14.0563 0.75 9.5ZM8.25 13.25C8.25 12.8358 8.58579 12.5 9 12.5H9.0075C9.42171 12.5 9.7575 12.8358 9.7575 13.25C9.7575 13.6642 9.42171 14 9.0075 14H9C8.58579 14 8.25 13.6642 8.25 13.25ZM8.17997 6.70342C8.48537 6.52393 8.84444 6.45832 9.19358 6.51821C9.54272 6.5781 9.8594 6.75962 10.0875 7.03062C10.3157 7.30162 10.4405 7.64461 10.44 7.99885L10.44 7.99997C10.44 8.35182 10.1662 8.71863 9.64897 9.06343C9.41319 9.22062 9.17208 9.34171 8.98695 9.42399C8.89546 9.46465 8.82025 9.49468 8.76968 9.51395C8.74445 9.52356 8.72554 9.53042 8.71401 9.53452L8.70204 9.53872C8.30958 9.67001 8.09758 10.0944 8.22848 10.4871C8.35947 10.8801 8.78421 11.0925 9.17717 10.9615L8.94 10.25C9.17717 10.9615 9.17788 10.9612 9.17811 10.9612L9.17925 10.9608L9.18218 10.9598L9.19047 10.957L9.21652 10.9478C9.23794 10.9402 9.26737 10.9295 9.30367 10.9157C9.37615 10.8881 9.47672 10.8478 9.59616 10.7947C9.83291 10.6895 10.1543 10.5293 10.481 10.3115C11.0887 9.90639 11.9397 9.14842 11.94 8.00065C11.9409 7.29233 11.6912 6.60651 11.2351 6.06462C10.7788 5.52261 10.1455 5.15957 9.44717 5.0398C8.74889 4.92003 8.03075 5.05125 7.41995 5.41022C6.80915 5.7692 6.3451 6.33276 6.10999 7.00109C5.97254 7.39183 6.17787 7.82002 6.56861 7.95747C6.95935 8.09493 7.38754 7.8896 7.525 7.49885C7.64255 7.16469 7.87457 6.88291 8.17997 6.70342Z"
                                fill="#5367ff"
                            />
                        </svg>  
                        <div className='max-w-[350px] w-full absolute bottom-[100%] right-0 bg-[#fff] dark:bg-d-bg-primary p-[8px] rounded-[8px] border dark:border-[#25262a] border-[#e5e7eb] opacity-0'> 
                            <p className='info-14-18 !text-[12px] !text-white'>1. Make a trade to apply your coupon.</p>
                            <p className='info-14-18 !text-[12px] !text-white'>2. If your trade meets the criteria stated in our T&Cs, the coupon will be automatically applied.</p>
                            <p className='info-14-18 !text-[12px] !text-white'>3. Coupons can be used to offset trading fees for Perpetual and Futures contracts (Spot not included).</p>
                            <p className='info-14-18 !text-[12px] !text-white'>4. Coupons will be deducted to cover fees prior to your own capital.</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Timeline (UTC)</p>
                        {/* <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>Welcome Gifts</p> */}
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Claimed on</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>2024-02-03 07:04</p>
                    </div>
                    <div className='flex items-center gap-[15px] justify-between mt-[20px]'>
                        <p className='info-14-18'>Expire on</p>
                        <p className='info-14-18 dark:!text-white !text-black text-end max-w-[250px] w-full'>2024-02-10 07:04</p>
                    </div>
                </div>
                <div className='max-w-[35%] w-full'>
                    <div className='rounded-[10px] bg-white'>
                        <div className='px-[24px] py-[30px] rounded-[10px] bg-primary-400 relative z-[1] group relative after:w-[20px] after:h-[20px] after:absolute after:top-[calc(50%-10px)] after:left-[-10px] overflow-hidden after:bg-[#fff] after:dark:bg-d-bg-primary after:rounded-full before:w-[20px] before:h-[20px] before:absolute before:top-[calc(50%-10px)] before:right-[-10px] overflow-hidden before:bg-[#fff] before:dark:bg-d-bg-primary before:rounded-full'>
                            <div className='flex items-center justify-center gap-[15px] relative'>
                                <div className='text-center'>
                                    <h3 className='sec-title !text-white'>20 USDT</h3>
                                    <p className='sm-text !text-white mt-[8px]'>Coupon</p>
                                </div>
                                <div className='absolute bottom-[-36px] right-0'>
                                    <svg
                                        className='opacity-[0.3] mr-[24px]'
                                        width={97}
                                        height={74}
                                        viewBox="0 0 97 74"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <path
                                            d="M87.7959 19.7317C89.6811 19.3993 90.9382 17.6179 90.6095 15.7541L89.4932 9.42318C88.4501 3.50758 81.6432 -0.072221 73.9969 1.27602L46.7253 6.08474L48.5114 16.2142C48.84 18.078 47.583 19.8594 45.6978 20.1918C43.8127 20.5242 42.0221 19.2802 41.6935 17.4164L39.9074 7.28692L12.6358 12.0956C4.98952 13.4439 -0.182563 19.1359 0.860516 25.0515L1.97683 31.3824C2.30547 33.2462 4.09599 34.4902 5.98114 34.1578C11.4286 33.1973 17.1124 37.4834 18.1429 43.3281C19.0913 48.7069 15.4781 53.372 9.55333 54.4167C7.66818 54.7491 6.41111 56.5305 6.73975 58.3943L8.0049 65.5693C8.96463 71.0122 15.7061 74.2206 23.3524 72.8723L50.624 68.0636L48.8379 57.9342C48.5092 56.0704 49.7663 54.289 51.6515 53.9566C53.5366 53.6242 55.3271 54.8682 55.6558 56.732L57.4419 66.8614L84.7135 62.0527C92.3597 60.7045 97.5973 55.3839 96.6376 49.941L95.3724 42.766C95.0438 40.9021 93.2533 39.6582 91.3681 39.9906C85.4434 41.0353 80.4524 37.8872 79.504 32.5085C78.4734 26.6638 82.3484 20.6922 87.7959 19.7317ZM53.8697 46.6025C54.1983 48.4664 52.9412 50.2477 51.0561 50.5801C49.1709 50.9125 47.3804 49.6685 47.0518 47.8047L46.4564 44.4282C46.1278 42.5644 47.3849 40.7831 49.27 40.4507C51.1551 40.1183 52.9457 41.3622 53.2743 43.2261L53.8697 46.6025ZM50.8929 29.7201C51.2215 31.5839 49.9644 33.3653 48.0793 33.6977C46.1941 34.0301 44.4036 32.7861 44.075 30.9223L43.4796 27.5458C43.1509 25.682 44.408 23.9007 46.2932 23.5682C48.1783 23.2358 49.9688 24.4798 50.2975 26.3436L50.8929 29.7201Z"
                                            fill="#fff"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='border border-[#e9edf2] pt-[40px] mt-[-40px] rounded-[10px] p-[24px]'>
                            <button type='button' className='mt-[15px] w-full solid-button !px-[20px] !py-[10px]'>Use</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default RewardDetail;