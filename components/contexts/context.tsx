
/**
 * Context for managing the theme mode (dark/light) in the application.
 * 
 * Provides a global state to be shared across components for controlling the mode setting.
 *
 * @example
 * // To consume the context in a component
 * const { mode, setMode } = useContext(Context);
 */

import { modeProps } from "@/types.d";
import { createContext } from "react";

// Default values for the context
const authContextDefaultValues: modeProps = {
    mode: "dark",
    setMode : ()=>{}
};

// Creating the context with default values
const Context = createContext<modeProps>(authContextDefaultValues);
export default Context;
