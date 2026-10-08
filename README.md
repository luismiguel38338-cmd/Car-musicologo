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

Se requiere Node.js 22 o superior.

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
Abre tu navegador en `http://localhost:5000`.

### 4. Compilar para Producción
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---

## 📱 Compilar en APK para Android

### Opción A: Compilación Automática en GitHub (Recomendada)
El flujo de **GitHub Actions** en `.github/workflows/build-apk.yml` compila y valida la aplicación y genera un APK de depuración.
1. Sube el repositorio a GitHub y abre la pestaña **Actions**.
2. Ejecuta **Compilar Web & Android APK** con **Run workflow**, o haz `push` a `main` o `master`.
3. Al finalizar correctamente, descarga `radio-musicologos-android-apk` en los artefactos de esa ejecución. El APK está dentro de `android/app/build/outputs/apk/debug/`.

### Opción B: Compilación local
Se requiere Node.js 22 o superior, Java JDK 17 y Android SDK (configurado en Android Studio).
1. Genera y sincroniza el proyecto Android:
```bash
npm run build:apk
```
2. Para compilar un APK de depuración desde la terminal:
```bash
npm run android:debug
```
El archivo se genera en `android/app/build/outputs/apk/debug/app-debug.apk`. Para abrir el proyecto en Android Studio:
```bash
npx cap open android
```
En Android Studio, selecciona **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**. El APK de depuración sirve para probar; para distribuirlo públicamente, crea una compilación release firmada.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
