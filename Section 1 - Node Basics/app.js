const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url == "/send" && method == "POST") {
    const message = [];
    req.on("data", (chunk) => {
      message.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(message);
      fs.writeFileSync("input.txt", data.toString("utf-8").split("=")[1]);
    });

    res.writeHead(302, { Location: "/" });
    return res.end();
  }
  res.writeHead(200, { "Content-type": "text/html" });
  res.write(`<html>
        <title>Node App</title>
        <body>
            <h1>Hello, World!</h1>
            <form action = "/send" method = "POST">
            <input type = "text" name = "textInput"/>
            <button type = "submit" >Send</button>
            </form>
        </body>
    </html>`);
  res.end();
});

server.listen(4000);
