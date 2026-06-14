"use client";

import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState("");
  async function login(e:React.FormEvent){e.preventDefault();setMessage("Ingresando...");try{const {error}=await createClient().auth.signInWithPassword({email,password});if(error)throw error;window.location.href="/admin";}catch(err){setMessage(err instanceof Error?err.message:"No se pudo iniciar sesión");}}
  return <section className="container-page grid min-h-[70vh] place-items-center py-16"><form onSubmit={login} className="card w-full max-w-md p-8"><div className="grid size-12 place-items-center rounded-xl bg-[#16a8ff]/10 text-[#62d6ff]"><LockKeyhole/></div><h1 className="mt-5 text-3xl font-black">Panel administrador</h1><p className="mt-2 text-sm leading-6 text-[#91a0b4]">Ingresa con un usuario creado en Supabase Auth.</p><div className="mt-7"><label className="label">Correo</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="mt-4"><label className="label">Contraseña</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div><button className="btn-primary mt-6 w-full">Ingresar</button>{message&&<p className="mt-4 text-center text-sm text-[#9eacc0]">{message}</p>}</form></section>;
}
