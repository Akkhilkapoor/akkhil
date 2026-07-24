const SUPABASE_URL = "अपना Project URL यहाँ डालो";

const SUPABASE_ANON_KEY = "अपनी Publishable Key यहाँ डालो";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
