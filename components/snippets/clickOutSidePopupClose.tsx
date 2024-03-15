import { useEffect } from "react";

interface propsData {
    wrapperRef?: any;
    closePopup?: any;
}
export const clickOutSidePopupClose = (props: propsData) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (props.wrapperRef.current && !props.wrapperRef.current.contains(event.target)) {
                props.closePopup();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.wrapperRef]);
}

export default clickOutSidePopupClose;