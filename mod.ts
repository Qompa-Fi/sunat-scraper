import fetch, { type Response } from "node-fetch";
import { writeFileSync } from "node:fs";

const userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0";

const parseCookie = (str: string): Record<string, string> =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      //@ts-ignore
      acc[decodeURIComponent(v[0].trim())] = v[1]
        ? decodeURIComponent(v[1].trim())
        : true;
      return acc;
    }, {});

function parseCookies(response: Response): string {
  const raw = response.headers.raw()["set-cookie"];
  return raw
    .map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(";");
}

const captureFirstBodyUrl = async (
  response: Response,
): Promise<string | null> => {
  const rxUrlWithParams =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;

  const data = await response.text();

  const matches = data.match(rxUrlWithParams);
  if (matches) {
    for (const match of matches) {
      if (match.includes("sunat.gob.pe")) {
        return match;
      }
    }
  }

  return null;
};

const getStateQueryStrFromUrl = (url: string): string | null => {
  const u = new URL(url);
  return u.searchParams.get("state");
};

const replaceLastUrlPathSegment = (
  url: string,
  newSegment: string,
): string | null => {
  const u = new URL(url);
  u.search = "";

  const lastSlash = u.pathname.lastIndexOf("/");
  if (lastSlash === -1) {
    return null;
  }

  u.pathname = `${u.pathname.slice(0, lastSlash)}/${newSegment}`;

  return u.toString();
};

const initUrl =
  "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?pestana=*&agrupacion=*";

const initResponse = await fetch(initUrl, {
  redirect: "follow",
  headers: { "User-Agent": userAgent },
});

const initParsedCookies = parseCookie(
  initResponse.headers.get("set-cookie") ?? "",
);

const afterInitUrl = await captureFirstBodyUrl(initResponse);
if (!afterInitUrl) {
  throw new Error("no url were captured");
}

console.log("initParsedCookies", initParsedCookies);

const redirectedResponse = await fetch(afterInitUrl, {
  method: "HEAD",
  redirect: "follow",
  headers: { "User-Agent": userAgent },
});

const afterHeadRedirectResponse = await fetch(redirectedResponse.url, {
  method: "GET",
  redirect: "follow",
  headers: { "User-Agent": userAgent },
});

const newUrl = replaceLastUrlPathSegment(
  afterHeadRedirectResponse.url,
  "j_security_check",
);
if (!newUrl) {
  throw new Error("new url could not be resolved");
}

const state = getStateQueryStrFromUrl(afterHeadRedirectResponse.url);
if (!state) {
  throw new Error("state not found in url");
}

const ruc = "20613139703";
const solUsername = "WISHASYC";
const solKey = "upoillydr";
const lang = "es-PE";

const formResponse = await fetch(newUrl, {
  method: "POST",
  headers: {
    Accept: "text/html",
    Origin: "https://api-seguridad.sunat.gob.pe",
    Referer: "https://e-menu.sunat.gob.pe/",
    DNT: "1",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: `${ruc}${solUsername}=1;MENU-SOL-LANGUAGE=${lang};`,
    "User-Agent": userAgent,
  },
  body: new URLSearchParams({
    tipo: "2",
    dni: "",
    custom_ruc: ruc,
    j_username: solUsername,
    j_password: solKey,
    captcha: "",
    state,
    originalUrl: "",
  }),
  redirect: "follow",
});

console.log(
  'formResponse.headers.get("set-cookie")',
  formResponse.headers.get("set-cookie"),
);

const code =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMDYxMzEzOTcwMyIsInVzZXJkYXRhIjp7Im51bVJVQyI6IjIwNjEzMTM5NzAzIiwidGlja2V0IjoiMTM2NTE4NTAzNTIwMSIsIm5yb1JlZ2lzdHJvIjoiIiwiYXBlTWF0ZXJubyI6IiIsImxvZ2luIjoiMjA2MTMxMzk3MDNXSVNIQVNZQyIsIm5vbWJyZUNvbXBsZXRvIjoiUU9NUEEgU09DSUVEQUQgQU5PTklNQSBDRVJSQURBIiwibm9tYnJlcyI6IlFPTVBBIFNPQ0lFREFEIEFOT05JTUEgQ0VSUkFEQSIsImNvZERlcGVuZCI6IjAwMjMiLCJjb2RUT3BlQ29tZXIiOiIiLCJjb2RDYXRlIjoiIiwibml2ZWxVTyI6MCwiY29kVU8iOiIiLCJjb3JyZW8iOiIiLCJ1c3VhcmlvU09MIjoiV0lTSEFTWUMiLCJpZCI6IiIsImRlc1VPIjoiIiwiZGVzQ2F0ZSI6IiIsImFwZVBhdGVybm8iOiIiLCJpZENlbHVsYXIiOm51bGwsIm1hcCI6eyJpc0Nsb24iOmZhbHNlLCJkZHBEYXRhIjp7ImRkcF9udW1ydWMiOiIyMDYxMzEzOTcwMyIsImRkcF9udW1yZWciOiIwMDIzIiwiZGRwX2VzdGFkbyI6IjAwIiwiZGRwX2ZsYWcyMiI6IjAwIiwiZGRwX3ViaWdlbyI6IjE1MDEzMSIsImRkcF90YW1hbm8iOiIwMyIsImRkcF90cG9lbXAiOiIzOSIsImRkcF9jaWl1IjoiNjU5OTQifSwiaWRNZW51IjoiMTM2NTE4NTAzNTIwMSIsImpuZGlQb29sIjoicDAwMjMiLCJ0aXBVc3VhcmlvIjoiMCIsInRpcE9yaWdlbiI6IklUIiwicHJpbWVyQWNjZXNvIjp0cnVlfX0sIm5iZiI6MTczNTYwMjYzNSwiZXhwIjoxNzM1NjAyOTM1LCJpYXQiOjE3MzU2MDI2MzV9.QdYF0zOh6qmRQPCFT9xql3g24K5KpEEzRVfYYTax0uMmsgXUSTSv54jrJuVUdMgkwjfRgavL7sEHwA2DjNNy8Atlb6kTteakeTjL2aq-gsmMrdUsUcUwObEGYvT5lwUFyHprVLaq81BPXrlEGfaX1nDifQzSdeDmeDMeuR6HrU8BcTw-XLSmYV4Z9dkx-pakkB6eSbwv4S_qhL6GDtEPK4bWype94r-op_GItRRoVVXv-BYzaumwGDgOnefRZpF35wE3kRI1-iC-22YRWXxfDahEhWJxcnggkTlHfKIOLZ3VWoQXzTfwo1M1VrJPodwwLzrUhWwSuIcadnELORh9Jg";

