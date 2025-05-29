export enum ProofOfPaymentCode {
  /**
   * @description AKA "Otros".
   */
  Other = "00",
  /**
   * @description AKA "Factura".
   */
  Invoice = "01",
  /**
   * @description AKA "Recibo por honorarios".
   */
  ReceiptForFees = "02",
  /**
   * @description AKA "Boleta de venta".
   */
  SalesReceipt = "03",
  /**
   * @description AKA "Liquidación de compra".
   */
  PurchaseLiquidation = "04",
  /**
   * @description AKA "Boleto de compañía de aviación comercial por el servicio de transporte aéreo de pasajeros".
   */
  AviationCommercialPassengerTransportTicket = "05",
  /**
   * @description AKA "Carta de porte aéreo por el servicio de transporte de carga aérea".
   */
  AirCargoTransportWaybill = "06",
  /**
   * @description AKA "Nota de crédito".
   */
  CreditNote = "07",
  /**
   * @description AKA "Nota de débito".
   */
  DebitNote = "08",
  /**
   * @description AKA "Guía de remisión - Remitente".
   */
  SenderDispatchGuide = "09",
  /**
   * @description AKA "Recibo por Arrendamiento".
   */
  LeaseReceipt = "10",
  /**
   * @description AKA "Póliza emitida por las Bolsas de Valores, Bolsas de Productos o Agentes de Intermediación por operaciones realizadas en las Bolsas de Valores o Productos o fuera de las mismas, autorizadas por CONASEV".
   */
  PolicyIssuedByStockExchangesCommodityExchangesOrBrokerageAgents = "11",

  /**
   * @description AKA "Ticket o cinta emitido por máquina registradora".
   */
  CashRegisterReceipt = "12",

  /**
   * @description AKA "Documento emitido por bancos, instituciones financieras, crediticias y de seguros que se encuentran bajo el control de la Superintendencia de Banca y Seguros".
   */
  DocumentIssuedByBanksFinancialCreditAndInsuranceInstitutionsUnderSBSControl = "13",
  /**
   * @description AKA "Recibo por servicios públicos de suministro de energía eléctrica, agua, teléfono, telex y telegráficos y otros servicios complementarios que se incluyan en el recibo de servicio público"
   */
  PublicServiceReceiptForElectricityWaterPhoneTelexTelegraphAndOtherComplementaryServices = "14",
  /**
   * @description AKA "Boleto emitido por las empresas de transporte público urbano de pasajeros".
   */
  UrbanPublicTransportTicket = "15",
  /**
   * @description AKA "Boleto de viaje emitido por las empresas de transporte público interprovincial de pasajeros dentro del país".
   */
  DomesticInterprovincialPublicTransportTicket = "16",
  /**
   * @description AKA "Documento emitido por la Iglesia Católica por el arrendamiento de bienes inmuebles".
   */
  CatholicChurchPropertyLeaseDocument = "17",
  /**
   * @description AKA "Documento emitido por las Administradoras Privadas de Fondo de Pensiones que se encuentran bajo la supervisión de la Superintendencia de Administradoras Privadas de Fondos de Pensiones".
   */
  DocumentIssuedByPrivatePensionFundAdministratorsUnderSBSControl = "18",
  /**
   * @description AKA "Boleto o entrada por atracciones y espectáculos públicos".
   */
  TicketForPublicAttractionsAndEvents = "19",
  /**
   * @description AKA "Comprobante de Retención".
   */
  WithholdingReceipt = "20",
  /**
   * @description AKA "Conocimiento de embarque por el servicio de transporte de carga marítima".
   */
  BillOfLadingForMaritimeCargoTransport = "21",
  /**
   * @description AKA "Comprobante por Operaciones No Habituales".
   */
  ReceiptForNonRoutineOperations = "22",
  /**
   * @description AKA "Pólizas de Adjudicación emitidas con ocasión del remate o adjudicación de bienes por venta forzada, por los martilleros o las entidades que rematen o subasten bienes por cuenta de terceros".
   */
  AdjudicationPoliciesFromForcedSaleByAuctioneers = "23",
  /**
   * @description AKA "Certificado de pago de regalías emitidas por PERUPETRO S.A".
   */
  RoyaltyPaymentCertificateIssuedByPERUPETRO = "24",
  /**
   * @description AKA "Documento de Atribución (Ley del Impuesto General a las Ventas e Impuesto Selectivo al Consumo, Art. 19º, último párrafo, R.S. N° 022-98-SUNAT)".
   */
  AttributionDocumentForVATAndExciseTax = "25",
  /**
   * @description AKA "Recibo por el Pago de la Tarifa por Uso de Agua Superficial con fines agrarios y por el pago de la Cuota para la ejecución de una determinada obra o actividad acordada por la Asamblea General de la Comisión de Regantes o Resolución expedida por el Jefe de la Unidad de Aguas y de Riego (Decreto Supremo N° 003-90-AG, Arts. 28 y 48)".
   */
  ReceiptForSurfaceWaterUseFeeForAgricultureAndConstructionFee = "26",
  /**
   * @description AKA "Seguro Complementario de Trabajo de Riesgo".
   */
  ComplementaryRiskWorkInsurance = "27",
  /**
   * @description AKA "Tarifa Unificada de Uso de Aeropuerto".
   */
  UnifiedAirportUsageFee = "28",
  /**
   * @description AKA "Documentos emitidos por la COFOPRI en calidad de oferta de venta de terrenos, los correspondientes a las subastas públicas y a la retribución de los servicios que presta".
   */
  DocumentsIssuedByCOFOPRIForLandSaleOfferAndPublicAuctions = "29",
  /**
   * @description AKA "Documentos emitidos por las empresas que desempeñan el rol adquirente en los sistemas de pago mediante tarjetas de crédito y débito".
   */
  DocumentsIssuedByAcquirerCompaniesInPaymentSystems = "30",
  /**
   * @description AKA "Guía de Remisión - Transportista".
   */
  TransporterDispatchGuide = "31",
  /**
   * @description AKA "Documentos emitidos por las empresas recaudadoras de la denominada Garantía de Red Principal a la que hace referencia el numeral 7.6 del artículo 7° de la Ley N° 27133 – Ley de Promoción del Desarrollo de la Industria del Gas Natural".
   */
  DocumentsIssuedByMainGridGuaranteeCollectors = "32",
  /**
   * @description AKA "Documento del Operador".
   */
  OperatorDocument = "34",
  /**
   * @description AKA "Documento del Partícipe".
   */
  ParticipantDocument = "35",
  /**
   * @description AKA "Recibo de Distribución de Gas Natural".
   */
  NaturalGasDistributionReceipt = "36",
  /**
   * @description AKA "Documentos que emitan los concesionarios del servicio de revisiones técnicas vehiculares, por la prestación de dicho servicio".
   */
  VehicleTechnicalInspectionServiceDocuments = "37",
  /**
   * @description AKA "Constancia de Depósito - IVAP (Ley 28211)".
   */
  DepositCertificateIVAP = "40",
  /**
   * @description AKA "Declaración Única de Aduanas - Importación definitiva".
   */
  SingleCustomsDeclarationForDefinitiveImportation = "50",
  /**
   * @description AKA "Despacho Simplificado - Importación Simplificada".
   */
  SimplifiedDispatchForSimplifiedImportation = "52",
  /**
   * @description AKA "Declaración de Mensajería o Courier".
   */
  CourierDeclaration = "53",
  /**
   * @description AKA "Liquidación de Cobranza".
   */
  CollectionSettlement = "54",
  /**
   * @description AKA "Nota de Crédito Especial".
   */
  SpecialCreditNote = "87",
  /**
   * @description AKA "Nota de Débito Especial".
   */
  SpecialDebitNote = "88",
  /**
   * @description AKA "Comprobante de No Domiciliado".
   */
  NonDomiciledReceipt = "91",
  /**
   * @description AKA "Exceso de crédito fiscal por retiro de bienes".
   */
  ExcessVATCreditDueToGoodsWithdrawal = "96",
  /**
   * @description AKA "Nota de Crédito - No Domiciliado".
   */
  CreditNoteForNonDomiciled = "97",
  /**
   * @description AKA "Nota de Débito - No Domiciliado".
   */
  DebitNoteForNonDomiciled = "98",
  /**
   * @description AKA "Otros - Consolidado de Boletas de Venta".
   */
  OthersConsolidatedSalesReceipts = "99",
}

