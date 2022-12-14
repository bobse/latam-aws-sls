"use strict";
import { TicketFinder } from "./latam.mjs";
import { Email } from "./emailHelper.mjs";
import { getUrl } from "./customFetch.mjs";

export const run = async () => {
  const {
    EMAIL_TO,
    EMAIL_FROM,
    MAX_PRICE,
    MAX_DAYS,
    MIN_DAYS,
    INITIAL_DATE,
    ORIGIN,
    DESTINATION,
  } = {
    ...process.env,
  };

  const latam = new TicketFinder(
    ORIGIN,
    DESTINATION,
    INITIAL_DATE,
    Number(MAX_PRICE),
    Number(MIN_DAYS),
    Number(MAX_DAYS)
  );

  const bestPrices = await latam.getBestPrices();

  if (bestPrices.length > 0) {
    console.log(
      `${bestPrices.length} Prices matched! Sending email to: ${EMAIL_TO}`
    );
    let lastItem = bestPrices[0][0];
    let message = bestPrices.map((item) => {
      let line = lastItem !== item[0] ? "<br/>" : "";
      line += `Departure: ${item[0]} > Return: ${item[1]} | <b>R$ ${item[2]}</b>`;
      lastItem = item[0];
      return line;
    });
    message.unshift(
      `<h3>Ticket search: ${ORIGIN} > ${DESTINATION} | Max price: ${MAX_PRICE} | Min. days: ${MIN_DAYS} | Max. days ${MAX_DAYS}</h3><hr />`
    );
    const email = new Email(
      EMAIL_TO,
      EMAIL_FROM,
      "Ticket Finder",
      message.join("<br>")
    );
    email.send();
  } else {
    console.log("No prices have matched your criteria!");
  }
};

export const test = async () => {
  const response = await getUrl(
    "https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/bestprices/roundtrip?departure=2022-12-29&origin=CGH&destination=POA&cabin=Y&country=BR&language=PT&home=pt_br&return=2022-12-31&adult=1&promoCode="
  );
  console.log(response);
};
