import Image from "next/image";
import React from "react";
import IconsComponent from "../snippets/icons";

const NewsDetail = () => {
  return (
    <section className="md:py-[100px] py-[60px] bg-white dark:bg-black">
      <div className="container">
        <div className=" flex gap-[30px] items-center  lg:flex-nowrap flex-wrap pb-30 md:pb-[60px]">
          <div className="lg:order-1 order-2">
            <div className="flex gap-10 items-center pb-[15px]">
              <p className="md-text dark:text-grey-v-1 text-beta !font-medium">
                Posted By -
              </p>
              <Image
                src="/assets/news/Avatar.png"
                alt="Laptop-image"
                className=""
                width={32}
                height={32}
              />
              <p className="md-text dark:text-grey-v-1 text-beta !font-medium">
                Updated on: 14 September 2023
              </p>
            </div>
            <p className="md:text-[52px] text-[24px] font-semibold md:font-bold leading-normal text-[#232530] dark:text-white pb-[15px] md:pb-30">
              Tech titans meet US lawmakers, Musk seeks “Referee” for AI
            </p>
            <p className="md-text text-nav-primary font-medium pb-[15px]">
              8 min read
            </p>
            <div className="flex gap-[6px] items-center">
              <IconsComponent type="comment" active={false} hover={false} />
              <p className="md-text dark:text-grey-v-1 text-beta font-medium">
                Comment
              </p>
            </div>
          </div>
          <div className="hero_right w-full max-w-full lg:max-w-[50%] lg:flex lg:items-center order-1 lg:order-2">
            <Image
              src="/assets/news/feature-news-img.png"
              alt="Laptop-image"
              className="block w-full"
              width={730}
              height={443}
            />
          </div>
        </div>
        <div>
          <p className="text-sm md:text-[28px] font-normal md:leading-normal leading-5 dark:text-white text-[#232530] pb-20 md:pb-30">
            Tesla boss Elon Musk called for a "referee" for artificial
            intelligence (AI) after he, Meta chief Mark Zuckerberg, Alphabet
            boss Sundar Pichai and other tech CEOs met with US lawmakers to
            discuss AI regulation.
          </p>
          <p className="pb-10 md:pb-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Musk said there was a need for a regulator to ensure the safe use of
            AI.{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            "It's important for us to have a referee," Musk told reporters,
            comparing it to sports. The billionaire, who also owns the social
            media platform X, added that a regulator would "ensure that
            companies take actions that are safe and in the interest of the
            general public."{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Musk said the meeting was a "service to humanity" and said it "may
            go down in history as very important to the future of civilization."
            The billionaire confirmed he had called AI "a double-edged sword"
            during the forum.{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Zuckerberg said Congress "should engage with AI to support
            innovation and safeguards. This is an emerging technology, there are
            important equities to balance here, and the government is ultimately
            responsible for that."{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            He added it was "better that the standard is set by American
            companies that can work with our government to shape these models on
            important issues."{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            More than 60 senators took part. Lawmakers said there was universal
            agreement about the need for government regulation of AI.{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            "We are beginning to really deal with one of the most significant
            issues facing the next generation, and we got a great start on it
            today," Democratic Senate Majority Leader Chuck Schumer, who
            organized the forum, told reporters after the meetings. "We have a
            long way to go."{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Republican Senator Todd Young, a co-host of the forum, said he
            believes the Senate is "getting to the point where I think
            committees of jurisdiction will be ready to begin their process of
            considering legislation
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            But Republican Senator Mike Rounds cautioned it would take time for
            Congress to act. "Are we ready to go out and write legislation?
            Absolutely not," Rounds said. "We're not there."{" "}
          </p>
          <p className="pt-10 md:pt-20 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Lawmakers are seeking ways to mitigate dangers of the emerging
            technology, which has boomed in investment and consumer popularity
            since the release of OpenAI's ChatGPT chatbot.
          </p>
        </div>
        <div className="py-[30px] md:py-[60px] relative">
          <Image
            src="/assets/news/news-desktop.png"
            alt="Laptop-image"
            className="hidden lg:block w-full relative rounded-10"
            width={1590}
            height={485}
          />
          <Image
            src="/assets/news/news-video.png"
            alt="Laptop-image"
            className="lg:hidden block w-full "
            width={345}
            height={210}
          />
          <div className="p-[5px] lg:p-[10px] top-[50%] right-[50%] absolute bg-[#ffffff12] translate-x-1/2 -translate-y-1/2">
            <Image
              src="/assets/news/yotubeicon.svg"
              alt="Laptop-image"
              className=" block  md:w-[82px] w-[26px]"
              width={26}
              height={26}
            />
          </div>
        </div>
        <div>
          <p className="text-sm md:text-[28px] font-normal md:leading-normal leading-5 dark:text-white text-[#232530] pb-20 md:pb-30">
          Lawmakers want safeguards against potentially dangerous deep fakes such as bogus videos, election interference and attacks on critical infrastructure.
          </p>
          <p className="pb-10 md:pb-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
            Musk said there was a need for a regulator to ensure the safe use of
            AI.{" "}
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          Other attendees included Nvidia CEO Jensen Huang, Microsoft CEO Satya Nadella, IBM CEO Arvind Krishna, former Microsoft CEO Bill Gates and AFL-CIO labor federation President Liz Shuler.
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          Schumer emphasized the need for regulation ahead of the 2024 US general election, particularly around deep fakes.
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          "A lot of things that have to be done, but that one has a quicker timetable maybe than some of the others," he said.
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          March, Musk and a group of AI experts and executives called for a six-month pause in developing systems more powerful than OpenAI's GPT-4, citing potential risks to society
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          Regulators globally have been scrambling to draw up rules governing the use of generative AI, which can create text and generate images whose artificial origins are virtually undetectable.
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          On Tuesday, Adobe, IBM, Nvidia and five other companies said they had signed President Joe Biden's voluntary AI commitments requiring steps such as watermarking AI-generated content.
          </p>
          <p className="py-10 md:py-20 border-b-[0.5px] dark:border-[#ccced94d] border-grey-v-1 sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-gamma dark:text-beta">
          The commitments, announced in July, are aimed at ensuring AI's power is not used for destructive purposes. Google, OpenAI and Microsoft signed on in July. The White House has also been working on an AI executive order.
          </p>
        
        </div>
      </div>
    </section>
  );
};

export default NewsDetail;
