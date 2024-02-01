import Image from "next/image";

const Participate = () => {

  const participation=[
    {
      price:10,
      desc:"Invite a friend who deposits a minimum of $100 and achieves a trading volume of $500 within seven (7) days of signing up."
    },
    {
      price:20,
      desc:"Invite a friend who deposits at least $25,000 during the event period."
    },
    {
      price:100,
      desc:"Invite a friend who trades at least $4,000,000 during the event period."
    },
    {
      price:400,
      desc:"Invite a friend who trades at least $10,000,000 during the event period."
    },
  ]





  return (
    <div className="py-40 lg:px-0 px-[10px]">
      <div className="max-w-[1200px] w-full flex flex-col mx-auto items-center ">

        <h2 className="text-[32px] font-bold leading-[40px] mb-[60px] dark:text-white text-black text-center w-full">How to Participate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {
            participation?.map((item:any,index:number)=>{
              return(
                <div key={index} className="rounded-[8px] overflow-hidden bg-white">
                  <div className="py-[19px] px-[23px] bg-primary  w-full whitespace-nowrap">
                    <div className="relative">
                    <p className="text-white text-[20px] tracking-[0.25px] leading-[42px] font-bold ">{item?.price} USDT Bonus</p>

                    <Image src="/assets/refer/stars.png" width={40} height={40} alt="stars" className="absolute right-[-10px]  top-[-10px]  brightness-0 z-0"/>
                    </div>

                  </div>
                  <div className="py-[19px] px-[23px] w-full bg-white">
                    <p className="text-[14px] tracking-[0.25px]">{item?.desc}</p>

                  </div>

                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Participate;