/**
 * @description You can see the full table in https://www.sunat.gob.pe/legislacion/superin/2014/anexo4-247-2014.pdf.
 */
export enum InvoiceStatusCode {
  /**
   * @description Originally described with "Cuando la operación (anotación optativa sin efecto en el IGV) corresponde al periodo, emitidas en el periodo".
   */
  OperationCorrespondingToThePeriodIssuedInThePeriod = "O",

  /**
   * @description Originally described with "Cuando se anota el Comprobante de Pago o documento en el periodo que se emitió o que se pagó el impuesto, según normativa".
   */
  PaymentReceiptRecordedInThePeriodIssuedOrPaid = "1",

  /**
   * @description Originally described with "Cuando la fecha de emisión del Comprobante de Pago o de pago del impuesto, por operaciones que otorguen derecho a crédito fiscal, es anterior al periodo de anotación y esta se produce dentro de los doce meses siguientes a la emisión".
   */
  ReceiptIssuedBeforePeriodRecordedWithin12Months = "6",

  /**
   * @description Originally described with "Cuando la fecha de emisión del Comprobante de Pago o pago del impuesto, por operaciones que otorgaban derecho a crédito fiscal, es anterior al periodo de anotación y esta se produce luego de los doce meses siguientes a la emisión".
   */
  ReceiptIssuedBeforePeriodRecordedAfter12Months = "7",

