const express = require("express");
const { createClient, sendRPCMessage } = require("./amqp");
const bodyParser = require("body-parser");
const { uuid } = require("uuidv4");

const RABBITMQ =
    "amqps://xgaohqty:lROPwYxXOhzMuuYnf0_WFBZaAh_VyWad@stingray.rmq.cloudamqp.com/xgaohqty";
const q = "example";
const port = 3001;

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/", async (req, res) => {
    const { message } = req.body;
    const channel = await createClient(RABBITMQ);

    console.log(`[ ${new Date()} ] Message sent: ${JSON.stringify(message)}`);

    const respone = await sendRPCMessage(channel, JSON.stringify(message), q);

    console.log(`[ ${new Date()} ] Message received: ${respone}`);

    res.json({ respone });
});

app.listen(port, async () => {
    console.log(`Client is listening on port ${port}`);
});
