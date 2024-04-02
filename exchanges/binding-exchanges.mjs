import amqp from 'amqplib';

async function exchange() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
        vhost: 'headers-example'
    });

    const channel = await conn.createChannel();
    
    // Exchange fanout - para mandar mensagem para todas as filas

    await channel.assertExchange('notify_fanout', 'fanout');

    await channel.bindQueue('email_notification', 'notify_fanout');
    await channel.bindQueue('sms_notification', 'notify_fanout');
    await channel.bindQueue('push_notification', 'notify_fanout');

    await channel.bindExchange('notify_fanout', 'notify_headers', '', {
        'notification_type': 'all'
    });

    channel.publish('notify_headers', '', Buffer.from('meu header'), {
        headers: {
            notification_type: 'all'
        }
    })

    await channel.close();
    await conn.close();
}

exchange();