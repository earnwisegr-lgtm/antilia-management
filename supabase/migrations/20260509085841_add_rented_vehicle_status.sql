/*
  # Add 'rented' to vehicle status options

  1. Changes
    - Drop existing `vehicles_status_check` constraint
    - Add new constraint allowing: 'available', 'reserved', 'rented', 'service'
  
  2. Notes
    - 'rented' status is used when a vehicle is checked out on an active rental
    - Vehicle returns to 'available' on check-in
*/

ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;

ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check
  CHECK (status = ANY (ARRAY['available', 'reserved', 'rented', 'service']));
