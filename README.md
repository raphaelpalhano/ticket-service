<h1>
<p align="center">
  Ticket Service
</p>
</h1>

## Projeto:

Densenvolver uma plataforma de invesimentos com Home Broker:

- Sistema da Bolsa (Simular uma B3)

- Dar match de oferta de compra e vendas de ações

- Home Broker onde as ofertas serão submetidas, além dos indicadores em tempo real.

## Dinamica do projeto 

User faz request --> home broker (react/nextjs) --> Consome do service ticket em nestjs --> vai encaminhar para Apache Kafka (sistema de stream de dados) que vai receber todas as requests. Quando as requests chegaram ao apache conseguimos trabalhar de forma async que vai ter outro microserviço chamado bolsa que vai receber essas informações e fazer os match das informações.

Assim que o microserviço der um match vai gerar as transações, concluido ordem de compra e venda, esse serviço vai retornar a reposta para o kafka a transação gerada.

O apache kafka vai retornar a informação para o nestjs, o nestjs vai ter isso para o back e retornar ao front home broker.

Tudo isso vai ocorrer em tempo real usando o Server Sent Event, uma comunicação unedirecional entre back e front, o back manda stream de dados ao front conforme as atualizações ocorram.


## Tecnologias

- Docker
- Liguagem Go: sistema de bolsa
- Nextjs: react front
- Nestjs: back do home broker
- Apache Kafka: sistema de stream de dados

## ordem do desenvolvimento

Microserviço de bolsa


## Como vai funcionar as filas (Ordem de compra e Venda)

Um cara quer comprar 10 ações e o outro cara quer vender 10 ações, isso será feito um match encaixando uma operação de compra com venda.

Caso tenho um correntista querendo comprar 10 e dois vendendo 5 ações, a operação vai ser proporcional 5 para um e para outro.

Para não ocorrer o match seria no caso de um correntista querendo comprar 10 ações por 10R$ e o outro vendendo 10 ações por 11R$.

Caso o valor da ação de venda for menor que da compra ele fará um match cruzado com uma operação anterior.



## Microsserviço Bolsa

Cada vez que uma ordem de compra e venda dar match será gerado uma transação;

Essa transação será publicada no Apache Kafka no formato JSON

Banco de dados opcional por causa da complexidade 

Se o processo morrer as transações são perdidas


## Tickect service



## psql

psql -d {db-name} -f path-file


## Rabbit

Solution for mangment queue and event 

const { execSync } = require("child_process");
const amqp = require("amqplib");

async function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, delay);
    });
}

async function createChannel(config) {
    const { url, publishers, listeners } = Object.assign({url: "", publishers: {}, listeners: {}}, config);
    try {
        // create connection
        const connection = await amqp.connect(url);
        let channel = null;
        connection._channels = [];
        connection.on("error", (error) => {
            console.error("Connection error : ", config, error);
        });
        connection.on("close", async (error) => {
            if (channel) {
                channel.close();
            }
            console.error("Connection close : ", config, error);
            await sleep(1000);
            createChannel(config);
        });
        // create channel
        channel = await connection.createConfirmChannel();
        channel.on("error", (error) => {
            console.error("Channel error : ", config, error);
        });
        channel.on("close", (error) => {
            console.error("Channel close : ", config, error);
        });
        // register listeners
        for (queue in listeners) {
            const callback = listeners[queue];
            channel.assertQueue(queue, { durable: false });
            channel.consume(queue, callback);
        }
        // publish
        for (queue in publishers) {
            const message = publishers[queue];
            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, message);
        }
        return channel;
    } catch (error) {
        console.error("Create connection error : ", error);
        await sleep(1000);
        createChannel(config);
    }
}

async function main() {
    // publish "hello" message to queue
    const channelPublish = await createChannel({
        url: "amqp://root:toor@0.0.0.0:5672",
        publishers: {
            "queue": Buffer.from("hello"),
        }
    });

    // restart rabbitmq
    execSync("docker stop rabbitmq");
    execSync("docker start rabbitmq");

    // consume message from queue
    const channelConsume = await createChannel({
        url: "amqp://root:toor@0.0.0.0:5672",
        listeners: {
            "queue": (message) => {
                console.log("Receive message ", message.content.toString());
            },
        }
    });

    return true;
}

main().catch((error) => console.error(error));