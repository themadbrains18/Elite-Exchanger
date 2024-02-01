import Image from "next/image"


const Invite = () => {
  return (
    <div className="p-[20px] max-w-[1200px] w-full mx-auto">
        <p className="text-[20px] md:text-[28px] leading-[30px] md:leading-[36px] font-semibold mb-[16px] md:mb-[20px] dark:text-white">Invite Qualified Referee to Earn Bonuses</p>
        <p className="text-[16px] md:text-[20px] leading-[150%] font-semibold mb-[16px] dark:text-white">Complete the tasks below to unlock the bonuses. The more Qualified Referees you invite, the more rewards you get.</p>
        <div className="pt-[35px] md:pt-[50px] px-[16px] md:px-[40px] pb-[16px] md:pb-[20px] invite-bg mb-[16px] rounded-[4px] w-full">
            <div className="flex mx-auto md:flex-row flex-col items-center gap-[40px] justify-center">
                <Image src='/assets/refer/no-task.svg' width={145} height={150} alt="no-task"/>
                <div>
                    <p className="text-[20px] md:text-[24px] leading-[32px] font-semibold mb-[8px] dark:text-white">Searching for available tasks. Please check back later.</p>
                    <p className="text-[16px] leading-[24px] mb-[24px] dark:text-white">Attractive rewards await!</p>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Invite