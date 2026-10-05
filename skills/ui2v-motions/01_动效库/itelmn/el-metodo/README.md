# El Método — Árkos / Rodrigo Torres

Video vertical (TikTok) construido con **HyperFrames** (HTML → MP4 determinista).
Single-founder dirigiendo agentes de IA para construir SaaS de producción.

- **Formato:** 1080×1920 (9:16), 30 fps, ~31 s, MP4.
- **Diseñado para verse SIN audio** (el texto cuenta la historia). En TikTok se le pone audio trending.
- **Márgenes seguros:** ~10 % libres arriba/abajo (la UI de TikTok tapa los bordes).
- Composición: `index.html` (todo en un solo archivo, timeline GSAP seekable).

## Beats (0–31 s)

| Beat | t (s)      | Contenido                                                        | Acento ámbar         |
| ---- | ---------- | ---------------------------------------------------------------- | -------------------- |
| 1    | 0.0–4.5    | Hook — "En esta laptop hay **3** trabajando ahora mismo."        | el `3` (count-up)    |
| 2    | 4.5–9.5    | Ventana 01 — Reconstruyendo árkos.com                            | cursor del path      |
| 3    | 9.5–14.5   | Ventana 02 — Precio Vivo (dashboard MIDAGRI) · "73 tests ✓"      | el `✓`               |
| 4    | 14.5–19.0  | Ventana 03 — RestHUB / KDS en producción                         | dot "en vivo"        |
| 4.5  | 19.0–21.0  | Payoff — las 3 ventanas juntas en mosaico                        | —                    |
| 5    | 21.0–26.0  | El método — "No escribo cada línea. **Dirijo.**"                 | "Dirijo."            |
| 6    | 26.0–31.0  | CTA — "Rodrigo. Construyo software para **pymes en LATAM**."     | "pymes en LATAM" + @ |

## Sistema visual (tokens)

```
--bg #0A0A0A · --ink #F2F0EA · --ink-dim #8A8782 · --ink-faint #4A4742
--accent #F2A93B (ámbar, único acento) · --rule rgba(242,240,234,0.12)
Display/Body: Inter (500–900) · Mono/datos: JetBrains Mono
```

Fuentes empaquetadas localmente en `assets/fonts/` (render determinista, sin depender de red).

## Comandos

```bash
cd el-metodo
npm run dev      # preview en navegador (hot reload)
npm run check    # lint + validate + inspect
npm run render   # render a MP4 (renders/)

# Render explícito (calidad alta, 1 worker por RAM):
npx hyperframes render --output renders/el-metodo.mp4 --quality high --workers 1
```

El MP4 queda en `renders/`.

## Assets

1. **Handle de TikTok** — `@arkos_devs` (beat 6). ✓
2. **Logo Árkos** — logo real monocromo off-white en `assets/arkos-logo-mono.svg` (derivado de tu SVG de marca `final - LOGO 2-02`, recoloreado a `--ink` y con fondo quitado, para respetar la disciplina del ámbar del video). ✓
   - ¿Lo quieres a **todo color** (teal + índigo) como cierre de marca? Cambia el `<img>` del beat 6 por el SVG original o avísame.
3. **Foto de laptop (opcional)** — el hook es solo texto sobre negro. Para usar foto: agregar `<img>` de fondo en `#b1` con velo negro ~45 %.

> Integraciones disponibles (Izipay, PedidosYa, Rappi, SUNAT) en `C:\Trabajo\Arkos\Logos de diferenciales\` — no se usan en este corte, pero servirían para una variante "proof / integraciones locales".

## Notas

- Apache 2.0, render local (sin fees, sin auth de HeyGen).
- Mudo por diseño — no se generó pista de audio.
