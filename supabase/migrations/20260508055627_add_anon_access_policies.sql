/*
  # Add anon role access policies

  1. Problem
    - All existing RLS policies are restricted to the `authenticated` role
    - The app connects using the anon key (role = anon) without Supabase Auth
    - This causes all queries to return empty results / 403 Forbidden

  2. Fix
    - Add SELECT policies for `anon` role on read-heavy tables
    - Add full CRUD policies for `anon` role on tables the app manages
    - This allows the app to function with the anon key while RLS is still enabled

  3. Tables affected
    - customers: SELECT, INSERT, UPDATE, DELETE for anon
    - vehicles: SELECT, INSERT, UPDATE for anon
    - stations: SELECT for anon
    - seasons: SELECT for anon
    - pricing: SELECT for anon
    - extras: SELECT for anon
    - insurance_types: SELECT for anon
    - reservations: SELECT, INSERT, UPDATE, DELETE for anon
    - reservation_extras: SELECT, INSERT, UPDATE, DELETE for anon
    - checkouts: SELECT, INSERT for anon
    - checkins: SELECT, INSERT for anon
    - payments: SELECT, INSERT for anon
    - photos: SELECT, INSERT for anon
    - damages: SELECT, INSERT for anon
    - users: SELECT for anon
*/

-- Customers: full access for anon
CREATE POLICY "Anon can select customers"
  ON customers FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert customers"
  ON customers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update customers"
  ON customers FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete customers"
  ON customers FOR DELETE TO anon USING (true);

-- Vehicles: read + update for anon
CREATE POLICY "Anon can select vehicles"
  ON vehicles FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert vehicles"
  ON vehicles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update vehicles"
  ON vehicles FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Stations: read only for anon
CREATE POLICY "Anon can select stations"
  ON stations FOR SELECT TO anon USING (true);

-- Seasons: read only for anon
CREATE POLICY "Anon can select seasons"
  ON seasons FOR SELECT TO anon USING (true);

-- Pricing: read only for anon
CREATE POLICY "Anon can select pricing"
  ON pricing FOR SELECT TO anon USING (true);

-- Extras: read only for anon
CREATE POLICY "Anon can select extras"
  ON extras FOR SELECT TO anon USING (true);

-- Insurance types: read only for anon
CREATE POLICY "Anon can select insurance_types"
  ON insurance_types FOR SELECT TO anon USING (true);

-- Reservations: full access for anon
CREATE POLICY "Anon can select reservations"
  ON reservations FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert reservations"
  ON reservations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update reservations"
  ON reservations FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete reservations"
  ON reservations FOR DELETE TO anon USING (true);

-- Reservation extras: full access for anon
CREATE POLICY "Anon can select reservation_extras"
  ON reservation_extras FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert reservation_extras"
  ON reservation_extras FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update reservation_extras"
  ON reservation_extras FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can delete reservation_extras"
  ON reservation_extras FOR DELETE TO anon USING (true);

-- Checkouts: read + insert for anon
CREATE POLICY "Anon can select checkouts"
  ON checkouts FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert checkouts"
  ON checkouts FOR INSERT TO anon WITH CHECK (true);

-- Checkins: read + insert for anon
CREATE POLICY "Anon can select checkins"
  ON checkins FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert checkins"
  ON checkins FOR INSERT TO anon WITH CHECK (true);

-- Payments: read + insert for anon
CREATE POLICY "Anon can select payments"
  ON payments FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert payments"
  ON payments FOR INSERT TO anon WITH CHECK (true);

-- Photos: read + insert for anon
CREATE POLICY "Anon can select photos"
  ON photos FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert photos"
  ON photos FOR INSERT TO anon WITH CHECK (true);

-- Damages: read + insert for anon
CREATE POLICY "Anon can select damages"
  ON damages FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert damages"
  ON damages FOR INSERT TO anon WITH CHECK (true);

-- Users: read only for anon
CREATE POLICY "Anon can select users"
  ON users FOR SELECT TO anon USING (true);
