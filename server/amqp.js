const amqp = require("amqplib");
const RABBITMQ =
    "amqps://xgaohqty:lROPwYxXOhzMuuYnf0_WFBZaAh_VyWad@stingray.rmq.cloudamqp.com/xgaohqty";

const open = amqp.connect(RABBITMQ);
const q = "example";

// Consumer
open.then(function (conn) {
    console.log(`[ ${new Date()} ] Server started`);
    return conn.createChannel();
})
    .then(function (ch) {
        return ch.assertQueue(q).then(function (ok) {
            return ch.consume(q, function (msg) {
                console.log(
                    `[ ${new Date()} ] Message received: ${JSON.stringify(
                        JSON.parse(msg.content.toString("utf8"))
                    )}`
                );
                if (msg !== null) {
                    const response = msg.content.toString("utf8");

                    console.log(
                        `[ ${new Date()} ] Message sent: ${JSON.stringify(
                            response
                        )}`
                    );

                    ch.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(response)),
                        {
                            correlationId: msg.properties.correlationId,
                        }
                    );

                    ch.ack(msg);
                }
            });
        });
    })
    .catch(console.warn);
