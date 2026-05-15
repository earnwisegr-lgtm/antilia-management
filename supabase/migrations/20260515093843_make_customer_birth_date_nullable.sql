/*
  # Make customer birth_date nullable

  1. Changes
    - ALTER `customers.birth_date` to allow NULL values
    - ALTER `customers.country` to allow NULL values  
    - ALTER `customers.license_number` to allow NULL values

  2. Notes
    - Booking flow does not always collect these fields
    - Existing data remains unchanged
    - These fields are still collected when available but not blocking reservation creation
*/

ALTER TABLE customers ALTER COLUMN birth_date DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN country DROP NOT NULL;
ALTER TABLE customers ALTER COLUMN license_number DROP NOT NULL;
