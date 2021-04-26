
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