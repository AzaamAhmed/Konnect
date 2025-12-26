-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis";   -- For geo-location queries

-- Set timezone
SET timezone = 'Asia/Colombo';

-- Create custom types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('FOUNDER', 'DEVELOPER', 'STUDENT', 'MENTOR', 'INVESTOR', 'ADMIN');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_type') THEN
        CREATE TYPE post_type AS ENUM ('IDEA', 'TASK', 'REQUEST', 'MENTORSHIP', 'FUNDING');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funding_stage') THEN
        CREATE TYPE funding_stage AS ENUM ('IDEA', 'PROTOTYPE', 'MVP', 'EARLY', 'GROWTH', 'SCALE');
    END IF;
END $$;

-- Initial configuration
ALTER DATABASE konnect_db SET timezone TO 'Asia/Colombo';