const cookiedResponse = await fetch(
  `https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm?state=${state}&code=${code}&lang=${lang}`,
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-GPC": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Cookie: `${parseCookies(formResponse)};srv_id=${initParsedCookies.srv_id}; ${ruc}${solUsername}=1;`,
    },
    referrer: "https://api-seguridad.sunat.gob.pe/",
    method: "GET",
  },
);

const cookieHeader = `${parseCookies(cookiedResponse)};${ruc}${solUsername}=1;S${ruc}${solUsername}=1;`;

// 20613139703WISHASYC=1;
// ITMENUSESSION=p_oaHHblJfz_KtS1HxSEz0xCSli6awUaclLnGRmyCEz8iyDANqeeE54j1F-F1iATl04etg3XqGL5LEe3lvli5pU0M8aQ--I6gFhxGxDa58hUo_CdpBP_OIeX5tfnd7P3fQ3kAhkUSirz93QEKaozHYfj5tf8QHndH-Uxw1BVvaSRGlHGeSmQAzWbKBa3F4N0LNpqhCPZ2_yVYafoY3-LadYMqdh9AOzbO5V2La9QUar8R75HiZQPg0_FXHsRyVLw!608369520!1619028034;
// S20613139703WISHASYC=1;
// srv_id=c44f00c992c7ad6e614e62781b29168c;
// TS015a04e9=019edc9eb86581dcfc13091a94785267939a368f276c15eba1ed52e7080cfac4d60895af07b84c4a5ac8d79ff5e5dc31caed9447976830059f46231d409e548fad02f89cdc6d9e2690f9f004cd9ebad81a73117f6b;
// TS030edf5d027=08d0cd49b8ab2000bf89b67c0989ca364f58e660c24f473ddbd20415b11446cc9767b37324039df9089795ef551130007030509a0124a5a3092eb63ce14e1f994931b58048033bc6809c6bd079b319a2b7aa4452c927b613e5562163747d2764;

console.log("cookieHeader", cookieHeader);

const menuResponse = await fetch(
  "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm?pestana=*&agrupacion=*",
  {
    method: "GET",
    referrer: "https://api-seguridad.sunat.gob.pe/",
    headers: {
      "User-Agent": userAgent,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Sec-GPC": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Cookie: cookieHeader,
    },
  },
);

writeFileSync("index.html", await menuResponse.text());

process.exit(0);

const response = await fetch(
  "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/j_security_check",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Sec-GPC": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
    },
    referrer:
      "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?lang=es-PE&showDni=true&showLanguages=false&originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==",
    body: "tipo=2&dni=&custom_ruc=20613139703&j_username=WISHASYC&j_password=upoillydr&captcha=&originalUrl=https%3A%2F%2Fe-menu.sunat.gob.pe%2Fcl-ti-itmenu%2FAutenticaMenuInternet.htm&lang=es-PE&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA",
    method: "POST",
  },
);

const nextCookies = parseCookies(response);

const data = await response.text();

console.log("data", data);

const nextUrl = await captureFirstBodyUrl(response);

if (!nextUrl) {
  throw new Error("No next URL found");
}

console.log("calling next url...");

const nextResponse = await fetch(nextUrl, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Sec-GPC": "1",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-User": "?1",
    Cookie: nextCookies,
    Priority: "u=0, i",
  },
  referrer: "https://api-seguridad.sunat.gob.pe/",
  method: "GET",
});

console.log("nextResponse.status:", nextResponse.status);

writeFileSync("index.html", await nextResponse.text());
