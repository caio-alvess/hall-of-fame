/**
 * @param {{userInput: String, submit: String}} screen 
 * @returns 
 */
export const UserScreen = (screen) => {
    const { userInput, submit, loadingScreen, log } = screen;
    const input = document.querySelector(`${userInput}`);
    return {
        get userInput() {
            return input;
        },
        /** Define if should start or finish a loading screen;
        * @param {Boolean} startLoading
        */
        loadingToggle() {
            const button = document.querySelector(`${submit}`);
            const loader = document.querySelector(`${loadingScreen}`)
            loader.classList.toggle('d-none');

            if (!loader.classList.contains('d-none')) {
                button.disabled = true;
                return;
            }
            button.disabled = false;
        },
        /**Write a message to user
         * It's recommended to write only if errors has occurred
         * @param {String|undefined} message - String or Boolean. 
         * If message == 'clear' || message == '', it will remove any log message
        */
        log(message) {
            let logText = message == 'clear' ? '' : message;
            const logHTML = document.querySelector(`${log}`);
            logHTML.innerText = logText ? logText : '';
        },
    }
}