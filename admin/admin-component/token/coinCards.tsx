import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React from "react";

const CoinCards = () => {
  let data = [
    {
      title: "Total Coins",
      total: "4684",
      percent: "1.5%",
      bg: "bg-[#42A5F5]",
    },
    {
      title: "Active Wallet Coins",
      total: "1,99,81200",
      percent: "5.3%",
      bg: "bg-[#ED5868]",
    },
    {
      title: "Top Holders",
      total: "546",
      percent: "2.4%",
      bg: "bg-[#1B283F]",
    },
  ];

  return (
    <section>
      <div className="relative mb-6">
        <Image
          src="/assets/admin/tokenoverlay.svg"
          width={795}
          height={217}
          alt="token-overlay"
          className="w-full "
        />

        <div className="absolute top-6 right-6 max-w-[360px] w-full">
          <p className="text-[34px] font-normal font-public-sans leading-[41px] text-white mb-[5px]">
            Dashboard Analysis
          </p>
          <p className="admin-table-data !text-white">
            With all of the styling tool options available in today's market
          </p>
        </div>
        <div className="flex rounded-[6px] bg-[#3699FF] py-[6px] px-5 w-max items-center absolute right-[21px] bottom-6">
          <p className="text-sm text-white leading-6 font-medium">Updates</p>
          <AdminIcons type="right-arrow" hover={false} active={false} />
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        {data?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className={`px-5 py-[10px] rounded-10 ${item?.bg} w-full`}
            >
              <div className=" mb-[10px]">
                <p className="text-sm font-public-sans text-white leading-5 font-normal">
                  {item?.title}
                </p>
              </div>
              <div className="flex gap-[5px] items-center mb-1">
                <p className="text-xl font-public-sans text-white leading-8 font-medium">
                  {item?.total}
                </p>
                <span className="bg-[#D7F9EF] py-[2px] px-1 rounded-5 flex">
                  <p className="text-xs font-public-sans font-medium leading-5 text-[#0BB783]">
                    +{item?.percent}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M14.0416 5.70833L15.2416 6.90833L11.1749 10.975L8.43328 8.23333C8.10828 7.90833 7.58328 7.90833 7.25828 8.23333L2.25828 13.2417C1.93328 13.5667 1.93328 14.0917 2.25828 14.4167C2.58328 14.7417 3.10828 14.7417 3.43328 14.4167L7.84161 10L10.5833 12.7417C10.9083 13.0667 11.4333 13.0667 11.7583 12.7417L16.4166 8.09167L17.6166 9.29167C17.8749 9.55 18.3249 9.36667 18.3249 9V5.41667C18.3333 5.18333 18.1499 5 17.9166 5H14.3416C13.9666 5 13.7833 5.45 14.0416 5.70833Z"
                      fill="#0BB783"
                    />
                  </svg>
                </span>
              </div>
              <p className="text-sm font-public-sans font-normal text-[#ECF0F3] leading-5">
                Compared to 1,20,15500 last month
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CoinCards;
