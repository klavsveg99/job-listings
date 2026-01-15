import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nwomyemjcvfwsddnxvvx.supabase.co'
const supabaseKey = 'sb_publishable_y_RocvOWAW1e2Ly7gmBb4Q_W4O2kz1s'

export const supabase = createClient(supabaseUrl, supabaseKey)
