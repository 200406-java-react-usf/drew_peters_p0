create user project_0_api
with password 'password';

create database project_0;

grant all privileges 
on database project_0
to project_0_api;

set search_path to project_0;

create table user_roles(
	id serial,
	name varchar(25) not null,
	
	constraint user_roles_pk primary key (id)
	
);

create table app_users(
	id serial,
	username varchar(25) unique not null,
	password varchar(256) not null,
	first_name varchar(25) not null,
	last_name varchar(25) not null,
	email varchar(256) unique not null,
	role_id int not null,
	
	constraint app_users_pk primary key (id),
	constraint user_role_fk foreign key (role_id) references user_roles
);
create table accounts(
	id serial,
	balance int not null,
	type varchar(25) not null,
	owner_id int not null,
	
	constraint acounts_pk primary key (id),
	constraint account_owner_fk foreign key (owner_id) references app_users
);
create table transactions(
	id serial,
	amount int not null,
	description varchar(256) not null,
	account_id int not null,
	
	constraint transactions_pk primary key (id),
	constraint transaction_account_fk foreign key (account_id) references app_users
);

insert into user_roles (name) 
values ('admin'), ('client');

insert into app_users (username, password, first_name, last_name, email, role_id) 
values
	('aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 2),
	('bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', 2),
	('ccalhoun', 'password', 'Charles', 'Calhoun', 'ccalhoun@revature.com', 2),
	('ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', 1),
	('eeinstein', 'password', 'Emily', 'Anderson', 'eeinstein@revature.com', 2);

insert into accounts (balance, type, owner_id) 
values 
	(14233, 'Savings', 1),
	(1736, 'Checking', 1),
	(6523, 'Checking', 2),
	(1235, 'Savings', 3),
	(45641, 'Savings', 5),
	(526, 'Checking', 3),
	(341, 'Checking', 5),
	(57461, 'Savings', 2);

insert into transactions (amount, description, account_id) 
values 
	(825, 'Rent Bill', 1),
	(216.12, 'Electric Bill', 1),
	(64.45, 'Debit Transaction', 1),
	(1250, 'Rent Bill', 2),
	(415.12, 'Electric Bill', 2),
	(561.10, 'Debit Transaction', 2),
	(975, 'Rent Bill', 3),
	(323.56, 'Electric Bill', 3),
	(112.48, 'Debit Transaction', 3),
	(700, 'Rent Bill', 5),
	(113.57, 'Electric Bill', 5),
	(84.25, 'Debit Transaction', 5);

commit;