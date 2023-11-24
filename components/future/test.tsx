import Image from "next/image";
import Link from "next/link";
const BlockBusterCard = () => {
    return (
        <div className="max-w-[300px] w-full mx-auto parentWrapper relative">
            <div className="relative group ">
                <div className="blockBusterCard max-w-[306px] w-full relative  duration-500 linear peer">
                    <Image
                        src="/assets/news/feature-news-img.png"
                        width={306}
                        height={302}
                        alt="Picture of the Card"
                        className="rounded-[8px] md:rounded-[15px]"
                    />
                    <div className="layer  absolute  bottom-1/2 left-1/2 -translate-x-2/4 translate-y-2/4 w-0 h-0 md:group-hover:h-full  md:group-hover:w-full md:group-hover:-translate-y-none  md:group-hover:right-full duration-500 bg-black bg-opacity-20 rounded-[8px] md:rounded-[15px]"></div>

                </div>
                <Link href="#" className="imageLogo  hover:bottom-1/2 peer-hover:bottom-1/2 hidden md:block group max-w-[197px] w-full rounded-[10px] border-[transparent] hover:border-primary-900  border-[1px] shadow-[0px_4px_15px_0px_#0000002e] bg-white py-[11px] px-[30px] absolute bottom-0 left-1/2 translate-y-2/4 -translate-x-2/4 duration-500" >
                    <Image
                        src="/assets/home/investorLogo1.png"
                        width={120}
                        height={35}
                        alt="Icon"
                        className="block m-auto group-hover:scale-90 duration-500 linear w-[auto] h-[auto] "
                    />

                </Link>
            </div>
        </div>
    );
};
export default BlockBusterCard;







