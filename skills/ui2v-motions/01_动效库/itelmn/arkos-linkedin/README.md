# Árkos — LinkedIn (16:9) · "¿Otra app o un sistema?"

Video **horizontal (1920×1080)** para LinkedIn. Pitch distinto: en vez del "método" (cómo
construye Rodrigo), va al **dolor del cliente** — ángulo diagnóstico de consultor.

- **Formato:** 1920×1080 (16:9), 30 fps, 30 s, MP4. Mudo.
- Motion graphics con iconos **alineados** (cajas de tamaño fijo, viewBox 100×100 con contenido centrado y simétrico).
- Modo claro, colores de marca, contenido de valor.

## Guion (diagnóstico → solución → autoridad)

1. Tu pyme no necesita otra **app**.
2. El problema son las que ya tienes: viviendo **separadas**. (4 apps inconexas)
3. **3 señales de que ya las superaste:** copian/pegan entre apps · nadie confía en los números · crecer = contratar, no escalar.
4. No te falta software. Te falta **un sistema**.
5. Un sistema **vertical**, hecho para tu operación. (hub conectado)
6. Árkos — sistemas verticales para pymes en **LATAM**.
7. ¿Te suena? **Hablemos.** — Rodrigo Torres · Árkos · arkos.com

## Nota de alineación de iconos

Cada icono vive en `.icobox` (118×118, `place-items:center`) con su SVG en `viewBox 0 0 100 100`
y contenido **simétrico centrado** → quedan alineados en columna y centrados con el texto.
(Corrige el desalineado de la versión anterior, p. ej. el `</>`.)

## Comandos

```bash
cd arkos-linkedin
npm run check
npx hyperframes render --output renders/arkos-linkedin.mp4 --quality high --workers 1
```

## Nota LinkedIn

Horizontal 16:9 con márgenes cómodos (sin la zona segura agresiva de TikTok). Para el post:
copy más largo/profesional, CTA a comentar o a arkos.com.
