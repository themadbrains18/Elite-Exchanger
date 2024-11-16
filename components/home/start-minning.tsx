import Image from 'next/image';
import React, { useState } from 'react';
import ETH from '../../public/assets/home/etherium-bg.png';
import BitCoin from '../../public/assets/home/bitcoin-bg.png';
import { toast, ToastContainer } from 'react-toastify';

const StartMinning = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  /**
   * Handles form submission for email subscription.
   * Validates the email format and shows appropriate success or error messages.
   * If valid, shows a success toast, resets the email input, and disables the submit button temporarily.
   * If invalid, displays an error message below the input field.
   * 
   * @returns {void}
   */
  const handleSubmit = () => {
    setShowToast(true);
    const emailRegex = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(email)) {
      setErrorMessage('');
      toast.success("Subscribe successfully!!", { autoClose: 2000 })
      setTimeout(() => {
        setShowToast(false);
        setEmail('')
      }, 3000);
    } else {
      setErrorMessage('Invalid email address');
      setShowToast(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className='py-[30px] md:py-100 dark:bg-black-v-1'>
        <div className="container max-w-[1272px] px-20 py-60 lg:p-50 bg-[#3671E9] lg:rounded-16 relative">
          <Image src={ETH} width={170} height={185} alt='error' className='absolute top-0 left-0' />
          <Image src={BitCoin} width={170} height={185} alt='error' className='absolute bottom-0 right-0' />
          <div className='flex items-center flex-col lg:flex-row justify-between relative z-1'>
            <div className='max-w-full md:max-w-[368px] w-full text-center mb-[50px] lg:mb-0 lg:text-start'>
              <h3 className='lg-heading text-[23px] md:text-[39px] mb-[17px] !text-white'>Start mining now</h3>
              <p className='sec-text !text-white'>Join now with us to get the latest news and start mining now</p>
            </div>
            <div className='flex flex-col sm:flex-row items-center gap-[42px] max-w-full md:max-w-[598px] w-full justify-center lg:justify-end'>
              <div className=' max-w-[396px] w-full'>

                <input
                  type="email"
                  id='miningEmail'
                  name='miningEmail'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pb-[10px] sec-text text-[16px] md:text-[18px] w-full !text-white outline-none border-b placeholder:text-white dark:border-white border-[#ffffff66] bg-[transparent]'
                />
                {errorMessage && <p className='errorMessage mt-2'>{errorMessage}</p>}
              </div>
              <button
                type='submit'
                className={`w-full sm:w-auto pill-solid-button hover:text-primary ${showToast ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={handleSubmit}
                disabled={showToast}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default StartMinning;
