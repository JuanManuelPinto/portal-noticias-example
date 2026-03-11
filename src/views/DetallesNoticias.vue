<template>
     <div class="detail-page">
          <nav class="top-nav">
               <div class="nav-container">
                    <router-link to="/" class="back-link">← Volver al Portal</router-link>
               </div>
          </nav>

          <main class="container" v-if="noticia">
               <header class="post-header">
                    <span class="date">{{ new Date(noticia.created_at).toLocaleDateString('es-ES', {
                         weekday: 'long',
                         year: 'numeric', month: 'long', day: 'numeric'
                    }) }}</span>
                    <h1>{{ noticia.titulo }}</h1>
               </header>

               <div class="featured-image" v-if="noticia.imagen_url">
                    <img :src="noticia.imagen_url" :alt="noticia.titulo" />
               </div>

               <div class="content">
                    <p class="text-body">{{ noticia.contenido }}</p>
               </div>
          </main>

          <div v-else class="loading">
               <p>Cargando noticia...</p>
          </div>
     </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../lib/supabase";

const route = useRoute();
const noticia = ref(null);

onMounted(async () => {
     const id = route.params.id;
     const { data, error } = await supabase
          .from("noticias")
          .select("*")
          .eq("id", id)
          .single();

     if (error) {
          console.error("Error cargando la noticia:", error);
     } else {
          noticia.value = data;
     }
});
</script>

<style scoped>
.detail-page {
     min-height: 100vh;
     background: white;
}

.top-nav {
     border-bottom: 1px solid #eee;
     padding: 20px;
}

.nav-container {
     max-width: 800px;
     margin: 0 auto;
}

.back-link {
     font-weight: 600;
     color: #333;
}

.container {
     max-width: 800px;
     margin: 0 auto;
     padding: 40px 20px;
}

.post-header {
     margin-bottom: 30px;
}

.date {
     color: #888;
     text-transform: uppercase;
     font-size: 0.8rem;
     font-weight: 700;
     letter-spacing: 1px;
}

.post-header h1 {
     font-size: 2.5rem;
     margin-top: 10px;
     line-height: 1.2;
}

.featured-image {
     width: 100%;
     border-radius: 12px;
     overflow: hidden;
     margin-bottom: 30px;
     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.featured-image img {
     width: 100%;
     display: block;
}

.content {
     line-height: 1.8;
     font-size: 1.15rem;
     color: #2c3e50;
}

.text-body {
     white-space: pre-wrap;
}

.loading {
     text-align: center;
     padding: 100px;
     color: #666;
}

@media (max-width: 600px) {
     .post-header h1 {
          font-size: 1.8rem;
     }
}
</style>