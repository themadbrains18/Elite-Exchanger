import Link from 'next/link'
import React, { Fragment } from 'react'
import IconsComponent from '../snippets/icons'

const FooterNav = () => {
    const Exchange =[
        {
            "linktext":"Exchange Home",
            "linkurl":"#"
        },
        {
            "linktext":"Margin Tranding",
            "linkurl":"#"
        },
        {
            "linktext":"Derivatives Trading",
            "linkurl":"#"
        },
        {
            "linktext":"Supercharger",
            "linkurl":"#"
        }
    ]
    const Support =[
        {
            "linktext":"Request form",
            "linkurl":"#"
        },
        {
            "linktext":"Contact Support",
            "linkurl":"#"
        },
        {
            "linktext":"FAQ",
            "linkurl":"#"
        },
        {
            "linktext":"Security",
            "linkurl":"#"
        },
    ]
    const Company =[
        {
            "linktext":"About us",
            "linkurl":"#"
        },
        {
            "linktext":"Careers",
            "linkurl":"#"
        },
        {
            "linktext":"News",
            "linkurl":"/news"
        },
        {
            "linktext":"Security",
            "linkurl":"#"
        },
        {
            "linktext":"Community",
            "linkurl":"#"
        },
        {
            "linktext":"Announcements",
            "linkurl":"#"
        },
    ]
    const Resources =[
        {
            "linktext":"Downloads",
            "linkurl":"#"
        },
        {
            "linktext":"Desktop Aplication",
            "linkurl":"#"
        },
        {
            "linktext":"Buy Crypto",
            "linkurl":"#"
        },
        {
            "linktext":"Referral Program",
            "linkurl":"/refer"
        },
        {
            "linktext":"Listing Tranding",
            "linkurl":"#"
        }
    ]
  return (
    <div>
        <div className='flex items-start gap-y-[40px] md:gap-[20px] justify-between xl:justify-unset flex-wrap xl:flex-nowrap '>
            <div className='max-w-[calc(50%-10px)] md:max-w-[23%] xl:max-w-[17%] w-full'>
                <h4 className='footer-heading !text-white mb-[21px] md:mb-[31px]'>Exchange</h4>
                <ul>
                    {
                        Exchange.map((elem,ind)=>{
                            return(
                                <Fragment key={ind}>
                                    <li className='mb-[11px] md:mb-[21px]'>
                                        <Link prefetch={false} href={elem.linkurl} className='footer-text hover:text-primary'>
                                            {elem.linktext}
                                        </Link>
                                    </li>
                                </Fragment>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='max-w-[calc(50%-10px)] md:max-w-[23%] xl:max-w-[17%] w-full'>
                <h4 className='footer-heading !text-white mb-[21px] md:mb-[31px]'>Support</h4>
                <ul>
                    {
                        Support.map((elem,ind)=>{
                            return(
                                <Fragment key={ind}>
                                    <li className='mb-[11px] md:mb-[21px]'>
                                        <Link prefetch={false} href={elem.linkurl} className='footer-text hover:text-primary'>
                                            {elem.linktext}
                                        </Link>
                                    </li>
                                </Fragment>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='max-w-[calc(50%-10px)] md:max-w-[23%] xl:max-w-[17%] w-full'>
                <h4 className='footer-heading !text-white mb-[21px] md:mb-[31px]'>Company</h4>
                <ul>
                    {
                        Company.map((elem,ind)=>{
                            return(
                                <Fragment key={ind}>
                                    <li className='mb-[11px] md:mb-[21px] last:mb-[6px]'>
                                        <Link prefetch={false} href={elem.linkurl} className='footer-text hover:text-primary'>
                                            {elem.linktext}
                                        </Link>
                                    </li>
                                </Fragment>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='max-w-[calc(50%-10px)] md:max-w-[23%] xl:max-w-[17%] w-full'>
                <h4 className='footer-heading !text-white mb-[21px] md:mb-[31px]'>Resources</h4>
                <ul>
                    {
                        Resources.map((elem,ind)=>{
                            return(
                                <Fragment key={ind}>
                                    <li className='mb-[11px] md:mb-[21px] last:mb-[6px]'>
                                        <Link prefetch={false} href={elem.linkurl} className='footer-text hover:text-primary'>
                                            {elem.linktext}
                                        </Link>
                                    </li>
                                </Fragment>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='max-w-full xl:max-w-[32%] w-full'>
                {/* <div>
                    <h4 className='footer-heading !text-white mb-[21px] md:mb-[31px]'>NewsLetter</h4>
                    <form onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
                        <div className='flex gap-[5px]'>
                            <input id='newslatter' name='newslatter' type="email" placeholder='Enter your email' className='sm-text text-[14px] !text-white px-10 py-[13px] md:py-[15px] max-w-[321px] w-full block bg-[transparent] border border-[#8AC8FF] rounded-5 focus:outline-none' />
                            <button className='solid-button !text-[16px] rounded-[5px] md:rounded-[10px] p-[13px] md:p-[15px]'>Send</button>
                        </div>
                    </form>
                </div> */}
                <p className='info-14-18  md:text-[18px] text-[16px] !text-footer-text  mb-[20px] md:mb-30'>We accept following payment systems</p>
                <div className='flex items-center gap-[13px] flex-wrap'>
                    <div  className='block max-w-[67px] md:max-w-[91px] w-full' >
                        <IconsComponent type='paypal' hover={false} active={false} />
                    </div>
                    <div  className='block max-w-[67px] md:max-w-[91px] w-full' >
                        <IconsComponent type='masterCard' hover={false} active={false} />
                    </div>
                    <div className='block max-w-[67px] md:max-w-[91px] w-full' >
                        <IconsComponent type='bitCoin' hover={false} active={false} />
                    </div>
                    <div className='block max-w-[67px] md:max-w-[91px] w-full' >
                        <IconsComponent type='otherCards' hover={false} active={false} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FooterNav