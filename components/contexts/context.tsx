

import { modeProps } from "@/types.d";
import { createContext } from "react";

const authContextDefaultValues: modeProps = {
    mode: "dark",
    setMode : ()=>{}
};

const Context = createContext<modeProps>(authContextDefaultValues);

export default Context;
