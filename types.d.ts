export type authContextType = {
    mode: string;
    login: () => void;
    logout: () => void;
};


type Themes = "dark" | "light" ;
 
export  type modeProps = {
    mode: string | null;
    setMode(theme : Themes) : void;
};