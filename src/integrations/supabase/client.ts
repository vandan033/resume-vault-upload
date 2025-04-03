
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://njqpkycdfmpgzyhdepst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcXBreWNkZm1wZ3p5aGRlcHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTQ5MjksImV4cCI6MjA1OTIzMDkyOX0.3lH3Mz4d1oHX9VgdqdCPwTZyOrFitWYANyyl0Fq4SlI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
