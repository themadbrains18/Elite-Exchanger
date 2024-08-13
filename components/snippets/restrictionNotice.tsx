import IconsComponent from "./icons"

interface popupprops {
    setShowNotice:(value: boolean) => void
}
const RestrictionNotice = (props:popupprops) =>{
    return(
        <>
            <div className="bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-80 visible" onClick={()=>{props?.setShowNotice(false)}}></div>
            <div className='max-w-[calc(100%-30px)] md:max-w-[600px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                <div className='flex items-center justify-between'>
                    <p className="sec-title">Security Notice</p> 
                    <div className="cursor-pointer" onClick={()=>{props?.setShowNotice(false)}}>
                        <IconsComponent type='close' />
                    </div>
                </div>
                <p className='info-14-18 my-[20px] md:my-[40px] text-center'>Withdrawals and deposits are temporarily disabled due to your recent password reset. Please try again after 24 hours for your security.</p>
                
                <button className='solid-button w-full' onClick={()=>{props?.setShowNotice(false)}}>Ok</button>
            </div>
        </>
    )
}
export default RestrictionNotice;