import { parse as parseHtml, type HTMLElement } from "node-html-parser";

import * as Types from "./types.js";

type SunatQueryAction = "consPorRuc" | "getRepLeg";

const token =
  "03AFcWeA7QNYC9ZT-BoB0vp4N41EMYvcRLrq1WqwnNDS0GuwJGUKihzDLIi2HxXO_JEJDnHMZb2HtWKSEI7w_PfESFeJnkEKgrCYFOP6XgljqpsgB4KMoWg_jlEzadLpLix-H1CaNS-naEHtSMrVv2eX_RjjSfedAGfgxEWNu9dK7a9iVig0qR4LG-xgCX2NFDQvCRurxG7Odj9I4mroLM20OWHZyxHWtt-xsp6yGwILmiIF6TV1SsTAXW7AKp2CWODyvSPnKgLp9bZS1FQ6j9jOO-IGv4vtd9yBsi7HLrc4omJaBDSMDkdutxqvphBr8r6esSB1XPFTpdmZRFppNYiOfdPzTWBpg0ExGIpnObnCKveWL_FA8fPkDYLHoZ6Zobub23d7Ls2ZmFCNKtqCQ-EVwIr3wlniJ4B3e18azM2tQOhFjIv7mVHPnniEWN14MmO0vWO0PL5HH0c-RqLLSoGK_wqOuVXvvn34hgi_Ca9c6jKH73AbpgdGApLdQrnOmtfbP6j5QkgonXgG1O_6bvwP8czQ_SkQDarAPuihl9ixB7-BhWeEC3mfN4a7JVVe_h4dQzTY_Lom_nepNhBuHCpCrim_7CIrNkJ0CB9VzLlw5u39aelr6LybUs_-T6NK3-C_LmanwJ_pn7B5ZpfpNXG956Ml5XLH2vjL8aqVjqkNJSE7B3e9549nBP8eEh7gmFTzPa_MojhV7cKSI6mtjKIBtXhgjJh1hI8XAuCPeC1qq_1jVKHUuGCpDymGNr4ojSxR28totax43s-JwYsGDMKWWt8W0JUP5ygLeL98H2bMBbEI4uEWjAb2XX6-f5zSwgjy-nszvr5CbcY0nmeg7NGT9gEc2RDOZrfkdctdN6_UbDwFPxy1Pi2HcQPeg7N6Y3FPf6R5YdtulB";

const SUNAT_WEBVIEW_URL =
  "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias";

export namespace Company {
  export const getLegalRepresentatives = async (
    ruc: string,
  ): Promise<Company.LegalRepresentative[] | null> => {
    const document = await queryByRuc(ruc, "getRepLeg"); //

    const tds = document.querySelectorAll(".panel .table td");
    const results: Array<Company.LegalRepresentative> = [];

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

  export const getInformation = async (
    ruc: string,
  ): Promise<Company.Information | null> => {
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
    const fiscalAddress = cleanDashedText(tds[17].innerText).replace(
      "----",
      "",
    );

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

  export import Information = Types.CompanyInfo;
  export import LegalRepresentative = Types.CompanyLegalRepresentative;
}

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
