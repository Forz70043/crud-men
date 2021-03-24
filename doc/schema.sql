
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
