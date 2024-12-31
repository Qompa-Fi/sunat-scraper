import * as sunat from "./index.ts";

const exchangeRates = await sunat.getExchangeRatesOfMonth(11, 2024);

console.log(exchangeRates);
