import Cookies from 'js-cookie';

/**
 * Function for Get cookie data
 * @param {string} _cookieName
 * @returns {string | undefined} Cookie data or undefined if it doesn't exist
 */
function GetCookie(_cookieName: string): string | undefined {
  return Cookies.get(_cookieName);
}

/**
 * Function for storing a cookie
 * @param {string} _cookieKey
 * @param {object} _cookieData
 * @returns {void} Cookie stored on the navigator
 */
function StorageCookie(_cookieKey: string, _cookieData: object): void {
  //guardar o cookie no banco.
}

/**
 * Function for clearing a cookie
 * @param {string} _cookieKey
 * @returns {void} Clear navigator cookies
 */
function ClearCookieData(_cookieKey: string): void {
  Cookies.remove(_cookieKey);
}

export {
  GetCookie,
  StorageCookie,
  ClearCookieData
}
