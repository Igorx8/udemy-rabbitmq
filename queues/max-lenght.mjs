import amqp from 'amqplib';

async function queue() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "curso",
    });

    const channel = await conn.createChannel();

    // define a capacidade máxima da fila, não dá erro ao enviar mais mensagens do que o limite, porém também não adiciona mais mensagens
    await channel.assertQueue('max_length', { maxLength: 1000 });

    for(let i=0; i<1000; i++){
        channel.publish('', 'max_length', Buffer.from(`Mensagem ${i}`))
    }

}

queue();