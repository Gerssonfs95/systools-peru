import type { Download, Post, System, Tool } from "./types";

const date = "2026-05-20T12:00:00Z";
export const demoSystems: System[] = [
  { id:"s1", name:"Sistema de Inventario", slug:"sistema-inventario", description:"Control ágil de productos, movimientos y reportes para pequeños negocios.", version:"2.4", image_url:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Negocios", published:true, created_at:date },
  { id:"s2", name:"Gestor de Ventas", slug:"gestor-ventas", description:"Una solución clara para registrar ventas y tomar mejores decisiones.", version:"1.8", image_url:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Sistemas", published:true, created_at:date },
  { id:"s3", name:"Panel de Redes", slug:"panel-redes", description:"Monitoreo centralizado y visual para tu infraestructura tecnológica.", version:"1.2", image_url:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Redes", published:true, created_at:date },
];
export const demoTools: Tool[] = [
  { id:"t1", name:"Calculadora de subredes", slug:"calculadora-subredes", description:"Planifica redes IPv4 de forma sencilla.", icon:"Network", category:"Redes", published:true, created_at:date },
  { id:"t2", name:"Generador de contraseñas", slug:"generador-contrasenas", description:"Crea contraseñas seguras y personalizadas.", icon:"KeyRound", category:"Seguridad", published:true, created_at:date },
  { id:"t3", name:"Calculadora de IGV", slug:"calculadora-igv", description:"Calcula montos e IGV para tus operaciones.", icon:"Calculator", category:"Negocios", published:true, created_at:date },
  { id:"t4", name:"Conversor digital", slug:"conversor-digital", description:"Convierte unidades de almacenamiento.", icon:"RefreshCw", category:"Utilidades", published:true, created_at:date },
];
export const demoDownloads: Download[] = [
  { id:"d1", name:"Kit de utilidades Windows", description:"Selección de herramientas esenciales para soporte técnico.", version:"2026.1", image_url:"https://images.unsplash.com/photo-1624571409108-e9a41746af53?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Utilidades", published:true, created_at:date },
  { id:"d2", name:"Pack de recursos gaming", description:"Recursos optimizados para mejorar tu experiencia.", version:"3.0", image_url:"https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Gaming", published:true, created_at:date },
  { id:"d3", name:"Plantillas para negocios", description:"Documentos y hojas de trabajo listas para usar.", version:"1.5", image_url:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80", download_url:"#", category:"Negocios", published:true, created_at:date },
];
export const demoPosts: Post[] = [
  { id:"p1", title:"Cómo proteger tus datos en 2026", slug:"como-proteger-tus-datos", excerpt:"Buenas prácticas simples para navegar, trabajar y comprar con mayor seguridad.", content:"La seguridad digital empieza con hábitos claros. Usa contraseñas únicas, activa la autenticación en dos pasos y mantén tus equipos actualizados.\n\nTambién es importante revisar periódicamente los permisos de tus aplicaciones y contar con copias de seguridad.", image_url:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80", category:"Seguridad", published:true, created_at:date },
  { id:"p2", title:"Tecnología para impulsar pequeños negocios", slug:"tecnologia-pequenos-negocios", excerpt:"Cinco formas prácticas de digitalizar procesos sin complicaciones.", content:"Digitalizar no significa cambiarlo todo de una vez. Empieza por el proceso que más tiempo consume y mide el resultado.\n\nLas herramientas adecuadas permiten ordenar información y atender mejor a tus clientes.", image_url:"https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80", category:"Negocios", published:true, created_at:date },
  { id:"p3", title:"Guía rápida para mejorar tu red WiFi", slug:"mejorar-red-wifi", excerpt:"Consejos para conseguir mejor cobertura, estabilidad y velocidad en casa.", content:"La ubicación del router tiene un gran impacto. Colócalo en una zona central, elevada y libre de obstáculos.\n\nRevisa además los canales disponibles y mantén actualizado el firmware.", image_url:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80", category:"Redes", published:true, created_at:date },
];
