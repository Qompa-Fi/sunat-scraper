import AdmZip from "adm-zip";

import * as Types from "./types.js";
import { Result } from "../types.js";

namespace ProposalsAPI {
  const genericHeaders: HeadersInit = {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
    Accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    Referer: "https://e-factura.sunat.gob.pe/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    Priority: "u=0",
  };

  /**
   * @description Retrieve the official records from the SUNAT Platform. The response items are an array in the following format: YYYYMM. Some examples are: 202405, 202201, 202112, etc.
   */
  export const getTaxComplianceVerificationPeriods = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    bookCode: Types.BookCode,
  ): Promise<Result<string[], "unauthorized" | "bad_response">> => {
    const endpoint = `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/padron/web/omisos/${bookCode}/periodos`;

    const response = await fetch(endpoint, {
      credentials: "include",
      headers: {
        ...genericHeaders,
        authorization: `Bearer ${sunatToken}`,
      },
      referrer: "https://e-factura.sunat.gob.pe/",
      method: "GET",
      mode: "cors",
      signal,
    });

    if (!response.ok) {
      const body = await response.text();

      console.warn({ body, url: response.url }, "response was not ok");

      if (body.includes("401 Authorization Required")) {
        return Result.notok("unauthorized");
      }

      return Result.notok("bad_response");
    }

    interface RawPeriod {
      numEjercicio: string;
      desEstado: string;
      lisPeriodos: Array<{
        perTributario: string;
        codEstado: string;
        desEstado: string;
      }>;
    }

    const untypedData = await response.json();
    const data = untypedData as RawPeriod[];

    const taxPeriods: Array<string> = [];

    for (const item of data) {
      for (const period of item.lisPeriodos) {
        taxPeriods.push(period.perTributario);
      }
    }

    return Result.ok(taxPeriods);
  };

  export interface SalesAndRevenueManagementSummary {
    documentType: string; // e.g., "01-Factura"
    totalDocuments: number; // Total number of documents
    taxableBaseDG: number; // BI Gravado DG
    igvIPMDG: number; // IGV / IPM DG
    taxableBaseDGNG: number; // BI Gravado DGNG
    igvIPMDGNG: number; // IGV / IPM DGNG
    taxableBaseDNG: number; // BI Gravado DNG
    igvIPMDNG: number; // IGV / IPM DNG
    nonTaxableValue: number; // Valor Adq. NG
    exciseTax: number; // ISC
    environmentalTax: number; // ICBPER
    otherTaxesOrCharges: number; // Otros Trib/ Cargos
    totalAmount: number; // Total CP
  }

  export interface PurchasingManagementSummary {
    documentType: string; // Type of document (e.g., "01-Factura", "03-Boleta de Venta")
    totalDocuments: number; // Total number of documents
    exportInvoicedValue: number; // Valor facturado la exportación
    taxableOperationBase: number; // Base imponible de la operación gravada
    taxableBaseDiscount: number; // Dscto. de la Base Imponible
    totalIGV: number; // Monto Total del IGV
    igvDiscount: number; // Dscto. del IGV
    exemptOperationTotal: number; // Importe total de la operación exonerada
    unaffectedOperationTotal: number; // Importe total de la operación inafecta
    exciseTaxISC: number; // ISC
    riceTaxableBase: number; // Base imponible de la operación gravada con el Impuesto a las Ventas del Arroz Pilado
    riceSalesTax: number; // Impuesto a las Ventas del Arroz Pilado
    environmentalTaxICBPER: number; // ICBPER
    otherTaxesOrCharges: number; // Otros Trib/ Cargos
    totalAmount: number; // Total CP
  }

  type GetTaxComplianceVerificationSummaryDataMapping<
    B extends Types.BookCode,
  > = B extends "140000"
    ? PurchasingManagementSummary[]
    : B extends "080000"
      ? SalesAndRevenueManagementSummary[]
      : never;

  export interface GetTaxComplianceVerificationSummaryInputs<
    B extends Types.BookCode,
  > {
    book_code: B;
    tax_period: string;
  }

  export const getTaxComplianceVerificationSummary = async <
    B extends Types.BookCode,
  >(
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: GetTaxComplianceVerificationSummaryInputs<B>,
  ): Promise<
    Result<GetTaxComplianceVerificationSummaryDataMapping<B>, "bad_response">
  > => {
    const endpoint = `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/resumen/web/resumencomprobantes/${inputs.tax_period}/1/1/exporta`;

    const response = await fetch(`${endpoint}?codLibro=${inputs.book_code}`, {
      credentials: "include",
      headers: {
        ...genericHeaders,
        authorization: `Bearer ${sunatToken}`,
      },
      referrer: "https://e-factura.sunat.gob.pe/",
      method: "GET",
      mode: "cors",
      signal,
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn({ body, url: response.url }, "response was not ok");
      return Result.notok("bad_response");
    }

    const csvData = await response.text();

    const [, ...rows] = csvData.split("\n");

    if (inputs.book_code === "140000") {
      const results: PurchasingManagementSummary[] = [];

      // We skip the last row (footer)
      for (let i = 0; i < rows.length - 1; i++) {
        const row = rows[i];
        const columns = row.split(",").map((c) => c.trim());

        results.push({
          documentType: columns[0],
          totalDocuments: safeParseInt(columns[1]),
          exportInvoicedValue: safeParseFloat(columns[2]),
          taxableOperationBase: safeParseFloat(columns[3]),
          taxableBaseDiscount: safeParseFloat(columns[4]),
          totalIGV: safeParseFloat(columns[5]),
          igvDiscount: safeParseFloat(columns[6]),
          exemptOperationTotal: safeParseFloat(columns[7]),
          unaffectedOperationTotal: safeParseFloat(columns[8]),
          exciseTaxISC: safeParseFloat(columns[9]),
          riceTaxableBase: safeParseFloat(columns[10]),
          riceSalesTax: safeParseFloat(columns[11]),
          environmentalTaxICBPER: safeParseFloat(columns[12]),
          otherTaxesOrCharges: safeParseFloat(columns[13]),
          totalAmount: safeParseFloat(columns[14]),
        });
      }

      return Result.ok(
        results as GetTaxComplianceVerificationSummaryDataMapping<B>,
      );
    }

    const results: SalesAndRevenueManagementSummary[] = [];

    // We skip the last row (footer)
    for (let i = 0; i < rows.length - 1; i++) {
      const row = rows[i];
      const columns = row.split(",").map((c) => c.trim());

      results.push({
        documentType: columns[0],
        totalDocuments: safeParseInt(columns[1]),
        taxableBaseDG: safeParseFloat(columns[2]),
        igvIPMDG: safeParseFloat(columns[3]),
        taxableBaseDGNG: safeParseFloat(columns[4]),
        igvIPMDGNG: safeParseFloat(columns[5]),
        taxableBaseDNG: safeParseFloat(columns[6]),
        igvIPMDNG: safeParseFloat(columns[7]),
        nonTaxableValue: safeParseFloat(columns[8]),
        exciseTax: safeParseFloat(columns[9]),
        environmentalTax: safeParseFloat(columns[10]),
        otherTaxesOrCharges: safeParseFloat(columns[11]),
        totalAmount: safeParseFloat(columns[12]),
      });
    }

    return Result.ok(
      results as GetTaxComplianceVerificationSummaryDataMapping<B>,
    );
  };

  export interface QueryProcessesData {
    pagination: {
      page: number;
      per_page: number;
      total: number;
    };
    items: {
      tax_period: string;
      ticket_id: string;
      issue_date: string | null;
      start_date: string | null;
      process_code: string;
      process_label: string;
      process_status_code: string;
      process_status_label: string;
      import_file_name: string | null;
      detail: {
        ticket_id: string;
        issue_date: string;
        issue_hour: string;
        delivery_status_code: string;
        delivery_status_label: string;
        report_file_name: string | null;
      };
      files:
        | {
            type_code: string;
            name: string;
            target_name: string;
          }[]
        | null;
      subprocesses:
        | {
            code: string;
            label: string;
            status: string;
            attempts: number;
          }[]
        | null;
    }[];
  }

  export interface RawQueryProcessesData {
    paginacion: {
      page: number;
      perPage: number;
      totalRegistros: number;
    };
    registros: {
      showReporteDescarga: string;
      perTributario: string;
      numTicket: string;
      fecCargaImportacion: string | null;
      fecInicioProceso: string | null;
      codProceso: string;
      desProceso: string;
      codEstadoProceso: string;
      desEstadoProceso: string;
      nomArchivoImportacion: string | null;
      detalleTicket: {
        numTicket: string;
        fecCargaImportacion: string;
        horaCargaImportacion: string;
        codEstadoEnvio: string;
        desEstadoEnvio: string;
        nomArchivoReporte: string | null;
        cntFilasvalidada: number;
        cntCPError: number;
        cntCPInformados: number;
      };
      archivoReporte: {
        codTipoAchivoReporte: string;
        nomArchivoReporte: string;
        nomArchivoContenido: string;
      }[];
      subProcesos:
        | {
            codTipoSubProceso: string;
            desTipoSubProceso: string;
            codEstado: string;
            numIntentos: number;
          }[]
        | null;
    }[];
  }

  export interface QueryProcessesInputs {
    /**
     * @description The book code to use in the request.
     */
    book_code: Types.BookCode;
    /**
     * @description A year and month in the following format: YYYYMM. Example: 202401, 202512, 202403, etc.
     */
    start_period: string;
    /**
     * @description A year and month in the following format: YYYYMM. Example: 202401, 202512, 202403, etc. By default it has the same value that `start_period` has.
     */
    end_period?: string;
    /**
     * @description The list page to retrieve. By default is `1`.
     */
    page?: number;
    /**
     * @description The number of records to retrieve in the list to retrieve. By default is `20`.
     */
    count?: number;
  }

  const rawQueryProcesses = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: QueryProcessesInputs,
  ): Promise<Result<RawQueryProcessesData, "bad_response">> => {
    const params = new URLSearchParams({
      perIni: inputs.start_period,
      perFin: inputs.end_period ? inputs.end_period : inputs.start_period,
      page: `${inputs.page ? inputs.page : 1}`,
      perPage: `${inputs.count ? inputs.count : 20}`,
      numTicket: "",
      codOrigenEnvio: "1",
      codLibro: inputs.book_code,
    });

    const endpoint =
      "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/consultaestadotickets";

    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        ...genericHeaders,
        authorization: `Bearer ${sunatToken}`,
      },
      signal,
      body: null,
      method: "GET",
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(
        { body, url: response.url },
        "SunatAPI.queryProcesses.error",
      );
      return Result.notok("bad_response");
    }

    return Result.ok(await response.json());
  };

  /**
   * @description Returns the paginated processes from the SUNAT API. You can also use `SunatAPI.queryProcesses.raw`.
   */
  export const queryProcesses = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: QueryProcessesInputs,
  ): Promise<Result<QueryProcessesData, "bad_response">> => {
    const result = await rawQueryProcesses(signal, sunatToken, inputs);
    if (!result.ok) return result;

    const data = result.value;

    return Result.ok({
      pagination: {
        page: data.paginacion.page,
        per_page: data.paginacion.perPage,
        total: data.paginacion.totalRegistros,
      },
      items: data.registros.map((record) => ({
        tax_period: record.perTributario,
        ticket_id: record.numTicket,
        issue_date: record.fecCargaImportacion,
        start_date: record.fecInicioProceso,
        process_code: record.codProceso,
        process_label: record.desProceso,
        process_status_code: record.codEstadoProceso,
        process_status_label: record.desEstadoProceso,
        import_file_name: record.nomArchivoImportacion,
        detail: {
          ticket_id: record.detalleTicket.numTicket,
          issue_date: record.detalleTicket.fecCargaImportacion,
          issue_hour: record.detalleTicket.horaCargaImportacion,
          delivery_status_code: record.detalleTicket.codEstadoEnvio,
          delivery_status_label: record.detalleTicket.desEstadoEnvio,
          report_file_name: record.detalleTicket.nomArchivoReporte,
        },
        files: record.archivoReporte
          ? record.archivoReporte.map((file) => ({
              type_code: file.codTipoAchivoReporte,
              name: file.nomArchivoReporte,
              target_name: file.nomArchivoContenido,
            }))
          : null,
        subprocesses: record.subProcesos
          ? record.subProcesos.map((sub) => ({
              code: sub.codTipoSubProceso,
              label: sub.desTipoSubProceso,
              status: sub.codEstado,
              attempts: sub.numIntentos,
            }))
          : record.subProcesos,
      })),
    });
  };

  /**
   * @description Returns the paginated processes from the SUNAT API. It doesn't perform a data structure mapping.
   */
  queryProcesses.raw = rawQueryProcesses;

  export interface RequestSalesAndRevenueManagementProposalInputs {
    tax_period: string;
  }

  export interface RequestSalesAndRevenueManagementProposalData {
    ticket_id: string;
  }

  /**
   * @description Returns the ticket number so you can query the process in background while is being dispatched by the SUNAT platform.
   */
  export const requestSalesAndRevenueManagementProposal = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: RequestSalesAndRevenueManagementProposalInputs,
  ): Promise<
    Result<
      RequestPurchasingManagementProposalData,
      "no_ticket_in_response" | "bad_response"
    >
  > => {
    const EXPORT_AS_CSV_CODE = "1";

    const endpoint = `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvie/propuesta/web/propuesta/${inputs.tax_period}/exportapropuesta`;

    const params = new URLSearchParams({
      codOrigenEnvio: "1",
      mtoTotalDesde: "",
      mtoTotalHasta: "",
      fecDocumentoDesde: "",
      fecDocumentoHasta: "",
      numRucAdquiriente: "",
      numCarSunat: "",
      codTipoCDP: "",
      codTipoInconsistencia: "",
      codTipoArchivo: EXPORT_AS_CSV_CODE,
    });

    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        ...genericHeaders,
        authorization: `Bearer ${sunatToken}`,
      },
      signal,
      body: null,
      method: "GET",
    });
    if (!response.ok) {
      const body = await response.text();
      console.warn({ body, url: response.url }, "response was not ok");
      return Result.notok("bad_response");
    }

    interface RawBody {
      numTicket?: string;
    }

    const untypedBody = await response.json();
    const body = untypedBody as RawBody;

    if (!body.numTicket) {
      return Result.notok("no_ticket_in_response");
    }

    return Result.ok({ ticket_id: body.numTicket });
  };

  export interface RequestPurchasingManagementProposalInputs {
    tax_period: string;
  }

  export interface RequestPurchasingManagementProposalData {
    ticket_id: string;
  }

  /**
   * @description Returns the ticket number so you can query the process in background while is being dispatched by the SUNAT platform.
   */
  export const requestPurchasingManagementProposal = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: RequestPurchasingManagementProposalInputs,
  ): Promise<
    Result<
      RequestPurchasingManagementProposalData,
      "no_ticket_in_response" | "bad_response"
    >
  > => {
    const EXPORT_AS_CSV_CODE = "1";

    const endpoint = `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rce/propuesta/web/propuesta/${inputs.tax_period}/exportacioncomprobantepropuesta`;

    const params = new URLSearchParams({
      codTipoArchivo: EXPORT_AS_CSV_CODE,
      codOrigenEnvio: "1",
    });

    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        ...genericHeaders,
        Authorization: `Bearer ${sunatToken}`,
      },
      signal,
      body: null,
      method: "GET",
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn({ body, url: response.url }, "response was not ok");
      return Result.notok("bad_response");
    }

    interface RawBody {
      numTicket?: string;
    }

    const untypedBody = await response.json();
    const body = untypedBody as RawBody;

    if (!body.numTicket) {
      return Result.notok("no_ticket_in_response");
    }

    return Result.ok({ ticket_id: body.numTicket });
  };

  export interface GetProcessedProposalInputs {
    report_file: {
      code_type: string;
      name: string;
    };
    process_code: string;
    tax_period: string;
    ticket_id: string;
  }

  export const getProcessedSalesAndRevenuesProposal = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: GetProcessedProposalInputs,
  ): Promise<
    Result<Types.SalesRecord[], "bad_response" | "could_not_retrieve_csv">
  > => {
    const result = await getProcessedIGVProposal(
      signal,
      sunatToken,
      Types.BookCode.SalesAndRevenue,
      inputs,
    );
    if (!result.ok) return result;

    const results: Array<Types.SalesRecord> = [];

    const [, ...rows] = result.value.split("\n");

    for (const row of rows) {
      const columns = row.split(",");
      if (columns.length < 38) {
        continue;
      }

      results.push({
        ruc: columns[0],
        business_name: columns[1],
        tax_period: columns[2],
        car_sunat: columns[3],
        issue_date: columns[4],
        due_date: columns[5] ?? null,
        document_type: columns[6].padStart(2, "0") as Types.ProofOfPaymentCode,
        document_series: columns[7],
        initial_document_number: columns[8] ?? null,
        final_document_number: columns[9] ?? null,
        identity_document_type: columns[10] as Types.EntityDocumentTypeCode,
        identity_document_number: columns[11],
        client_name: columns[12],
        export_invoiced_value: safeParseFloat(columns[13]),
        taxable_base: safeParseFloat(columns[14]),
        taxable_base_discount: safeParseFloat(columns[15]),
        igv: safeParseFloat(columns[16]),
        igv_discount: safeParseFloat(columns[17]),
        exempted_amount: safeParseFloat(columns[18]),
        unaffected_amount: safeParseFloat(columns[19]),
        isc: safeParseFloat(columns[20]),
        ivap_taxable_base: safeParseFloat(columns[21]),
        ivap: safeParseFloat(columns[22]),
        icbper: safeParseFloat(columns[23]),
        other_taxes: safeParseFloat(columns[24]),
        total_amount: safeParseFloat(columns[25]),
        currency: columns[26] as Types.KnownCurrenciesAndMore,
        exchange_rate: safeParseFloat(columns[27]),
        mod_document:
          columns[28] && columns[29] && columns[30] && columns[31]
            ? {
                issue_date: columns[28],
                type: columns[29] as Types.ProofOfPaymentCode,
                series: columns[30],
                number: columns[31],
              }
            : null,
        note_type: columns[33] ? columns[33] : null,
        invoice_status: columns[34] as Types.InvoiceStatusCode,
        fob_value: safeParseFloat(columns[35]),
        free_operations_value: safeParseFloat(columns[36]),
        operation_type: columns[37] as Types.SaleTypeCode,
        customs_declaration: columns[38] ?? null,
      });
    }

    return Result.ok(results);
  };

  export const getProcessedIncomesProposal = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    inputs: GetProcessedProposalInputs,
  ): Promise<
    Result<Types.PurchaseRecord[], "bad_response" | "could_not_retrieve_csv">
  > => {
    const result = await getProcessedIGVProposal(
      signal,
      sunatToken,
      Types.BookCode.Purchases,
      inputs,
    );
    if (!result.ok) return result;

    const [, ...rows] = result.value.split("\n");

    const results: Array<Types.PurchaseRecord> = [];

    for (const row of rows) {
      const columns = row.split(",");
      if (columns.length < 40) {
        continue;
      }

      results.push({
        ruc: columns[0],
        names: columns[1],
        tax_period: columns[2],
        car_sunat: columns[3],
        issue_date: columns[4],
        due_date: columns[5] ?? null,
        document_type: columns[6].padStart(2, "0") as Types.ProofOfPaymentCode,
        document_series: columns[7],
        year: columns[8] ?? null,
        initial_document_number: columns[9] ?? null,
        final_document_number: columns[10] ?? null,
        identity_document_type: columns[11] as Types.EntityDocumentTypeCode,
        identity_document_number: columns[12],
        client_name: columns[13],
        taxable_base_dg: safeParseFloat(columns[14]),
        igv_dg: safeParseFloat(columns[15]),
        taxable_base_dgng: safeParseFloat(columns[16]),
        igv_dgng: safeParseFloat(columns[17]),
        taxable_base_dng: safeParseFloat(columns[18]),
        igv_dng: safeParseFloat(columns[19]),
        acquisition_value_ng: safeParseFloat(columns[20]),
        isc: safeParseFloat(columns[21]),
        icbper: safeParseFloat(columns[22]),
        other_taxes: safeParseFloat(columns[23]),
        total_amount: safeParseFloat(columns[24]),
        currency: columns[25] as Types.KnownCurrenciesAndMore,
        exchange_rate: safeParseFloat(columns[26]),
        mod_document:
          columns[27] && columns[28] && columns[29] && columns[31]
            ? {
                issue_date: columns[27],
                type: columns[28] as Types.ProofOfPaymentCode,
                series: columns[29],
                number: columns[31],
              }
            : null,
        imb: safeParseFloat(columns[35]),
        origin_indicator: columns[36] ?? null,
        detraction: columns[37] ? safeParseFloat(columns[37]) : null,
        note_type: columns[38] ? columns[38] : null,
        invoice_status: columns[39] as Types.InvoiceStatusCode,
        incal: columns[40] ?? null,
      });
    }

    return Result.ok(results);
  };

  /**
   * @description Returns the CSV data for the provided IGV proposal.
   */
  const getProcessedIGVProposal = async (
    signal: AbortSignal | undefined,
    sunatToken: string,
    bookCode: Types.BookCode,
    inputs: GetProcessedProposalInputs,
  ): Promise<Result<string, "bad_response" | "could_not_retrieve_csv">> => {
    const params = new URLSearchParams({
      nomArchivoReporte: inputs.report_file.name,
      codTipoArchivoReporte: inputs.report_file.code_type,
      codLibro: bookCode,
      perTributario: inputs.tax_period,
      codProceso: inputs.process_code,
      numTicket: inputs.ticket_id,
    });

    const endpoint =
      "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/gestionprocesosmasivos/web/masivo/archivoreporte";

    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        ...genericHeaders,
        Authorization: `Bearer ${sunatToken}`,
      },
      signal,
      body: null,
      method: "GET",
    });
    if (!response.ok) {
      const body = await response.text();
      console.warn({ body, url: response.url }, "response was not ok");
      return Result.notok("bad_response");
    }

    const compressedData = await response.arrayBuffer();
    const zip = new AdmZip(Buffer.from(compressedData));

    for (const entry of zip.getEntries()) {
      const content = entry.getData().toString("utf8");
      return Result.ok(content);
    }

    return Result.notok("could_not_retrieve_csv");
  };

  /**
   * @description Safe parsing for decimal numbers from CSV strings
   * @param value The string value to parse
   * @param defaultValue Default value if parsing fails (default: 0)
   * @returns Parsed number or default value
   */
  const safeParseFloat = (value: string | undefined | null, defaultValue: number = 0): number => {
    if (!value || value.trim() === '' || value.trim() === '-') {
      return defaultValue;
    }
    
    const cleaned = value.trim().replace(/,/g, '');
    const parsed = Number.parseFloat(cleaned);
    
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  /**
   * @description Safe parsing for integer numbers from CSV strings
   * @param value The string value to parse
   * @param defaultValue Default value if parsing fails (default: 0)
   * @returns Parsed integer or default value
   */
  const safeParseInt = (value: string | undefined | null, defaultValue: number = 0): number => {
    if (!value || value.trim() === '' || value.trim() === '-') {
      return defaultValue;
    }
    
    const cleaned = value.trim().replace(/,/g, '');
    const parsed = Number.parseInt(cleaned, 10);
    
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };
}

export namespace Proposals {
  export const queryProcesses = ProposalsAPI.queryProcesses;

  export const TaxComplianceVerification = {
    getSummary: ProposalsAPI.getTaxComplianceVerificationSummary,
    getPeriods: ProposalsAPI.getTaxComplianceVerificationPeriods,
  };

  export const Purchasing = {
    requestProposal: ProposalsAPI.requestPurchasingManagementProposal,
    getProposal: ProposalsAPI.getProcessedIncomesProposal,
  };

  export const SalesAndRevenues = {
    requestProposal: ProposalsAPI.requestSalesAndRevenueManagementProposal,
    getProposal: ProposalsAPI.getProcessedSalesAndRevenuesProposal,
  };

  export import SalesRecord = Types.SalesRecord;
  export import PurchaseRecord = Types.PurchaseRecord;

  export const {
    ProofOfPaymentCode,
    InvoiceStatusCode,
    EntityDocumentTypeCode,
    SaleTypeCode,
    BookCode
  } = Types;
}
