# El Método — Árkos · V3 (Motion Graphics)

Versión **motion graphics completa**: cada idea con su gráfico animado (iconos que se
dibujan, contadores, barras, constelación de agentes, loop del método, bloques). Contenido
de **valor / referente**, modo claro, **zona segura TikTok**, colores de marca.

- **Formato:** 1080×1920 (9:16), 30 fps, 30 s, MP4. Mudo (audio trending en TikTok).
- **9 escenas**, cada una con un gráfico animado + texto, centradas en zona segura.
- Composición en `index.html` (timeline GSAP único, seek-safe).

## Escenas y gráficos

1. `</>` que se dibuja + líneas de código — "La IA ya escribe el código."
2. Diana (anillos + punto ámbar pulsante) — "lo escaso es el criterio."
3. **Constelación**: tú al centro + agentes orbitando (líneas que se dibujan, nodos que pulsan, giro lento) — "Tú diriges. Ellos construyen."
4. **Bucle** del método (anillo punteado girando + nodos 1·2·3) — "Decidir. Revisar. Corregir."
5. **Barras** comparativas (meses → semanas).
6. **Contador** +50 (count-up + barras) — "sistemas en producción."
7. **Bloques** que se ensamblan — "sistemas a tu medida."
8. Logo Árkos + "Rodrigo." + "pymes en LATAM".
9. CTA: icono follow (+) + "@arkos_devs".

## Técnicas (HyperFrames, deterministas)

- Dibujo de SVG: `strokeDasharray = getTotalLength()` + tween de `strokeDashoffset`→0.
- Barras/contadores: `scaleY` + `onUpdate` con `tabular-nums`.
- Iconos vivos: pulso/giro vía escala/rotación GSAP (origen = centro del bbox para círculos/grupos).
- Cortes duros entre escenas (sin fades de salida → sin estado obsoleto en seeks).

## Zona segura TikTok

`.scene { padding: 300px 230px 470px 230px; }` (todo centrado). Fondos a sangre OK; gráfico + texto dentro del área segura. Verificado con la plantilla del cliente.

## Comandos

```bash
cd el-metodo-motion
npm run dev
npm run check
npx hyperframes render --output renders/el-metodo-motion.mp4 --quality high --workers 1
```
