drop schema if exists ccca cascade;

create schema ccca;

create table ccca.transaction (
	transaction_id uuid,
	ride_id uuid,
	amount numeric,
	status text,
	date timestamp
);
