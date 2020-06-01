import express from 'express';
const app = express();

app.get("/", (request, response) =>{
  response.json(["Js","NodeJS","ReactJS"]);
});

app.listen(3000);