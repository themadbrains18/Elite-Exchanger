import { useEffect } from "react";

/**
 * Interface representing the props for handling a click outside popup.
 *
 * @interface clickOutSidePopupProps
 * @property {any} [wrapperRef] - A reference to the wrapper element to detect clicks outside of it.
 * @property {any} [closePopup] - A function to close the popup when a click outside is detected.
 */
interface clickOutSidePopupProps {
    wrapperRef?: any;
    closePopup?: any;
}

export const clickOutSidePopupClose = (props: clickOutSidePopupProps) => {
    useEffect(() => {
        /**
         * Handles the click outside event to close the popup if the click occurs outside the wrapper element.
         * It also checks if the click happened inside a Toastify toast container to prevent closing the popup
         * when interacting with toasts.
         *
         * @function handleClickOutside
         * @param {any} event - The event object representing the click event.
         */
        function handleClickOutside(event: any) {
            let toastConter = document.querySelectorAll('.Toastify__toast-container');
            let toast = [];
            for(const t of toastConter){
                if(t.contains(event.target)){
                    toast.push(t);
                }
            }
            if (toast.length === 0 ) {
                if (props.wrapperRef.current && !props.wrapperRef.current.contains(event.target)) {
                    props.closePopup();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.wrapperRef]);
}

export default clickOutSidePopupClose;