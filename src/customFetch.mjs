import https from "https";

async function getUrl(url) {
  let data = "";
  return await new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "user-agent": "PostmanRuntime/7.29.2",
            Accept: "*/*",
            Connection: "keep-alive",
            Host: "bff.latam.com",
          },
        },
        (res) => {
          //   console.log("statusCode:", res.statusCode);
          //   console.log("headers:", res.headers);
          res.on("data", (d) => {
            data += d;
          });
          res.on("end", () => {
            resolve(JSON.parse(data));
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
