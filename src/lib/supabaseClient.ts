import { createClient } from '@supabase/supabase-js';
import { PUBLIC_URL, PUBLIC_API_KEY } from '$env/static/public';

const supabase = createClient(
    PUBLIC_URL,
    PUBLIC_API_KEY
)

export default supabase