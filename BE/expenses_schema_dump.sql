CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `image_name` varchar(50) DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6664 DEFAULT CHARSET=utf8mb3;


CREATE TABLE categories (
    id INT unsigned not null AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
    created_by bigint unsigned not null,
    KEY `fk_categories_created_by` (`created_by`),
    CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
);


CREATE TABLE `expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` bigint unsigned NOT NULL,
  `created_at` datetime(3) NOT NULL,
  `modified_at` datetime(3) NOT NULL,  
  `description` varchar(1024) DEFAULT NULL,
  `user_id` bigint unsigned not null,
  `category_id` int unsigned not null,
   KEY `fk_expenses_user_id` (`user_id`),
    CONSTRAINT `fk_expenses_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    KEY `fk_expenses_category_id` (`category_id`),
    CONSTRAINT `fk_expenses_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6664 DEFAULT CHARSET=utf8mb3;


ALTER TABLE categories ADD FULLTEXT(name);
ALTER TABLE expenses ADD FULLTEXT(category, description);
ALTER TABLE expenses ADD FULLTEXT(description);
ALTER TABLE expenses ADD FULLTEXT(category);

ALTER TABLE expenses MODIFY COLUMN amount FLOAT NOT NULL;
ALTER TABLE user ADD COLUMN password_hash VARCHAR(255) NOT NULL;
