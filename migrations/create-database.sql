CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) DEFAULT NULL,
  `name` text,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) DEFAULT NULL,
  `name` text,
  `book_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `paragraphs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) DEFAULT NULL,
  `name` text,
  `content` text,
  `chapter_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rendered` mediumtext,
  PRIMARY KEY (`id`),
  KEY `chapter_id` (`chapter_id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `keywords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` text,
  `type` text,
  `ref_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `pos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pos` int(11),
  `type` text,
  `ref_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `problems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) DEFAULT NULL,
  `name` text,
  `content` text,
  `paragraph_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rendered` mediumtext,
  PRIMARY KEY (`id`),
  KEY `paragraph_id` (`paragraph_id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `prompts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `content` text,
  `rendered` mediumtext,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET='utf8';

CREATE TABLE IF NOT EXISTS `search` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request` text,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET='utf8';
