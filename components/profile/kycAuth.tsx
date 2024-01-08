import Image from "next/image";
import React, { FormEvent, useState } from "react";
import IconsComponent from "../snippets/icons";
import FiliterSelectMenu from "../snippets/filter-select-menu";
import CountrylistDropdown from "../snippets/country-list-dropdown";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormSubmitHandler, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  num: number;
  session?: {
    user: any;
  };
  setVerified?: Function | any;
}

type UserSubmitForm = {
  country: string;
  fname: string;
  doctype: string;
  docnumber: string;
  dob: Date;
  idfront: any;
  idback: any;
  statement: any;
};

const MAX_FILE_SIZE = 102400000; //100KB

const validFileExtensions: { [key: string]: string[] } = {
  image: ["jpg", "png", "jpeg", "svg", "zip"],
};

const schema = yup
  .object()
  .shape({
    country: yup.string().required("Please select Country"),
    fname: yup.string().required("Please enter same name as on document"),
    // lname: yup.string().required("This field is required"),
    doctype: yup.string().required("Please select Document type"),
    docnumber: yup.string().required("Please enter valid document number"),
    dob: yup
      .date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) {
          return value;
        }
        return originalValue;
      })
      .typeError("please enter a valid date")
      .required()
      .min("1950-11-13", "Please enter valid date of birth")
      .max("2020-01-01", "Please enter valid date of birth"),
    idfront: yup.mixed().required("Please upload front side of  document"),
    idback: yup.mixed().required("Please upload back side of  document"),
    statement: yup.mixed().required("Please upload bank statement"),
  })
  .required();

function isValidFileType(fileName: string | undefined, fileType: string) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(
      fileName.split(".").pop()!.toLowerCase()
    ) > -1
  );
}

