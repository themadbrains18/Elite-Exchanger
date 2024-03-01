import React from 'react'
import IconsComponent from './icons';
import Link from 'next/link';

interface secHeaddata{
    headData: {
        title: string;
        subTitle: string;
        brief: string;
        spacing:boolean;
        Cta:boolean,
        hidden:boolean
    },
    center: boolean;
}


const SectionHead = (props:secHeaddata) => {
return (
    <div>
        <div className={`secHeader ${props.center && 'text-center'} ${props.headData.spacing && 'mb-[20px] md:mb-[36px]'}`}>
            <span className={` ${props.headData.spacing && 'block mb-[10px] md:mb-[36px]'} !text-[18px] font-normal md:mb-[15px] mb-[10px] block sec-title !text-primary`}>{props.headData.title}</span>
            <p className='sec-subTitle mb-[31px]'>{props.headData.subTitle}</p>
        </div>
        <div className={`${props.headData.spacing && 'mb-[50px] md:mb-[70px]'} secBody `}>
            <p className='sec-Brief md:!text-[18px] text-body-primary'>{props.headData.brief}</p>
        </div>
        {
            props.headData.Cta &&
            <Link href='/chart/BTC' className='sec-Brief hidden lg:flex items-center gap-[10px] !text-primary mt-[8px]'>
                <span className='block relative after:absolute after:w-full after:h-[2px] after:bg-primary after:top-[100%] after:left-0'>Start Trading</span>
                <IconsComponent type='rightArrow' hover={false} active={false}/>
            </Link>
        }
    </div>
    )
}

export default SectionHead