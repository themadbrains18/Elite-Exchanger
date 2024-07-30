import IconsComponent from "./icons"

const RestrictionNotice = () =>{
    return(
        <>
            <div className='max-w-[calc(100%-30px)] md:max-w-[600px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                <div className='flex items-center justify-between'>
                    <p className="sec-title">24 Hours Withdrawal Restriction Notice</p> 
                    <div className="cursor-pointer">
                        <IconsComponent type='close' />
                    </div>
                </div>
                <p className='info-14-18 my-[40px] text-center'>We've detected the following activity on your account and temporarily restricted your withdrawals to safeguard your assets. The restriction will be lifted after 24 hours.</p>
                
                <button className='solid-button w-full'>Ok</button>
            </div>
        </>
    )
}
export default RestrictionNotice;