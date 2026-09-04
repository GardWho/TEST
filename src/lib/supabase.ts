import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Client Supabase unique pour toute l'application
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);