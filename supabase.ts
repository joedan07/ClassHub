import { createClient } from '@supabase/supabase-js';

// 1. Your Project URL (https://xxxx.supabase.co)
const supabaseUrl = 'https://xjfurzusdfbfkkrlukff.supabase.co';

// 2. Your PUBLISHABLE key (Starts with sb_publishable_...)
const supabaseAnonKey = 'sb_publishable_672L6XJJkn_EpMSrOCJFWw_ZfLY9G03';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);