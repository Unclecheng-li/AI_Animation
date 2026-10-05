# El Método — Árkos · V2 (Light / Kinetic / Valor)

Versión **clara y kinética**, reescrita como **contenido de valor** (consultor / referente),
sin nombres de producto. Tesis con criterio sobre cómo se construye software hoy y qué
significa para una pyme.

- **Formato:** 1080×1920 (9:16), 30 fps, ~29 s, MP4. Mudo (audio trending en TikTok).
- **~13 escenas** de ~2 s, cortes rápidos, tipografía enorme, posiciones variadas.
- Composición en `index.html` (timeline GSAP data-driven: `data-anim` por escena).

## Guion (valor → autoridad → CTA)

1. La IA ya escribe el código.
2. Entonces, ¿qué te vuelve valioso?
3. **El criterio.** (lo escaso)
4. Saber qué construir. Y por qué.
5. 1 persona con **criterio** + agentes de IA
6. rinde como un equipo entero.
7. El valor ya no está en tipear.
8. Está en **DIRIGIR.**
9. Decidir. Revisar. Corregir el rumbo.
10. *para tu pyme:* sistemas a tu **medida**, en semanas, no en años.
11. Sin forzar tu negocio a un molde genérico.
12. *quién soy:* **Rodrigo.** Software para pymes en **LATAM**.
13. CTA: logo + **@arkos_devs** + "construye con criterio. síguenos."

## Zona segura TikTok

El TEXTO se mantiene dentro del área segura (los fondos a color sí van a sangre, quedan bajo la UI):
- `.scene { padding: 300px 240px 470px 90px; }` (top · right · bottom · left)
- right 240 despeja la columna de botones (notch inferior-derecho); bottom 470 despeja caption/usuario; top 300 despeja la barra superior.
- Escenas centradas: padding simétrico + `max-width` reducido para despejar el notch.
- Verificado superponiendo la plantilla de zona segura sobre frames reales.

## Sistema visual

```
--paper #F4F2EC · --ink #1A1726 · --teal #57D1D6 · --amber #F2A93B
Inter 800/900 (titulares) · JetBrains Mono (kickers) · resaltador = caja de color animada
```

## Comandos

```bash
cd el-metodo-light
npm run dev
npm run check
npx hyperframes render --output renders/el-metodo-light.mp4 --quality high --workers 1
```

## Notas

- Logo a color (índigo + teal) en `assets/arkos-logo-color.svg`.
- Si quieres posiciones aún más marcadas, reducir `.stage max-width` (más desplazamiento horizontal).
