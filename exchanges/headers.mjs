import amqp from 'amqplib';

async function exchange() {
    const conn = await amqp.connect({
        host: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'curso',
        vhost: 'headers-example'
    });

    const channel = await conn.createChannel();

    await channel.assertExchange('notify_headers', 'headers');

    await channel.assertQueue('email_notification');
    await channel.assertQueue('sms_notification');
    await channel.assertQueue('push_notification');

    await channel.bindQueue('email_notification', 'notify_headers', '', {
        'notification_type': 'email',
        'mode': 'internal',
        'x-match': 'any',
    });

    await channel.bindQueue('sms_notification', 'notify_headers', '', {
        'notification_type': 'sms'
    });

    await channel.bindQueue('push_notification', 'notify_headers', '', {
        'notification_type': 'push'
    });

    // resumidamente, esse tipo de fila vai setar quais parametros enviados no header vão trigar o recebimento de mensagens para filas selecionadas
    channel.publish('notify_headers', '', Buffer.from('meu header'), {
        headers: {
            notification_type: 'sms'
        }
    })

    await channel.close();
    await conn.close();    
}

exchange();