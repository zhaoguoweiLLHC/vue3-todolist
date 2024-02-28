import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '8k2p6u',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173/vue3-todolist'
  }
})
