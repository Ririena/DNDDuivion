import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pmehdovnchbhfeyplyxt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWhkb3ZuY2hiaGZleXBseXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcyNTUwNTYsImV4cCI6MjAzMjgzMTA1Nn0.zqArFQz4ni0z0WhPV3HlzEj5PCD_8cpP7RHTycD5yPk",
  {}
)
