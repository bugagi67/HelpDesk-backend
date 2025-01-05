# HelpDesk

**API развёрнуто на: https://helpdesk-backend-mcms.onrender.com** 

Легенда
Пока backend-разработчик находится в отпуске, вам поручили сделать прототип API для сервиса управления заявками на помощь (можете за себя порадоваться, так недалеко и до fullstack'а), к которому вам и нужно будет в дальнейшем прикруить frontend.

Описание
Вам потребуется написать CRUD функционал для работы с заявками при помощи сервера koa. Для хранения данных мы будем оперировать следующими структурами:

```
Ticket {
    id // идентификатор (уникальный в пределах системы)
    name // краткое описание
    status // boolean - сделано или нет
    created // дата создания (timestamp)
}

TicketFull {
    id // идентификатор (уникальный в пределах системы)
    name // краткое описание
    description // полное описание
    status // boolean - сделано или нет
    created // дата создания (timestamp)
}
```
Примеры запросов:

GET ?method=allTickets - список тикетов

GET ?method=ticketById&id=<id> - полное описание тикета (где <id> - идентификатор тикета)

POST ?method=createTicket - создание тикета (<id> генерируется на сервере, в теле формы name, description, status)

Соответственно:

GET ?method=allTickets - массив объектов типа Ticket (т.е. без description)

GET ?method=ticketById&id=<id> - объект типа TicketFull (т.е. с description)

POST ?method=createTicket - в теле запроса форма с полями для объекта типа Ticket (с id = null)

Авто-тесты писать не нужно.

Не забывайте про CORS. Для обработки CORS в koa есть своя middleware koa-CORS

Для упрощения тестирования можете при старте сервера добавлять туда несколько тикетов.

Для начала, чтобы с сервера отдавать данные, достаточно в обработчиках koa написать:
```
const tickets = [];

app.use(async ctx => {
    const { method } = ctx.request.querystring;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});

```
А код ниже позволит обработать полученный ответ от сервера во Frontend:
```
xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
        try {
            const data = JSON.parse(xhr.responseText);
        } catch (e) {
            console.error(e);
        }
    }
});
```
В качестве результата пришлите проверяющему ссылку на GitHub репозиторий.