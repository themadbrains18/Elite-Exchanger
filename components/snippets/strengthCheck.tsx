interface propsData {
    password: string;
}

const StrengthCheck = (props: propsData) => {
    const atLeastOneUppercase = /[A-Z]/g; // capital letters from A to Z
    const atLeastOneLowercase = /[a-z]/g; // small letters from a to z
    const atLeastOneNumeric = /[0-9]/g; // numbers from 0 to 9
    const atLeastOneSpecialChar = /[#?!@$%^&*-]/g; // any of the special characters within the square brackets
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
        <>
            <div>
                <div className="flex justify-between gap-[20px] items-center">
                    <div className="password-strength-meter" style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: `${['red', 'orange', '#03a2cc', '#03a2cc', '#0ce052']
                        [passwordStrength - 1] || ''
                            }`,
                        display: 'block',
                        borderRadius: '3px',
                        height: '5px'
                    }}></div>
                    <div className="sm-text text-gamma dark:text-white">
                        {['Too Weak', 'Medium', 'Average', 'Good', 'Strong']
                        [passwordStrength - 1] || ''
                            }
                    </div>
                </div>


                {/* <div>
                    <h3 className="checklist-title">Password should be</h3>
                    <ul className='checklist'>
                        <li>
                            {passwordStrength < 5 && 'Password must contain eight characters or more'}
                        </li>
                        <li>{!passwordTracker.uppercase && 'at least 1 uppercase'}</li>
                        <li>{!passwordTracker.lowercase && 'at least 1 lowercase'}</li>
                        <li>{!passwordTracker.specialChar && 'at least 1 special character'}</li>
                        <li>{!passwordTracker.number && 'at least 1 number'}</li>
                    </ul>
                </div> */}

            </div>


        </>

    )
}

export default StrengthCheck;