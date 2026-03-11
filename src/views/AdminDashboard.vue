<template>
     <div class="admin-page">
          <nav class="top-nav">
               <div class="nav-container">
                    <h2 class="brand">Admin Panel</h2>
                    <div class="nav-actions">
                         <router-link to="/">Volver al Portal</router-link>
                         <button @click="logout" class="btn-text">Cerrar Sesión</button>
                    </div>
               </div>
          </nav>

          <main class="container">
               <div class="header">
                    <h1>Gestión de Noticias</h1>
               </div>

               <div class="admin-grid">
                    <section class="editor">
                         <div class="section-title">{{ editId ? "Editar Noticia" : "Nueva Noticia" }}</div>
                         <div class="form">
                              <div class="field">
                                   <label>Título</label>
                                   <input v-model="form.titulo" type="text" />
                              </div>
                              <div class="field">
                                   <label>Contenido</label>
                                   <textarea v-model="form.contenido" rows="8"></textarea>
                              </div>
                              <div class="field">
                                   <label>Imagen</label>
                                   <input type="file" @change="uploadImage" accept="image/*" />
                                   <div v-if="uploading" class="status">Subiendo imagen...</div>
                                   <div v-if="form.imagen_url" class="preview">
                                        <img :src="form.imagen_url" alt="Vista previa" />
                                   </div>
                              </div>
                              <div class="actions">
                                   <button @click="saveNoticia" :disabled="uploading" class="btn-black">
                                        {{ editId ? "Actualizar" : "Guardar" }}
                                   </button>
                                   <button v-if="editId" @click="resetForm" class="btn-outline">Cancelar</button>
                              </div>
                         </div>
                    </section>

                    <section class="inventory">
                         <div class="section-title">Publicadas</div>
                         <div class="list">
                              <div v-if="noticias.length === 0" class="empty">No hay noticias.</div>
                              <div v-for="n in noticias" :key="n.id" class="item">
                                   <div class="item-info">
                                        <h3>{{ n.titulo }}</h3>
                                        <span>{{ new Date(n.created_at).toLocaleDateString() }}</span>
                                   </div>
                                   <div class="item-actions">
                                        <button @click="edit(n)" class="btn-small">Editar</button>
                                        <button @click="deleteNoticia(n.id)" class="btn-small btn-del">Borrar</button>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          </main>
     </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter();
const noticias = ref([]);
const uploading = ref(false);
const editId = ref(null);
const form = ref({ titulo: "", contenido: "", imagen_url: "" });

const fetchNoticias = async () => {
     const { data } = await supabase
          .from("noticias")
          .select("*")
          .order("created_at", { ascending: false });
     noticias.value = data || [];
};

const uploadImage = async (e) => {
     const file = e.target.files[0];
     if (!file) return;

     uploading.value = true;
     const fileName = `${Date.now()}_${file.name}`;

     const { error } = await supabase.storage
          .from("noticias-bucket")
          .upload(fileName, file);

     if (error) {
          alert("Error: " + error.message);
     } else {
          const { data: urlData } = supabase.storage
               .from("noticias-bucket")
               .getPublicUrl(fileName);
          form.value.imagen_url = urlData.publicUrl;
     }
     uploading.value = false;
};

const saveNoticia = async () => {
     if (!form.value.titulo || !form.value.contenido) return;

     if (editId.value) {
          await supabase.from("noticias").update(form.value).eq("id", editId.value);
     } else {
          await supabase.from("noticias").insert([form.value]);
     }
     resetForm();
     fetchNoticias();
};

const deleteNoticia = async (id) => {
     if (confirm("Borrar noticia?")) {
          await supabase.from("noticias").delete().eq("id", id);
          fetchNoticias();
     }
};

const edit = (n) => {
     form.value = { ...n };
     editId.value = n.id;
     window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
     form.value = { titulo: "", contenido: "", imagen_url: "" };
     editId.value = null;
};

const logout = async () => {
     await supabase.auth.signOut();
     router.push("/");
};

onMounted(fetchNoticias);
</script>

<style scoped>
.admin-page {
     background: #fcfcfc;
     min-height: 100vh;
     color: #1a1a1a;
     font-family: ui-sans-serif, system-ui, sans-serif;
}

.top-nav {
     border-bottom: 1px solid #eee;
     background: white;
     padding: 0 20px;
}

.nav-container {
     max-width: 1000px;
     margin: 0 auto;
     height: 60px;
     display: flex;
     justify-content: space-between;
     align-items: center;
}

.brand {
     font-size: 1rem;
     font-weight: 600;
     margin: 0;
}

.nav-actions {
     display: flex;
     gap: 20px;
     align-items: center;
     font-size: 0.9rem;
}

.btn-text {
     background: none;
     padding: 0;
     color: #666;
     font-weight: normal;
}

.container {
     max-width: 1000px;
     margin: 0 auto;
     padding: 40px 20px;
}

.header h1 {
     font-size: 1.5rem;
     font-weight: 600;
     margin-bottom: 30px;
}

.admin-grid {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 60px;
}

.section-title {
     font-size: 0.8rem;
     font-weight: 700;
     text-transform: uppercase;
     color: #999;
     margin-bottom: 20px;
     letter-spacing: 0.05em;
}

.field {
     margin-bottom: 20px;
}

.field label {
     display: block;
     font-size: 0.9rem;
     margin-bottom: 6px;
}

input[type="text"],
textarea {
     width: 100%;
     border: 1px solid #ddd;
     border-radius: 4px;
     padding: 10px;
     font-size: 0.95rem;
}

.preview {
     margin-top: 10px;
     width: 100%;
     aspect-ratio: 16/9;
     background: #f0f0f0;
     border-radius: 4px;
     overflow: hidden;
}

.preview img {
     width: 100%;
     height: 100%;
     object-fit: cover;
}

.actions {
     display: flex;
     gap: 12px;
     margin-top: 30px;
}

.btn-black {
     background: #1a1a1a;
     color: white;
     padding: 10px 24px;
     border-radius: 4px;
}

.btn-outline {
     background: white;
     border: 1px solid #ddd;
     padding: 10px 24px;
     border-radius: 4px;
}

.list {
     display: flex;
     flex-direction: column;
}

.item {
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 15px 0;
     border-bottom: 1px solid #eee;
}

.item-info h3 {
     margin: 0 0 4px 0;
     font-size: 1rem;
     font-weight: 500;
}

.item-info span {
     font-size: 0.8rem;
     color: #888;
}

.item-actions {
     display: flex;
     gap: 10px;
}

.btn-small {
     font-size: 0.85rem;
     padding: 4px 10px;
     background: #f5f5f5;
     border-radius: 4px;
}

.btn-del {
     color: #cc0000;
}

.status {
     font-size: 0.8rem;
     margin-top: 5px;
     color: #666;
}

@media (max-width: 768px) {
     .admin-grid {
          grid-template-columns: 1fr;
          gap: 40px;
     }
}
</style>