const KycAuth = (props: fixSection) => {
  const [frontImg, setFrontImg] = useState("");
  const [formFrontImg, setFromFrontImg] = useState("");
  const [backImg, setBackImg] = useState("");
  const [formBackImg, setFromBackImg] = useState("");
  const [selfieImg, setSelfieImg] = useState("");
  const [formSelfieImg, setFormSelfieImg] = useState("");
  const { data: session, status } = useSession();

  const router = useRouter()

  const list = [
    { fullname: "Driving License" },
    { fullname: "Voter Id" },
    { fullname: "Aadhar Card" },
  ];

  const [startDate, setStartDate] = useState(new Date());

  let {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(schema),
  });

  const getDocumentDetail = (document: any) => {
    setValue("doctype", document?.fullname);
    clearErrors("doctype");
  };
  const getCountryChange = (country: any) => {
    setValue("country", country);
    clearErrors("country");
  };
  const handleDate = (date: any) => {
    setValue("dob", date);
    setStartDate(date);
    clearErrors("dob");
  };

  const handleFileChange = async (e: any) => {
    let files = e.target.files[0];
    setValue("idfront", files);
    setFromFrontImg(files)
    clearErrors("idfront");
    if (files) {
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function (e: any) {
        setFrontImg(reader?.result as string);
      }.bind(this);
    }

  };

  const handleBackChange = async (e: any) => {
    let files = e.target.files[0];
    setFromBackImg(files);
    setValue("idback", files as string);

    clearErrors("idback");
    if (files) {
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function (e: any) {
        setBackImg(reader?.result as string);
      }.bind(this);
    }

  };

  const handleSelfieChange = async (e: any) => {
    let files = e.target.files[0];

    setFormSelfieImg(files);
    setValue("statement", files as string);
    clearErrors("statement");
    if (files) {
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function (e: any) {
        setSelfieImg(reader.result as string);
      }.bind(this);
    }

  };

  const onHandleSubmit = async (data: UserSubmitForm) => {
    try {

      var formData = new FormData();
      formData.append("idback", formBackImg);
      formData.append("idfront", formFrontImg);
      formData.append("statement", formSelfieImg);
      formData.append("country", data?.country);
      formData.append("fname", data?.fname);
      // formData.append("lname", "asdasdass");
      formData.append("doctype", data?.doctype);
      formData.append("docnumber", data?.docnumber);
      formData.append("user_id", session?.user?.user_id);
      formData.append("username", session?.user?.email);
      formData.append("dob", data?.dob.toString());

      if (status === 'authenticated') {

        let res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/profile/kyc`,
          {
            method: "POST",
            headers: {
              "Authorization": session?.user?.access_token
            },
            body: formData
          }
        )

        let result = await res.json()

        if (result?.data?.status === 200) {
          toast.success("KYC Done Successfully");
          reset()
          setSelfieImg('')
          setBackImg('')
          setFrontImg('')
          setValue("doctype", '')
          setValue("country", '')
          if(window.innerWidth<768){
            props?.setVerified(false)
            setTimeout(()=>{
              props.setShow(4)
            },1000)
          }
          else{
            router.reload()

          }
        }
        else {
          toast.error(result.data.data + " you auto redirect to login page");
        }
      } else {
        toast.error('Your session is expired. Its auto redirect to login page');
        setTimeout(() => {
          signOut();
        }, 4000);

      }

    } catch (error) {
      console.log(error, "kyc auth");
    }
  };

  let Countrylist = [
    {
      country: "Afghanistan",
      code: "93",
      iso: "AF",
    },
    { country: "Albania", code: "355", iso: "AL" },
    { country: "Algeria", code: "213", iso: "DZ" },
    { country: "American Samoa", code: "1-684", iso: "AS" },
    { country: "Andorra", code: "376", iso: "AD" },
    { country: "Angola", code: "244", iso: "AO" },
    { country: "Anguilla", code: "1-264", iso: "AI" },
    { country: "Antarctica", code: "672", iso: "AQ" },
    { country: "Antigua and Barbuda", code: "1-268", iso: "AG" },
    { country: "Argentina", code: "54", iso: "AR" },
    { country: "Armenia", code: "374", iso: "AM" },
    { country: "Aruba", code: "297", iso: "AW" },
    { country: "Australia", code: "61", iso: "AU" },
    { country: "Austria", code: "43", iso: "AT" },
    { country: "Azerbaijan", code: "994", iso: "AZ" },
    { country: "Bahamas", code: "1-242", iso: "BS" },
    { country: "Bahrain", code: "973", iso: "BH" },
    { country: "Bangladesh", code: "880", iso: "BD" },
    { country: "Barbados", code: "1-246", iso: "BB" },
    { country: "Belarus", code: "375", iso: "BY" },
    { country: "Belgium", code: "32", iso: "BE" },
    { country: "Belize", code: "501", iso: "BZ" },
    { country: "Benin", code: "229", iso: "BJ" },
    { country: "Bermuda", code: "1-441", iso: "BM" },
    { country: "Bhutan", code: "975", iso: "BT" },
    { country: "Bolivia", code: "591", iso: "BO" },
    { country: "Bosnia and Herzegovina", code: "387", iso: "BA" },
    { country: "Botswana", code: "267", iso: "BW" },
    { country: "Brazil", code: "55", iso: "BR" },
    { country: "British Indian Ocean Territory", code: "246", iso: "IO" },
    { country: "British Virgin Islands", code: "1-284", iso: "VG" },
    { country: "Brunei", code: "673", iso: "BN" },
    { country: "Bulgaria", code: "359", iso: "BG" },
    { country: "Burkina Faso", code: "226", iso: "BF" },
    { country: "Burundi", code: "257", iso: "BI" },
    { country: "Cambodia", code: "855", iso: "KH" },
    { country: "Cameroon", code: "237", iso: "CM" },
    { country: "Canada", code: "1", iso: "CA" },
    { country: "Cape Verde", code: "238", iso: "CV" },
    { country: "Cayman Islands", code: "1-345", iso: "KY" },
    { country: "Central African Republic", code: "236", iso: "CF" },
    { country: "Chad", code: "235", iso: "TD" },
    { country: "Chile", code: "56", iso: "CL" },
    { country: "China", code: "86", iso: "CN" },
    { country: "Christmas Island", code: "61", iso: "CX" },
    { country: "Cocos Islands", code: "61", iso: "CC" },
    { country: "Colombia", code: "57", iso: "CO" },
    { country: "Comoros", code: "269", iso: "KM" },
    { country: "Cook Islands", code: "682", iso: "CK" },
    { country: "Costa Rica", code: "506", iso: "CR" },
    { country: "Croatia", code: "385", iso: "HR" },
    { country: "Cuba", code: "53", iso: "CU" },
    { country: "Curacao", code: "599", iso: "CW" },
    { country: "Cyprus", code: "357", iso: "CY" },
    { country: "Czech Republic", code: "420", iso: "CZ" },
    { country: "Democratic Republic of the Congo", code: "243", iso: "CD" },
    { country: "Denmark", code: "45", iso: "DK" },
    { country: "Djibouti", code: "253", iso: "DJ" },
    { country: "Dominica", code: "1-767", iso: "DM" },
    { country: "Dominican Republic", code: "1-809", iso: "DO" },
    { country: "East Timor", code: "670", iso: "TL" },
    { country: "Ecuador", code: "593", iso: "EC" },
    { country: "Egypt", code: "20", iso: "EG" },
    { country: "El Salvador", code: "503", iso: "SV" },
    { country: "Equatorial Guinea", code: "240", iso: "GQ" },
    { country: "Eritrea", code: "291", iso: "ER" },
    { country: "Estonia", code: "372", iso: "EE" },
    { country: "Ethiopia", code: "251", iso: "ET" },
    { country: "Falkland Islands", code: "500", iso: "FK" },
    { country: "Faroe Islands", code: "298", iso: "FO" },
    { country: "Fiji", code: "679", iso: "FJ" },
    { country: "Finland", code: "358", iso: "FI" },
    { country: "France", code: "33", iso: "FR" },
    { country: "French Polynesia", code: "689", iso: "PF" },
    { country: "Gabon", code: "241", iso: "GA" },
    { country: "Gambia", code: "220", iso: "GM" },
    { country: "Georgia", code: "995", iso: "GE" },
    { country: "Germany", code: "49", iso: "DE" },
    { country: "Ghana", code: "233", iso: "GH" },
    { country: "Gibraltar", code: "350", iso: "GI" },
    { country: "Greece", code: "30", iso: "GR" },
    { country: "Greenland", code: "299", iso: "GL" },
    { country: "Grenada", code: "1-473", iso: "GD" },
    { country: "Guam", code: "1-671", iso: "GU" },
    { country: "Guatemala", code: "502", iso: "GT" },
    { country: "Guinea", code: "224", iso: "GN" },
    { country: "Guinea-Bissau", code: "245", iso: "GW" },
    { country: "Guyana", code: "592", iso: "GY" },
    { country: "Haiti", code: "509", iso: "HT" },
    { country: "Honduras", code: "504", iso: "HN" },
    { country: "Hong Kong", code: "852", iso: "HK" },
    { country: "Hungary", code: "36", iso: "HU" },
    { country: "Iceland", code: "354", iso: "IS" },
    { country: "India", code: "91", iso: "IN" },
    { country: "Indonesia", code: "62", iso: "ID" },
    { country: "Iran", code: "98", iso: "IR" },
    { country: "Iraq", code: "964", iso: "IQ" },
    { country: "Ireland", code: "353", iso: "IE" },
    { country: "Israel", code: "972", iso: "IL" },
    { country: "Italy", code: "39", iso: "IT" },
    { country: "Ivory Coast", code: "225", iso: "CI" },
    { country: "Jamaica", code: "1-876", iso: "JM" },
    { country: "Japan", code: "81", iso: "JP" },
    { country: "Jordan", code: "962", iso: "JO" },
    { country: "Kazakhstan", code: "7", iso: "KZ" },
    { country: "Kenya", code: "254", iso: "KE" },
    { country: "Kiribati", code: "686", iso: "KI" },
    { country: "Kosovo", code: "383", iso: "XK" },
    { country: "Kuwait", code: "965", iso: "KW" },
    { country: "Kyrgyzstan", code: "996", iso: "KG" },
    { country: "Laos", code: "856", iso: "LA" },
    { country: "Latvia", code: "371", iso: "LV" },
    { country: "Lebanon", code: "961", iso: "LB" },
    { country: "Lesotho", code: "266", iso: "LS" },
    { country: "Liberia", code: "231", iso: "LR" },
    { country: "Libya", code: "218", iso: "LY" },
    { country: "Liechtenstein", code: "423", iso: "LI" },
    { country: "Lithuania", code: "370", iso: "LT" },
    { country: "Luxembourg", code: "352", iso: "LU" },
    { country: "Macao", code: "853", iso: "MO" },
    { country: "Macedonia", code: "389", iso: "MK" },
    { country: "Madagascar", code: "261", iso: "MG" },
    { country: "Malawi", code: "265", iso: "MW" },
    { country: "Malaysia", code: "60", iso: "MY" },
    { country: "Maldives", code: "960", iso: "MV" },
    { country: "Mali", code: "223", iso: "ML" },
    { country: "Malta", code: "356", iso: "MT" },
    { country: "Marshall Islands", code: "692", iso: "MH" },
    { country: "Mauritania", code: "222", iso: "MR" },
    { country: "Mauritius", code: "230", iso: "MU" },
    { country: "Mayotte", code: "262", iso: "YT" },
    { country: "Mexico", code: "52", iso: "MX" },
    { country: "Micronesia", code: "691", iso: "FM" },
    { country: "Moldova", code: "373", iso: "MD" },
    { country: "Monaco", code: "377", iso: "MC" },
    { country: "Mongolia", code: "976", iso: "MN" },
    { country: "Montenegro", code: "382", iso: "ME" },
    { country: "Montserrat", code: "1-664", iso: "MS" },
    { country: "Morocco", code: "212", iso: "MA" },
    { country: "Mozambique", code: "258", iso: "MZ" },
    { country: "Myanmar", code: "95", iso: "MM" },
    { country: "Namibia", code: "264", iso: "NA" },
    { country: "Nauru", code: "674", iso: "NR" },
    { country: "Nepal", code: "977", iso: "NP" },
    { country: "Netherlands", code: "31", iso: "NL" },
    { country: "Netherlands Antilles", code: "599", iso: "AN" },
    { country: "New Caledonia", code: "687", iso: "NC" },
    { country: "New Zealand", code: "64", iso: "NZ" },
    { country: "Nicaragua", code: "505", iso: "NI" },
    { country: "Niger", code: "227", iso: "NE" },
    { country: "Nigeria", code: "234", iso: "NG" },
    { country: "Niue", code: "683", iso: "NU" },
    { country: "North Korea", code: "850", iso: "KP" },
    { country: "Northern Mariana Islands", code: "1-670", iso: "MP" },
    { country: "Norway", code: "47", iso: "NO" },
    { country: "Oman", code: "968", iso: "OM" },
    { country: "Pakistan", code: "92", iso: "PK" },
    { country: "Palau", code: "680", iso: "PW" },
    { country: "Palestine", code: "970", iso: "PS" },
    { country: "Panama", code: "507", iso: "PA" },
    { country: "Papua New Guinea", code: "675", iso: "PG" },
    { country: "Paraguay", code: "595", iso: "PY" },
    { country: "Peru", code: "51", iso: "PE" },
    { country: "Philippines", code: "63", iso: "PH" },
    { country: "Pitcairn", code: "64", iso: "PN" },
    { country: "Poland", code: "48", iso: "PL" },
    { country: "Portugal", code: "351", iso: "PT" },
    { country: "Puerto Rico", code: "1-787", iso: "PR" },
    { country: "Qatar", code: "974", iso: "QA" },
    { country: "Republic of the Congo", code: "242", iso: "CG" },
    { country: "Reunion", code: "262", iso: "RE" },
    { country: "Romania", code: "40", iso: "RO" },
    { country: "Russia", code: "7", iso: "RU" },
    { country: "Rwanda", code: "250", iso: "RW" },
    { country: "Saint Barthelemy", code: "590", iso: "BL" },
    { country: "Saint Helena", code: "290", iso: "SH" },
    { country: "Saint Kitts and Nevis", code: "1-869", iso: "KN" },
    { country: "Saint Lucia", code: "1-758", iso: "LC" },
    { country: "Saint Martin", code: "590", iso: "MF" },
    { country: "Saint Pierre and Miquelon", code: "508", iso: "PM" },
    { country: "Saint Vincent and the Grenadines", code: "1-784", iso: "VC" },
    { country: "Samoa", code: "685", iso: "WS" },
    { country: "San Marino", code: "378", iso: "SM" },
    { country: "Sao Tome and Principe", code: "239", iso: "ST" },
    { country: "Saudi Arabia", code: "966", iso: "SA" },
    { country: "Senegal", code: "221", iso: "SN" },
    { country: "Serbia", code: "381", iso: "RS" },
    { country: "Seychelles", code: "248", iso: "SC" },
    { country: "Sierra Leone", code: "232", iso: "SL" },
    { country: "Singapore", code: "65", iso: "SG" },
    { country: "Sint Maarten", code: "1-721", iso: "SX" },
    { country: "Slovakia", code: "421", iso: "SK" },
    { country: "Slovenia", code: "386", iso: "SI" },
    { country: "Solomon Islands", code: "677", iso: "SB" },
    { country: "Somalia", code: "252", iso: "SO" },
    { country: "South Africa", code: "27", iso: "ZA" },
    { country: "South Korea", code: "82", iso: "KR" },
    { country: "South Sudan", code: "211", iso: "SS" },
    { country: "Spain", code: "34", iso: "ES" },
    { country: "Sri Lanka", code: "94", iso: "LK" },
    { country: "Sudan", code: "249", iso: "SD" },
    { country: "Suriname", code: "597", iso: "SR" },
    { country: "Svalbard and Jan Mayen", code: "47", iso: "SJ" },
    { country: "Swaziland", code: "268", iso: "SZ" },
    { country: "Sweden", code: "46", iso: "SE" },
    { country: "Switzerland", code: "41", iso: "CH" },
    { country: "Syria", code: "963", iso: "SY" },
    { country: "Taiwan", code: "886", iso: "TW" },
    { country: "Tajikistan", code: "992", iso: "TJ" },
    { country: "Tanzania", code: "255", iso: "TZ" },
    { country: "Thailand", code: "66", iso: "TH" },
    { country: "Togo", code: "228", iso: "TG" },
    { country: "Tokelau", code: "690", iso: "TK" },
    { country: "Tonga", code: "676", iso: "TO" },
    { country: "Trinidad and Tobago", code: "1-868", iso: "TT" },
    { country: "Tunisia", code: "216", iso: "TN" },
    { country: "Turkey", code: "90", iso: "TR" },
    { country: "Turkmenistan", code: "993", iso: "TM" },
    { country: "Turks and Caicos Islands", code: "1-649", iso: "TC" },
    { country: "Tuvalu", code: "688", iso: "TV" },
    { country: "U.S. Virgin Islands", code: "1-340", iso: "VI" },
    { country: "Uganda", code: "256", iso: "UG" },
    { country: "Ukraine", code: "380", iso: "UA" },
    { country: "United Arab Emirates", code: "971", iso: "AE" },
    { country: "United Kingdom", code: "44", iso: "GB" },
    { country: "United States", code: "1", iso: "US" },
    { country: "Uruguay", code: "598", iso: "UY" },
    { country: "Uzbekistan", code: "998", iso: "UZ" },
    { country: "Vanuatu", code: "678", iso: "VU" },
    { country: "Vatican", code: "379", iso: "VA" },
    { country: "Venezuela", code: "58", iso: "VE" },
    { country: "Vietnam", code: "84", iso: "VN" },
    { country: "Wallis and Futuna", code: "681", iso: "WF" },
    { country: "Western Sahara", code: "212", iso: "EH" },
    { country: "Yemen", code: "967", iso: "YE" },
    { country: "Zambia", code: "260", iso: "ZM" },
    { country: "Zimbabwe", code: "263", iso: "ZW" },
  ];

  return (
    <>
      <ToastContainer />
      <section
        className={`${props.show == 4 && "!left-[50%]"} ${props.fixed
          ? "overflow-y-scroll duration-300 p-5 md:p-40 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary "
          : "p-5 md:p-40  block"
          }}`}
      >
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
            <div>
              <IconsComponent type="editIcon" hover={false} active={false} />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onHandleSubmit)}
          className="max-[1023px] dark:bg-omega bg-white  rounded-[10px]"
        >
          <div className="flex items-center gap-5 justify-between">
            <p className="sec-title lg:px-0 px-20 pt-20">KYC Verification </p>
            <div className="py-[13px] px-[15px] border dark:border-opacity-[15%]  border-grey-v-1 items-center rounded-5 hidden md:flex gap-[10px]">
              <Image
                src="/assets/profile/edit.svg"
                width={24}
                height={24}
                alt="edit"
              />
              <p className="nav-text-sm">Edit</p>
            </div>
          </div>
          <div className="py-[30px] md:py-[50px] lg:px-0 px-20">
            <div className="relative">
              {/* <div className="rounded-5 py-[15px] px-5 flex gap-[5px] md:max-w-[240px] max-w-full w-full bg-grey dark:bg-black-v-1">
              <p className="nav-text-sm md:nav-text-lg !text-gamma min-w-[173px] w-full">Choose Doument Type</p>
              <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="down arrow" />
            </div> */}
              <FiliterSelectMenu
                data={list}
                placeholder="Choose Document Type"
                auto={false}
                widthFull={false}
                onDocumentChange={getDocumentDetail}
              />
              {errors.doctype && (
                <p style={{ color: "#ff0000d1" }}>{errors.doctype.message}</p>
              )}
            </div>

            <div className="mt-[30px]">
              <div className="flex gap-[30px] md:flex-row flex-col">
                <div className="max-w-full md:max-w-[30%] w-full">
                  <label className="sm-text mb-[10px]">ID Card Number</label>
                  <input
                    type="text"
                    {...register("docnumber")}
                    placeholder="Enter ID number"
                    className="sm-text input-cta2 w-full focus:bg-primary-100 dark:focus:bg-[transparent]"
                  />
                  {errors.docnumber && (
                    <p style={{ color: "#ff0000d1" }}>
                      {errors.docnumber.message}
                    </p>
                  )}
                </div>
                <div className="max-w-full md:max-w-[70%] w-full">
                  <label className="sm-text mb-[10px]">
                    Full name on Identity
                  </label>
                  <input
                    type="text"
                    {...register("fname")}
                    // value="gjsg"
                    placeholder="Enter user name"
                    className="sm-text input-cta2 w-full  focus:bg-primary-100 dark:focus:bg-[transparent]"
                  />
                  {errors?.fname && (
                    <p style={{ color: "#ff0000d1" }}>
                      {errors?.fname.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-[30px] md:flex-row flex-col mt-[24px]">
                <div className="max-w-full md:max-w-[30%] w-full">
                  <label className="sm-text mb-[10px]">Date of Birth</label>
                  {/* <input type="date" placeholder="Enter ID number" className="sm-text input-cta2 w-full focus:bg-primary-100 dark:focus:bg-[transparent]"/> */}
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => handleDate(date)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="sm-text input-cta2 w-full focus:bg-primary-100 dark:focus:bg-[transparent]"
                  />
                  {errors?.dob && (
                    <p style={{ color: "#ff0000d1" }}>{errors?.dob.message}</p>
                  )}
                </div>
                <div className="max-w-full md:max-w-[70%] w-full">
                  <label className="sm-text mb-[10px]">Country</label>
                  <CountrylistDropdown
                    data={Countrylist}
                    placeholder="Choose Country"
                    onCountryChange={getCountryChange}
                  />
                  {errors?.country && (
                    <p style={{ color: "#ff0000d1" }}>
                      {errors?.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>

          <div className="flex md:flex-row flex-col gap-[30px] py-[30px] md:py-[50px] lg:px-0 px-20">
            <div className="w-full">
              <label className="sm-text ">Identity Document Front Side</label>

              <div className="w-full min-h-[160px] hover:dark:bg-black-v-1 flex  mt-2 md:mt-5 border-[1.5px] border-dashed border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] rounded-md">
                <div className="m-auto ">
                  <input
                    type="file"
                    placeholder="Type Here...."
                    id={`front${props?.num}`}
                    name="front"
                    autoComplete="off"
                    className="hidden "
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                  />
                  <label
                    htmlFor={`front${props?.num}`}
                    className="py-[30px]  cursor-pointer block h-full items-stretch "
                  >
                    <div className={`${frontImg === "" ? "block" : "hidden"}`}>
                      <p className="nav-text-sm md:nav-text-lg text-center  mb-2">
                        Drop your file upload or{" "}
                        <span className="text-primary">Browse</span>
                      </p>
                      <p className="info-12  text-center !text-[#808A9A]">
                        Maximum size of image 1MB
                      </p>
                    </div>

                    <div
                      className={`${frontImg !== ""
                        ? "flex items-center h-full justufy-center"
                        : "hidden"
                        }`}
                    >
                      {frontImg && (
                        <Image
                          src={frontImg}
                          width={720}
                          height={90}
                          alt="front Image"
                          className="h-[133px] object-contain"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
              {errors?.idfront && (
                <p style={{ color: "#ff0000d1" }}>{errors?.idfront.message?.toString()}</p>
              )}
            </div>

            <div className="w-full ">
              <label className="sm-text ">Identity Document Back Side</label>
              <div className="w-full min-h-[160px] mt-2 md:mt-5 border-[1.5px] border-dashed border-grey-v-1 flex dark:border-grey-v-2 dark:border-opacity-[15%] rounded-md">
                <div className="m-auto ">
                  <input
                    type="file"
                    placeholder="Type Here...."
                    id={`back${props?.num}`}
                    name="back"
                    autoComplete="off"
                    className="hidden "
                    onChange={(e) => {
                      handleBackChange(e);
                    }}
                  />
                  <label
                    htmlFor={`back${props?.num}`}
                    className="py-[30px]  cursor-pointer block h-full items-stretch"
                  >
                    <div className={`${backImg === "" ? "block" : "hidden"}`}>
                      <p className="nav-text-sm md:nav-text-lg text-center  mb-2">
                        Drop your file upload or{" "}
                        <span className="text-primary">Browse</span>
                      </p>
                      <p className="info-12  text-center !text-[#808A9A]">
                        Maximum size of image 1MB
                      </p>
                    </div>
                    <div
                      className={`${backImg !== ""
                        ? "flex items-center h-full justufy-center"
                        : "hidden"
                        }`}
                    >
                      {backImg && (
                        <Image
                          src={backImg}
                          width={720}
                          height={90}
                          alt="back Image"
                          className="h-[133px]  object-contain"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
              {errors?.idback && (
                <p style={{ color: "#ff0000d1" }}>{errors?.idback.message?.toString()}</p>
              )}
            </div>
            <div className="w-full">
              <label className="sm-text ">A Selfie with your identity</label>

              <div className="w-full min-h-[133px]  flex mt-2 md:mt-5 border-[1.5px] border-dashed border-grey-v-1 dark:border-grey-v-2 dark:border-opacity-[15%] rounded-md">
                <div className="m-auto ">
                  <input
                    type="file"
                    placeholder="Type Here...."
                    id={`statement${props?.num}`}
                    name="statement"
                    autoComplete="off"
                    className="hidden "
                    onChange={(e) => {
                      handleSelfieChange(e);
                    }}
                  />

                  <label
                    htmlFor={`statement${props?.num}`}
                    className="py-[30px]  cursor-pointer block h-full items-stretch"
                  >
                    <div className={`${selfieImg === "" ? "block" : "hidden"}`}>
                      <Image
                        src="/assets/profile/kycselfie.png"
                        width={100}
                        height={50}
                        alt="selfie"
                        className="mx-auto"
                      />
                      <p className="info-12 text-center  mb-2">
                        Please, make sure that every detail of the ID document
                        is clearly visible.{" "}
                        <span className="text-primary">Browse</span>
                      </p>
                    </div>
                    <div
                      className={`${selfieImg !== ""
                        ? "flex items-center  justufy-center"
                        : "hidden"
                        }`}
                    >
                      {selfieImg && (
                        <Image
                          src={selfieImg}
                          width={720}
                          height={90}
                          alt="selfie Image"
                          className="max-h-[133px] object-contain h-full"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
              {errors?.statement && (
                <p style={{ color: "#ff0000d1" }}>
                  {errors?.statement.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="h-[1px] w-full bg-grey-v-2 dark:bg-opacity-[15%]"></div>

          <div className="flex md:flex-row flex-col-reverse items-center gap-[10px] justify-between pt-5 md:pt-[30px] lg:px-0 px-20">
            <p className="sm-text">
              This account was created on January 10, 2022, 02:12 PM
            </p>

            <button
              type="submit"
              className="solid-button px-[23px] md:px-[51px]"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default KycAuth;
