const fs = require("fs");
const http = require("http");
const url = require("url");

let superheroes = JSON.parse(fs.readFileSync("./superheroes.json", "utf8"));
let homepage = fs.readFileSync("./index.html", "utf8");
let superheroCard = fs.readFile("./superheroCard.html", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  }
  superheroCard = data;
});
let superheroPage = fs.readFile("./heroDetails.html", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  }
  superheroPage = data;
});

const htmlReplace = (template, hero) => {
  let output = template;
  output = output.replace("{{%IMAGE%}}", hero.image);
  output = output.replace("{{%HERO%}}", hero.heroName);
  output = output.replace("{{%HERONAME%}}", hero.firstName);
  output = output.replace("{{%HEROLASTNAME%}}", hero.lastName);
  output = output.replace("{{%ID%}}", hero.id);
  output = output.replace("{{%DESCRIPTION%}}", hero.description);
  return output;
};

const server = http
  .createServer((request, response) => {
    let { query, pathname: path } = url.parse(request.url, true);

    if (path === "/" || path === "/superheroes") {
      if (!query.id) {
        let heroesHtmlArray = superheroes.map((hero) => {
          return htmlReplace(superheroCard, hero);
        });
        let heroResponseHtml = homepage.replace(
          "{{%CONTENT%}}",
          heroesHtmlArray.join(",")
        );
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(heroResponseHtml);
      } else {
        let hero = superheroes[query.id];
        let heroDetailsResponseHtml = htmlReplace(superheroPage, hero);
        response.end(
          homepage.replace("{{%CONTENT%}}", heroDetailsResponseHtml)
        );
      }
    } else {
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end("page not found");
    }
  })
  .listen(3000);
console.log("Server started...");
console.log("enter --> localhost:3000 <-- in your browser");
