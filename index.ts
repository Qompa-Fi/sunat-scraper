import { parse as parseHtml, type HTMLElement } from "node-html-parser";

import type { CompanyInfo, CompanyLegalRepresentative } from "./types";

type SunatQueryAction = "consPorRuc" | "getRepLeg";

const token =
  "03AFcWeA7QNYC9ZT-BoB0vp4N41EMYvcRLrq1WqwnNDS0GuwJGUKihzDLIi2HxXO_JEJDnHMZb2HtWKSEI7w_PfESFeJnkEKgrCYFOP6XgljqpsgB4KMoWg_jlEzadLpLix-H1CaNS-naEHtSMrVv2eX_RjjSfedAGfgxEWNu9dK7a9iVig0qR4LG-xgCX2NFDQvCRurxG7Odj9I4mroLM20OWHZyxHWtt-xsp6yGwILmiIF6TV1SsTAXW7AKp2CWODyvSPnKgLp9bZS1FQ6j9jOO-IGv4vtd9yBsi7HLrc4omJaBDSMDkdutxqvphBr8r6esSB1XPFTpdmZRFppNYiOfdPzTWBpg0ExGIpnObnCKveWL_FA8fPkDYLHoZ6Zobub23d7Ls2ZmFCNKtqCQ-EVwIr3wlniJ4B3e18azM2tQOhFjIv7mVHPnniEWN14MmO0vWO0PL5HH0c-RqLLSoGK_wqOuVXvvn34hgi_Ca9c6jKH73AbpgdGApLdQrnOmtfbP6j5QkgonXgG1O_6bvwP8czQ_SkQDarAPuihl9ixB7-BhWeEC3mfN4a7JVVe_h4dQzTY_Lom_nepNhBuHCpCrim_7CIrNkJ0CB9VzLlw5u39aelr6LybUs_-T6NK3-C_LmanwJ_pn7B5ZpfpNXG956Ml5XLH2vjL8aqVjqkNJSE7B3e9549nBP8eEh7gmFTzPa_MojhV7cKSI6mtjKIBtXhgjJh1hI8XAuCPeC1qq_1jVKHUuGCpDymGNr4ojSxR28totax43s-JwYsGDMKWWt8W0JUP5ygLeL98H2bMBbEI4uEWjAb2XX6-f5zSwgjy-nszvr5CbcY0nmeg7NGT9gEc2RDOZrfkdctdN6_UbDwFPxy1Pi2HcQPeg7N6Y3FPf6R5YdtulB";

const SUNAT_WEBVIEW_URL =
  "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias";

export const getLegalRepresentatives = async (
  ruc: string,
): Promise<CompanyLegalRepresentative[] | null> => {
  const document = await queryByRuc(ruc, "getRepLeg"); //

  const tds = document.querySelectorAll(".panel .table td");
  const results: Array<CompanyLegalRepresentative> = [];

  if (tds.length === 0) return null;

  for (let i = 0; i < tds.length; i += 5) {
    const type = sanitize(tds[i].innerText);
    const number = sanitize(tds[i + 1].innerText);
    const names = sanitize(tds[i + 2].innerText);
    const role = sanitize(tds[i + 3].innerText);

    const rawSince = sanitize(tds[i + 4].innerText);
    const since = parseAsLocalizedDateOrNull(rawSince, "-05:00");

    results.push({
      document: { type, number },
      names,
      role,
      since,
    });
  }

  return results;
};

export const getCompanyInfo = async (
  ruc: string,
): Promise<CompanyInfo | null> => {
  const document = await queryByRuc(ruc);

  const tds = document.querySelectorAll(".form-table tr td");
  if (tds.length < 27) return null;

  const [rucNumber, name] = tds[2].innerText.split(" - ");
  const taxPayerType = tds[4].innerText;

  const businessName = tds[6].innerText === "-" ? null : tds[6].innerText;

  const registrationDate = parseAsLocalizedDateOrNull(
    tds[8].innerText,
    "-05:00",
  );

  const startDateOfActivities =
    tds[10].innerText === "-"
      ? null
      : parseAsLocalizedDateOrNull(tds[10].innerText, "-05:00");

  const status = tds[12].innerText;
  const condition = sanitize(tds[15].innerText);
  const fiscalAddress = cleanDashedText(tds[17].innerText).replace("----", "");

  const economicActivities: Array<string> = [];

  for (const line of tds[22].innerText.split("\n")) {
    const s = cleanDashedText(line);
    if (s) economicActivities.push(s);
  }

  return {
    ruc: rucNumber,
    name,
    taxPayerType,
    businessName,
    registrationDate,
    startDateOfActivities,
    status,
    condition,
    fiscalAddress,
    economicActivities,
  };
};

const queryByRuc = async (
  ruc: string,
  action: SunatQueryAction = "consPorRuc",
): Promise<HTMLElement> => {
  const response = await fetch(SUNAT_WEBVIEW_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=ISO-8859-1",
    },
    body: new URLSearchParams({
      accion: action,
      nroRuc: ruc,
      desRuc: "",
      token,
      tipdoc: "1",
    }),
  });

  const data = await response.text();

  return parseHtml(data);
};

const sanitize = (s: string): string =>
  s
    .replace(/^[\\r\\n\s]+/, "")
    .replace(/[\\r\\n\s]+$/, "")
    .replace("&oacute;", "ó")
    .replace("&eacute;", "é")
    .replace("  ", " ");

const cleanDashedText = (s: string): string =>
  s.split(" - ").map(sanitize).join(" - ");

const parseAsLocalizedDateOrNull = (
  datestr: string,
  tzOffset: string,
): Date | null => {
  const [day, month, year] = datestr.split("/");
  const d = new Date(`${year}-${month}-${day}T00:00:00${tzOffset}`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const verifySolCredentials = async (
  ruc: string,
  solUsername: string,
  solPassword: string,
): Promise<boolean> => {
  const oauth2Endpoint = await getOauth2EndpointUrl();
  if (!oauth2Endpoint) return false;

  const structuredOauth2Endpoint = new URL(oauth2Endpoint);

  const state = structuredOauth2Endpoint.searchParams.get("state") ?? "";

  structuredOauth2Endpoint.search = "";
  const urlWithoutParams = structuredOauth2Endpoint.toString();
  const trimmedEndpoint = urlWithoutParams.substring(
    0,
    urlWithoutParams.lastIndexOf("/"),
  );

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
      j_password: solPassword,
      captcha: "",
      state,
      originalUrl: "",
    }),
    redirect: "follow",
  });

  const document = await response.text();
  const isValid = document.includes("Bienvenidos a SUNAT");

  return isValid;
};

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
