import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

try {
  const srcImg = "C:\\Users\\011676\\.gemini\\antigravity-ide\\brain\\a3b44bb9-9b46-45f6-9cd4-98472cf85c51\\valam_logo_v_big_alam_small_1789124810356.png";
  const destImg = path.resolve(__dirname, 'public', 'valam-logo.png');
  if (fs.existsSync(srcImg)) {
    fs.copyFileSync(srcImg, destImg);
    console.log("Big V Logo copied successfully via Vite config!");
  }
} catch (e) {
  console.error("Error copying logo:", e);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
