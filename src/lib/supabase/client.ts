import {createClient,type SupabaseClient} from "@supabase/supabase-js"; import {publicEnv} from "@/lib/env"; import type {Database} from "./database";
let instance:SupabaseClient<Database>|undefined;
export function browserSupabase(){if(!instance){const {url,key}=publicEnv();instance=createClient<Database>(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}return instance}
