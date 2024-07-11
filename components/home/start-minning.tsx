import Image from 'next/image';
import React, { useState } from 'react';
import ETH from '../../public/assets/home/etherium-bg.png';
import BitCoin from '../../public/assets/home/bitcoin-bg.png';
import { toast, ToastContainer } from 'react-toastify';

const StartMinning = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
      setShowToast(true);
    const emailRegex = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(email)) {
      setErrorMessage('');
      toast.success("Subscribe successfully!!", {autoClose:2000})
      // Simulate successful subscription (you can replace this with your actual subscription logic)
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
              className={`w-full sm:w-auto pill-solid-button hover:text-primary ${showToast?'cursor-not-allowed':'cursor-pointer'}`}
              onClick={handleSubmit}
              disabled={showToast}
            >
              {/* {showToast &&  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  } */}
              Subscribe
            </button>
          </div>
        </div>
        {/* {showToast && <p className='text-green-500 mt-2'>Subscribe successfully</p>} */}
      </div>
    </section>
    </>
  );
}

export default StartMinning;
