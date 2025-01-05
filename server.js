const { error } = require("console");
const http = require("http");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const cors = require("koa-cors");
const moment = require("moment");
require("moment/locale/ru");
const app = new Koa();

const tickets = [
  {
    id: 1,
    name: "Поменять краску в принтере, ком. 404",
    description: "Принтер HP LJ 1210, картридж на складе",
    status: false,
    created: new Date(),
  },
  {
    id: 2,
    name: "Переустановить Windows, ПК-Hall24",
    description: "Переустановить Windows, ключ на почте",
    status: true,
    created: new Date(2024, 10, 21, 15, 11),
  },
  {
    id: 3,
    name: "Замена клавиатуры в Бухгалтерии",
    description: "Выбрать что то получше",
    status: false,
    created: new Date(),
  },
  {
    id: 4,
    name: "Настроить интернет охраннику",
    description: "Не для работы",
    status: true,
    created: new Date(2024, 11, 21, 15, 11),
  },
];

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

app.use((ctx) => {
  ctx.response.set({
    "Access-Control-Allow-Origin": "*",
  });
  const { method } = ctx.request.query;
  switch (method) {
    case "allTickets":
      ctx.response.body = tickets.map((ticket) => ({
        ...ticket,
        created: moment(ticket.created).format("D MMMM YYYY, HH:mm"),
      }));
      return;
    case "ticketById":
      const { id: ticketId } = ctx.request.query;
      const ticketShow = tickets.find(
        (ticket) => ticket.id === parseInt(ticketId, 10)
      );

      if (ticketShow) {
        ctx.response.body = {
          ...ticketShow,
          created: moment(ticketShow.created).format("D MMMM YYYY, HH:mm"),
        };
        ctx.response.status = 200;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { error: "Ticket not found" };
      }
      return;
    case "createTicket":
      if (ctx.request.method !== "POST") {
        ctx.response.status = 404;
        return;
      }
      const data = ctx.request.body;
      const ticket = {
        id: tickets.length ? tickets[tickets.length - 1].id + 1 : 1,
        name: data.name,
        description: data.description,
        status: data.status ? data.status : false,
        created: new Date(),
      };

      tickets.push(ticket);

      ctx.response.status = 201;
      ctx.response.body = tickets.map((ticket) => ({
        ...ticket,
        created: moment(ticket.created).format("D MMMM YYYY, HH:mm"),
      }));
      return;

    case "deleteTicket":
      if (ctx.request.method !== "POST") {
        ctx.response.status = 404;
        return;
      }
      const { id: ticketToDelete } = ctx.request.body;
      const index = tickets.findIndex(
        (ticket) => ticket.id === parseInt(ticketToDelete)
      );
      if (index === -1) {
        ctx.response.status = 404;
        return;
      }
      tickets.splice(index, 1);
      ctx.response.body = tickets.map((ticket) => ({
        ...ticket,
        created: moment(ticket.created).format("D MMMM YYYY, HH:mm"), // Форматируем дату
      }));
      return;
    default:
      server.js;
      ctx.response.status = 404;
      return;
    case "editTicket":
      if (ctx.request.method !== "POST") {
        ctx.response.status = 404;
        return;
      }

      const {
        id: ticketIdToEdit,
        name,
        description,
        status,
      } = ctx.request.body;

      const ticketIndex = tickets.findIndex(
        (ticket) => ticket.id === parseInt(ticketIdToEdit)
      );

      if (ticketIndex === -1) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Тикет не найден" };
        return;
      }

      const updateTicket = {
        ...tickets[ticketIndex],
        name: name !== undefined ? name : tickets[ticketIndex].name,
        description:
          description !== undefined
            ? description
            : tickets[ticketIndex].description,
        status:
          status !== undefined ? Boolean(status) : tickets[ticketIndex].status,
      };

      tickets.splice(ticketIndex, 1, updateTicket);

      ctx.response.status = 200;
      ctx.response.body = tickets.map((ticket) => ({
        ...ticket,
        created: moment(ticket.created).format("D MMMM YYYY, HH:mm"),
      }));
      return;
  }
});

const port = process.env.PORT || 9000;
const server = http.createServer(app.callback()).listen(port);
