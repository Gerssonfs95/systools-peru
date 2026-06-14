export type Post = { id: string; title: string; slug: string; excerpt: string; content: string; image_url: string; category: string; published: boolean; created_at: string; };
export type System = { id: string; name: string; slug: string; description: string; version: string; image_url: string; download_url: string; category: string; published: boolean; created_at: string; };
export type Tool = { id: string; name: string; slug: string; description: string; icon: string; category: string; published: boolean; created_at: string; };
export type Download = { id: string; name: string; description: string; version: string; image_url: string; download_url: string; category: string; published: boolean; created_at: string; };
