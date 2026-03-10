<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <router-link to="/" class="back-link">Volver al Portal</router-link>
        <h1>Admin Login</h1>
        <p>Acceso restringido para gestión de contenidos.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="ejemplo@correo.com" required />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" :disabled="loading" class="btn-black">
          {{ loading ? 'Iniciando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    router.push("/admin");
  }
  loading.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: white;
  padding: 40px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.login-header {
  text-align: left;
  margin-bottom: 30px;
}

.back-link {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 20px;
  color: #888;
}

.login-header h1 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.login-header p {
  color: #888;
  font-size: 0.9rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
}

.btn-black {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
}
</style>
