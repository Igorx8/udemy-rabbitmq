import amqp from "amqplib";

async function queue() {
    const conn = await amqp.connect({
      hostname: "localhost",
      port: 5672,
      username: "rabbitmq",
      password: "curso",
    });

    const channel = await conn.createChannel();

    // as filas exclusivas serão destruídas assim que a conexão for fechada e suas mensagens também só podem ser consumidas pelo seu canal de origem(o que criou a fila exclusiva);
    await channel.assertQueue("exclusive", {
      exclusive: true,
    });

    channel.prefetch(3);
    await channel.consume('exclusive', data => {
        console.log(data.content.toString())
        setTimeout(() => { channel.ack(data) }, 1000)
    });

    for (let i = 0; i < 10; i++) {
      channel.publish("", "exclusive", Buffer.from(`Mensagem exclusiva ${i}`));
    }

    channel.publish("", "exclusive", Buffer.from(`Mensagem exclusiva 5`));

}

queue();
