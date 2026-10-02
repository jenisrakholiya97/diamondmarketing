-- PostgreSQL Database Schema for Gigakelvin Diamonds Sourcing Platform
-- Database: diamond_marketing

-- Enable UUID extension if needed (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Diamonds Table (Stores loose certified lab-grown and natural diamonds)
CREATE TABLE IF NOT EXISTS diamonds (
  id VARCHAR(100) PRIMARY KEY,
  original_id VARCHAR(100),
  handle VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'diamond',
  product_type VARCHAR(100) DEFAULT 'diamond',
  natural_or_lab VARCHAR(50) DEFAULT 'Lab-grown',
  shape VARCHAR(50) NOT NULL,
  carat VARCHAR(50),
  carat_value NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
  color VARCHAR(20) DEFAULT 'D',
  color_tier VARCHAR(50) DEFAULT 'Near Colorless',
  clarity VARCHAR(20) DEFAULT 'VVS1',
  clarity_tier VARCHAR(50) DEFAULT 'Very Very Slightly Included',
  cut VARCHAR(50) DEFAULT 'Ideal',
  cert VARCHAR(100) DEFAULT 'IGI Certified',
  cert_number VARCHAR(100),
  cert_url TEXT,
  dimensions VARCHAR(100),
  depth VARCHAR(20) DEFAULT '62.0%',
  table_pct VARCHAR(20) DEFAULT '57.0%',
  polish VARCHAR(50) DEFAULT 'Excellent',
  symmetry VARCHAR(50) DEFAULT 'Excellent',
  fluorescence VARCHAR(50) DEFAULT 'None',
  ratio VARCHAR(20) DEFAULT '1.00',
  price VARCHAR(50),
  price_value NUMERIC(12, 2) NOT NULL DEFAULT 1000.00,
  is_triple_excellent BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  video TEXT,
  video_poster TEXT,
  is_custom_added BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance filtering on diamonds
CREATE INDEX IF NOT EXISTS idx_diamonds_shape ON diamonds (shape);
CREATE INDEX IF NOT EXISTS idx_diamonds_carat ON diamonds (carat_value);
CREATE INDEX IF NOT EXISTS idx_diamonds_color ON diamonds (color);
CREATE INDEX IF NOT EXISTS idx_diamonds_clarity ON diamonds (clarity);
CREATE INDEX IF NOT EXISTS idx_diamonds_price ON diamonds (price_value);
CREATE INDEX IF NOT EXISTS idx_diamonds_custom ON diamonds (is_custom_added);
CREATE INDEX IF NOT EXISTS idx_diamonds_triple_ex ON diamonds (is_triple_excellent);

-- 2. B2B Quotation Requests Table
CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(100) PRIMARY KEY,
  category VARCHAR(100) DEFAULT 'Lab-grown',
  specs TEXT,
  full_name VARCHAR(150),
  company_name VARCHAR(150),
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  target_budget VARCHAR(100),
  order_timeframe VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes (email);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes (created_at DESC);

-- 3. Customer Reviews & Testimonials Table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(100) PRIMARY KEY,
  author_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(150),
  country VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  review_text TEXT NOT NULL,
  verified_purchaser BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