  /**
   * @description Originally described with "Cuando se realice un ajuste o rectificación en la anotación de la información de una operación registrada en un periodo anterior".
   */
  AdjustmentOrCorrectionOfOperationRecordedInPreviousPeriod = "9",
}

/**
 * @description Use https://www2.sunat.gob.pe/pdt/pdtModulos/independientes/p695/TipoDoc.htm to watch more. ;)
 */
export enum EntityDocumentTypeCode { // TODO: normalize from SUNAT response.
  DNI = "01",
  ImmigrationCard = "04",
  RUC = "06",
  Passport = "07",
  BirthCertificate = "11",
  Other = "00",
}

export type KnownCurrenciesAndMore = "PEN" | "USD" | (string & {});

/**
 * @description Links that will be useful for your journey are https://www.sunat.gob.pe/legislacion/superin/2022/anexo-040-2022.pdf and https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.sunat.gob.pe/legislacion/proyectos-ti/2010/mayo/pn190510/caratula/Anexos3Tablas2-3-10.xls&ved=2ahUKEwj9_I3yvfiKAxWkGLkGHaVSMS8QFnoECBkQAQ&usg=AOvVaw1abFJDjaaYSg26KUR0WZRH.
 */
export interface PurchaseRecord {
  /**
   * @description Original: "RUC". Index 0. - Taxpayer Identification Number.
   */
  ruc: string;
  /**
   * @description Original: "Apellidos y Nombres o Razón social". Index 1. - Name of the individual or legal entity.
   */
  names: string;
  /**
   * @description Original: "Periodo". Index 2. - The fiscal period, typically formatted as YYYYMM.
   */
  tax_period: string;
  /**
   * @description Original: "CAR SUNAT". Index 3. - The SUNAT's registration annotation code. For more information see the last page of https://www.sunat.gob.pe/legislacion/superin/2021/anexo-112-2021.pdf.
   */
  car_sunat: string;
  /**
   * @description Original: "Fecha de emisión". Index 4. - The date the document was issued.
   */
  issue_date: string;
  /**
   * @description Original: "Fecha Vcto/Pago". Index 5. - Due of payment date, null if missing.
   */
  due_date: string | null;
  /**
   * @description Original: "Tipo CP/Doc.". Index 6. - Code assigned for the proof of payment. For more information see "TABLA_10" from https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.sunat.gob.pe/legislacion/proyectos-ti/2010/mayo/pn190510/caratula/Anexos3Tablas2-3-10.xls&ved=2ahUKEwj9_I3yvfiKAxWkGLkGHaVSMS8QFnoECBkQAQ&usg=AOvVaw1abFJDjaaYSg26KUR0WZRH.
   */
  document_type: ProofOfPaymentCode;
  /**
   * @description Original: "Serie del CDP". Index: 7. - Series for the Electronic Withholding Voucher.
   */
  document_series: string;
  /**
   * @description Original: "Año". Index: 8. - The year associated with the document, null if missing.
   */
  year: string | null;
  /**
   * @description Original: "Nro CP o Doc. Nro Inicial (Rango)". Index: 9. - Initial document number for a range, null if missing (don't know what that means).
   */
  initial_document_number: string | null;
  /**
   * @description Original: "Nro Final (Rango)". Index: 10. - Final document number for a range, null if missing(don't know what that means).
   */
  final_document_number: string | null;
  /**
   * @description Original: "Tipo Doc Identidad". Index: 11. - Type of identity document.
   */
  identity_document_type: EntityDocumentTypeCode;
  /**
   * @description Original: "Nro Doc Identidad". Index: 12. - Identity document number.
   */
  identity_document_number: string;
  /**
   * @description Original: "Apellidos Nombres/ Razón  Social". Index: 13. - Client's name or company name.
   */
  client_name: string;
  /**
   * @description Original: "BI Gravado DG". Index: 14. - Taxable base amount for general goods.
   */
  taxable_base_dg: number;
  /**
   * @description Original: "IGV / IPM DG". Index: 15. - IGV (general sales tax) for general goods.
   */
  igv_dg: number;
  /**
   * @description Original: "BI Gravado DGNG". Index: 16. - Taxable base for non-gravable goods.
   */
  taxable_base_dgng: number;
  /**
   * @description Original: "IGV / IPM DGNG". Index: 17. - IGV for non-gravable goods.
   */
  igv_dgng: number;
  /**
   * @description Original: "BI Gravado DNG". Index: 18. - Taxable base for non-gravable services.
   */
  taxable_base_dng: number;
  /**
   * @description Original: "IGV / IPM DNG". Index: 19. - IGV for non-gravable services.
   */
  igv_dng: number;
  /**
   * @description Original: "Valor Adq. NG". Index: 20. - Acquisition value for non-gravable items.
   */
  acquisition_value_ng: number;
  /**
   * @description Original: "ISC". Example: 0.00. Index: 21. - Selective Consumption Tax.
   */
  isc: number;
  /**
   * @description Original: "ICBPER". Index: 22. - Environmental tax on plastic bags.
   */
  icbper: number;
  /**
   * @description Original: "Otros Trib/ Cargos". Index: 23. - Other taxes or charges.
   */
  other_taxes: number;
  /**
   * @description Original: "Total CP". Index: 24. - Total amount of the document.
   */
  total_amount: number;
  /**
   * @description Original: "Moneda". Index: 25. - Currency code (e.g., PEN for Peruvian Sol).
   */
  currency: KnownCurrenciesAndMore;
  /**
   * @description Original: "Tipo de Cambio". Example for PEN: 1.000. Index: 26. - Exchange rate applied.
   */
  exchange_rate: number;
  mod_document: {
    /**
     * @description Original: "Fecha Emisión Doc Modificado". - Date of modification of the document.
     */
    issue_date: string;
    /**
     * @description Original: "Tipo CP Modificado". - Modified document type.
     */
    type: ProofOfPaymentCode;
    /**
     * @description Original: "Serie CP Modificado". - Modified document series.
     */
    series: string;
    /**
     * @description Original: "Nro CP Modificado". - Modified document number.
     */
    number: string;
  } | null;

