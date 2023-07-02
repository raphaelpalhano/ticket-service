/*drop schema fullcycle cascade; */

create schema tickect_broker;

create table tickect_broker.event (
  event_id uuid,
  description text,
  price numeric,
  capacity integer
);

create table tickect_broker.ticket (
  ticket_id uuid,
  event_id uuid,
  email text,
  status text
);


create table tickect_broker.transaction (
  transaction_id uuid,
  ticket_id uuid,
  event_id uuid,
  price numeric,
  tid text,
  status text
);


insert into tickect_broker.event (event_id, description, price, capacity) values ('bf6a9b3d-4d5c-4c9d-bf3b-4a091b05dc76', 'Foo Fighters 10/10/2022 22:00', 300, 100000);