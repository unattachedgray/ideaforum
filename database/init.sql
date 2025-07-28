-- Initialize PostgreSQL database for Idea Forum
-- This file is run when the PostgreSQL container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the main database if it doesn't exist
-- (This is handled by the POSTGRES_DB environment variable in docker-compose)

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance on JSONB columns
-- These will be created by the migrations, but we can prepare the database

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Idea Forum database initialized successfully';
END $$;
