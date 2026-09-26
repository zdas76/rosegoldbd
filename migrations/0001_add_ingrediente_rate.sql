-- Migration: Add ingredienteRate to raw_materials
ALTER TABLE `raw_materials` ADD COLUMN `ingredienteRate` DOUBLE NULL;
