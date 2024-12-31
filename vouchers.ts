const response = await fetch(
  "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/resumen/web/resumencomprobantes/202412/1/1/exporta?codLibro=080000",
  {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      authorization:
        "Bearer eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYxMzEzOTcwMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktc2lyZS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL21pZ2VpZ3ZcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19XSIsInVzZXJkYXRhIjp7Im51bVJVQyI6IjIwNjEzMTM5NzAzIiwidGlja2V0IjoiMTM2MjE2Mjc0OTU3MiIsIm5yb1JlZ2lzdHJvIjoiIiwiYXBlTWF0ZXJubyI6IiIsImxvZ2luIjoiMjA2MTMxMzk3MDNXSVNIQVNZQyIsIm5vbWJyZUNvbXBsZXRvIjoiUU9NUEEgU09DSUVEQUQgQU5PTklNQSBDRVJSQURBIiwibm9tYnJlcyI6IlFPTVBBIFNPQ0lFREFEIEFOT05JTUEgQ0VSUkFEQSIsImNvZERlcGVuZCI6IjAwMjMiLCJjb2RUT3BlQ29tZXIiOiIiLCJjb2RDYXRlIjoiIiwibml2ZWxVTyI6MCwiY29kVU8iOiIiLCJjb3JyZW8iOiIiLCJ1c3VhcmlvU09MIjoiV0lTSEFTWUMiLCJpZCI6IiIsImRlc1VPIjoiIiwiZGVzQ2F0ZSI6IiIsImFwZVBhdGVybm8iOiIiLCJpZENlbHVsYXIiOm51bGwsIm1hcCI6eyJpc0Nsb24iOmZhbHNlLCJkZHBEYXRhIjp7ImRkcF9udW1ydWMiOiIyMDYxMzEzOTcwMyIsImRkcF9udW1yZWciOiIwMDIzIiwiZGRwX2VzdGFkbyI6IjAwIiwiZGRwX2ZsYWcyMiI6IjAwIiwiZGRwX3ViaWdlbyI6IjE1MDEzMSIsImRkcF90YW1hbm8iOiIwMyIsImRkcF90cG9lbXAiOiIzOSIsImRkcF9jaWl1IjoiNjU5OTQifSwiaWRNZW51IjoiMTM2MjE2Mjc0OTU3MiIsImpuZGlQb29sIjoicDAwMjMiLCJ0aXBVc3VhcmlvIjoiMCIsInRpcE9yaWdlbiI6IklUIiwicHJpbWVyQWNjZXNvIjp0cnVlfX0sIm5iZiI6MTczNTMzNjkwMywiY2xpZW50SWQiOiJlMmY3NmY1YS0zZjgxLTRlODUtYTY4MS1jNzliNWE0YmQ2YTgiLCJpc3MiOiJodHRwczpcL1wvYXBpLXNlZ3VyaWRhZC5zdW5hdC5nb2IucGVcL3YxXC9jbGllbnRlc3NvbFwvZTJmNzZmNWEtM2Y4MS00ZTg1LWE2ODEtYzc5YjVhNGJkNmE4XC9vYXV0aDJcL3Rva2VuXC8iLCJleHAiOjE3MzUzNDA1MDMsImdyYW50VHlwZSI6ImF1dGhvcml6YXRpb25fdG9rZW4iLCJpYXQiOjE3MzUzMzY5MDN9.aDpq2Z-IgRtZyPJavlqv3FZTDuz91k1RhKx5vnHeZSgnzTRf0BHKtpfdswpvahccajcDrVx75gUBUeQxxiLgPggR5M4eFPENCVEkeBf0fs2aX04Z2hXzKH41XxKqzAiDhZBWPpJxfo3SBPd4WEo6vzk5FyK8j-03Z-bsO8tynSfdMJgbcv_Riwx5ClOZojbLOBOcJzPW3qNq08oHem0I9QIwQ-DNxVxs1_GkPmWjh2uj5b7gPNLETRVb27pWLo98PlDeWTQoETIkhwsUcWlyLE84t4HJhtIAw1PmZtn5MDQoirNNIR15EsS9pYe5Cf2TRpEPMh7ucR-i0RamEelVog",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      Priority: "u=0",
    },
    referrer: "https://e-factura.sunat.gob.pe/",
    method: "GET",
    mode: "cors",
  },
);

const data = await response.text();

console.log("data", data);
