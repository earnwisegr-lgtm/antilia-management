/*
  # Add 'inactive' to vehicle status options

  1. Changes
    - Drop existing `vehicles_status_check` constraint
    - Add new constraint allowing: 'available', 'reserved', 'rented', 'service', 'inactive'

  2. Notes
    - 'inactive' status is used for deactivated vehicles that should not appear in bookings
    - Inactive vehicles remain in the database for historical reservation/contract records
    - Reactivation sets status back to 'available'
*/

ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;

ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check
  CHECK (status = ANY (ARRAY['available', 'reserved', 'rented', 'service', 'inactive']));
