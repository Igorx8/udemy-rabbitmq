import amqp from "amqplib";

async function main() {
  const conn = await amqp.connect({
    hostname: "localhost",
    port: 5672,
    username: "rabbitmq",
    password: "curso",
  });

  const channel = await conn.createChannel();

  // quantas mensagens serão carregadas por vez
  await channel.prefetch(15);

  channel.consume('minha_fila', (data) => {
    console.log(data.content.toString());    
  });

}

main();
