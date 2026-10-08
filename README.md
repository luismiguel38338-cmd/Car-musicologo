# 🔊 Radio Musicólogos · Pioneer DEH-4250BT Car Audio Simulator

> **Simulador interactivo de Car Audio dominicano con estéreo Pioneer DEH-4250BT, chucheros y kitipos con animación de bajos reales, ecualizadores paramétricos, voltímetro digital y DJ Soundboard en vivo.**

---

## 🚀 Características Principales

* **Estéreo Pioneer DEH-4250BT (y 7 modelos adicionales):**
  * Pantalla LCD segmentada con marquesina en tiempo real.
  * Perilla de volumen giratoria interactiva (arrastre, rueda del mouse o clics) con escala real de 0 a 62 y sonido beep Pioneer.
  * 7 modelos intercambiables: Pioneer DEH-4250BT, Pioneer MVH-S218BT, Alpine iDA-X305, Pioneer DEH CD Bluetooth, JVC XD-X280BT, etc.
* **Chucheros y Kitipos Animados en Canvas:**
  * Tamaños de 6", 8", 10" y 12" con suspensión y excursión física calculada mediante Web Audio API (`AnalyserNode`).
  * Conos y tweeters que vibran con la pegada del bajo y sacudida de la caja de sonido.
* **Ecualizador Paramétrico de 7 Bandas (1 a 5 unidades):**
  * Bandas: 50Hz, 125Hz, 316Hz, 750Hz, 2.2kHz, 6kHz y 16kHz.
  * Controles de Sub Level, Volumen, Fader y botón AUX S/W (bypass).
  * Filtros biquad con alta respuesta sonora y luces LED dinámicas.
* **Voltímetro Digital del Carro (12.6V / 14.4V):**
  * Pantalla de 7 segmentos con caída de voltaje en tiempo real con los golpes de bajo.
* **DJ Soundboard & Launchpad:**
  * 📢 Air Horn (Corneta de Dembow)
  * 🚨 Sirena Policial
  * 💥 Sub Drop 30Hz
  * ⚡ Láser FX
  * 🔄 Scratch DJ
* **Emisoras Dominicanas en Vivo:**
  * Top Urbano RD, FieraMix, Ritmo 96.5 FM, Tropical 100 Mix, Bachata, Merengue y Salsa.
  * Soporte para cargar carpetas locales de música (USB) o archivos MP3.
* **💳 Método de Pago Oficial:**
  * Enlace oficial de pago con PayPal: [Pagar Factura con PayPal](https://www.paypal.com/invoice/p/#GZ9P8RYCZX64484J).
* **💬 Discord Oficial (Actualizaciones y Soporte):**
  * Servidor de Discord de Luis Miguel Musicólogo: [Unirse al Discord](https://discord.gg/FYxevNeSp).

---

## 🛠️ Instalación y Ejecución Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/radio-musicologos.git
cd radio-musicologos
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000`.

### 4. Compilar para Producción
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---

## 📱 Compilar en APK para Android

### Opción A: Compilación Automática en GitHub (Recomendada)
Este repositorio incluye un flujo de trabajo de **GitHub Actions** en `.github/workflows/build-apk.yml`.
1. Sube este repositorio a tu cuenta de GitHub.
2. Cada vez que hagas un `push` a la rama `main`, GitHub compilará automáticamente el proyecto y creará el archivo APK listo para descargar en la pestaña **Actions** -> **Artefactos**.

### Opción B: Compilación Local con Android Studio y Capacitor
1. Compila la aplicación web:
```bash
npm run build
```
2. Agrega la plataforma Android:
```bash
npx cap add android
```
3. Sincroniza los archivos:
```bash
npx cap sync android
```
4. Abre el proyecto en Android Studio:
```bash
npx cap open android
```
5. En Android Studio, ve a **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)** para generar tu archivo `.apk` final.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
