import amqp from 'amqplib'

async function main() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'curso'
    }).finally(() => console.info('Conectado'))

    const channel = await connection.createChannel();
    
    // sempre usar para criar dinamicamente  a fila caso não exista ainda
    await channel.assertQueue('minha_fila', {
        durable: true
    })
     
    // Enviando a mensagem via publish
    // channel.publish('', 'minha_fila', Buffer.from('Minha primeira mensagem'));
    
    for(let i=0; i < 20; i++) {
        channel.sendToQueue('minha_fila', Buffer.from('Mensagme vindo do sendToQueue' + i))
    }

    await channel.close  ()
    await connection.close();

}

main();