/*
  # Update customers source check constraint

  1. Changes
    - Drop existing `customers_source_check` constraint that only allows 'walk-in', 'phone', 'instagram'
    - Add new constraint allowing: 'store', 'phone', 'instagram', 'whatsapp', 'website', 'repeat', 'other', 'walk-in'
    - Update default value from 'walk-in' to 'store'
    - Migrate existing 'walk-in' values to 'store'

  2. Notes
    - Keeps 'walk-in' as an allowed value for backward compatibility with existing rows
    - New bookings will default to 'store'
*/

ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_source_check;

ALTER TABLE customers ADD CONSTRAINT customers_source_check
  CHECK (source = ANY (ARRAY['store', 'phone', 'instagram', 'whatsapp', 'website', 'repeat', 'other', 'walk-in']));

ALTER TABLE customers ALTER COLUMN source SET DEFAULT 'store';
