<template>
     <div class="portal-page">
          <nav class="top-nav">
               <div class="nav-container">
                    <h1 class="logo">CádizCF - Noticias</h1>
                    <div class="nav-links">
                         <router-link v-if="session" to="/admin" class="btn-black">Dashboard</router-link>
                         <router-link v-else to="/login" class="btn-outline">Admin Access</router-link>
                    </div>
               </div>
          </nav>

          <main class="container">
               <header class="hero">
                    <h1>Últimas Noticias</h1>
                    <p>Mantente al día con lo último en el mundo del Cádiz CF.</p>
               </header>

               <div class="news-grid">
                    <router-link v-for="nota in noticias" :key="nota.id" :to="'/noticia/' + nota.id"
                         class="news-card-link">
                         <article class="news-card">
                              <div class="card-image" v-if="nota.imagen_url">
                                   <img :src="nota.imagen_url" loading="lazy" />
                              </div>
                              <div class="card-body">
                                   <span class="date">{{ new Date(nota.created_at).toLocaleDateString() }}</span>
                                   <h2>{{ nota.titulo }}</h2>
                                   <p>{{ nota.contenido }}</p>
                              </div>
                         </article>
                    </router-link>
               </div>
          </main>
     </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";

const noticias = ref([]);
const session = ref(null);

onMounted(async () => {
     const { data: { session: currentSession } } = await supabase.auth.getSession();
     session.value = currentSession;

     supabase.auth.onAuthStateChange((_event, _session) => {
          session.value = _session;
     });

     const { data } = await supabase
          .from("noticias")
          .select("*")
          .order("created_at", { ascending: false });
     noticias.value = data;
});
</script>

<style scoped>
.top-nav {
     border-bottom: 1px solid #eee;
     background: white;
     padding: 0 20px;
}

.nav-container {
     max-width: 1100px;
     margin: 0 auto;
     height: 70px;
     display: flex;
     justify-content: space-between;
     align-items: center;
}

.logo {
     font-size: 1.25rem;
     font-weight: 700;
     margin: 0;
}

.logo span {
     color: #0400ff;
}

.nav-links {
     display: flex;
     gap: 15px;
}

.hero {
     text-align: left;
     padding: 60px 0;
     border-bottom: 1px solid #eee;
     margin-bottom: 40px;
}

.hero h1 {
     font-size: 2rem;
     margin-bottom: 10px;
}

.hero p {
     color: #666;
     font-size: 1.1rem;
}

.container {
     max-width: 1100px;
     margin: 0 auto;
     padding: 0 20px 60px;
}

.news-grid {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     gap: 40px;
}

.news-card {
     display: flex;
     flex-direction: column;
}

.card-image {
     width: 100%;
     aspect-ratio: 16/9;
     background: #f0f0f0;
     margin-bottom: 15px;
     overflow: hidden;
}

.card-image img {
     width: 100%;
     height: 100%;
     object-fit: cover;
}

.date {
     font-size: 0.8rem;
     color: #999;
     font-weight: 600;
     text-transform: uppercase;
     display: block;
     margin-bottom: 8px;
}

.card-body h2 {
     font-size: 1.15rem;
     margin-bottom: 10px;
     line-height: 1.4;
}

.card-body p {
     color: #444;
     font-size: 0.95rem;
     display: -webkit-box;
     -webkit-line-clamp: 3;
     line-clamp: 3;
     -webkit-box-orient: vertical;
     overflow: hidden;
}

.news-card-link {
     text-decoration: none;
     color: inherit;
     transition: transform 0.2s ease;
}

.news-card-link:hover {
     transform: translateY(-5px);
}
</style>
