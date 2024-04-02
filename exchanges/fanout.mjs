import amqp from 'amqplib';

async function exchange() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
        vhost: 'fanout-example'
    });

    const channel = await conn.createChannel();

    await channel.assertExchange('notifications', 'fanout');

    await channel.assertQueue('email_notification');
    await channel.assertQueue('sms_notification');
    await channel.assertQueue('push_notification');

    await channel.bindQueue('email_notification', 'notifications', '');
    await channel.bindQueue('sms_notification', 'notifications', '');
    await channel.bindQueue('push_notification', 'notifications', '');

    // fanout é uma exchange dispara para várias filas vinculadas a ela
    channel.publish('notifications', '', Buffer.from('Sua conta teve uma atividade suspeita' + Math.random(0, 0.9999)));

    await channel.close();
    await conn.close();
}

exchange();