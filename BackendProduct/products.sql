-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2025 a las 22:30:05
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `products`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_categoria`
--

CREATE TABLE `catalogo_categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(100) NOT NULL,
  `indice_pedido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_categoria`
--

INSERT INTO `catalogo_categoria` (`id_categoria`, `nombre_categoria`, `indice_pedido`) VALUES
(1, 'Bebidas', 1),
(2, 'ABARROTES', 2),
(3, 'PAN', 3),
(4, 'GOLOSINAS', 4),
(5, 'Limpieza', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_producto`
--

CREATE TABLE `catalogo_producto` (
  `id_producto` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `precio_producto` decimal(10,2) NOT NULL,
  `indice_pedido_producto` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_producto`
--

INSERT INTO `catalogo_producto` (`id_producto`, `nombre_producto`, `precio_producto`, `indice_pedido_producto`, `categoria_id`) VALUES
(1, 'COCA COLA 1 LT', 1.60, 1, 1),
(2, 'COCA COLA 2 LT', 2.10, 2, 1),
(3, 'PEPSI 1 LT', 1.00, 3, 1),
(4, 'Arroz blanco 1kg', 1.10, 1, 2),
(5, 'Frijoles rojos 1lb', 0.95, 2, 2),
(6, 'Aceite vegetal 500ml', 1.75, 3, 2),
(7, 'Sal refinada 500g', 0.60, 4, 2),
(8, 'Azúcar estándar 1kg', 1.20, 5, 2),
(9, 'Pan francés (unidad)', 0.20, 1, 3),
(10, 'Pan dulce relleno de crema', 0.75, 2, 3),
(11, 'Pan de caja blanco', 1.90, 3, 3),
(12, 'Pan integral 500g', 2.25, 4, 3),
(13, 'Pan tostado con ajo', 1.50, 5, 3),
(14, 'Chocolatina Diana', 0.35, 1, 4),
(15, 'Gomitas surtidas Trolli', 0.50, 2, 4),
(16, 'Paleta de caramelo Fini', 0.40, 3, 4),
(17, 'Mazapán tradicional', 0.60, 4, 4),
(18, 'Chicle sabor fresa', 0.25, 5, 4),
(19, 'escoba', 5.00, 1, 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catalogo_categoria`
--
ALTER TABLE `catalogo_categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `catalogo_producto`
--
ALTER TABLE `catalogo_producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catalogo_categoria`
--
ALTER TABLE `catalogo_categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `catalogo_producto`
--
ALTER TABLE `catalogo_producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `catalogo_producto`
--
ALTER TABLE `catalogo_producto`
  ADD CONSTRAINT `catalogo_producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `catalogo_categoria` (`id_categoria`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
