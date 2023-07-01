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