import {createClient} from "@supabase/supabase-js"; import {serverEnv} from "@/lib/env"; import type {Database} from "./database";
export function adminSupabase(){const {url,secret}=serverEnv();return createClient<Database>(url,secret,{auth:{persistSession:false,autoRefreshToken:false}})}
