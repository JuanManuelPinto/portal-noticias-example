<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
:root {
  --black: #1a1a1a;
  --gray-dark: #666666;
  --gray-medium: #888888;
  --gray-light: #dddddd;
  --bg-site: #fcfcfc;
  --border-color: #eeeeee;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-site);
  color: var(--black);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

h1,
h2,
h3,
h4 {
  margin-top: 0;
  font-weight: 600;
  color: var(--black);
}

a {
  text-decoration: none;
  color: var(--black);
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.7;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input,
textarea {
  font-family: inherit;
  width: 100%;
  padding: 10px;
  border: 1px solid var(--gray-light);
  border-radius: 4px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--black);
}

.btn-black {
  background: var(--black);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
}

.btn-outline {
  background: white;
  border: 1px solid var(--gray-light);
  padding: 10px 20px;
  border-radius: 4px;
}

.btn-text {
  background: none;
  color: var(--gray-dark);
}
</style>
