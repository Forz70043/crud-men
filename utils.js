

class Utils {
    constructor() { }

    checkEmail(email) {

        var emailToChek = email.toLowerCase();
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(emailToChek)) {
            console.log("TEST EMAIL: ", re.test(emailToChek));
            return true;
        }
        else {
            return false;
        }
    }

    checkDate18(date) {
        var today = new Date().getFullYear();
        console.log(today, new Date(date).getFullYear);
        var d = new Date(date).getFullYear();
        if ((today - d) >= 18) return true;
        else return false;
    }

    encodeBase64(string) {

        if (typeof (string) === 'string') {
            const buff = Buffer.from(string, 'utf-8');
            const base64 = buff.toString('base64');

            return base64;
        }
    }

    decodeBase64(base64) {

        const buff = Buffer.from(base64, 'base64');
        // decode buffer as UTF-8
        const str = buff.toString('utf-8');

        return str;
    }

    /**
     * @param {string} fieldJSONPath 
     * @return {boolean}
     */
    isEmpty(fieldJSONPath) {
        var val = getValue(fieldJSONPath);
        if (val == null || val.toString().trim().length == 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
   * @param {string} field valore del campo da controllare
   * @return {boolean} esito del controllo
   */
    isValidCf(field) {
        //    //return field.match(/^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/);
        return field.match(/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-7LMNPQRST]{1}[0-9LMNPQRSTUV]{1}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/i);
    }

    /**
     * @param {string} field valore del campo da controllare
     * @return {boolean} esito del controllo
     */
    isValidIVA(field) {
        return field.match(/^[0-9]{11}$/);
    }

    /**
     * Verifica se il field è un CAP italiano valido
     * 
     * @param {string} field valore da controllare
     * @returns {Boolean} esito del controllo
     */
    isValidCap(field) {
        return field.match(/^\d{5}$/);
    }


    /**
   * Verifica se il field è un iban italiano valido
   * 
   * @param {string} field valore da controllare
   * @returns {Boolean} esito del controllo
   */
    isValidIbanIta(field) {
        return field.match(/^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/);
    }

    /**
     * @param {string} field valore del campo da controllare
     * @return {boolean} esito del controllo
     */
    isValidEmail(field) {
        return field.match(/^[A-Za-z0-9.%+-]{3,}@[A-Za-z0-9.%+-]{3,}.[A-Za-z0-9._%+-]{2,}$/);
    }
}

module.exports = Utils