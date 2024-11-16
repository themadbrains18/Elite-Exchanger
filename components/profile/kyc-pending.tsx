import React from 'react'
import IconsComponent from '../snippets/icons';
import Image from 'next/image';

/**
 * Props interface for the KYC (Know Your Customer) pending component.
 * This interface defines the expected properties for managing the state and functionality
 * of the KYC process when it is in a pending state, handling user session and UI elements.
 *
 * @interface KycPendingProps
 */
interface KycPendingProps {
  /**
   * Optional boolean that determines whether the component should be fixed in position.
   * If `true`, the component will be fixed on the screen; otherwise, it will be scrollable.
   * @type {boolean}
   */
  fixed?: boolean;
  /**
   * Optional number representing a display condition.
   * It can be used to control visibility or trigger certain states of the component.
   * @type {number}
   */
  show?: number;
  /**
   * Optional function to set the visibility or update the state of the component.
   * This function can be used to modify the display of the component based on user interaction.
   * @type {Function | any}
   */
  setShow?: Function | any;
  /**
   * Optional number, possibly representing the user's KYC status or step in the process.
   * It could help determine the component's behavior, like the progress or pending status.
   * @type {number}
   */
  num?: number;
  /**
   * Optional session object containing user-specific session data.
   * This data could include authentication details, user information, or session state.
   * @type {any}
   */
  session?: any;
}

const KycPending = (props: KycPendingProps) => {
  return (
    <div className={` ${props.show == 3 && "!left-[50%]"} ${props.fixed
      ? " duration-300 p-5 md:p-40 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary "
      : "p-5 md:p-40  block"
      }} overflow-y-auto`}>
      {/* only for mobile view */}
      <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0  w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
        <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
          <div
            onClick={() => {
              props.setShow(0);
            }}
          >
            <IconsComponent type="backIcon" hover={false} active={false} />
          </div>
          <div className="text-center">
            <p className="sec-title">KYC Verification</p>
          </div>

        </div>
      </div>
      <div className='flex items-center justify-between gap-20 mb-[46px]'>
        <p className="sec-title">KYC Verification</p>
        <div className='flex items-center gap-10'>
          <IconsComponent type="kychold" hover={false} active={false} width={20} height={20} />
          <p className='nav-text-sm'>Unverified</p>
        </div>
      </div>
      <div>
        <p className='nav-text-lg !text-[18px] mb-[10px]'>Please wait while we are verify your documents. This may take a few minutes.</p>
        <Image src="/assets/kyc/kyc-under-process.jpg" alt='image-description' width={1047} height={691} className='max-w-full w-full' />
      </div>
    </div>
  )
}

export default KycPending;