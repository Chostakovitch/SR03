-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema SR03Projet
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `SR03Projet` ;

-- -----------------------------------------------------
-- Schema SR03Projet
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SR03Projet` DEFAULT CHARACTER SET latin1 ;
USE `SR03Projet` ;

-- -----------------------------------------------------
-- Table `SR03Projet`.`branche`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`branche` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`branche` (
  `abreviation` VARCHAR(5) NOT NULL,
  `nom` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`abreviation`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`jour`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`jour` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`jour` (
  `nom` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`nom`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`salle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`salle` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`salle` (
  `nom` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`nom`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`uv`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`uv` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`uv` (
  `nom` CHAR(4) NOT NULL,
  `description` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`nom`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`edt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`edt` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`edt` (
  `salle` VARCHAR(6) NOT NULL,
  `heure_debut` TIME NOT NULL,
  `jour` VARCHAR(10) NOT NULL,
  `uv` CHAR(4) NOT NULL,
  `type` ENUM('CM', 'TD', 'TP') NOT NULL,
  `duree` INT(11) NOT NULL,
  PRIMARY KEY (`salle`, `heure_debut`, `jour`(1)),
  INDEX `salle_idx` (`salle` ASC),
  INDEX `uv` (`uv` ASC),
  INDEX `jour` (`jour` ASC),
  INDEX `fk` (`salle` ASC, `heure_debut` ASC, `jour` ASC),
  CONSTRAINT `jour`
    FOREIGN KEY (`jour`)
    REFERENCES `SR03Projet`.`jour` (`nom`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `salle`
    FOREIGN KEY (`salle`)
    REFERENCES `SR03Projet`.`salle` (`nom`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `uv`
    FOREIGN KEY (`uv`)
    REFERENCES `SR03Projet`.`uv` (`nom`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`etudiant`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`etudiant` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`etudiant` (
  `mail` VARCHAR(45) NOT NULL,
  `prenom` VARCHAR(45) NULL DEFAULT NULL,
  `nom` VARCHAR(45) NULL DEFAULT NULL,
  `branche` VARCHAR(5) NULL DEFAULT NULL,
  PRIMARY KEY (`mail`),
  INDEX `fk_branche_idx` (`branche` ASC),
  CONSTRAINT `fk_branche`
    FOREIGN KEY (`branche`)
    REFERENCES `SR03Projet`.`branche` (`abreviation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `SR03Projet`.`inscription`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SR03Projet`.`inscription` ;

CREATE TABLE IF NOT EXISTS `SR03Projet`.`inscription` (
  `mail` VARCHAR(45) NOT NULL,
  `salle` VARCHAR(6) NOT NULL,
  `heure_debut` TIME NOT NULL,
  `jour` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`mail`, `salle`, `heure_debut`, `jour`),
  INDEX `edt_idx` (`salle` ASC, `heure_debut` ASC, `jour` ASC),
  CONSTRAINT `edt`
    FOREIGN KEY (`salle` , `heure_debut` , `jour`)
    REFERENCES `SR03Projet`.`edt` (`salle` , `heure_debut` , `jour`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `email`
    FOREIGN KEY (`mail`)
    REFERENCES `SR03Projet`.`etudiant` (`mail`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
