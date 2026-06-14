import { demoDownloads, demoPosts, demoSystems, demoTools } from "./demo-data";
import { createClient } from "./supabase/server";
import type { Download, Post, System, Tool } from "./types";

const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function list<T>(table: string, fallback: T[]): Promise<T[]> {
  if (!configured()) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from(table).select("*").eq("published", true).order("created_at", { ascending: false });
    return error ? fallback : (data as T[]);
  } catch { return fallback; }
}

export const getPosts = () => list<Post>("posts", demoPosts);
export const getSystems = () => list<System>("systems", demoSystems);
export const getTools = () => list<Tool>("tools", demoTools);
export const getDownloads = () => list<Download>("downloads", demoDownloads);
export async function getPost(slug: string) {
  if (configured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single();
      if (data) return data as Post;
    } catch {}
  }
  return demoPosts.find((post) => post.slug === slug) ?? null;
}
