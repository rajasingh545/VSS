-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2019 at 05:41 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `v_productivity`
--

-- --------------------------------------------------------

--
-- Table structure for table `p_clients`
--

CREATE TABLE `p_clients` (
  `clientId` int(11) NOT NULL,
  `clientName` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_clients`
--

INSERT INTO `p_clients` (`clientId`, `clientName`, `status`) VALUES
(1, 'client1', 1),
(2, 'client2', 1),
(3, 'client3', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_contracts`
--

CREATE TABLE `p_contracts` (
  `id` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  `clientId` int(11) NOT NULL,
  `item` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `length` float NOT NULL,
  `height` float NOT NULL,
  `width` float NOT NULL,
  `sets` int(11) NOT NULL DEFAULT '0',
  `setCount` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdOn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_contracts`
--

INSERT INTO `p_contracts` (`id`, `projectId`, `description`, `clientId`, `item`, `location`, `length`, `height`, `width`, `sets`, `setCount`, `createdBy`, `createdOn`) VALUES
(1, 3, 'Perimeter scaffold with every level plateform		', 1, '1a', 'level-3 to top', 231, 123, 2, 0, 0, 0, 0),
(2, 3, 'cantilever scaffold ', 1, '2b', 'top level', 112, 32, 8, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `p_dailyworktrack`
--

CREATE TABLE `p_dailyworktrack` (
  `worktrackId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `requestedBy` varchar(100) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `workRequestId` int(11) NOT NULL,
  `photo_1` varchar(100) NOT NULL,
  `photo_2` varchar(100) NOT NULL,
  `photo_3` varchar(100) NOT NULL,
  `remarks` text NOT NULL,
  `matMisuse` tinyint(1) NOT NULL,
  `matRemarks` text NOT NULL,
  `matPhotos` varchar(100) NOT NULL,
  `safetyVio` tinyint(1) NOT NULL DEFAULT '0',
  `safetyRemarks` text NOT NULL,
  `safetyPhoto` varchar(100) NOT NULL,
  `createdOn` datetime NOT NULL,
  `uniqueId` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_dailyworktrack`
--

INSERT INTO `p_dailyworktrack` (`worktrackId`, `projectId`, `ClientId`, `type`, `requestedBy`, `supervisor`, `workRequestId`, `photo_1`, `photo_2`, `photo_3`, `remarks`, `matMisuse`, `matRemarks`, `matPhotos`, `safetyVio`, `safetyRemarks`, `safetyPhoto`, `createdOn`, `uniqueId`, `status`) VALUES
(1, 3, 1, 1, 'xxx', 0, 1, 'images/1561562194621/photo_1.png', '', '', '', 2, '', '', 2, '', '', '2019-06-26 17:35:29', '1561562194621', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_dailyworktrackmaterials`
--

CREATE TABLE `p_dailyworktrackmaterials` (
  `id` int(11) NOT NULL,
  `workTrackId` int(11) NOT NULL,
  `subDevisionId` int(11) NOT NULL,
  `material` int(11) NOT NULL,
  `workerCount` int(11) NOT NULL,
  `inTime` time NOT NULL,
  `outTime` time NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_dailyworktrackmaterials`
--

INSERT INTO `p_dailyworktrackmaterials` (`id`, `workTrackId`, `subDevisionId`, `material`, `workerCount`, `inTime`, `outTime`, `createdOn`) VALUES
(1, 1, 8, 1, 2, '20:00:00', '02:00:00', '0000-00-00 00:00:00'),
(2, 1, 9, 1, 2, '20:00:00', '02:00:00', '0000-00-00 00:00:00'),
(3, 2, 9, 2, 0, '01:00:00', '01:00:00', '0000-00-00 00:00:00'),
(4, 3, 9, 1, 1, '02:00:00', '10:00:00', '0000-00-00 00:00:00'),
(5, 3, 9, 2, 2, '02:00:00', '01:10:00', '0000-00-00 00:00:00'),
(6, 4, 0, 2, 0, '02:00:00', '20:00:00', '0000-00-00 00:00:00'),
(7, 5, 8, 3, 2, '20:00:00', '02:00:00', '0000-00-00 00:00:00'),
(8, 5, 9, 3, 2, '20:00:00', '02:00:00', '0000-00-00 00:00:00'),
(9, 6, 8, 1, 2, '02:00:00', '02:00:00', '0000-00-00 00:00:00'),
(10, 6, 9, 1, 2, '02:00:00', '02:00:00', '0000-00-00 00:00:00'),
(11, 7, 8, 1, 1, '02:00:00', '00:10:00', '0000-00-00 00:00:00'),
(12, 7, 9, 1, 1, '02:00:00', '00:10:00', '0000-00-00 00:00:00'),
(13, 8, 0, 1, 0, '02:00:00', '00:30:00', '0000-00-00 00:00:00'),
(14, 9, 0, 2, 0, '20:00:00', '20:00:00', '0000-00-00 00:00:00'),
(15, 10, 0, 1, 2, '02:00:00', '00:00:00', '0000-00-00 00:00:00'),
(16, 11, 0, 1, 22, '20:00:00', '00:10:00', '0000-00-00 00:00:00'),
(17, 11, 0, 2, 2, '01:00:00', '20:00:00', '0000-00-00 00:00:00'),
(18, 12, 8, 1, 3, '02:00:00', '20:00:00', '0000-00-00 00:00:00'),
(19, 13, 8, 1, 0, '20:00:00', '02:00:00', '0000-00-00 00:00:00'),
(20, 14, 9, 1, 2, '02:20:00', '20:20:00', '0000-00-00 00:00:00'),
(21, 14, 9, 2, 22, '00:20:00', '20:00:00', '0000-00-00 00:00:00'),
(22, 15, 8, 1, 3, '01:00:00', '10:00:00', '2019-06-01 03:50:48'),
(23, 15, 9, 2, 3, '03:40:00', '04:00:00', '2019-06-01 03:50:48'),
(24, 1, 0, 2, 43, '22:00:00', '02:00:00', '2019-06-26 17:35:30');

-- --------------------------------------------------------

--
-- Table structure for table `p_dailyworktracksubdivision`
--

CREATE TABLE `p_dailyworktracksubdivision` (
  `id` int(11) NOT NULL,
  `workTrackId` int(11) NOT NULL,
  `subDivisionId` int(11) NOT NULL,
  `timing` tinyint(1) NOT NULL,
  `length` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `setcount` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `cLength` int(11) NOT NULL,
  `cHeight` int(11) NOT NULL,
  `cWidth` int(11) NOT NULL,
  `cSetcount` int(11) NOT NULL,
  `diffSubDivision` int(11) NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_dailyworktracksubdivision`
--

INSERT INTO `p_dailyworktracksubdivision` (`id`, `workTrackId`, `subDivisionId`, `timing`, `length`, `height`, `width`, `setcount`, `status`, `cLength`, `cHeight`, `cWidth`, `cSetcount`, `diffSubDivision`, `createdOn`) VALUES
(1, 1, 8, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, '2019-05-26 21:07:32'),
(2, 1, 9, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, '2019-05-26 21:07:32'),
(3, 2, 8, 2, 1, 2, 1, 2, 1, 0, 0, 0, 0, 9, '2019-05-26 21:21:15'),
(4, 3, 8, 2, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, '2019-05-26 21:27:21'),
(5, 3, 9, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 9, '2019-05-26 21:27:21'),
(6, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2019-05-26 21:39:25'),
(7, 5, 8, 1, 2, 4, 3, 4, 1, 0, 0, 0, 0, 0, '2019-05-27 11:17:16'),
(8, 5, 9, 1, 22, 3, 33, 3, 1, 0, 0, 0, 0, 0, '2019-05-27 11:17:16'),
(9, 6, 8, 1, 1, 3, 2, 4, 1, 0, 0, 0, 0, 0, '2019-05-27 12:14:31'),
(10, 6, 9, 1, 12, 4, 3, 3, 1, 0, 0, 0, 0, 0, '2019-05-27 12:14:31'),
(11, 7, 8, 1, 55, 2, 1, 2, 1, 0, 0, 0, 0, 0, '2019-05-27 12:37:05'),
(12, 7, 9, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, '2019-05-27 12:37:05'),
(13, 8, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2019-05-31 05:09:33'),
(14, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2019-05-31 05:21:00'),
(15, 10, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2019-05-31 10:45:02'),
(16, 11, 9, 0, 2, 4, 3, 4, 1, 0, 0, 0, 0, 0, '2019-05-31 11:31:24'),
(17, 12, 8, 1, 3, 2, 3, 5, 1, 0, 0, 0, 0, 0, '2019-06-01 03:00:25'),
(18, 13, 8, 1, 2, 3, 2, 3, 2, 2, 3, 2, 3, 0, '2019-06-01 03:03:39'),
(19, 14, 8, 2, 2, 3, 3, 3, 1, 0, 0, 0, 0, 0, '2019-06-01 03:23:35'),
(20, 14, 9, 2, 4, 2, 2, 3, 1, 0, 0, 0, 0, 9, '2019-06-01 03:23:35'),
(21, 15, 8, 2, 1, 3, 2, 4, 1, 0, 0, 0, 0, 0, '2019-06-01 03:50:48'),
(22, 15, 9, 2, 5, 7, 6, 8, 1, 0, 0, 0, 0, 0, '2019-06-01 03:50:48'),
(23, 1, 12, 0, 223, 2, 3, 33, 1, 0, 0, 0, 0, 0, '2019-06-26 17:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `p_dailyworktrackteams`
--

CREATE TABLE `p_dailyworktrackteams` (
  `id` int(11) NOT NULL,
  `workTrackId` int(11) NOT NULL,
  `subDevisionId` int(11) NOT NULL,
  `teamId` int(11) NOT NULL,
  `workerCount` int(11) NOT NULL,
  `inTime` time NOT NULL,
  `outTime` time NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_dailyworktrackteams`
--

INSERT INTO `p_dailyworktrackteams` (`id`, `workTrackId`, `subDevisionId`, `teamId`, `workerCount`, `inTime`, `outTime`, `createdOn`) VALUES
(1, 1, 8, 1, 22, '01:00:00', '01:00:00', '2019-05-26 21:07:32'),
(2, 1, 9, 1, 22, '01:00:00', '01:00:00', '2019-05-26 21:07:33'),
(3, 2, 9, 2, 0, '00:10:00', '01:00:00', '2019-05-26 21:21:15'),
(4, 3, 9, 1, 1, '01:00:00', '01:00:00', '2019-05-26 21:27:21'),
(5, 4, 0, 2, 2, '10:00:00', '02:00:00', '2019-05-26 21:39:25'),
(6, 5, 8, 2, 22, '02:00:00', '02:00:00', '2019-05-27 11:17:16'),
(7, 5, 9, 2, 22, '02:00:00', '02:00:00', '2019-05-27 11:17:16'),
(8, 6, 8, 2, 2, '01:00:00', '01:00:00', '2019-05-27 12:14:31'),
(9, 6, 9, 2, 2, '01:00:00', '01:00:00', '2019-05-27 12:14:31'),
(10, 7, 8, 2, 1, '10:00:00', '10:00:00', '2019-05-27 12:37:05'),
(11, 7, 9, 2, 1, '10:00:00', '10:00:00', '2019-05-27 12:37:06'),
(12, 8, 0, 2, 22, '00:20:00', '20:00:00', '2019-05-31 05:09:33'),
(13, 9, 0, 1, 22, '02:00:00', '20:00:00', '2019-05-31 05:21:00'),
(14, 10, 0, 1, 2, '02:00:00', '00:00:00', '2019-05-31 10:45:02'),
(15, 11, 0, 1, 2, '20:00:00', '00:20:00', '2019-05-31 11:31:24'),
(16, 12, 8, 1, 3, '20:00:00', '20:00:00', '2019-06-01 03:00:26'),
(17, 13, 8, 1, 33, '02:00:00', '02:00:00', '2019-06-01 03:03:39'),
(18, 14, 9, 1, 3, '03:00:00', '00:00:00', '2019-06-01 03:23:35'),
(19, 14, 9, 2, 22, '20:00:00', '02:00:00', '2019-06-01 03:23:35'),
(20, 15, 8, 1, 1, '01:00:00', '01:00:00', '2019-06-01 03:50:48'),
(21, 15, 9, 2, 2, '02:00:00', '03:00:00', '2019-06-01 03:50:48'),
(22, 1, 0, 1, 33, '03:00:00', '22:00:00', '2019-06-26 17:35:30');

-- --------------------------------------------------------

--
-- Table structure for table `p_grade`
--

CREATE TABLE `p_grade` (
  `id` int(11) NOT NULL,
  `range` int(11) NOT NULL,
  `Percentage` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `modifiedBy` int(11) NOT NULL,
  `modifiedOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `p_productivityslab`
--

CREATE TABLE `p_productivityslab` (
  `id` int(11) NOT NULL,
  `scaffoldType` int(11) NOT NULL,
  `scaffoldSubCategory` int(11) NOT NULL,
  `unit` int(11) NOT NULL,
  `typeWorkErection` varchar(100) NOT NULL,
  `typeWorkDismantle` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL,
  `modifiedBy` int(11) NOT NULL,
  `modifiedOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `p_projects`
--

CREATE TABLE `p_projects` (
  `projectId` int(11) NOT NULL,
  `projectName` varchar(100) NOT NULL,
  `projectStatus` tinyint(1) NOT NULL DEFAULT '1',
  `modifiedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_projects`
--

INSERT INTO `p_projects` (`projectId`, `projectName`, `projectStatus`, `modifiedOn`, `createdBy`, `createdOn`) VALUES
(3, 'project5', 1, '2018-04-29 05:06:33', 2, '2018-04-29 00:00:00'),
(4, 'project2', 1, '2018-04-29 05:06:33', 2, '2018-04-29 00:00:00'),
(5, 'project 3', 1, '2018-09-29 18:35:06', 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `p_scaffoldsubcatergory`
--

CREATE TABLE `p_scaffoldsubcatergory` (
  `scaffoldSubCateId` int(11) NOT NULL,
  `scaffoldTypeId` int(11) NOT NULL,
  `scaffoldSubCatName` varchar(100) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL,
  `modifiedBy` int(11) NOT NULL,
  `modifiedOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `p_scaffoldtype`
--

CREATE TABLE `p_scaffoldtype` (
  `id` int(11) NOT NULL,
  `scaffoldName` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_scaffoldtype`
--

INSERT INTO `p_scaffoldtype` (`id`, `scaffoldName`, `status`) VALUES
(1, 'Tower', 1),
(2, 'Perimeter', 1),
(3, 'Cantilever', 1),
(4, 'Mobile', 1),
(5, 'Birdcage', 1),
(6, 'Hanging', 1),
(7, 'Lift Shaft', 1),
(8, 'Truss Out', 1),
(9, 'Cantilever I.Beam', 1),
(10, 'Cantilever T.Bracket', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_scaffoldworktype`
--

CREATE TABLE `p_scaffoldworktype` (
  `id` int(11) NOT NULL,
  `scaffoldName` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_scaffoldworktype`
--

INSERT INTO `p_scaffoldworktype` (`id`, `scaffoldName`, `status`) VALUES
(1, 'Erection', 1),
(2, 'Dismandle', 1),
(3, 'Modification', 1),
(4, 'Erection & Dismandle', 1),
(5, 'Re-Erection', 1),
(6, 'Modification & Dismandle', 1),
(11, 'Top-Up', 1),
(12, 'Dismandle & Re-Erection', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_supervisor`
--

CREATE TABLE `p_supervisor` (
  `supervisorId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_supervisor`
--

INSERT INTO `p_supervisor` (`supervisorId`, `projectId`, `type`, `createdOn`, `createdBy`) VALUES
(5, 3, 1, '2019-03-07 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_users`
--

CREATE TABLE `p_users` (
  `userId` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `userType` smallint(2) NOT NULL,
  `userStatus` tinyint(1) NOT NULL DEFAULT '1',
  `createdBy` int(11) NOT NULL,
  `project` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_users`
--

INSERT INTO `p_users` (`userId`, `Name`, `userName`, `password`, `userType`, `userStatus`, `createdBy`, `project`) VALUES
(2, 'Admin', 'admin', '0192023a7bbd73250516f069df18b500', 1, 1, 0, 0),
(3, 'jeeva', 'storeman', 'c6f929f8c30078248c2a2151be9f0f39', 3, 1, 0, 0),
(4, 'driver', 'driver', '703b02a2a8bb363f50386bb338892471', 4, 1, 0, 0),
(5, 'super', 'super', 'f35364bc808b079853de5a1e343e7159', 5, 1, 0, 3),
(6, 'Super 2', 'Super2', 'affc43cb08a4fd1d9b27fae06b3c57cd', 5, 1, 0, 5),
(7, 'jeeva', 'ssjeeva', 'e8717e52966964f14a532ba011503c64', 5, 1, 0, 4),
(8, 'driver2', 'driver2', '703b02a2a8bb363f50386bb338892471', 4, 1, 0, 0),
(9, 'super 3', 'super3', '85511dc944c3765338deb0b3ad38e907', 5, 1, 0, 3),
(11, 'super 4', 'super4', 'be3878a397a68ac10c4ef8727baa3b7d', 5, 1, 0, 4);

-- --------------------------------------------------------

--
-- Table structure for table `p_workarrangement`
--

CREATE TABLE `p_workarrangement` (
  `workArrangementId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `baseSupervsor` int(11) NOT NULL,
  `addSupervsor` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `attendanceStatus` tinyint(1) NOT NULL DEFAULT '0',
  `attendanceRemark` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workarrangement`
--

INSERT INTO `p_workarrangement` (`workArrangementId`, `projectId`, `baseSupervsor`, `addSupervsor`, `createdOn`, `createdBy`, `remarks`, `status`, `attendanceStatus`, `attendanceRemark`) VALUES
(1, 3, 5, 9, '2019-04-23 00:00:00', 2, '', 1, 0, ''),
(2, 4, 7, 11, '2019-04-23 00:00:00', 2, '', 1, 0, ''),
(3, 3, 9, 5, '2019-04-26 00:00:00', 2, '', 1, 1, ''),
(4, 3, 5, 9, '2019-04-27 00:00:00', 2, 'sfsfsasf asdasdasdas', 1, 1, ''),
(5, 4, 7, 11, '2019-04-27 00:00:00', 2, '', 2, 0, ''),
(6, 3, 9, 5, '2019-04-30 00:00:00', 2, '', 1, 0, ''),
(7, 3, 5, 5, '2019-05-01 00:00:00', 2, 'this is remarks', 2, 0, ''),
(8, 3, 5, 9, '2019-05-02 00:00:00', 2, 'ddfg', 1, 0, ''),
(9, 4, 11, 7, '2019-05-02 00:00:00', 2, '', 1, 1, ''),
(10, 3, 5, 9, '2019-05-04 00:00:00', 2, 'this is remarks', 1, 1, 'this is attendance remarkss mod'),
(11, 3, 5, 6, '2019-05-14 00:00:00', 2, '', 2, 0, ''),
(12, 3, 5, 9, '2019-05-13 00:00:00', 2, '', 2, 0, ''),
(13, 3, 5, 9, '2019-05-18 00:00:00', 2, '', 1, 1, ''),
(14, 4, 7, 7, '2019-05-18 00:00:00', 2, '', 1, 0, ''),
(15, 3, 5, 5, '2019-06-08 00:00:00', 2, '', 2, 0, ''),
(16, 4, 11, 0, '2019-06-08 00:00:00', 2, '', 2, 0, ''),
(17, 5, 6, 6, '2019-06-08 00:00:00', 2, '', 2, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `p_workattendance`
--

CREATE TABLE `p_workattendance` (
  `id` int(11) NOT NULL,
  `workArrangementId` int(11) NOT NULL,
  `workerId` int(11) NOT NULL,
  `workerTeam` tinyint(3) NOT NULL,
  `inTime` time NOT NULL,
  `outTime` time NOT NULL,
  `reason` tinyint(2) NOT NULL,
  `forDate` date NOT NULL,
  `createdOn` datetime NOT NULL,
  `status` tinyint(2) NOT NULL,
  `partial` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workattendance`
--

INSERT INTO `p_workattendance` (`id`, `workArrangementId`, `workerId`, `workerTeam`, `inTime`, `outTime`, `reason`, `forDate`, `createdOn`, `status`, `partial`) VALUES
(24, 1, 3, 2, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:34:48', 0, 0),
(25, 1, 4, 1, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:34:48', 0, 0),
(26, 1, 5, 2, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:34:49', 0, 0),
(27, 1, 8, 3, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:34:49', 0, 0),
(28, 2, 1, 1, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:35:40', 0, 0),
(29, 2, 10, 4, '00:00:00', '00:00:00', 0, '2019-04-23', '2019-04-23 15:35:40', 0, 0),
(30, 3, 1, 1, '01:00:00', '20:00:00', 0, '2019-04-27', '2019-04-26 20:34:44', 0, 0),
(31, 3, 2, 1, '02:00:00', '10:00:00', 0, '2019-04-27', '2019-04-26 20:34:44', 0, 0),
(32, 3, 4, 1, '02:30:00', '03:00:00', 0, '2019-04-27', '2019-04-26 20:34:44', 0, 0),
(33, 3, 6, 2, '00:00:00', '00:00:00', 0, '2019-04-27', '2019-04-26 20:34:44', 0, 0),
(34, 4, 3, 2, '02:00:00', '01:00:00', 0, '2019-04-27', '2019-04-27 04:21:36', 0, 0),
(35, 4, 7, 3, '10:00:00', '04:00:00', 0, '2019-04-27', '2019-04-27 04:21:36', 0, 0),
(36, 4, 9, 4, '01:00:00', '02:00:00', 0, '2019-04-27', '2019-04-27 04:21:36', 0, 0),
(37, 5, 5, 2, '00:00:00', '00:00:00', 0, '2019-04-27', '2019-04-27 05:49:45', 0, 0),
(38, 6, 1, 1, '00:00:00', '00:00:00', 0, '2019-04-30', '2019-04-30 09:12:24', 0, 0),
(39, 6, 2, 1, '00:00:00', '00:00:00', 0, '2019-04-30', '2019-04-30 09:12:24', 0, 0),
(40, 6, 6, 2, '00:00:00', '00:00:00', 0, '2019-04-30', '2019-04-30 09:12:24', 0, 0),
(41, 6, 7, 3, '00:00:00', '00:00:00', 0, '2019-04-30', '2019-04-30 09:12:24', 0, 0),
(42, 7, 1, 1, '00:00:00', '00:00:00', 0, '2019-05-01', '2019-05-01 11:03:21', 0, 0),
(43, 7, 3, 2, '00:00:00', '00:00:00', 0, '2019-05-01', '2019-05-01 11:03:21', 0, 0),
(44, 7, 4, 1, '00:00:00', '00:00:00', 0, '2019-05-01', '2019-05-01 11:03:21', 0, 0),
(45, 7, 5, 2, '00:00:00', '00:00:00', 0, '2019-05-01', '2019-05-01 11:03:21', 0, 0),
(46, 8, 2, 1, '00:00:00', '00:00:00', 0, '2019-05-02', '2019-05-02 13:47:47', 0, 0),
(47, 8, 3, 2, '00:00:00', '00:00:00', 0, '2019-05-02', '2019-05-02 13:47:47', 0, 0),
(48, 9, 1, 1, '10:11:00', '03:30:00', 5, '2019-05-02', '2019-05-02 20:05:58', 1, 0),
(49, 9, 5, 2, '11:02:00', '20:00:00', 4, '2019-05-02', '2019-05-02 20:05:58', 1, 0),
(53, 10, 1, 1, '00:00:00', '00:00:00', 0, '2019-05-04', '2019-05-04 03:01:27', 0, 0),
(54, 10, 3, 2, '00:00:00', '00:00:00', 0, '2019-05-04', '2019-05-04 03:01:27', 0, 0),
(55, 10, 6, 2, '00:00:00', '00:00:00', 0, '2019-05-04', '2019-05-04 03:01:27', 0, 0),
(58, 11, 1, 1, '00:00:00', '00:00:00', 0, '2019-05-14', '2019-05-15 11:41:29', 0, 0),
(59, 11, 2, 1, '00:00:00', '00:00:00', 0, '2019-05-14', '2019-05-15 11:41:29', 0, 0),
(60, 12, 1, 1, '00:00:00', '00:00:00', 0, '2019-05-13', '2019-05-15 11:43:27', 0, 0),
(61, 12, 2, 1, '00:00:00', '00:00:00', 0, '2019-05-13', '2019-05-15 11:43:27', 0, 0),
(62, 13, 1, 1, '13:00:00', '01:00:00', 0, '2019-05-18', '2019-05-18 03:01:22', 1, 0),
(63, 13, 2, 1, '00:00:00', '00:00:00', 0, '2019-05-18', '2019-05-18 03:01:22', 0, 0),
(64, 13, 3, 2, '00:00:00', '00:00:00', 0, '2019-05-18', '2019-05-18 03:01:23', 0, 0),
(67, 14, 4, 1, '00:00:00', '00:00:00', 0, '2019-05-18', '2019-05-18 03:12:31', 0, 0),
(68, 14, 5, 2, '00:00:00', '00:00:00', 0, '2019-05-18', '2019-05-18 03:12:32', 0, 0),
(72, 16, 4, 1, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 10:03:05', 0, 0),
(73, 16, 5, 2, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 10:03:05', 0, 0),
(74, 17, 4, 1, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 10:04:21', 0, 1),
(75, 17, 5, 2, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 10:04:21', 0, 0),
(94, 15, 1, 1, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 12:21:09', 0, 1),
(95, 15, 2, 1, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 12:21:09', 0, 0),
(96, 15, 3, 2, '00:00:00', '00:00:00', 0, '2019-06-08', '2019-06-08 12:21:09', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `p_workers`
--

CREATE TABLE `p_workers` (
  `workerId` int(11) NOT NULL,
  `workerName` varchar(100) NOT NULL,
  `teamId` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL,
  `modifiedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workers`
--

INSERT INTO `p_workers` (`workerId`, `workerName`, `teamId`, `createdOn`, `createdBy`, `modifiedOn`, `status`) VALUES
(1, 'worker1', 1, '2019-03-02 00:00:00', 1, '0000-00-00 00:00:00', 1),
(2, 'worker2', 1, '2019-03-02 00:00:00', 1, '0000-00-00 00:00:00', 1),
(3, 'worker3', 2, '2019-03-14 00:00:00', 1, '2019-04-23 13:11:24', 1),
(4, 'worker4', 1, '2019-04-13 00:00:00', 1, '0000-00-00 00:00:00', 1),
(5, 'worker5', 2, '2019-04-13 00:00:00', 1, '2019-04-23 13:13:37', 1),
(6, 'worker6', 2, '2019-04-13 00:00:00', 1, '2019-04-23 13:13:37', 1),
(7, 'worker7', 3, '2019-04-13 00:00:00', 1, '2019-04-23 13:15:03', 1),
(8, 'worker8', 3, '2019-04-13 00:00:00', 1, '2019-04-23 13:15:03', 1),
(9, 'worker9', 4, '2019-04-13 00:00:00', 1, '2019-04-23 13:15:03', 1),
(10, 'worker10', 4, '2019-04-13 00:00:00', 1, '2019-04-23 13:15:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_workerteam`
--

CREATE TABLE `p_workerteam` (
  `teamid` int(11) NOT NULL,
  `teamName` varchar(100) NOT NULL,
  `createdOn` datetime NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workerteam`
--

INSERT INTO `p_workerteam` (`teamid`, `teamName`, `createdOn`, `status`) VALUES
(1, 'CW', '2019-04-23 00:00:00', 1),
(2, 'Team1', '2019-04-23 00:00:00', 1),
(3, 'Team2', '2019-04-23 00:00:00', 1),
(4, 'SW', '2019-04-23 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_workrequest`
--

CREATE TABLE `p_workrequest` (
  `workRequestId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `requestedBy` varchar(100) NOT NULL,
  `contractType` tinyint(1) NOT NULL,
  `remarks` text NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` int(11) NOT NULL,
  `scaffoldRegister` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workrequest`
--

INSERT INTO `p_workrequest` (`workRequestId`, `projectId`, `clientId`, `requestedBy`, `contractType`, `remarks`, `createdOn`, `createdBy`, `scaffoldRegister`, `status`) VALUES
(1, 3, 1, 'fdf', 1, '', '2019-06-26 17:14:03', 2, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `p_workrequestitems`
--

CREATE TABLE `p_workrequestitems` (
  `id` int(11) NOT NULL,
  `workRequestId` int(11) NOT NULL,
  `contractType` tinyint(2) NOT NULL,
  `itemId` int(11) NOT NULL,
  `sizeType` tinyint(2) NOT NULL,
  `workBased` tinyint(2) NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workrequestitems`
--

INSERT INTO `p_workrequestitems` (`id`, `workRequestId`, `contractType`, `itemId`, `sizeType`, `workBased`, `createdOn`) VALUES
(9, 7, 1, 1, 1, 1, '2019-05-16 11:24:23'),
(10, 7, 1, 1, 1, 2, '2019-05-16 11:24:23'),
(11, 8, 1, 1, 1, 1, '2019-05-16 11:28:14'),
(12, 9, 2, 0, 0, 1, '2019-05-16 12:33:08'),
(13, 10, 2, 0, 0, 2, '2019-05-16 12:48:07'),
(14, 11, 2, 0, 0, 2, '2019-05-16 12:52:27'),
(15, 12, 1, 1, 1, 1, '2019-05-17 20:36:26'),
(16, 13, 1, 1, 1, 1, '2019-05-17 22:24:08'),
(17, 13, 1, 2, 2, 2, '2019-05-17 22:24:08'),
(18, 14, 2, 0, 0, 2, '2019-05-18 01:07:19'),
(19, 15, 1, 1, 1, 1, '2019-05-24 09:52:09'),
(20, 16, 2, 0, 1, 1, '2019-05-24 10:02:18'),
(21, 17, 2, 0, 0, 1, '2019-05-24 10:04:20'),
(22, 18, 1, 1, 1, 1, '2019-05-31 15:02:04'),
(23, 19, 1, 1, 1, 1, '2019-05-31 15:23:27'),
(24, 1, 1, 1, 1, 1, '2019-06-26 17:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `p_workrequestmanpower`
--

CREATE TABLE `p_workrequestmanpower` (
  `id` int(11) NOT NULL,
  `workRequestId` int(11) NOT NULL,
  `itemListId` int(11) NOT NULL,
  `safety` int(11) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `erectors` int(11) NOT NULL,
  `generalWorker` int(11) NOT NULL,
  `timeIn` time NOT NULL,
  `timeOut` time NOT NULL,
  `createdOn` datetime NOT NULL,
  `ItemUniqueId` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workrequestmanpower`
--

INSERT INTO `p_workrequestmanpower` (`id`, `workRequestId`, `itemListId`, `safety`, `supervisor`, `erectors`, `generalWorker`, `timeIn`, `timeOut`, `createdOn`, `ItemUniqueId`) VALUES
(1, 7, 10, 2, 3, 5, 4, '20:00:00', '03:00:00', '2019-05-16 11:24:23', ''),
(2, 10, 13, 34, 2, 2, 2, '00:00:00', '00:00:00', '2019-05-16 12:48:07', ''),
(3, 11, 14, 2, 2, 3, 3, '01:00:00', '10:00:00', '2019-05-16 12:52:27', ''),
(4, 11, 14, 1, 4, 12, 31, '02:00:00', '12:00:00', '2019-05-16 12:52:27', ''),
(5, 13, 17, 3, 4, 7, 5, '03:00:00', '02:00:00', '2019-05-17 22:24:09', ''),
(6, 14, 18, 2, 5, 5, 3, '02:00:00', '03:20:00', '2019-05-18 01:07:19', ''),
(7, 14, 18, 3, 3, 2, 2, '02:00:00', '02:20:00', '2019-05-18 01:07:19', '');

-- --------------------------------------------------------

--
-- Table structure for table `p_workrequestsizebased`
--

CREATE TABLE `p_workrequestsizebased` (
  `id` int(11) NOT NULL,
  `workRequestId` int(11) NOT NULL,
  `itemListId` int(11) NOT NULL,
  `scaffoldType` int(11) NOT NULL,
  `scaffoldWorkType` int(11) NOT NULL,
  `scaffoldSubCategory` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `setcount` int(11) NOT NULL,
  `createdOn` datetime NOT NULL,
  `ItemUniqueId` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `p_workrequestsizebased`
--

INSERT INTO `p_workrequestsizebased` (`id`, `workRequestId`, `itemListId`, `scaffoldType`, `scaffoldWorkType`, `scaffoldSubCategory`, `length`, `height`, `width`, `setcount`, `createdOn`, `ItemUniqueId`) VALUES
(1, 7, 9, 0, 0, 0, 231, 123, 2, 0, '2019-05-16 11:24:23', ''),
(2, 8, 11, 0, 0, 0, 231, 123, 2, 0, '2019-05-16 11:28:14', ''),
(3, 9, 12, 2, 1, 0, 22, 33, 24, 2, '2019-05-16 12:33:08', ''),
(4, 9, 12, 2, 2, 0, 2, 3, 4, 28, '2019-05-16 12:33:08', ''),
(5, 12, 15, 1, 1, 0, 231, 123, 2, 4, '2019-05-17 20:36:26', ''),
(6, 13, 16, 0, 1, 0, 231, 123, 2, 6, '2019-05-17 22:24:08', ''),
(7, 15, 19, 2, 1, 0, 231, 123, 2, 34, '2019-05-24 09:52:09', 'WR-19A'),
(8, 17, 21, 2, 1, 0, 34, 55, 55, 54, '2019-05-24 10:04:20', 'WR-0021A'),
(9, 17, 21, 4, 2, 0, 4, 3, 5, 8, '2019-05-24 10:04:20', 'WR-0021B'),
(10, 18, 22, 2, 1, 0, 231, 123, 4, 0, '2019-05-31 15:02:04', 'WR-0022A'),
(11, 19, 23, 2, 1, 0, 231, 123, 2, 10, '2019-05-31 15:23:27', 'WR-0023A'),
(12, 1, 24, 2, 1, 0, 231, 123, 2, 40, '2019-06-26 17:14:04', 'WR-0001A');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `p_clients`
--
ALTER TABLE `p_clients`
  ADD PRIMARY KEY (`clientId`);

--
-- Indexes for table `p_contracts`
--
ALTER TABLE `p_contracts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_dailyworktrack`
--
ALTER TABLE `p_dailyworktrack`
  ADD PRIMARY KEY (`worktrackId`);

--
-- Indexes for table `p_dailyworktrackmaterials`
--
ALTER TABLE `p_dailyworktrackmaterials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_dailyworktracksubdivision`
--
ALTER TABLE `p_dailyworktracksubdivision`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_dailyworktrackteams`
--
ALTER TABLE `p_dailyworktrackteams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_grade`
--
ALTER TABLE `p_grade`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_productivityslab`
--
ALTER TABLE `p_productivityslab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_projects`
--
ALTER TABLE `p_projects`
  ADD PRIMARY KEY (`projectId`);

--
-- Indexes for table `p_scaffoldsubcatergory`
--
ALTER TABLE `p_scaffoldsubcatergory`
  ADD PRIMARY KEY (`scaffoldSubCateId`);

--
-- Indexes for table `p_scaffoldtype`
--
ALTER TABLE `p_scaffoldtype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_scaffoldworktype`
--
ALTER TABLE `p_scaffoldworktype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_users`
--
ALTER TABLE `p_users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `userName` (`userName`,`password`);

--
-- Indexes for table `p_workarrangement`
--
ALTER TABLE `p_workarrangement`
  ADD PRIMARY KEY (`workArrangementId`);

--
-- Indexes for table `p_workattendance`
--
ALTER TABLE `p_workattendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_workers`
--
ALTER TABLE `p_workers`
  ADD PRIMARY KEY (`workerId`);

--
-- Indexes for table `p_workerteam`
--
ALTER TABLE `p_workerteam`
  ADD PRIMARY KEY (`teamid`);

--
-- Indexes for table `p_workrequest`
--
ALTER TABLE `p_workrequest`
  ADD PRIMARY KEY (`workRequestId`);

--
-- Indexes for table `p_workrequestitems`
--
ALTER TABLE `p_workrequestitems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_workrequestmanpower`
--
ALTER TABLE `p_workrequestmanpower`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `p_workrequestsizebased`
--
ALTER TABLE `p_workrequestsizebased`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `p_clients`
--
ALTER TABLE `p_clients`
  MODIFY `clientId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `p_contracts`
--
ALTER TABLE `p_contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `p_dailyworktrack`
--
ALTER TABLE `p_dailyworktrack`
  MODIFY `worktrackId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `p_dailyworktrackmaterials`
--
ALTER TABLE `p_dailyworktrackmaterials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `p_dailyworktracksubdivision`
--
ALTER TABLE `p_dailyworktracksubdivision`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `p_dailyworktrackteams`
--
ALTER TABLE `p_dailyworktrackteams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `p_grade`
--
ALTER TABLE `p_grade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_productivityslab`
--
ALTER TABLE `p_productivityslab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_projects`
--
ALTER TABLE `p_projects`
  MODIFY `projectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `p_scaffoldsubcatergory`
--
ALTER TABLE `p_scaffoldsubcatergory`
  MODIFY `scaffoldSubCateId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_scaffoldtype`
--
ALTER TABLE `p_scaffoldtype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `p_scaffoldworktype`
--
ALTER TABLE `p_scaffoldworktype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `p_users`
--
ALTER TABLE `p_users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `p_workarrangement`
--
ALTER TABLE `p_workarrangement`
  MODIFY `workArrangementId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `p_workattendance`
--
ALTER TABLE `p_workattendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `p_workers`
--
ALTER TABLE `p_workers`
  MODIFY `workerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `p_workerteam`
--
ALTER TABLE `p_workerteam`
  MODIFY `teamid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `p_workrequest`
--
ALTER TABLE `p_workrequest`
  MODIFY `workRequestId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `p_workrequestitems`
--
ALTER TABLE `p_workrequestitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `p_workrequestmanpower`
--
ALTER TABLE `p_workrequestmanpower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `p_workrequestsizebased`
--
ALTER TABLE `p_workrequestsizebased`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
