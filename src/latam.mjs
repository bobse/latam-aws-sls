import axios from "axios";
import { airportCodes } from "./airports.mjs";

Date.prototype.addDays = function (days) {
  const currDate = this.valueOf();
  const newDate = new Date(currDate + 1000 * 60 * 60 * 24 * days);
  return newDate;
};
Date.prototype.toString = function () {
  return this.toISOString().split("T")[0];
};

class TicketFinder {
  constructor(
    origin,
    destination,
    departureDate,
    maxPrice,
    minDays = 1,
    maxDays = 1
  ) {
    this.origin = this.validadeAirport(origin);
    this.destination = this.validadeAirport(destination);
    this.departureDate = this.validateDate(departureDate + "T00:00:00Z");
    this.maxPrice = maxPrice;
    this.minDays = minDays > 0 ? minDays : 1;
    this.maxDays = maxDays >= minDays ? maxDays : minDays;
    this.travelDates = this.generateTravelDates();
  }

  validateDate(strDate) {
    if (isNaN(Date.parse(strDate))) {
      throw new TypeError("Invalid Date!");
    } else {
      const depDate = new Date(strDate);
      if (depDate < new Date()) {
        throw new TypeError("Invalid Date!");
      } else {
        return depDate;
      }
    }
  }

  validadeAirport(airportCode) {
    if (!airportCodes.includes(airportCode.toUpperCase())) {
      throw new TypeError("Invalid airport code!");
    }
    return airportCode.toUpperCase();
  }

  generateTravelDates() {
    let currDate = this.departureDate;
    const dateArray = [];
    for (let i = 0; i <= 4; i++) {
      const newDate = currDate.addDays(7 * i);
      dateArray.push(newDate.toString());
    }
    return this.composeDates(dateArray);
  }

  composeDates(array) {
    return array
      .map((e, idx) => {
        return array.slice(idx).map((y) => {
          return [e, y];
        });
      })
      .flat();
  }

  async getBestPrices() {
    const rawData = await this.getData();
    if (
      rawData.filter((item) => {
        return item.cheapestPrice <= this.maxPrice;
      }).length === 0
    ) {
      return [];
    }
    const bestPrices = [];
    const formatedFlights = this.cleanFlights(rawData);
    formatedFlights.forEach((prices, depDate) => {
      if (prices.length < this.minDays) {
        return;
      }
      for (let idx = this.minDays; idx <= this.maxDays; idx++) {
        if (prices[idx] && prices[idx] <= this.maxPrice) {
          const returnDate = new Date(depDate).addDays(idx).toString();
          bestPrices.push([depDate, returnDate, prices[idx]]);
        }
      }
    });
    return bestPrices.sort((a, b) => a[2] - b[2]);
  }

  cleanFlights(flights) {
    const cleanedFlights = new Map();
    flights.map((item) => {
      item.bestPrices.forEach((flight) => {
        const depDate = flight.departureDate;
        const prices = flight.returnDates
          .map((returnDate) => {
            if (returnDate.available === true) {
              return returnDate.price.amount;
            } else {
              return null;
            }
          })
          .filter((i) => i !== null);

        if (!cleanedFlights.get(depDate)) {
          cleanedFlights.set(depDate, prices);
        } else {
          cleanedFlights.set(
            depDate,
            [...cleanedFlights.get(depDate)].concat([...prices])
          );
        }
      });
    });
    return cleanedFlights;
  }

  async getData() {
    const urls = this.generateUrls();
    let maxTries = 4;
    const getResponses = async (urls) => {
      const responses = await Promise.allSettled(
        urls.map((url) => axios.get(url, { timeout: 10000 }))
      );
      const errors = [];
      const data = [];
      responses.forEach((res) => {
        if (res.status !== "fulfilled") {
          errors.push(res.reason.config.url);
          console.error(`Error retrieving ${res.reason.config.url}`);
        } else {
          data.push(res.value.data);
        }
      });
      return [data, errors];
    };

    let [responseData, errors] = await getResponses(urls);
    while (errors.length > 0 && maxTries > 0) {
      console.log(`${maxTries} attempts left >> Trying again to get urls...`);
      const response = await getResponses(errors);
      maxTries -= 1;
      errors = response[1];
      responseData.concat(response[0]);
    }
    return responseData;
  }

  generateUrls() {
    const urls = [];
    const baseUrl = `http://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/revenue/bestprices/roundtrip?departure={departureDate}&origin=${this.origin}&destination=${this.destination}&cabin=Y&country=BR&language=PT&home=pt_br&return={returnDate}&adult=1&promoCode=`;
    for (let idx in this.travelDates) {
      const newUrl = baseUrl
        .replace("{departureDate}", this.travelDates[idx][0])
        .replace("{returnDate}", this.travelDates[idx][1]);
      urls.push(newUrl);
    }
    return urls;
  }
}

export { TicketFinder };

// const a = new TicketFinder("vix", "poa", "2023-01-01", 1380, 4, 5);
// const bestPrices = await a.getBestPrices();
