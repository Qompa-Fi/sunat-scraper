const getOauth2EndpointMetadata = (endpoint: string): [string, string] => {
  const structuredOauth2Endpoint = new URL(endpoint);
  const state = structuredOauth2Endpoint.searchParams.get("state") ?? "";

  structuredOauth2Endpoint.search = "";

  const completeUrl = structuredOauth2Endpoint.toString();

  const trimmedEndpoint = completeUrl.substring(
    0,
    completeUrl.lastIndexOf("/"),
  );

  return [trimmedEndpoint, state];
};

export async function verifySolCredentials(
  ruc: string,
  solUsername: string,
  solKey: string,
): Promise<boolean> {
  const oauth2Endpoint = await getOauth2EndpointUrl();
  if (!oauth2Endpoint) return false;

  const [trimmedEndpoint, state] = getOauth2EndpointMetadata(oauth2Endpoint);

  const response = await fetch(`${trimmedEndpoint}/j_security_check`, {
    method: "POST",
    headers: {
      Accept: "text/html",
      Origin: "https://api-seguridad.sunat.gob.pe",
      Referer: "https://e-menu.sunat.gob.pe/",
      DNT: "1",
      "Content-Type": "application/x-www-form-urlencoded",
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

  const document = await response.text();
  const isValid = document.includes("Bienvenidos a SUNAT");

  return isValid;
}

async function getOauth2EndpointUrl(): Promise<string | null> {
  const response = await fetch(
    "https://e-menu.sunat.gob.pe/cl-ti-itmenu/MenuInternet.htm",
    {
      credentials: "include",
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.5",
        Origin: "https://api-seguridad.sunat.gob.pe",
        Referer: "https://e-menu.sunat.gob.pe/",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        DNT: "1",
      },
    },
  );

  const body = await response.text();

  // https://stackoverflow.com/a/6041965 :)
  const rxUrlWithParams =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;

  const matches = body.match(rxUrlWithParams);
  if (matches) {
    for (const match of matches) {
      if (match.includes("https://api-seguridad.sunat.gob.pe/v1/clientessol")) {
        return match;
      }
    }
  }

  return null;
}

export interface RawExchangeRate {
  fecPublica: string;
  valTipo: string;
  codTipo: RawExchangeRateType;
}

type RawExchangeRateType = "C" | "V";

export interface ExchangeRate {
  date: string;
  salePrice: string;
  purchasePrice: string;
}

async function getRawExchangeRatesOfMonth(
  month: number,
  year: number,
): Promise<RawExchangeRate[] | null> {
  const endpoint =
    "https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias/listarTipoCambio";

  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Connection: "keep-alive",
      "User-Agent": userAgent,
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
    },
    body: JSON.stringify({
      anio: year,
      mes: month - 1, // yes, months are zero-indexed
      token: "dont_make_this_difficult",
    }),
    credentials: "include",
    mode: "cors",
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

export async function getExchangeRatesOfMonth(
  month: number,
  year: number,
): Promise<ExchangeRate[] | null> {
  const rawRates = await getRawExchangeRatesOfMonth(month, year);
  if (!rawRates) return null;

  const results: Array<ExchangeRate> = [];
  let parsedRate: Partial<ExchangeRate> | null = null;

  for (const rawRate of rawRates) {
    if (!parsedRate) {
      parsedRate = { date: rawRate.fecPublica };
    }

    if (rawRate.codTipo === "C") {
      parsedRate.purchasePrice = rawRate.valTipo;
    } else if (rawRate.codTipo === "V") {
      parsedRate.salePrice = rawRate.valTipo;
    }

    const isComplete =
      parsedRate?.date && parsedRate?.purchasePrice && parsedRate?.salePrice;

    if (isComplete) {
      results.push(parsedRate as ExchangeRate);
      parsedRate = null;
    }
  }

  return results.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

getExchangeRatesOfMonth.raw = getRawExchangeRatesOfMonth;

export * from "./proposals";
export * from "./company";
