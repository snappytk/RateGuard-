
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zjxjkwptpgfefltdynxd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yAogL7wRTV3wjTPI8WHDJA_SLSTdP_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
