import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export default async function AdminPage(){
  if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/admin/login");}
  return <AdminDashboard/>;
}
