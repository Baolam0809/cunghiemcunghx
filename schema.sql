-- ====================================================================
-- SQL SCHEMA FOR GIA PHẢ HỌ NGHIÊM HÒA XÁ
-- Copy and run this script in your Supabase SQL Editor to set up tables.
-- Project: https://opejoygxoyxezxjtzrxm.supabase.co
-- ====================================================================

-- 1. Create Members Table
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Nam', 'Nữ')),
    generation INTEGER NOT NULL,
    branch TEXT NOT NULL,
    spouse TEXT,
    "parentId" TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    "motherId" TEXT,
    status TEXT NOT NULL CHECK (status IN ('Còn sống', 'Đã mất', 'Mất sớm (Phạp)')),
    note TEXT,
    dob TEXT,
    birthplace TEXT,
    job TEXT,
    education TEXT,
    phone TEXT,
    relation TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Tributes Table
CREATE TABLE IF NOT EXISTS public.tributes (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    time TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) and allow full public read/write.
-- (This makes it very easy to develop and ensures no authorization blocking).
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;

-- Indexing for high-performance queries
CREATE INDEX IF NOT EXISTS idx_members_generation ON public.members(generation);
CREATE INDEX IF NOT EXISTS idx_members_parent ON public.members("parentId");
CREATE INDEX IF NOT EXISTS idx_tributes_created ON public.tributes(created_at DESC);
