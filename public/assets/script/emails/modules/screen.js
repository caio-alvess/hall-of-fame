//Use this as module

const opt = {
    email: 'opan',
    submit: 'submit',
    loadingScreen: 'oi',
    log: 'atata'
}
/**
 * 
 * @param {{email: String, submit: String}} screen 
 * @returns 
 */
export const UserScreen = (screen) => {
    const { email, submit, loadingScreen, log } = screen;
    const emailInput = document.querySelector(`${email}`);
    return {
        /** Define if should start or finish a loading screen;
        * @param {Boolean} startLoading
        */
        loading(startLoading) {
            const button = document.querySelector(`${submit}`);
            document.querySelector(`${loadingScreen}`).classList.toggle('d-none');

            if (startLoading) {
                button.disabled = true;
                return;
            }
            button.disabled = false;
        },

        /**Write a message to user
         * It's recommended to write only if errors has occurred
         * @param {String|boolean} message - String or Boolean. 
         * If message == false, it will remove any log message
        */
        log(message) {
            const logHTML = document.querySelector(`${log}`);
            logHTML.innerText = message ? message : '';
        },

        get userEmail() {
            return emailInput.value;
        },
        set userEmail(value) {
            emailInput.value = value;
        },

        /*         startEmailCounter() {
                    
                } */
    }
}