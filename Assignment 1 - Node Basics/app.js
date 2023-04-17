const http = require("http");

const userList = [];

const server = http.createServer((request, response) => {
  const url = request.url;
  const method = request.method;

  if (url == "/") {
    response.writeHead(200, "Home page", { "Content-type": "text/html" });
    response.write(
      `<html>
        <head>
          <title>Assignment Home</title>
        </head>
        <body>
          <h1>Hello,^_^</h1>
          <hr />
          <form action="/create-user" method="POST">
            <input type="text" name="new-user" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>`
    );
    return response.end();
  }

  if (url == "/users") {
    console.log(userList);
    response.writeHead(200, "User list", { "Content-type": "text/html" });
    response.write(
      `<html>
            <head>
                <title>User List</title>
            </head>
            <body>
                <ul>
                ${userList
                  .map((item) => `<li>${item}</li>`)
                  .reduce((oldString, item) => oldString + item, "")}
                </ul>
            </body>
        </html>`
    );
    return response.end();
  }

  if (url == "/create-user" && method == "POST") {
    const chunckList = [];
    request.on("data", (chunk) => chunckList.push(chunk));
    request.on("end", () =>
      userList.push(Buffer.concat(chunckList).toString().split("=")[1])
    );
    response.writeHead(302, "User list", { Location: "/users" });
    response.end();
  }
});

server.listen(3000);
