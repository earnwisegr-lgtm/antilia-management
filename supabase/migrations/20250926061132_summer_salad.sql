/*
  # Initial Schema for Antilia Rent a Car

  1. New Tables
    - `users` - System users with roles
    - `customers` - Customer information
    - `vehicles` - Fleet management
    - `stations` - Pickup/return locations
    - `seasons` - Pricing seasons
    - `pricing` - Daily rates per category/season
    - `extras` - Additional services
    - `insurance_types` - Insurance options
    - `reservations` - Booking records
    - `reservation_extras` - Extras per reservation
    - `checkouts` - Vehicle checkout records
    - `checkins` - Vehicle checkin records
    - `damages` - Damage records
    - `payments` - Payment records
    - `photos` - Photo storage references

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('agent', 'manager', 'admin')),
  active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  country text NOT NULL,
  license_number text NOT NULL,
  birth_date date NOT NULL,
  notes text,
  source text NOT NULL CHECK (source IN ('walk-in', 'phone', 'instagram')) DEFAULT 'walk-in',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  category text NOT NULL CHECK (category IN ('A', 'B', 'C', 'SUV', '7-seater')),
  year integer NOT NULL,
  transmission text NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  fuel_type text NOT NULL CHECK (fuel_type IN ('petrol', 'diesel')),
  status text NOT NULL CHECK (status IN ('available', 'reserved', 'service')) DEFAULT 'available',
  insurance_expiry date,
  inspection_expiry date,
  last_service date,
  odometer integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_en text NOT NULL,
  address text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  multiplier decimal(3,2) NOT NULL DEFAULT 1.0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL CHECK (category IN ('A', 'B', 'C', 'SUV', '7-seater')),
  daily_rate decimal(8,2) NOT NULL,
  season_id uuid REFERENCES seasons(id),
  created_at timestamptz DEFAULT now()
);

-- Extras table
CREATE TABLE IF NOT EXISTS extras (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_en text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'one-time')),
  price decimal(8,2) NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insurance types table
CREATE TABLE IF NOT EXISTS insurance_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_en text NOT NULL,
  daily_rate decimal(8,2) NOT NULL,
  category text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  category text NOT NULL,
  pickup_date timestamptz NOT NULL,
  return_date timestamptz NOT NULL,
  pickup_station_id uuid REFERENCES stations(id) NOT NULL,
  return_station_id uuid REFERENCES stations(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
  daily_rate decimal(8,2) NOT NULL,
  insurance_type text NOT NULL DEFAULT 'basic',
  insurance_rate decimal(8,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_at timestamptz DEFAULT now()
);

-- Reservation extras table
CREATE TABLE IF NOT EXISTS reservation_extras (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  extra_id uuid REFERENCES extras(id),
  quantity integer NOT NULL DEFAULT 1,
  daily_rate decimal(8,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('checkout', 'checkin', 'damage', 'vehicle')),
  reference_id uuid NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Damages table
CREATE TABLE IF NOT EXISTS damages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  description text NOT NULL,
  estimated_cost decimal(8,2),
  photo_id uuid REFERENCES photos(id),
  created_at timestamptz DEFAULT now()
);

-- Checkouts table
CREATE TABLE IF NOT EXISTS checkouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id uuid REFERENCES reservations(id) NOT NULL,
  fuel_level integer NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
  odometer integer NOT NULL,
  accessories_given text[] DEFAULT '{}',
  damage_ids uuid[] DEFAULT '{}',
  checked_out_by uuid REFERENCES users(id),
  checked_out_at timestamptz DEFAULT now(),
  notes text
);

-- Checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id uuid REFERENCES reservations(id) NOT NULL,
  fuel_level integer NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
  odometer integer NOT NULL,
  new_damage_ids uuid[] DEFAULT '{}',
  additional_charges jsonb DEFAULT '[]',
  checked_in_by uuid REFERENCES users(id),
  checked_in_at timestamptz DEFAULT now(),
  notes text
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id uuid REFERENCES reservations(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  method text NOT NULL CHECK (method IN ('cash', 'card', 'transfer')),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Users can read all data" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage users" ON users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "All authenticated users can read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage customers" ON customers FOR ALL TO authenticated USING (true);

CREATE POLICY "All authenticated users can read vehicles" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers and admins can manage vehicles" ON vehicles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY "All authenticated users can read stations" ON stations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage stations" ON stations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "All authenticated users can read seasons" ON seasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers and admins can manage seasons" ON seasons FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY "All authenticated users can read pricing" ON pricing FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers and admins can manage pricing" ON pricing FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY "All authenticated users can read extras" ON extras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers and admins can manage extras" ON extras FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY "All authenticated users can read insurance_types" ON insurance_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers and admins can manage insurance_types" ON insurance_types FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);

CREATE POLICY "All authenticated users can manage reservations" ON reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage reservation_extras" ON reservation_extras FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage photos" ON photos FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage damages" ON damages FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage checkouts" ON checkouts FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage checkins" ON checkins FOR ALL TO authenticated USING (true);
CREATE POLICY "All authenticated users can manage payments" ON payments FOR ALL TO authenticated USING (true);