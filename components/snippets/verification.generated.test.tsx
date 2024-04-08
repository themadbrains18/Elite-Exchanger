import renderer from 'react-test-renderer';
import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../contexts/context";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";

import { signOut } from "next-auth/react";
import EmailChangeAlert from "./emailChangeAlert";
import clickOutSidePopupClose from "./clickOutSidePopupClose";
import CodeNotRecieved from "./codeNotRecieved";
import Verification from "./verification";

jest.mock("../contexts/context");
jest.mock("crypto-js");
jest.mock("react-toastify");
jest.mock("react-toastify/dist/ReactToastify.css");
jest.mock("next-auth/react");
jest.mock("./emailChangeAlert");
jest.mock("./clickOutSidePopupClose");
jest.mock("./codeNotRecieved");

const renderTree = tree => renderer.create(tree);
describe('<Verification>', () => {
  it('should render component', () => {
    expect(renderTree(<Verification  
      setEnable={/* Function */}  
      type={/* string */}  
      data={/* any */}  
      session={/* any */} 
    />).toJSON()).toMatchSnapshot();
  });
  it('should render component with props', () => {
    expect(renderTree(<Verification  
      setEnable={/* Function */}  
      setShow={/* any */}  
      type={/* string */}  
      data={/* any */}  
      session={/* any */}  
      finalOtpVerification={/* any */}  
      finalBtnenable={/* any */}  
      snedOtpToUser={/* any */}  
      sendOtpRes={/* any */} 
    />).toJSON()).toMatchSnapshot();
  });
});