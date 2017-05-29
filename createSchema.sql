drop schema if exists SR03Projet;
create schema SR03Projet;
use SR03Projet;
create table branche (abreviation varchar(255) not null, nom varchar(255), primary key (abreviation));
create table edt (heure_debut datetime not null, jour varchar(255) not null, salle varchar(255) not null, duree integer not null, type varchar(255), uv varchar(255), primary key (heure_debut, jour, salle));
create table etudiant (mail varchar(255) not null, nom varchar(255), prenom varchar(255), branche varchar(255), primary key (mail));
create table inscription (mail varchar(255) not null, heure_debut datetime not null, jour varchar(255) not null, salle varchar(255) not null);
create table jour (nom varchar(255) not null, primary key (nom));
create table salle (nom varchar(255) not null, primary key (nom));
create table uv (nom varchar(255) not null, description varchar(255), primary key (nom));
alter table edt add constraint FKhgvkdqcr65ijy50uavitpibn9 foreign key (jour) references jour (nom);
alter table edt add constraint FK9siat9vv9gjlunsrwd4wcc73h foreign key (salle) references salle (nom);
alter table edt add constraint FK2976ef9ow5g5ttxwa08qgo6v0 foreign key (uv) references uv (nom);
alter table etudiant add constraint FKpitbe9bvy3ijxqi3vi6ltjs1e foreign key (branche) references branche (abreviation);
alter table inscription add constraint FKo74epmx5attuowjqycn37ahqa foreign key (heure_debut, jour, salle) references edt (heure_debut, jour, salle);
alter table inscription add constraint FKg7jrpmuhksknj4loc94lej0fi foreign key (mail) references etudiant (mail);
INSERT into branche
VALUES('GI', 'Génie Informatique'),('GM', 'Génie Mécanique'),('GB', 'Génie Biologique'),('GSU', 'Génie des Systèmes Urbains'),('TC', 'Tronc Commun'),('GP','Génie des Procédés');
INSERT INTO etudiant VALUES
('quentin.duchemin@etu.utc.fr', 'Duchemin', 'Quentin', 'GI');
INSERT INTO jour VALUES ("LUNDI"), ("MARDI"), ("MECREDI"), ("JEUDI"), ("VENDREDI"), ("SAMEDI")
commit;