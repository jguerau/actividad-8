CREATE DATABASE IF NOT EXISTS `blog_db`;
USE `blog_db`;

-- 2. Crear tabla de autores
CREATE TABLE IF NOT EXISTS `autores` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `imagen` VARCHAR(255)
) ENGINE=InnoDB;

-- 3. Crear tabla de posts
CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(255) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `categoria` VARCHAR(50),
    `autor_id` INT,
    CONSTRAINT `fk_autor` FOREIGN KEY (`autor_id`) REFERENCES `autores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;