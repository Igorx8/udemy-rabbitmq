import amqp from 'amqplib'

async function exchangeTopic() {
    const conn = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'curso'
    });

    const channel = await conn.createChannel();

    await channel.assertExchange('system_exchange', 'topic');
    await channel.assertQueue('system_logs');
    await channel.assertQueue('system_errors');

    await channel.bindQueue('system_logs', 'system_exchange', 'logs.#'); // pega tudo que tiver depois do "logs." e envia pra system_logs
    await channel.bindQueue('system_errors', 'system_exchange', '#.erro');

    channel.publish('system_exchange', 'logs.system.info', Buffer.from('mensagem de sucesso'));
    channel.publish('system_exchange', 'logs.system.erro', Buffer.from('mensagem de erro'));

    await channel.close();
    await conn.close();
}

exchangeTopic();