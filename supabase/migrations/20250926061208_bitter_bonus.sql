/*
  # Seed Data for Antilia Rent a Car

  1. Initial Data
    - Default stations
    - Seasons
    - Base pricing
    - Extras and insurance types
    - Sample vehicles
    - Demo user
*/

-- Insert default stations
INSERT INTO stations (name, name_en, address) VALUES
  ('Πλατανιάς', 'Platanias', 'Πλατανιάς, Χανιά, Κρήτη'),
  ('Αγία Μαρίνα', 'Agia Marina', 'Αγία Μαρίνα, Χανιά, Κρήτη'),
  ('Αεροδρόμιο', 'Airport', 'Αεροδρόμιο Χανίων "Ιωάννης Δασκαλογιάννης"');

-- Insert seasons
INSERT INTO seasons (name, start_date, end_date, multiplier) VALUES
  ('Low Season', '2024-11-01', '2025-03-31', 1.0),
  ('Mid Season', '2025-04-01', '2025-05-31', 1.3),
  ('High Season', '2025-06-01', '2025-09-30', 1.8),
  ('Peak Season', '2025-07-01', '2025-08-31', 2.0);

-- Insert base pricing (Low Season rates)
INSERT INTO pricing (category, daily_rate, season_id) 
SELECT category, daily_rate, (SELECT id FROM seasons WHERE name = 'Low Season')
FROM (VALUES 
  ('A', 25.00),
  ('B', 35.00),
  ('C', 45.00),
  ('SUV', 65.00),
  ('7-seater', 85.00)
) AS rates(category, daily_rate);

-- Insert extras
INSERT INTO extras (name, name_en, type, price) VALUES
  ('Παιδικό Κάθισμα', 'Child Seat', 'daily', 5.00),
  ('Δεύτερος Οδηγός', 'Additional Driver', 'one-time', 25.00),
  ('GPS Πλοήγηση', 'GPS Navigation', 'daily', 8.00),
  ('Φορτιστής Κινητού', 'Phone Charger', 'daily', 3.00),
  ('Αλυσίδες Χιονιού', 'Snow Chains', 'one-time', 15.00),
  ('Wifi Hotspot', 'Wifi Hotspot', 'daily', 6.00);

-- Insert insurance types
INSERT INTO insurance_types (name, name_en, daily_rate) VALUES
  ('Βασική Ασφάλεια', 'Basic Insurance', 0.00),
  ('Πλήρης Ασφάλεια', 'Full Insurance', 15.00),
  ('Premium Ασφάλεια', 'Premium Insurance', 25.00);

-- Insert sample vehicles
INSERT INTO vehicles (plate, brand, model, category, year, transmission, fuel_type, insurance_expiry, inspection_expiry, last_service) VALUES
  ('XAN-1001', 'Toyota', 'Aygo', 'A', 2023, 'manual', 'petrol', '2025-06-15', '2025-03-20', '2024-12-01'),
  ('XAN-1002', 'Peugeot', '108', 'A', 2022, 'manual', 'petrol', '2025-07-10', '2025-04-15', '2024-11-20'),
  ('XAN-2001', 'Nissan', 'Micra', 'B', 2023, 'automatic', 'petrol', '2025-08-20', '2025-05-10', '2024-12-15'),
  ('XAN-2002', 'Ford', 'Fiesta', 'B', 2022, 'manual', 'petrol', '2025-05-30', '2025-02-28', '2024-10-30'),
  ('XAN-3001', 'Volkswagen', 'Golf', 'C', 2023, 'automatic', 'petrol', '2025-09-15', '2025-06-20', '2025-01-10'),
  ('XAN-3002', 'Toyota', 'Corolla', 'C', 2023, 'automatic', 'petrol', '2025-07-25', '2025-04-30', '2024-12-20'),
  ('XAN-4001', 'Nissan', 'Qashqai', 'SUV', 2023, 'automatic', 'petrol', '2025-10-10', '2025-07-15', '2025-01-05'),
  ('XAN-4002', 'Peugeot', '3008', 'SUV', 2022, 'automatic', 'diesel', '2025-06-30', '2025-03-25', '2024-11-15'),
  ('XAN-5001', 'Ford', 'Galaxy', '7-seater', 2023, 'automatic', 'diesel', '2025-08-05', '2025-05-20', '2024-12-30'),
  ('XAN-5002', 'Volkswagen', 'Touran', '7-seater', 2022, 'automatic', 'petrol', '2025-09-20', '2025-06-10', '2024-11-25');

-- Insert demo admin user (password will be handled by Supabase Auth)
INSERT INTO users (email, name, role) VALUES
  ('admin@antilia.com', 'Διαχειριστής Συστήματος', 'admin'),
  ('manager@antilia.com', 'Μάνατζερ Καταστήματος', 'manager'),
  ('agent@antilia.com', 'Πράκτορας Πωλήσεων', 'agent');