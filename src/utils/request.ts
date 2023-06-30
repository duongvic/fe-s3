export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: Response) {
  // if (response.status >= 200 && response.status < 300) {
  return response;
  // }
  // const error = new ResponseError(response);
  // error.response = response;
  // throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function getToken() {
  const user = localStorage.getItem('account');
  if (user) {
    const userInfo = JSON.parse(user);
    return userInfo.auth_token;
  }
  return null;
}

export function setOptionsBasicAuthorizationToken(options) {

  const token = getToken();

  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
    Authorization: `Basic ${defaultOptions?.endCodeData_userPassw}`,
  };
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'X-Auth-Token': `${token}`,
    };
  }
  defaultOptions.credentials = 'same-origin';
  delete defaultOptions.endCodeData_userPassw;
  return defaultOptions;
}


export function setOptionsToken(options) {

  const token = getToken();

  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
  };
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'X-Auth-Token': `${token}`,
    };
  }
  defaultOptions.credentials = 'same-origin';
  return defaultOptions;
}

export function setOptionsBasicAuthorization(options) {
  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
    Authorization: `Basic ${defaultOptions?.endCodeData_userPassw}`,
  };
  defaultOptions.credentials = 'same-origin';
  delete defaultOptions.endCodeData_userPassw;
  return defaultOptions;
}

export function setOptions(options) {
  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
  };
  defaultOptions.credentials = 'same-origin';
  const token = getToken();
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Basic ${token}`,
    };
  }

  else {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Basic ${defaultOptions?.endCodeData_userPassw}`,
    };
    delete defaultOptions.endCodeData_userPassw;
  }

  return defaultOptions;
}

export function setNoAuthOptions(options) {
  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
  };
  // defaultOptions.credentials = 'same-origin';
  return defaultOptions;
}

export function setOptionsAuthorizationToken(options) {

  const token = getToken();

  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
  };
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `${token}`,
    };
  }
  defaultOptions.credentials = 'same-origin';
  return defaultOptions;
}



export async function requestAuthorizationToken(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptionsAuthorizationToken(options));
  try {
    // if (fetchResponse.status >= 200 && fetchResponse.status < 300) {
      return parseJSON(fetchResponse);
    // }
    // else {
    //   return fetchResponse?.statusText
    // }
  } catch (error) {
    const err: any = error;
    return err;
  }
  // const response = checkStatus(fetchResponse);
}


export async function requestToken(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptionsToken(options));
  const response = checkStatus(fetchResponse);

  return parseJSON(response);
}


export async function request(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptions(options));
  return parseJSON(fetchResponse);
}

export async function requestBasicAuthorization(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptionsBasicAuthorization(options));
  // debugger
  return parseJSON(fetchResponse);
  // const response = checkStatus(fetchResponse);
}

export async function requestBasicAuthorizationAndToken(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptionsBasicAuthorizationToken(options));
  return parseJSON(fetchResponse);
  // const response = checkStatus(fetchResponse);
}

export async function requestNoauth(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setNoAuthOptions(options));
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}

export async function requestUnauth(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, options);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}

export async function requestStatus(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptions(options));
  const status = fetchResponse.status;
  // console.log('status_check: ' + status)
  if (status === 200) {
    return true;
  }
  return parseJSON(fetchResponse);
}