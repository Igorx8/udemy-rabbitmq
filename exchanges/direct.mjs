import amqp from 'amqplib';

async function exchange() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
    });

    const channel = await conn.createChannel();

    // criar uma exchange
    await channel.assertExchange('udemy_exchange', 'direct');

    // criar uma fila
    await channel.assertQueue('udemy_notification', {
        durable: true
    });

    await channel.assertQueue('udemy_test', {
        durable: true,
    })

    // binding - linkar fila com exchange
    await channel.bindQueue('udemy_notification', 'udemy_exchange', 'novoCurso');
    await channel.bindQueue('udemy_test', 'udemy_exchange', 'novoCurso');

    // publicando mensagem com a chave de roteamento
    channel.publish('udemy_exchange', 'novoCurso', Buffer.from('teste de mensagem'));

    // a direct exchange é baseada na chave de roteamento, nesse caso, novoCurso

}

exchange();