  /**
   * @description Original: "IMB". Index: 35. - Tax subject matter of benefit Law 31053.
   */
  imb: number | null;
  /**
   * @description Original: "CAR Orig/ Ind E o I". Index: 36. - Origin or export/import indicator.
   */
  origin_indicator: string | null;
  /**
   * @description Original: "Detracción". Index: 37. - Detraction amount.
   */
  detraction: number | null;
  /**
   * @description Original: "Tipo de Nota". Index: 38. - Type of Credit Note or Debit Note. According to catalog No. 09 and 10 of Annex 8 of the Superintendency Resolution 097-2012/SUNAT and amending regulations. Null if missing.
   */
  note_type: string | null; // Original: "Tipo de Nota" (Index: 38) - Type of note, null if missing.
  /**
   * @description Original: "Est. Comp.". Index: 39. - Invoice status.
   */
  invoice_status: InvoiceStatusCode;
  /**
   * @description Original: "Incal". Index: 40. - Inconsistencies, null if missing.
   */
  incal: string | null;
}

/**
 * @description Codes according to SUNAT (https://www.sunat.gob.pe/legislacion/superin/2017/anexoVII-117-2017.pdf - Catálogo No. 51).
 */
export enum SaleTypeCode {
  /**
   * @description Common internal sale operation.
   */
  InternalSale = "0101",
  /**
   * @description Export operations (Exportación).
   */
  Export = "0102",
  /**
   * @description Operations with non-domiciled clients (No Domiciliados).
   */
  NonDomiciled = "0103",
  /**
   * @description Internal sales with advance payments (Venta Interna – Anticipos).
   */
  InternalSaleAdvance = "0104",
  /**
   * @description Itinerant sales (Venta Itinerante).
   */
  ItinerantSale = "0105",
  /**
   * @description Invoice and dispatch guide combined (Factura Guía).
   */
  InvoiceGuide = "0106",
  /**
   * @description Milled rice sale (Venta Arroz Pilado).
   */
  MilledRiceSale = "0107",
  /**
   * @description Invoice with perception receipt (Factura - Comprobante de Percepción).
   */
  InvoicePerception = "0108",
  /**
   * @description Invoice with sender guide (Factura - Guía remitente).
   */
  InvoiceSenderGuide = "0110",
  /**
   * @description Invoice with transporter guide (Factura - Guía transportista).
   */
  InvoiceTransporterGuide = "0111",
}

