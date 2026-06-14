"use client";

import { Download, FileText, LogOut, MonitorCog, Plus, Save, Trash2, Upload, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TableName = "posts" | "systems" | "tools" | "downloads";
type Row = Record<string, string | boolean | null>;
const configs: Record<TableName,{label:string;icon:typeof FileText;fields:string[]}> = {
  posts:{label:"Artículos",icon:FileText,fields:["title","slug","excerpt","content","image_url","category","published"]},
  systems:{label:"Sistemas",icon:MonitorCog,fields:["name","slug","description","version","image_url","download_url","category","published"]},
  tools:{label:"Herramientas",icon:Wrench,fields:["name","slug","description","icon","category","published"]},
  downloads:{label:"Descargas",icon:Download,fields:["name","description","version","image_url","download_url","category","published"]},
};
const labels:Record<string,string>={title:"Título",name:"Nombre",slug:"Slug",excerpt:"Extracto",content:"Contenido",description:"Descripción",image_url:"URL de imagen",category:"Categoría",version:"Versión",download_url:"URL de descarga externa",icon:"Icono",published:"Publicado"};
const emptyFor=(table:TableName)=>Object.fromEntries(configs[table].fields.map(f=>[f,f==="published"?false:""])) as Row;

export function AdminDashboard(){
  const [table,setTable]=useState<TableName>("posts"); const [rows,setRows]=useState<Row[]>([]); const [editing,setEditing]=useState<Row|null>(null); const [message,setMessage]=useState(""); const supabase=useMemo(()=>createClient(),[]);
  async function load(){const {data,error}=await supabase.from(table).select("*").order("created_at",{ascending:false});setRows((data as Row[])||[]);if(error)setMessage(error.message);}
  useEffect(()=>{setEditing(null);void load();},[table]);
  async function save(e:React.FormEvent){e.preventDefault();if(!editing)return;setMessage("Guardando...");const {id,created_at,...payload}=editing;const result=id?await supabase.from(table).update(payload).eq("id",id):await supabase.from(table).insert(payload);setMessage(result.error?result.error.message:"Guardado correctamente");if(!result.error){setEditing(null);await load();}}
  async function remove(id:string){if(!confirm("¿Eliminar este elemento?"))return;const {error}=await supabase.from(table).delete().eq("id",id);setMessage(error?error.message:"Elemento eliminado");await load();}
  async function upload(file:File){setMessage("Subiendo imagen...");const path=`${table}/${Date.now()}-${file.name.replace(/\s/g,"-")}`;const {error}=await supabase.storage.from("images").upload(path,file);if(error)return setMessage(error.message);const {data}=supabase.storage.from("images").getPublicUrl(path);setEditing(prev=>prev?{...prev,image_url:data.publicUrl}:prev);setMessage("Imagen subida");}
  async function logout(){await supabase.auth.signOut();window.location.href="/admin/login";}
  return <section className="container-page py-12"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="text-xs font-black uppercase tracking-[.2em] text-[#62d6ff]">Administración</span><h1 className="mt-2 text-4xl font-black">Gestión de contenido</h1></div><button onClick={logout} className="btn-secondary"><LogOut size={17}/> Salir</button></div>
    <div className="mb-7 flex flex-wrap gap-2">{(Object.keys(configs) as TableName[]).map(key=>{const Icon=configs[key].icon;return <button key={key} onClick={()=>setTable(key)} className={table===key?"btn-primary":"btn-secondary"}><Icon size={16}/>{configs[key].label}</button>})}</div>
    <div className="mb-5 flex items-center justify-between"><p className="text-sm text-[#91a0b5]">{rows.length} elementos</p><button onClick={()=>setEditing(emptyFor(table))} className="btn-primary"><Plus size={17}/> Crear nuevo</button></div>
    {message&&<p className="mb-5 rounded-xl border border-[#16a8ff]/20 bg-[#16a8ff]/5 px-4 py-3 text-sm text-[#b5dfff]">{message}</p>}
    <div className="grid gap-3">{rows.map(row=><article key={String(row.id)} className="card flex flex-wrap items-center justify-between gap-4 p-4"><div><h2 className="font-black">{String(row.title||row.name)}</h2><p className="mt-1 text-xs text-[#7f8da3]">{String(row.category||"Sin categoría")} · {row.published?"Publicado":"Borrador"}</p></div><div className="flex gap-2"><button onClick={()=>setEditing(row)} className="btn-secondary text-sm">Editar</button><button onClick={()=>remove(String(row.id))} className="btn-secondary text-sm text-red-300"><Trash2 size={16}/></button></div></article>)}</div>
    {editing&&<div className="fixed inset-0 z-[60] overflow-y-auto bg-[#02050b]/90 p-4 backdrop-blur-sm"><form onSubmit={save} className="card mx-auto my-8 max-w-2xl p-6 md:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-black">{editing.id?"Editar":"Crear"} {configs[table].label.toLowerCase()}</h2><button type="button" onClick={()=>setEditing(null)}><X/></button></div><div className="grid gap-5">{configs[table].fields.map(field=>field==="published"?<label key={field} className="flex items-center gap-3 font-bold"><input type="checkbox" checked={Boolean(editing[field])} onChange={e=>setEditing({...editing,[field]:e.target.checked})}/>{labels[field]}</label>:<div key={field}><label className="label">{labels[field]}</label>{["content","description","excerpt"].includes(field)?<textarea className="input min-h-24" value={String(editing[field]||"")} onChange={e=>setEditing({...editing,[field]:e.target.value})}/>:<input className="input" value={String(editing[field]||"")} onChange={e=>setEditing({...editing,[field]:e.target.value})}/>} {field==="image_url"&&<label className="btn-secondary mt-2 cursor-pointer text-sm"><Upload size={16}/> Subir imagen<input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/></label>}</div>)}</div><button className="btn-primary mt-7"><Save size={17}/> Guardar cambios</button></form></div>}
  </section>;
}
