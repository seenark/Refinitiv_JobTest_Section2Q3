const axios = require("axios");
const myArgs = process.argv.slice(2);

async function main() {
  const response = await fetchData();
  const data = extractDataFromHtmlText(response);

  if (myArgs.length <= 0) {
    const fund = data.map((element) => {
      const fund = element["Fund Name"];
      const nav = element["Nav"];
      console.log(fund, nav);
    });
  } else {
    const funds = data.filter((element) => {
      const fundName = element["Fund Name"];
      if (myArgs.includes(fundName)) return element;
    });
    funds.forEach((fund) => {
      console.log(fund.Nav);
    });
  }
}

async function fetchData() {
  const { data } = await axios.get("https://codequiz.azurewebsites.net/", {
    headers: {
      Cookie: "hasCookie=true",
    },
  });
  return data;
}

function extractDataFromHtmlText(htmlText) {
  const trTag = getTrTag(htmlText);
  const tdTag = splitTrTag(trTag);
  const headers = extractHeaders(tdTag);
  tdTag.splice(0, 1);
  const data = extractData(tdTag, headers);
  return data;
}

function getTrTag(htmlText) {
  const exec = /(<tr>[\s\S]*<\/tr>)/.exec(htmlText);
  return exec[0];
}

function splitTrTag(trTag) {
  const regex = /<tr>/;
  const splitTr = trTag.split(regex);
  const newTr = splitTr.map((tr) => {
    return tr.replace(/<\/tr>/, "");
  });
  newTr.splice(0, 1);
  return newTr;
}
function extractHeaders(trTag) {
  const headerWithTdTag = trTag[0];
  const headers = getHeaderFromThTag(headerWithTdTag);
  return headers;
}
function extractData(arrayOfTdTag, headers) {
  const newArray = arrayOfTdTag.map((td) => {
    return splitTdTag(td, headers);
  });
  return newArray;
}

function splitTdTag(tdTag, headers) {
  const split = tdTag.split(/<td>/);
  split.splice(0, 1);
  const obj = {};
  split.forEach((data, index) => {
    obj[headers[index]] = data.replace(/<\/td>/, "").trim();
  });
  return obj;
}

function getHeaderFromThTag(tdTag) {
  const split = tdTag.split(/<th>/);
  const headers = split.map((h) => {
    return h.replace(/<\/th>/, "").trim();
  });
  headers.splice(0, 1);
  return headers;
}

main();
