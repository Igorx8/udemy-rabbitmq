import amqp from 'amqplib';

async function queue() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
        vhost: 'durable-example'
    });

    const channel = await conn.createChannel();

    await channel.assertQueue('durable', {
        durable: true
    })

    await channel.assertQueue('not_durable', {
        durable: false
    })

    channel.publish('', 'durable', Buffer.from('durou'), { persistent: true }); // o persistent é o único que mantém a mensagem mesmo se reiniciar o docker
    channel.publish('', 'not_durable', Buffer.from('não durou'))

    await channel.close();
    await conn.close();
}

queue();