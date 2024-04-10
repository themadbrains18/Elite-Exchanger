import React from 'react'
interface propsData {
  password: string;
}
const StrengthCheck2 = ((props: propsData) => {
  const atLeastOneUppercase = /[A-Z]/g; // capital letters from A to Z
  const atLeastOneLowercase = /[a-z]/g; // small letters from a to z
  const atLeastOneNumeric = /[0-9]/g; // numbers from 0 to 9
  const atLeastOneSpecialChar = /[!@#$%^&*()_+{};:<>,.?0]/g; // any of the special characters within the square brackets
  const eightCharsOrMore = /.{8,}/g; // eight characters or more

  const passwordTracker = {
    uppercase: props.password.match(atLeastOneUppercase),
    lowercase: props.password.match(atLeastOneLowercase),
    number: props.password.match(atLeastOneNumeric),
    specialChar: props.password.match(atLeastOneSpecialChar),
    eightCharsOrGreater: props.password.match(eightCharsOrMore),
  }
  const passwordStrength = Object.values(passwordTracker).filter(value => value).length;

  return (
    <div className='bg-white shadow-md rounded-[12px] border-[#ebebeb] px-[14px] pt-[16px] pb-[6px] absolute top-[50px] z-[10] right-0'>
      <div>
        <ul className='checklist max-w-[220px] w-full'>
          <li className='text-[12px] leading-[16px] text-[#1f1f1f] mb-[10px] font-medium inline-flex items-center'>
            <span data-v-545b106c="" data-v-3c9c92ba="" className={` border-solid border-[1px]  rounded-[50%] w-[14px] h-[14px] mr-[4px] inline-flex items-center justify-center ${props.password.length >= 8? 'bg-[#1f1f1f] border-white':'border-[#1f1f1f] bg-[#fff]'}`}>
              <svg data-v-545b106c="" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none" className={`${props.password.length >= 8 ? 'inline-block' : 'hidden'}`}><path d="M7.82811 0.466824C7.7955 0.388148 7.74769 0.316671 7.68744 0.256481C7.62725 0.196224 7.55577 0.148423 7.47709 0.115808C7.39842 0.083194 7.31409 0.0664062 7.22892 0.0664062C7.14375 0.0664062 7.05942 0.083194 6.98074 0.115808C6.90206 0.148423 6.83059 0.196224 6.7704 0.256481L2.69231 4.33537L1.20658 2.84883C1.08497 2.72722 0.920034 2.6589 0.748056 2.6589C0.576077 2.6589 0.411142 2.72722 0.289534 2.84883C0.167927 2.97043 0.0996094 3.13537 0.0996094 3.30735C0.0996094 3.47933 0.167927 3.64426 0.289534 3.76587L2.23379 5.71013C2.29398 5.77038 2.36546 5.81819 2.44414 5.8508C2.52281 5.88341 2.60715 5.9002 2.69231 5.9002C2.77748 5.9002 2.86182 5.88341 2.94049 5.8508C3.01917 5.81819 3.09065 5.77038 3.15084 5.71013L7.68744 1.17352C7.74769 1.11333 7.7955 1.04186 7.82811 0.963181C7.86073 0.884504 7.87751 0.800171 7.87751 0.715002C7.87751 0.629834 7.86073 0.545501 7.82811 0.466824Z" fill="white"></path></svg></span>
            8 to 32 characters
          </li>
          <li className='text-[12px] leading-[16px] text-[#1f1f1f] mb-[10px] font-medium inline-flex items-center'>
            <span data-v-545b106c="" data-v-3c9c92ba="" className={` border-solid border-[1px]  rounded-[50%] w-[14px] h-[14px] mr-[4px] inline-flex items-center justify-center ${passwordTracker.uppercase ? 'bg-[#1f1f1f] border-white':'border-[#1f1f1f] bg-[#fff]'}`}>
              <svg data-v-545b106c="" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none" className={`${passwordTracker.uppercase ? 'inline-block' : 'hidden'}`}><path d="M7.82811 0.466824C7.7955 0.388148 7.74769 0.316671 7.68744 0.256481C7.62725 0.196224 7.55577 0.148423 7.47709 0.115808C7.39842 0.083194 7.31409 0.0664062 7.22892 0.0664062C7.14375 0.0664062 7.05942 0.083194 6.98074 0.115808C6.90206 0.148423 6.83059 0.196224 6.7704 0.256481L2.69231 4.33537L1.20658 2.84883C1.08497 2.72722 0.920034 2.6589 0.748056 2.6589C0.576077 2.6589 0.411142 2.72722 0.289534 2.84883C0.167927 2.97043 0.0996094 3.13537 0.0996094 3.30735C0.0996094 3.47933 0.167927 3.64426 0.289534 3.76587L2.23379 5.71013C2.29398 5.77038 2.36546 5.81819 2.44414 5.8508C2.52281 5.88341 2.60715 5.9002 2.69231 5.9002C2.77748 5.9002 2.86182 5.88341 2.94049 5.8508C3.01917 5.81819 3.09065 5.77038 3.15084 5.71013L7.68744 1.17352C7.74769 1.11333 7.7955 1.04186 7.82811 0.963181C7.86073 0.884504 7.87751 0.800171 7.87751 0.715002C7.87751 0.629834 7.86073 0.545501 7.82811 0.466824Z" fill="white"></path></svg></span>
              At least 1 uppercase
          </li>
          <li className='text-[12px] leading-[16px] text-[#1f1f1f] mb-[10px] font-medium inline-flex items-center'>
            <span data-v-545b106c="" data-v-3c9c92ba="" className={` border-solid border-[1px]  rounded-[50%] w-[14px] h-[14px] mr-[4px] inline-flex items-center justify-center ${passwordTracker.lowercase ? 'bg-[#1f1f1f] border-white':'border-[#1f1f1f] bg-[#fff]'}`}>
              <svg data-v-545b106c="" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none" className={`${passwordTracker.lowercase ? 'inline-block' : 'hidden'}`}><path d="M7.82811 0.466824C7.7955 0.388148 7.74769 0.316671 7.68744 0.256481C7.62725 0.196224 7.55577 0.148423 7.47709 0.115808C7.39842 0.083194 7.31409 0.0664062 7.22892 0.0664062C7.14375 0.0664062 7.05942 0.083194 6.98074 0.115808C6.90206 0.148423 6.83059 0.196224 6.7704 0.256481L2.69231 4.33537L1.20658 2.84883C1.08497 2.72722 0.920034 2.6589 0.748056 2.6589C0.576077 2.6589 0.411142 2.72722 0.289534 2.84883C0.167927 2.97043 0.0996094 3.13537 0.0996094 3.30735C0.0996094 3.47933 0.167927 3.64426 0.289534 3.76587L2.23379 5.71013C2.29398 5.77038 2.36546 5.81819 2.44414 5.8508C2.52281 5.88341 2.60715 5.9002 2.69231 5.9002C2.77748 5.9002 2.86182 5.88341 2.94049 5.8508C3.01917 5.81819 3.09065 5.77038 3.15084 5.71013L7.68744 1.17352C7.74769 1.11333 7.7955 1.04186 7.82811 0.963181C7.86073 0.884504 7.87751 0.800171 7.87751 0.715002C7.87751 0.629834 7.86073 0.545501 7.82811 0.466824Z" fill="white"></path></svg></span>
              At least 1 lowercase
          </li>
          <li className='text-[12px] leading-[16px] text-[#1f1f1f] mb-[10px] font-medium inline-flex items-center'>
            <span data-v-545b106c="" data-v-3c9c92ba="" className={` border-solid border-[1px]  rounded-[50%] w-[14px] h-[14px] mr-[4px] inline-flex items-center justify-center ${passwordTracker.specialChar ? 'bg-[#1f1f1f] border-white':'border-[#1f1f1f] bg-[#fff]'}`}>
              <svg data-v-545b106c="" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none" className={`${passwordTracker.specialChar? 'inline-block' : 'hidden'}`}><path d="M7.82811 0.466824C7.7955 0.388148 7.74769 0.316671 7.68744 0.256481C7.62725 0.196224 7.55577 0.148423 7.47709 0.115808C7.39842 0.083194 7.31409 0.0664062 7.22892 0.0664062C7.14375 0.0664062 7.05942 0.083194 6.98074 0.115808C6.90206 0.148423 6.83059 0.196224 6.7704 0.256481L2.69231 4.33537L1.20658 2.84883C1.08497 2.72722 0.920034 2.6589 0.748056 2.6589C0.576077 2.6589 0.411142 2.72722 0.289534 2.84883C0.167927 2.97043 0.0996094 3.13537 0.0996094 3.30735C0.0996094 3.47933 0.167927 3.64426 0.289534 3.76587L2.23379 5.71013C2.29398 5.77038 2.36546 5.81819 2.44414 5.8508C2.52281 5.88341 2.60715 5.9002 2.69231 5.9002C2.77748 5.9002 2.86182 5.88341 2.94049 5.8508C3.01917 5.81819 3.09065 5.77038 3.15084 5.71013L7.68744 1.17352C7.74769 1.11333 7.7955 1.04186 7.82811 0.963181C7.86073 0.884504 7.87751 0.800171 7.87751 0.715002C7.87751 0.629834 7.86073 0.545501 7.82811 0.466824Z" fill="white"></path></svg></span>
              At least 1 special character
          </li>
          <li className='text-[12px] leading-[16px] text-[#1f1f1f] mb-[10px] font-medium inline-flex items-center'>
            <span data-v-545b106c="" data-v-3c9c92ba="" className={` border-solid border-[1px]  rounded-[50%] w-[14px] h-[14px] mr-[4px] inline-flex items-center justify-center ${passwordTracker.number ? 'bg-[#1f1f1f] border-white':'border-[#1f1f1f] bg-[#fff]'}`}>
              <svg data-v-545b106c="" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none" className={`${passwordTracker.number ? 'inline-block' : 'hidden'}`}><path d="M7.82811 0.466824C7.7955 0.388148 7.74769 0.316671 7.68744 0.256481C7.62725 0.196224 7.55577 0.148423 7.47709 0.115808C7.39842 0.083194 7.31409 0.0664062 7.22892 0.0664062C7.14375 0.0664062 7.05942 0.083194 6.98074 0.115808C6.90206 0.148423 6.83059 0.196224 6.7704 0.256481L2.69231 4.33537L1.20658 2.84883C1.08497 2.72722 0.920034 2.6589 0.748056 2.6589C0.576077 2.6589 0.411142 2.72722 0.289534 2.84883C0.167927 2.97043 0.0996094 3.13537 0.0996094 3.30735C0.0996094 3.47933 0.167927 3.64426 0.289534 3.76587L2.23379 5.71013C2.29398 5.77038 2.36546 5.81819 2.44414 5.8508C2.52281 5.88341 2.60715 5.9002 2.69231 5.9002C2.77748 5.9002 2.86182 5.88341 2.94049 5.8508C3.01917 5.81819 3.09065 5.77038 3.15084 5.71013L7.68744 1.17352C7.74769 1.11333 7.7955 1.04186 7.82811 0.963181C7.86073 0.884504 7.87751 0.800171 7.87751 0.715002C7.87751 0.629834 7.86073 0.545501 7.82811 0.466824Z" fill="white"></path></svg></span>
              At least 1 number
          </li>
        

        </ul>
        <p className='text-[12px] text-[#7d8283] fornt-bold'>Only supports: ~`!@#$%^&*()_-+={ }[]|;:,.?</p>
      </div>
    </div>
  )
})

export default StrengthCheck2
