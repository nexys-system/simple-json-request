export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type Headers = { [k: string]: string };

export interface RequestHeaders {
  bearerToken?: string;
  headers?: Headers;
  headersDefault?: Headers;
}

export interface JsonRequestProps<A> extends RequestHeaders {
  url: string;
  method?: Method;
  data?: A;
  successStatus?: number[];
}

export const getHeaders = ({
  headers: headersIn,
  headersDefault,
  bearerToken,
}: RequestHeaders): Headers => {
  const headers: Headers = { ...headersIn, ...headersDefault };

  if (bearerToken) {
    headers["Authorization"] = "Bearer: " + bearerToken;
  }

  return headers;
};

export const jsonRequest = async <A, B = any>({
  url,
  method = "GET",
  data,
  bearerToken,
  headers: headersIn = {},
  headersDefault = { "content-type": "application/json" },
  successStatus = [200, 201],
}: JsonRequestProps<A>): Promise<B> => {
  const body: string | undefined = data && JSON.stringify(data);
  const headers: Headers = getHeaders({
    headers: headersIn,
    headersDefault,
    bearerToken,
  });

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  const json = await response.json();
  const { status } = response;

  if (!successStatus.includes(status)) {
    return Promise.reject({ status, json });
  }

  return json;
};

export default jsonRequest;
