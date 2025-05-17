-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: db_parking
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` bigint NOT NULL,
  `vehicleId` bigint NOT NULL,
  `parkingLotId` bigint NOT NULL,
  `slotId` bigint NOT NULL,
  `checkinTime` datetime NOT NULL,
  `checkoutTime` datetime DEFAULT NULL,
  `status` enum('Pending','Booked','CheckedIn','CheckedOut','Cancelled') NOT NULL DEFAULT 'Pending',
  `totalPrice` decimal(10,2) NOT NULL,
  `paymentStatus` enum('Unpaid','Paid') NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_38a69a58a323647f2e75eb994de` (`userId`),
  KEY `FK_30909e71d6dd969e95d995258f1` (`vehicleId`),
  KEY `FK_515adad92cb32627affeaa8be7b` (`parkingLotId`),
  KEY `FK_bb2c09a19d48380aca836adf7d9` (`slotId`),
  CONSTRAINT `FK_30909e71d6dd969e95d995258f1` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `FK_38a69a58a323647f2e75eb994de` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_515adad92cb32627affeaa8be7b` FOREIGN KEY (`parkingLotId`) REFERENCES `parking_lots` (`id`),
  CONSTRAINT `FK_bb2c09a19d48380aca836adf7d9` FOREIGN KEY (`slotId`) REFERENCES `parking_slots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (12,17,8,4,11,'2025-05-17 12:00:00',NULL,'Booked',20000.00,'Paid','2025-05-17 15:12:15.600055','2025-05-17 19:59:19.000000'),(18,17,8,4,8,'2025-05-19 12:00:00',NULL,'Booked',20000.00,'Unpaid','2025-05-17 15:31:21.206792','2025-05-17 20:00:13.000000'),(19,2,3,4,8,'2025-05-18 12:00:00',NULL,'Pending',20000.00,'Unpaid','2025-05-17 15:43:40.331197','2025-05-17 20:00:17.000000'),(20,2,7,1,1,'2025-05-25 12:00:00',NULL,'Booked',10000.00,'Paid','2025-05-17 18:47:41.599689','2025-05-17 20:00:21.000000'),(21,17,10,5,9,'2025-05-17 12:00:00','2025-05-17 18:00:00','CheckedOut',5000.00,'Paid','2025-05-17 19:50:52.308344','2025-05-17 20:00:25.000000'),(22,2,3,1,3,'2025-05-17 12:00:00','2025-05-17 19:00:00','CheckedIn',20000.00,'Paid','2025-05-17 19:54:53.465304','2025-05-17 19:54:53.465304');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_lots`
--

DROP TABLE IF EXISTS `parking_lots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_lots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(500) NOT NULL,
  `openTime` time NOT NULL,
  `closeTime` time NOT NULL,
  `totalSlots` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_lots`
--

LOCK TABLES `parking_lots` WRITE;
/*!40000 ALTER TABLE `parking_lots` DISABLE KEYS */;
INSERT INTO `parking_lots` VALUES (1,'Bãi đỗ A','123 Main Street, District 1, HCMC','09:00:00','23:00:00',20,'2025-05-11 11:12:45.350689','2025-05-17 10:55:40.000000'),(2,'Bãi đỗ C','Đại học Bách Khoa Hà Nội','08:00:00','22:00:00',10,'2025-05-14 03:36:51.546032','2025-05-17 10:07:36.000000'),(4,'Bãi đỗ D','Số 1 Hoàng Quốc Việt, Hà Nội','05:00:00','23:30:00',500,'2025-05-14 09:21:10.304118','2025-05-17 10:07:45.000000'),(5,'Bãi đỗ B','BigC Thăng Long Hà Nội','06:00:00','23:00:00',5,'2025-05-17 10:07:23.109810','2025-05-17 10:07:23.109810');
/*!40000 ALTER TABLE `parking_lots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_slots`
--

DROP TABLE IF EXISTS `parking_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parking_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parkingLotId` bigint NOT NULL,
  `vehicleType` enum('Motorbike','Car','Bicycle') NOT NULL,
  `status` enum('Available','Occupied') NOT NULL,
  `lastUpdated` datetime NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_f0156ed9b0552559132a32901e8` (`parkingLotId`),
  KEY `IDX_vehicle_type` (`vehicleType`),
  CONSTRAINT `FK_f0156ed9b0552559132a32901e8` FOREIGN KEY (`parkingLotId`) REFERENCES `parking_lots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_slots`
