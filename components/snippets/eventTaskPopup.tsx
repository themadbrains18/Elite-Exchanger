import React, { useContext } from 'react'
import Context from '../contexts/context';

interface activeSection {
    setTaskShow: Function;
    referProgamTask?: any;
}

const EventTaskPopup = (props: activeSection) => {
    const { mode } = useContext(Context);

    let depositAmount = 0;
    let tradeAmount = 0;
    let tokenId = props?.referProgamTask?.refer_program_invite.token_id;
    
    props.referProgamTask.User?.user_deposits.filter((item: any) => {
        let totken = item?.coinName.split('/')[1];
        
        if (totken === 'USDT') {
            depositAmount = depositAmount + Number(item?.amount)
        }
    })

    props.referProgamTask.User?.marketOrders.filter((item: any) => {
        if(item.status === true || item.status === 1){
            tradeAmount = tradeAmount + item?.volume_usdt;
            depositAmount = depositAmount + tradeAmount;
        }
    })

    return (
        <div className="fixed max-h-[calc(100%-124px)] overscroll-none	 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[24px] rounded-[10px] bg-white  z-[99] max-w-[calc(100%-36px)] xl:max-w-[1065px] w-full overflow-auto">
            <div className="flex items-center justify-between mb-[20px]">

                <h3 className="sm-heading ">Task Rewards History ({(props?.referProgamTask?.User?.id).substring(1, 7)})</h3>
                <svg
                    onClick={() => {
                        props.setTaskShow(false);
                    }}
                    className="cursor-pointer"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 6L6 18"
                        stroke="#81858C"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 6L18 18"
                        stroke="#81858C"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

            </div>

            {/* card style 1 */}
            <div className="px-[24px] py-[8px] bg-[#f5f7fa] rounded-[8px] flex relative overflow-hidden gap-[24px] min-w-[1000px] mb-[24px]">
                <div className="max-w-[30%] w-full flex items-center">
                    <div className="max-w-[50%] w-full">
                        <h3 className="md-heading text-primary">10 USDT</h3>
                        <p className="info-14">Bonus</p>
                    </div>
                    <div className="max-w-[50%] w-full">
                        <svg
                            className="m-[0_0_0_auto]"
                            width={76}
                            height={88}
                            viewBox="0 0 76 88"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M65.9509 28.8339H54.4125C58.6897 26.9349 62.6684 24.736 64.4589 23.0368C69.9297 17.5396 70.2281 9.04396 65.2546 4.0465C62.7679 1.54777 59.386 0.348379 55.805 0.548277C52.3236 0.748176 49.0411 2.24741 46.4549 4.84609C43.8687 7.44477 40.5862 14.7411 38.0995 20.9379C35.6127 14.7411 32.3302 7.54472 29.744 4.84609C24.2732 -0.651113 15.8183 -0.950961 10.8448 4.0465C5.87135 9.04396 6.26923 17.5396 11.6406 23.0368C13.431 24.8359 17.4098 26.9349 21.687 28.8339H10.0491C4.77719 28.8339 0.5 33.1317 0.5 38.429L0.5 85.9049C0.5 91.2022 4.77719 95.5 10.0491 95.5H65.9509C71.2228 95.5 75.5 91.2022 75.5 85.9049V38.429C75.5 33.1317 71.2228 28.8339 65.9509 28.8339ZM51.5279 10.1434C52.821 8.84406 54.5119 8.04447 56.1035 7.94452C56.2029 7.94452 56.3024 7.94452 56.5013 7.94452C57.8939 7.94452 59.0875 8.44426 59.9828 9.34381C62.0716 11.4427 61.7732 15.2408 59.187 17.8395C57.496 19.5386 50.8316 22.5371 44.2666 25.1358C46.8528 18.5391 49.8369 11.8425 51.5279 10.1434ZM16.813 17.8395C14.2268 15.2408 13.9284 11.4427 16.0172 9.34381C16.9125 8.44426 18.2056 7.94452 19.4987 7.94452C21.1897 7.94452 23.0796 8.74411 24.4722 10.1434C26.1631 11.8425 29.1472 18.5391 31.7334 25.1358C25.1684 22.5371 18.504 19.5386 16.813 17.8395ZM26.2626 45.4255C29.3462 45.4255 31.9324 47.9242 31.9324 51.1226C31.9324 54.221 29.4456 56.8197 26.2626 56.8197C23.179 56.8197 20.5928 54.3209 20.5928 51.1226C20.5928 48.0241 23.179 45.4255 26.2626 45.4255ZM53.5172 69.3133C51.13 75.91 44.8634 80.3077 38 80.3077C31.0371 80.3077 24.7706 75.91 22.4828 69.4133C21.8859 67.6142 22.7812 65.7151 24.4722 65.0155C26.2626 64.3159 28.1525 65.3154 28.8488 67.0145C30.2414 70.9125 33.9218 73.4112 38 73.4112C42.0783 73.4112 45.7586 70.8126 47.1512 67.0145C47.748 65.2154 49.7374 64.3159 51.5279 64.9156C53.3183 65.6152 54.2135 67.5142 53.5172 69.3133ZM49.7374 56.7197C46.6539 56.7197 44.0676 54.221 44.0676 51.0226C44.0676 47.9242 46.5544 45.3255 49.7374 45.3255C52.821 45.3255 55.4072 47.8242 55.4072 51.0226C55.4072 54.221 52.821 56.7197 49.7374 56.7197Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
                <div className="max-w-[70%] w-full bg-white px-[24px] py-[16px]  rounded-[8px] min-h-[126px] relative flex items-center mr-[-16px]">
                    <div className='w-full'>
                        <h4 className="sm-heading">Deposit ≥ {props?.referProgamTask?.refer_program_invite?.deposit} USDT</h4>
                        <div className="bg-[#f5f7fa] rounded-[8px] h-[8px] w-full mt-[20px]"></div>
                        <p className="info-14 mt-[8px]">{depositAmount} / {props?.referProgamTask?.refer_program_invite?.deposit} USDT</p>
                    </div>
                </div>
            </div>

            {/* card style 2 */}
            <div className="px-[24px] py-[8px] bg-[#f5f7fa] rounded-[8px] flex relative overflow-hidden gap-[24px] min-w-[1000px] mb-[24px]">
                <div className="max-w-[30%] w-full flex items-center">
                    <div className="max-w-[70%] w-full">
                        <h3 className="md-heading text-primary">{props?.referProgamTask?.refer_program_invite?.amount} USDT</h3>
                        <p className="info-14">Bonus</p>
                    </div>
                    <div className="max-w-[30%] w-full">
                        <svg
                            className="m-[0_0_0_auto]"
                            width={76}
                            height={88}
                            viewBox="0 0 76 88"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M65.9509 28.8339H54.4125C58.6897 26.9349 62.6684 24.736 64.4589 23.0368C69.9297 17.5396 70.2281 9.04396 65.2546 4.0465C62.7679 1.54777 59.386 0.348379 55.805 0.548277C52.3236 0.748176 49.0411 2.24741 46.4549 4.84609C43.8687 7.44477 40.5862 14.7411 38.0995 20.9379C35.6127 14.7411 32.3302 7.54472 29.744 4.84609C24.2732 -0.651113 15.8183 -0.950961 10.8448 4.0465C5.87135 9.04396 6.26923 17.5396 11.6406 23.0368C13.431 24.8359 17.4098 26.9349 21.687 28.8339H10.0491C4.77719 28.8339 0.5 33.1317 0.5 38.429L0.5 85.9049C0.5 91.2022 4.77719 95.5 10.0491 95.5H65.9509C71.2228 95.5 75.5 91.2022 75.5 85.9049V38.429C75.5 33.1317 71.2228 28.8339 65.9509 28.8339ZM51.5279 10.1434C52.821 8.84406 54.5119 8.04447 56.1035 7.94452C56.2029 7.94452 56.3024 7.94452 56.5013 7.94452C57.8939 7.94452 59.0875 8.44426 59.9828 9.34381C62.0716 11.4427 61.7732 15.2408 59.187 17.8395C57.496 19.5386 50.8316 22.5371 44.2666 25.1358C46.8528 18.5391 49.8369 11.8425 51.5279 10.1434ZM16.813 17.8395C14.2268 15.2408 13.9284 11.4427 16.0172 9.34381C16.9125 8.44426 18.2056 7.94452 19.4987 7.94452C21.1897 7.94452 23.0796 8.74411 24.4722 10.1434C26.1631 11.8425 29.1472 18.5391 31.7334 25.1358C25.1684 22.5371 18.504 19.5386 16.813 17.8395ZM26.2626 45.4255C29.3462 45.4255 31.9324 47.9242 31.9324 51.1226C31.9324 54.221 29.4456 56.8197 26.2626 56.8197C23.179 56.8197 20.5928 54.3209 20.5928 51.1226C20.5928 48.0241 23.179 45.4255 26.2626 45.4255ZM53.5172 69.3133C51.13 75.91 44.8634 80.3077 38 80.3077C31.0371 80.3077 24.7706 75.91 22.4828 69.4133C21.8859 67.6142 22.7812 65.7151 24.4722 65.0155C26.2626 64.3159 28.1525 65.3154 28.8488 67.0145C30.2414 70.9125 33.9218 73.4112 38 73.4112C42.0783 73.4112 45.7586 70.8126 47.1512 67.0145C47.748 65.2154 49.7374 64.3159 51.5279 64.9156C53.3183 65.6152 54.2135 67.5142 53.5172 69.3133ZM49.7374 56.7197C46.6539 56.7197 44.0676 54.221 44.0676 51.0226C44.0676 47.9242 46.5544 45.3255 49.7374 45.3255C52.821 45.3255 55.4072 47.8242 55.4072 51.0226C55.4072 54.221 52.821 56.7197 49.7374 56.7197Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
                <div className="max-w-[70%] w-full bg-white px-[24px] py-[16px]  rounded-[8px] min-h-[126px] relative flex items-center mr-[-16px] after:absolute after:top-[50%] after:left-[50%]  after:translate-x-[-50%] after:translate-y-[-50%] after:w-[2px] after:h-[calc(100%-16px)] after:bg-[#f5f7fa]">

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-[24px] w-full relative  items-end">
                        <div>
                            <h4 className="sm-heading">Deposit ≥ {props?.referProgamTask?.refer_program_invite?.deposit} USDT</h4>
                            <div className="bg-[#f5f7fa] rounded-[8px] h-[8px] w-full mt-[20px]"></div>
                            <p className="info-14 mt-[8px]">{depositAmount} / {props?.referProgamTask?.refer_program_invite?.deposit} USDT</p>
                        </div>
                        <div className="relative z-[1]">
                            <p className="w-[50px] flex h-[50px] rounded-full bg-[#f5f7fa] ">
                                <span className="m-auto opacity-[0.3]">AND</span>
                            </p>
                        </div>
                        <div>
                            <h4 className="sm-heading">Trade ≥ {props?.referProgamTask?.refer_program_invite?.trade} USDT</h4>
                            <div className="bg-[#f5f7fa] rounded-[8px] h-[8px] w-full mt-[20px]"></div>
                            <p className="info-14 mt-[8px]">{tradeAmount} / {props?.referProgamTask?.refer_program_invite?.trade} USDT</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventTaskPopup