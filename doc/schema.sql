
CREATE TABLE `GROCERY`(
    `id` INT(6) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `type_id` INT(6) DEFAULT NULL,
    `bought` ENUM('yes','no') DEFAULT 'no',
    PRIMARY KEY(`id`)
);

CREATE TABLE `TYPE`(
    `id` INT(6) NOT NULL AUTO_INCREMENT,
    `name` varchar(64) NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE `GROCERY` ADD FOREIGN KEY(`type_id`) REFERENCES `TYPE`(`id`);



CREATE TABLE `SYSLOG` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `remote_ip` varchar(15) NOT NULL,
  `forward_ip` varchar(15) NOT NULL,
  `email` varchar(256) NOT NULL,
  `action` varchar(512) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `ROLE`(
    `id` int(21) unsigned AUTO_INCREMENT not null,
    `name` varchar(256) not null,
    PRIMARY KEY(`id`)
);

CREATE TABLE `AUTH`(
    `cod_id` int(21) unsigned not null,
    `user_id` int(21) unsigned not null,
    PRIMARY KEY(`cod_id`),
    UNIQUE KEY`cod_id` (`cod_id`),
    FOREIGN KEY `user_id` REFERENCES `USERS`(`id`)
);

CREATE TABLE `USERS`(
    `id` int(21) unsigned AUTO_INCREMENT not null,
    `name` varchar(256) not null,
    `surname` varchar(256) not null,
    `email` varchar(256) not null,
    `password` varchar(256) not null,
    `photo` text default null,
    `gender` tinyint(0),
    `yearOfBirth` DATE not null,
    `cod_id` varchar(256) DEFAULT NULL,
    PRIMARY KEY(`id`),
);

CREATE TABLE `COUNTRY` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `iso_3166` char(2) DEFAULT '',
  `blacklist` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `iso_3166` (`iso_3166`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;