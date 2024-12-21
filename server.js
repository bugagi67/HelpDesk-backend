const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('koa-cors');
const app = new Koa();

const tickets = [
    {
        id: 1,
        name: "Поменять краску в принтере, ком. 404",
        description: "Принтер HP LJ 1210, картридж на складе",
        status: "false",
        created: new Date(),
    },
    {
        id: 2,
        name: "Переустановить Windows, ПК-Hall24",
        description: "Переустановить Windows, ключ на почте",
        status: "true",
        created: new Date(2024, 11, 21, 15, 11),
    }
]

app.use(cors({
  origin: "*",
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}))

app.use(ctx => {
  ctx.response.set({
    "Access-Control-Allow-Origin": "*",
  });
  const { method } = ctx.request.query;
  switch (method) {
    case "allTickets":
      ctx.response.body = tickets.map(({description, ...ticket}) => (ticket));
      return;
    case "ticketById":
      const { id: ticketId } = ctx.request.query;
      const ticketShow = tickets.find(ticket => ticket.id === parseInt(ticketId));
      if (ticketShow) {
        ctx.response.body = ticketShow.description;
      } else {
        ctx.response.status = 404;
      }
      return;
    case "createTicket":
      if (ctx.request.method !== "POST") {
        ctx.response.status = 404;
        return;
      }
      const data = ctx.request.body;

      const ticket = {
        id: (data.id) ? parseInt(data.id) : (tickets[tickets.length - 1]).id + 1,
        name: data.name,
        description: data.description,
        status: (data.status) ? data.status : "false",
        created: new Date(),
      };

      if (data.id) {
        let indexTicket = tickets.findIndex(ticket => ticket.id === parseInt(data.id));
        tickets.splice(indexTicket, 1, ticket);
      } else {
        tickets.push(ticket);
      }

      ctx.response.status = 201;
      ctx.response.body = tickets;

      return;

    case "deleteTicket": 
    if (ctx.request.method !== "POST") {
      ctx.response.status = 404;
      return;
    }
    const { id: ticketToDelete} = ctx.request.query;
    const index = tickets.findIndex(ticket => ticket.id === parseInt(ticketToDelete));
    if (index === -1) {
      ctx.response.status = 404;
      return;
    }
    tickets.splice(index, 1);
    ctx.response.body = tickets;
    return;
    default: server.js
    ctx.response.status = 404;
    return;
  }
})

const port = process.env.PORT || 9000;
const server = http.createServer(app.callback()).listen(port);
