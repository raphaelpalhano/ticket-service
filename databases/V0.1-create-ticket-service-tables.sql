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