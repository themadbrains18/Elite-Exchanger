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
            let toastConter = document.querySelectorAll('.Toastify__toast-container');
            // && !toastConter.contains(event.target)
            if (toastConter.length > 1) {
                if (props.wrapperRef.current && !props.wrapperRef.current.contains(event.target) && toastConter[1].contains(event.target) === false) {
                    props.closePopup();
                }
            }
            else {
                if (props.wrapperRef.current && !props.wrapperRef.current.contains(event.target)) {
                    props.closePopup();
                }
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