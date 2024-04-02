import amqp from 'amqplib';

async function queue() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
    });

    const channel = await conn.createChannel();

    await channel.assertQueue('autoDelete', {
        autoDelete: true
    });

    channel.publish('', 'autoDelete', Buffer.from('Minha fila auto-delete'))

    /* 
    ao existir um consumidor ou vários e estes todos forem desconectados, o rabbit irá deletar a fila, resumidamente, a fila só irá existir enquanto houver consumidores
    channel.consume('autoDelete', (data) => {
        console.log(data.content.toString())
    }) 
    */
}

queue();