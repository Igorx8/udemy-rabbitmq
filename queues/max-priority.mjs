import amqp from "amqplib";

async function queue() {
  const conn = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await conn.createChannel();

  // a prioridade vai em ordem crescente, sendo 5 a maior prioridade
  await channel.assertQueue("priority", {
    maxPriority: 5,
  });

  for (let i = 0; i < 10; i++) {
    channel.publish(
      "",
      "priority",
      Buffer.from("Mensagem padrão sem prioridade")
    );
  }

  for (let i = 0; i < 5; i++) {
    channel.publish(
      "",
      "priority",
      Buffer.from("Mensagem padrão com prioridade"),
      {
        priority: i,
      }
    );
  }

  await channel.close();
  await conn.close();
}

queue();
