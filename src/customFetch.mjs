import https from "https";

async function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getUrl(url) {
  let data = "";
  // Sleep so all the getUrl are fired at diferent times
  await _sleep(Math.floor(Math.random() * 500));
  return await new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            DNT: "1",
            Pragma: "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
          },
        },
        (res) => {
          console.log(`statusCode: ${res.statusCode} | ${url}`);
          //   console.log("headers:", res.headers);
          res.on("data", (d) => {
            data += d;
          });
          res.on("end", () => {
            if (res.statusCode !== 200) {
              data = { url: url };
              reject(data);
            } else {
              resolve(JSON.parse(data));
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        e["url"] = url;
        reject(e);
      });
  });
}

export { getUrl };
