import React from "react";

const ContactForm = () => {
  return (
    <section className="md:py-[100px] py-[60px] bg-white dark:bg-black">
      <div className="container">
        <div className="mb-30 md:mb-[60px] max-w-[721px] w-full">
          <h1 className="sec-title !text-[19px] md:!text-[28px] md:mb-[20px] mb-[10px]">
            Leave a Reply
          </h1>
          <p className="info-16-18 dark:!text-beta !text-[12px] md:!text-[16px] !leading-[18px] md:!leading-[24px]">
            Your email address will not be published. Required fields are marked
          </p>
        </div>
        <div className="max-w-[780px] w-full">
          <div className="flex gap-[15px] md:gap-30 md:flex-row flex-col mb-[15px] md:mb-[30px]">
            <div className="w-full">
              <label className="mb-10 sm-text ">*Full Name</label>
              <div className="py-[12px] mb:py-[14px] px-10 md:px-20 bg-[#F1F2F4] rounded-[5px] w-full ">
                <input
                  type="text"
                  placeholder="Type here"
                  className="outline-none border-none bg-[transparent]"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="mb-10 sm-text ">*Email Address</label>
              <div className="py-[12px] mb:py-[14px] px-10 md:px-20 bg-[#F1F2F4] rounded-[5px]  w-full">
                <input
                  type="text"
                  placeholder="Type here"
                  className="outline-none border-none bg-[transparent]"
                />
              </div>
            </div>
          </div>
          <div className="mb-[30px] md:mb-[50px]">
            <label className="mb-10 sm-text ">*Comment</label>
            <div className="py-[12px] mb:py-[14px] px-10 md:px-20 bg-[#F1F2F4] rounded-[5px]">
              <textarea
                id="editor"
                rows={8}
                className="w-full bg-[transparent] outline-none resize-none	"
              />
            </div>
          </div>
          <div className="mb-[30px]">
            <p className="sec-text text-xs md:text-lg leading-[18px] md:leading-24 text-[#232530] dark:text-white mb-[15px] md:mb-20">Privacy Policy Agreement</p>
            <div className={`flex gap-5 items-center  w-full cursor-pointer bg-[transparent]`} >
                <input id={`custom-radio`} type="radio" value=""  name="colored-radio" className="hidden contactform w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]" />
                <label htmlFor={`custom-radio`} className="
              custom-radio relative  px-[17px]  flex gap-2 items-center pl-[18px]
              cursor-pointer
              after:dark:bg-omega
              after:bg-white
              after:left-[0px]
              after:w-[20px] 
              after:h-[20px]
              after:rounded-[50%] 
              after:border after:border-beta
              after:absolute

              before:dark:bg-[transparent]
              before:bg-white
              before:left-[5px]
  
              before:w-[10px] 
              before:h-[10px]
              before:rounded-[50%] 
              before:absolute
              before:z-[1]
              
              ">
                  <p className="ml-2 md-text">    I agree to the <span className="text-primary">Terms & Conditions</span>  and <span className="text-primary">Privacy Policy </span>.</p>
                </label>
              </div>
          </div>
          <button className="solid-button">Post Comment</button>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