--

LOCK TABLES `parking_slots` WRITE;
/*!40000 ALTER TABLE `parking_slots` DISABLE KEYS */;
INSERT INTO `parking_slots` VALUES (1,'A-1',1,'Motorbike','Occupied','2025-05-17 13:01:26','2025-05-11 11:32:38.699981','2025-05-17 13:01:25.000000'),(3,'A-2',1,'Car','Occupied','2025-05-17 10:22:16','2025-05-11 11:36:40.025763','2025-05-17 19:54:53.000000'),(5,'A-3',1,'Car','Available','2025-05-17 10:22:12','2025-05-11 11:37:21.675189','2025-05-17 15:34:06.000000'),(6,'A-4',1,'Car','Available','2025-05-17 13:01:15','2025-05-11 11:38:47.248648','2025-05-17 20:00:55.000000'),(8,'D-1',4,'Motorbike','Occupied','2025-05-17 13:01:45','2025-05-14 09:22:04.977885','2025-05-17 15:24:50.000000'),(9,'B-1',5,'Motorbike','Occupied','2025-05-17 10:24:02','2025-05-17 10:23:53.668908','2025-05-17 19:50:52.000000'),(10,'B-2',5,'Car','Available','2025-05-17 10:27:27','2025-05-17 10:27:26.694041','2025-05-17 15:11:58.000000'),(11,'D-2',4,'Car','Occupied','2025-05-17 10:56:05','2025-05-17 10:56:04.549969','2025-05-17 15:22:31.000000');
/*!40000 ALTER TABLE `parking_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bookingId` bigint NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentMethod` enum('Momo','ZaloPay','VNPay','Bank','Cash') NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `status` enum('Pending','Success','Failed') NOT NULL,
  `paidAt` datetime DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_1ead3dc5d71db0ea822706e389d` (`bookingId`),
  CONSTRAINT `FK_1ead3dc5d71db0ea822706e389d` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `role` enum('ParkingGuest','ParkingStaff','Admin') NOT NULL DEFAULT 'ParkingGuest',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Adminstrator','0986668888','superadminstrator@gmail.com','$2b$10$f9gAqGXUw6MOycgZ0X0dVO6iNqt07R.AiF24NvBZ6IOIFmxInoXOe','2025-05-14 09:15:22.885602','Admin','2025-05-17 21:05:59.000000'),(2,'Người gửi A','0123456789','nguoiguia@example.com','$2b$10$UX8vuD0mHhQy7b4FoPhFFuLFKx8NmbHsKvEd5hSyDGqfTr6D766wy','2025-05-11 09:42:51.538900','ParkingGuest','2025-05-17 13:24:47.881092'),(3,'Người gửi B','0123456789','nguoiguib@example.com','$2b$10$ebHfrstlA69mU4MgrbQShu1zS87x6kYUXReWXP.XCB7mJpO.Kna0m','2025-05-11 12:30:08.846717','ParkingGuest','2025-05-17 10:58:32.000000'),(4,'Nhân viên 0001','0123456789','nhanvien0001@example.com','$2b$10$3jNQL6fyOl9drASkM80I8OPf8rWuO7DnC4lPJRaxOSNlgEdJh4IZi','2025-05-11 12:31:05.273221','ParkingStaff','2025-05-17 10:59:31.000000'),(5,'Người gửi C','0981231211','nguoiguic@gmail.com','$2b$10$TsS1bp2BaIkUPffSdsbDfO60JtXScvPYJwsYiG1XfB8YeZPLGr36G','2025-05-11 17:29:52.419131','ParkingGuest','2025-05-17 10:59:50.000000'),(6,'Nhân viên 0002','0981248123','nhanvien0002@gamil.com','$2b$10$0VWQO7aTfaH3fFclSIlR4OS6FJ5IqP/sdY849riUnw1hdg4SMkdRy','2025-05-14 02:54:41.562233','ParkingStaff','2025-05-17 11:00:07.000000'),(15,'Người gửi D','0981266001','nguoiguid@example.com','$2b$10$f9gAqGXUw6MOycgZ0X0dVO6iNqt07R.AiF24NvBZ6IOIFmxInoXOe','2025-05-17 09:36:54.414041','ParkingGuest','2025-05-17 11:00:28.000000'),(16,'Nhân viên D','0981231111','nhanviend@gmail.com','$2b$10$s4ZRVpMhf7cc3RUAdcNpgOEFRQo3AE43yNX9sJTrlv6mIPl8okQDW','2025-05-17 11:56:07.855270','ParkingStaff','2025-05-17 12:25:05.000000'),(17,'Người gửi E','0981231221','nguoiguie@gmail.com','$2b$10$UX8vuD0mHhQy7b4FoPhFFuLFKx8NmbHsKvEd5hSyDGqfTr6D766wy','2025-05-17 13:12:48.677890','ParkingGuest','2025-05-17 13:12:48.677890');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_rate_plans`
--

DROP TABLE IF EXISTS `vehicle_rate_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_rate_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicleType` enum('Motorbike','Car','Bicycle') NOT NULL,
  `pricePerEntry` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6dbcc7d161732b10ab5258a4cc` (`vehicleType`),
  KEY `IDX_vehicle_type` (`vehicleType`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_rate_plans`
--

LOCK TABLES `vehicle_rate_plans` WRITE;
/*!40000 ALTER TABLE `vehicle_rate_plans` DISABLE KEYS */;
INSERT INTO `vehicle_rate_plans` VALUES (1,'Car',20000.00,'2025-05-11 10:29:43.745418','2025-05-11 10:30:26.000000'),(2,'Motorbike',10000.00,'2025-05-11 10:29:43.745418','2025-05-11 10:30:26.000000'),(3,'Bicycle',5000.00,'2025-05-11 10:29:43.745418','2025-05-11 10:30:26.000000');
/*!40000 ALTER TABLE `vehicle_rate_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_types`
--

DROP TABLE IF EXISTS `vehicle_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_types`
--

LOCK TABLES `vehicle_types` WRITE;
/*!40000 ALTER TABLE `vehicle_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` bigint NOT NULL,
  `licensePlate` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `vehicleType` enum('Motorbike','Car','Bicycle') NOT NULL,
  `model` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_20f139b9d79f917ef735efacb00` (`userId`),
  KEY `IDX_vehicle_type` (`vehicleType`),
  CONSTRAINT `FK_20f139b9d79f917ef735efacb00` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (2,2,'51 FA 26868','2025-05-11 10:08:26.093155','2025-05-17 13:26:30.000000','Active','Motorbike','Honda','Xanh'),(3,2,'18 F1 12334','2025-05-13 07:47:41.070945','2025-05-17 13:26:41.000000','Active','Car','Honda','Đen'),(7,2,'29 AC 66666','2025-05-14 09:19:30.242792','2025-05-14 09:19:30.242792','Active','Motorbike','Honda SH 160i','Trắng'),(8,17,'30 L2 90886','2025-05-17 13:13:39.864121','2025-05-17 13:13:39.864121','Active','Car','Honda CRV','Đen'),(9,17,'17 B6 01239','2025-05-17 13:23:27.264113','2025-05-17 13:23:27.264113','Active','Motorbike','SH 125i','Đỏ'),(10,17,'19 N1 00001','2025-05-17 13:23:45.703154','2025-05-17 14:07:17.803532','Active','Bicycle','Thể thao','Đỏ đen ');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-17 23:03:00
