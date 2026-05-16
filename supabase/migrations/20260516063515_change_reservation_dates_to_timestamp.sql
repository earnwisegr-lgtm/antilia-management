/*
  # Change reservation dates from timestamptz to timestamp

  1. Modified Tables
    - `reservations`
      - `pickup_date` changed from `timestamptz` to `timestamp` (no timezone)
      - `return_date` changed from `timestamptz` to `timestamp` (no timezone)

  2. Reason
    - Pickup and return times are local business times (Greece)
    - Using timestamptz causes +3 hour shifts when saving/reading
    - timestamp without time zone stores and returns the exact value entered

  3. Important Notes
    - Existing data is preserved (values are cast from timestamptz to timestamp)
    - No data loss occurs during this conversion
*/

ALTER TABLE reservations
  ALTER COLUMN pickup_date TYPE timestamp WITHOUT TIME ZONE,
  ALTER COLUMN return_date TYPE timestamp WITHOUT TIME ZONE;
