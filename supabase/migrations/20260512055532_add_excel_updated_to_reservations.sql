/*
  # Add excel_updated field to reservations

  1. Modified Tables
    - `reservations`
      - Added `excel_updated` (boolean, default false)
        Tracks whether the reservation has been synced to the shared Excel planning sheet

  2. Notes
    - Lightweight operational tracking field
    - Does not affect booking flow or pricing
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'excel_updated'
  ) THEN
    ALTER TABLE reservations ADD COLUMN excel_updated boolean DEFAULT false;
  END IF;
END $$;