/**
 * @description More information here https://www.sunat.gob.pe/legislacion/superin/2021/anexo-112-2021.pdf.
 */
export interface SalesRecord {
  /**
   * @description Original: "Ruc". - Taxpayer Identification Number.
   */
  ruc: string;
  /**
   * @description Original: "Razon Social". - Company or business name.
   */
  business_name: string;
  /**
   * @description Original: "Periodo". - The fiscal period, formatted as YYYYMM.
   */
  tax_period: string;
  /**
   * @description Original: "CAR SUNAT". - The SUNAT's registration annotation code.
   */
  car_sunat: string;
  /**
   * @description Original: "Fecha de emisión". - Issue date of the document.
   */
  issue_date: string;
  /**
   * @description Original: "Fecha Vcto/Pago". - Due date or payment date, null if missing.
   */
  due_date: string | null;
  /**
   * @description Original: "Tipo CP/Doc.". - Type of payment commitment or document, according to the codification approved by SUNAT.
   */
  document_type: ProofOfPaymentCode;
  /**
   * @description Original: "Serie del CDP". - Serial number of the payment voucher or cash register, as appropriate.
   */
  document_series: string;
  /**
   * @description Original: "Nro CP o Doc. Nro Inicial (Rango)". - Initial document number.
   */
  initial_document_number: string | null;
  /**
   * @description Original: "Nro Final (Rango)". - Final document number in range.
   */
  final_document_number: string | null;
  /**
   * @description Original: "Tipo Doc Identidad". - Type of identity document.
   */
  identity_document_type: EntityDocumentTypeCode;
  /**
   * @description Original: "Nro Doc Identidad". - Identity document number.
   */
  identity_document_number: string;
  /**
   * @description Original: "Apellidos Nombres/ Razón Social". - Client's name or business name.
   */
  client_name: string;
  /**
   * @description Original: "Valor Facturado Exportación". - Export invoiced value.
   */
  export_invoiced_value: number;
  /**
   * @description Original: "BI Gravada". - Taxable base amount.
   */
  taxable_base: number;
  /**
   * @description Original: "Dscto BI". - Discount on taxable base.
   */
  taxable_base_discount: number;
  /**
   * @description Original: "IGV / IPM". - General sales tax amount.
   */
  igv: number;
  /**
   * @description Original: "Dscto IGV / IPM". - Discount on IGV.
   */
  igv_discount: number;
  /**
   * @description Original: "Mto Exonerado". - Exempted amount.
   */
  exempted_amount: number;
  /**
   * @description Original: "Mto Inafecto". - Unaffected amount.
   */
  unaffected_amount: number;
  /**
   * @description Original: "ISC". - Selective Consumption Tax.
   */
  isc: number;
  /**
   * @description Original: "BI Grav IVAP". - Taxable base for IVAP (Rice Sales Tax).
   */
  ivap_taxable_base: number;
  /**
   * @description Original: "IVAP". - Rice Sales Tax amount.
   */
  ivap: number;
  /**
   * @description Original: "ICBPER". - Plastic bag tax amount.
   */
  icbper: number;
  /**
   * @description Original: "Otros Tributos". - Other taxes amount.
   */
  other_taxes: number;
  /**
   * @description Original: "Total CP". - Total document amount.
   */
  total_amount: number;
  /**
   * @description Original: "Moneda". - Currency code.
   */
  currency: KnownCurrenciesAndMore;
  /**
   * @description Original: "Tipo Cambio". - Exchange rate.
   */
  exchange_rate: number;
  /**
   * @description Information about the modified document, null if not applicable.
   */
  mod_document: {
    /**
     * @description Original: "Fecha Emisión Doc Modificado". - Date of modification of the document.
     */
    issue_date: string;
    /**
     * @description Original: "Tipo CP Modificado". - Modified document type.
     */
    type: ProofOfPaymentCode;
    /**
     * @description Original: "Serie CP Modificado". - Modified document series.
     */
    series: string;
    /**
     * @description Original: "Nro CP Modificado". - Modified document number.
     */
    number: string;
  } | null;
  /**
   * @description Original: "Tipo de Nota". - Note type, null if not applicable.
   */
  note_type: string | null;
  /**
   * @description Original: "Est. Comp". - Document status using InvoiceStatusCode enum.
   */
  invoice_status: InvoiceStatusCode;
  /**
   * @description Original: "Valor FOB Embarcado". - FOB value for exports.
   */
  fob_value: number;
  /**
   * @description Original: "Valor OP Gratuitas". - Value of free operations.
   */
  free_operations_value: number;
  /**
   * @description Original: "Tipo Operación". - Operation type code.
   */
  operation_type: SaleTypeCode;
  /**
   * @description Original: "DAM / CP". - Customs declaration number, null if not applicable.
   */
  customs_declaration: string | null;
}

export enum BookCode {
  Purchases = "080000",
  SalesAndRevenue = "140000",
}
