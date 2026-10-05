# BatchClip third-party notices and redistribution audit

**Audit date:** 20 July 2026
**Release status:** **CLEARED for the Windows x64 payload described below.**

This file is part of every BatchClip release payload. It records the redistribution review of bundled fonts, audio, icons, and compiled third-party code selected by `package.json` and `package-lock.json`. It is not legal advice and does not replace the license terms below or the original license files retained in packaged npm modules.

The release gate is `npm run audit:third-party -- --release`. It verifies the audited asset hashes and package versions before either platform release script can package the application.

## Cleared Windows x64 release payload

The previously blocked material was removed instead of waived:

- Removed `ffmpeg-static` and `@ffprobe-installer` plus their platform binaries.
- Removed Remotion and its compositor/media packages. The inactive Remotion-only render features remain unregistered and their source is excluded from packaged files.
- Removed HyperFrames, which also removed transitive sharp/libvips and ONNX Runtime binaries. HyperFrames overlays are no longer registered in the release render pipeline.
- Removed the three unproven renderer UI sounds.
- Removed the unlicensed Media Master logo.

Windows now bundles a matching `ffmpeg.exe` / `ffprobe.exe` pair from BtbN FFmpeg-Builds release `latest`, commit `8c736b2d6fe5da2a10a8896d01e53bfb0ca4f665`, published 20 July 2026. The asset was `ffmpeg-n8.1-latest-win64-gpl-8.1.zip`, upstream SHA-256 `bffb1e3fbff5bba5ab2c54d36cc5935b1f0dd5219fb9eec8388df6bd5d95c933`. The binaries report FFmpeg 8.1 with `--enable-gpl --enable-version3`, explicitly `--disable-libfdk-aac`, and no `--enable-nonfree`.

| Bundled file | SHA-256 |
| --- | --- |
| `resources/bin/ffmpeg.exe` | `9959487dde724f9b3b997a2353517f43c12e1d96b6225029d0f0453242b4a370` |
| `resources/bin/ffprobe.exe` | `39b64ebddfc338436f2c1d9e5f691a3d82565f37a092349cbd07ea5397bb2651` |
| `resources/bin/FFMPEG-GPL-3.0.txt` | `8ceb4b9ee5adedde47b31e975c1d90c73ad27b6b165a1dcd80c7c545eb65b903` |
| `resources/bin/FFMPEG-BUILDS-MIT.txt` | `c1b3cc7eec42bd9c4f6247169bb887b4a9bc904abfd2a7f7f9231ed357844993` |

Corresponding source and exact build instructions are available from <https://github.com/BtbN/FFmpeg-Builds/tree/8c736b2d6fe5da2a10a8896d01e53bfb0ca4f665>. FFmpeg license and source obligations remain governed by GPL-3.0-or-later and the component licenses identified by that build.

### Evidence sources

- Exact files, versions, package license declarations, and platform selectors: repository `package-lock.json` plus SHA-256 hashes enforced by `scripts/audit-third-party-assets.mjs`.
- FFmpeg redistribution checklist: <https://ffmpeg.org/legal.html>.
- BtbN binary source/build recipe and MIT license: <https://github.com/BtbN/FFmpeg-Builds/tree/8c736b2d6fe5da2a10a8896d01e53bfb0ca4f665>.
- Font rights: the copyright, source, license, and Reserved Font Name fields embedded in each audited TTF, cross-checked against the named upstream projects.
- Original project-asset provenance: repository history and `scripts/generate-release-art.py`.

## Audited font files

The hashes and embedded name-table notices below identify the exact reviewed files. All are unmodified font binaries. Except for Permanent Marker, each declares the SIL Open Font License 1.1 in its metadata. Permanent Marker declares Apache License 2.0. The complete OFL and Apache texts are preserved in this file.

| File | SHA-256 | Embedded copyright/source | License |
| --- | --- | --- | --- |
| `resources/fonts/Anton-Regular.ttf` | `a4ba3a92350ebb031da0cb47630ac49eb265082ca1bc0450442f4a83ab947cab` | Copyright 2020 The Anton Project Authors, <https://github.com/googlefonts/AntonFont.git> | OFL-1.1 |
| `resources/fonts/Bangers-Regular.ttf` | `4160a7311de9342674cce9160cde9fcbb30f48190397d86ff1b70b455af65824` | Copyright 2010 The Bangers Project Authors, <https://github.com/googlefonts/bangers> | OFL-1.1 |
| `resources/fonts/BebasNeue-Regular.ttf` | `08e4623805102d819f58601e46e345648846075e363b2ceb23313c2d1c83ec73` | Copyright 2019 The Bebas Neue Project Authors, <https://github.com/dharmatype/Bebas-Neue>; Bebas Neue is a Dharma Type trademark | OFL-1.1 |
| `resources/fonts/Caveat.ttf` | `0bdb6b660482d31531b3945849fba5916b3ef8695da7024a9e6b9ee3c4157988` | Copyright 2014 The Caveat Project Authors, <https://github.com/googlefonts/caveat> | OFL-1.1 |
| `resources/fonts/DancingScript.ttf` | `21808625578fe8d8cd10cb684be546dca077b27cd03a53a2f1ec11dc743c924c` | Copyright 2016 The Dancing Script Project Authors, <https://github.com/googlefonts/DancingScript>; Reserved Font Name “Dancing Script” | OFL-1.1 |
| `resources/fonts/Geist-Bold.ttf` | `f032f37d12e82a37977fd1159c01e1a14415672244d2e6865d57e28c74886d03` | Copyright 2024 The Geist Project Authors, <https://github.com/vercel/geist-font.git> | OFL-1.1 |
| `resources/fonts/InstrumentSerif-Italic.ttf` | `08939b8bdf534afec24ae0ef5e03f948940cd9a8fe08e7fecbad040e62327385` | Copyright 2022 The Instrument Serif Project Authors, <https://github.com/Instrument/instrument-serif> | OFL-1.1 |
| `resources/fonts/InstrumentSerif-Regular.ttf` | `498efd461f6ddfcb7a111bf9a565709d2085d48201d501ead960d93e84ffbb88` | Copyright 2022 The Instrument Serif Project Authors, <https://github.com/Instrument/instrument-serif> | OFL-1.1 |
| `resources/fonts/Inter-Bold.ttf` | `b37284b5701b6b168dfc770aa1a4ac492106422fd3ba76bc7641e37434e8019c` | Copyright 2016 The Inter Project Authors, <https://github.com/rsms/inter> | OFL-1.1 |
| `resources/fonts/Inter.ttf` | `29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031` | Copyright 2016 The Inter Project Authors, <https://github.com/rsms/inter>; Inter is an rsms trademark | OFL-1.1 |
| `resources/fonts/JetBrainsMono.ttf` | `48715a42ec242c21e9f02692891e147d022299a52e48d5e413e1a942193ffeda` | Copyright 2020 The JetBrains Mono Project Authors, <https://github.com/JetBrains/JetBrainsMono>; JetBrains Mono is a JetBrains s.r.o. trademark | OFL-1.1 |
| `resources/fonts/Lora.ttf` | `822a6621ccbe8d97d20ac88c1c41f5615c9c2c202eaa75f272cd452aac6475a7` | Copyright 2011 The Lora Project Authors, <https://github.com/cyrealtype/Lora-Cyrillic>; Reserved Font Name “Lora” | OFL-1.1 |
| `resources/fonts/Montserrat-Bold.ttf` | `bc6e854971cea46b463be6f9eef4d9cd52f51cfc1fc0dd90c9d3e6483dc0ec61` | Copyright 2011 The Montserrat Project Authors, <https://github.com/JulietaUla/Montserrat> | OFL-1.1 |
| `resources/fonts/Montserrat.ttf` | `0f7b311b2f3279e4eef9b2f968bcdbab6e28f4daeb1f049f4f278a902bcd82f7` | Copyright 2011 The Montserrat Project Authors, <https://github.com/JulietaUla/Montserrat> | OFL-1.1 |
| `resources/fonts/Oswald.ttf` | `5b38c246e255a12f5712d640d56bcced0472466fc68983d2d0410ec0457c2817` | Copyright 2016 The Oswald Project Authors, <https://github.com/googlefonts/OswaldFont> | OFL-1.1 |
| `resources/fonts/Outfit.ttf` | `fc7287273e66929776e2ba54f144fe699080bec29f61bf649d70d871468aeade` | Copyright 2021 The Outfit Project Authors, <https://github.com/Outfitio/Outfit-Fonts> | OFL-1.1 |
| `resources/fonts/PermanentMarker-Regular.ttf` | `28f82c8a7943cb8e9d599f8554da1d4fc75dbcf69b9885ad6c0611d20c6946c5` | Copyright © 2010 Font Diner, Inc.; Permanent Marker is a Font Diner trademark | Apache-2.0 |
| `resources/fonts/PlayfairDisplay.ttf` | `c40f2293766a503bc70cce9e512ef844a4ccb7cbcde792fe2ea31d191917d8d6` | Copyright 2017 The Playfair Display Project Authors, <https://github.com/clauseggers/Playfair-Display>; Reserved Font Name “Playfair Display” | OFL-1.1 |
| `resources/fonts/Poppins-Bold.ttf` | `1984efdda0fbe207d7ac20feac2ba7c2768c92a90094b02a206c9d58cc30ff2e` | Copyright 2020 The Poppins Project Authors, <https://github.com/itfoundry/Poppins> | OFL-1.1 |
| `resources/fonts/Poppins-Regular.ttf` | `7e65201e9b79159e2300267cc885e16c8dcef2424cdfa09a29bfb0980a94a7ba` | Copyright 2020 The Poppins Project Authors, <https://github.com/itfoundry/Poppins> | OFL-1.1 |
| `resources/fonts/PressStart2P-Regular.ttf` | `034c77f1f05ec89421e4a63f0e3a4ca1ecf852cc6d2bf611f126f275728e017d` | Copyright 2012 The Press Start 2P Project Authors; Reserved Font Name “Press Start 2P” | OFL-1.1 |
| `resources/fonts/SourceCodePro.ttf` | `b400fc584e10aff25d0e775ce181b4fc1c5ea1b5dc37b81aeb2084375b945790` | © 2023 Adobe; Reserved Font Name “Source” | OFL-1.1 |
| `resources/fonts/StyleScript-Regular.ttf` | `e77c77bfaf9f79d5a1a5d4e8d3674ee7fa98dce1deb4ee8cdf1aef70b5229408` | Copyright 2013 The Style Script Project Authors, <https://github.com/googlefonts/style-script> | OFL-1.1 |

`@fontsource/inter@5.2.8` also supplies Inter webfont files to the renderer. Its original `LICENSE` is retained at `node_modules/@fontsource/inter/LICENSE`; it identifies Copyright 2016 The Inter Project Authors and applies OFL-1.1.

## Audited audio

### Project-owned procedural SFX — cleared

Repository commit `4787c756b62c646da2792d2bcfd6660e0657a27d` records these six files and their README as original FFmpeg synthesis from sine/noise/filter generators. BatchClip contributors release these project-owned recordings for unrestricted redistribution with BatchClip (CC0-equivalent waiver; attribution is not required).

| File | SHA-256 | Duration |
| --- | --- | --- |
| `resources/sfx/bass-drop.mp3` | `9a8aeaa2065b38cdfca9c20ab12a7386d799204db7c33cc1921a04e640e7e017` | 0.500 s |
| `resources/sfx/camera-shutter.mp3` | `5984cc0e0c6572b9a30e96424fa3141a568a4977381a31116e690520017f193f` | 0.300 s |
| `resources/sfx/rise-tension-short.mp3` | `8ba5a60589c60b46a33d3f132dcba0858d817d74c8c67198f16a01a32cb2f726` | 0.600 s |
| `resources/sfx/swipe-transition.mp3` | `5082fbf4e588362b9d4f36ce8455fd99f42acaeaef4e567df64aef098c99d1d2` | 0.400 s |
| `resources/sfx/typewriter-key.mp3` | `d8e0d949ef8da2da95e86dfb98168a8fdea06932e82bfbfdf967f96c822a02a2` | 0.300 s |
| `resources/sfx/word-pop.mp3` | `8ae8c9581173692884cc067139539f5c491ef867656019490114ee345a26773a` | 0.250 s |

### Music — empty

No music recording is currently present under `resources/music/`; only `resources/music/README.md` exists. Adding any audio file changes the audited file set and blocks the release gate until its grant and hash are recorded.

## Audited icon and artwork assets

### BatchClip release artwork — cleared

The BatchClip artwork is project-owned and covered by the repository MIT license. The raster/installer family is reproducibly generated by `scripts/generate-release-art.py` from product color tokens and the bundled Inter fonts. `build/icon.svg` is the project-authored editable vector source. These are not third-party assets.

| Files | SHA-256 |
| --- | --- |
| `build/icon.png`, `build/icons/1024x1024.png`, `build/icon.iconset/icon_512x512@2x.png` | `a4fd8962a0019196c416964426f7f90d901a91dc53ec1d7010ead316f53455ae` |
| `build/icons/16x16.png`, `build/icon.iconset/icon_16x16.png` | `12cdcf27c59fb8ba003bc9edd19760cf8bfb411dd2b6e41655440d7e35ce24eb` |
| `build/icons/32x32.png`, `build/icon.iconset/icon_16x16@2x.png`, `build/icon.iconset/icon_32x32.png` | `dfe5f2cb352e7dd0cd57fe4f8986a2d6d76339790770a62394e12f6e27b31a58` |
| `build/icons/48x48.png` | `97c0a2b30d84b2e35327dfb06e5e9ce4cc35e4301b3471819d8c27d7d2c1c023` |
| `build/icons/64x64.png`, `build/icon.iconset/icon_32x32@2x.png` | `7aba4f2d326b3c67e20cafb7db05f0a98accbc840ff54a495cd46d3ffdb2c41b` |
| `build/icons/128x128.png`, `build/icon.iconset/icon_128x128.png` | `f49645ddf1a7ecf02c8c4ae2c80a3c92845c410ec276800c52fdb53ce2fe7411` |
| `build/icons/256x256.png`, `build/icon.iconset/icon_128x128@2x.png`, `build/icon.iconset/icon_256x256.png` | `db01598bfe41e0fbc77aa54614bb7cc100d145fd0f43e9b4440e7ebf8c19c26f` |
| `build/icons/512x512.png`, `build/icon.iconset/icon_256x256@2x.png`, `build/icon.iconset/icon_512x512.png` | `63ef9332dceb0a4e84e63f26014d07d12ad351771c3de387774ff12767fc3c0b` |
| `build/icon.svg` | `67dc85296f208133cc04439d09950977963a57c0986a7d8d53d4a162de3479b8` |
| `build/icon.icns` | `14e7b559deb5dd9fd1d3d85eef7ce49f2797baccc4917c9f37cf4d4b96a23b89` |
| `build/icon.ico` | `45d173371c80be82395a713cbbd9d9330b44ed5c80e0613bb42eea8e5815069f` |
| `build/dmg-background.png` | `06e4332668605ae992d4a59880e3275ea390f6d2780cfb5ed7f55da842f0e51e` |
| `build/installerHeader.bmp` | `3156ffe5e1facacdc8c5069f12305c76fdb84d3e3e7c3e900affb148ede34f94` |
| `build/installerSidebar.bmp` | `57cd308e5f29093d477bdd28dad41b06680588c05e0a59afb3f26ccf9787c84f` |

### Third-party icon content

- `lucide-react@0.475.0` supplies icons embedded in renderer JavaScript under the ISC license. Copyright for Feather portions © 2013–2022 Cole Bemis; other Lucide portions © 2022 Lucide Contributors. Its original license remains at `node_modules/lucide-react/LICENSE` and is reproduced below.
- Inline SVG shapes authored directly in project source are covered by the BatchClip MIT license; no external SVG files were found beyond the audited build artwork.

## Audited compiled third-party code

Exact versions come from `package-lock.json`, not semver ranges in `package.json`.

| Component selected for release | Exact version(s) | Declared terms | Audit result |
| --- | --- | --- | --- |
| Electron runtime, including Chromium/Node.js | Electron `34.5.8` | MIT plus Electron's bundled Chromium notices | Permission established; preserve Electron `LICENSE` and `LICENSES.chromium.html` in the release |
| better-sqlite3 native addon + SQLite amalgamation | `better-sqlite3@12.9.0` | MIT; SQLite public domain | Cleared; original `node_modules/better-sqlite3/LICENSE` remains packaged |
| esbuild executables | `0.25.0` and production-nested `0.25.12` | MIT, Copyright © 2020 Evan Wallace | Cleared; each package's `LICENSE.md` remains packaged |
| Rspack native bindings | `@rspack/binding-*@1.7.6` | MIT, Copyright © 2022-present ByteDance Inc. and affiliates | Cleared; platform package `LICENSE` remains packaged |
| source-map WebAssembly mappings parser | `source-map@0.7.3` | BSD-3-Clause, Mozilla Foundation and contributors | Cleared; original `LICENSE` remains packaged and is reproduced below |
| fsevents native addon (macOS) | `fsevents@2.3.3` | MIT, Philipp Dunkel, Ben Noordhuis, Elan Shankar, Paul Miller | Cleared; original `LICENSE` remains packaged |
| BtbN FFmpeg 8.1 Windows x64 executables | build commit `8c736b2d6fe5da2a10a8896d01e53bfb0ca4f665` | GPL-3.0-or-later plus linked component terms | Cleared for the Windows payload with exact licenses, hashes, and corresponding build source recorded above |

The production tree also contains executable JavaScript command shims. Those are source-form scripts covered by their npm packages' licenses, not compiled binary payloads. Electron-builder/NSIS build-time executables are not installed as standalone application resources; the generated installer must continue to retain any notices electron-builder places in the artifact.

## Original license text: SIL Open Font License 1.1

Copyright statements and Reserved Font Names are listed with each font above.

```text
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

## Original license text: Apache License 2.0

This text applies to Permanent Marker and the cleared sharp native binding. It does not by itself clear sharp-libvips.

```text
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

## Original license text: Lucide ISC

```text
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Original license text: source-map BSD-3-Clause

```text
Copyright (c) 2009-2011, Mozilla Foundation and contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the names of the Mozilla Foundation nor the names of project
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## Original MIT license text: Electron

```text
Copyright (c) Electron contributors
Copyright (c) 2013-2020 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Electron's original `LICENSES.chromium.html` is generated for the exact runtime and must also remain in the packaged release; it is too large to duplicate here without risking divergence.

## Original MIT license text: better-sqlite3

```text
The MIT License (MIT)

Copyright (c) 2017 Joshua Wise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Original MIT license text: esbuild

```text
MIT License

Copyright (c) 2020 Evan Wallace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Original MIT license text: Rspack

```text
MIT License

Copyright (c) 2022-present Bytedance Inc and its affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Original MIT license text: fsevents

```text
MIT License
-----------

Copyright (C) 2010-2020 by Philipp Dunkel, Ben Noordhuis, Elan Shankar, Paul Miller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## License files that must remain in a future cleared release

When the blockers are resolved, the release must preserve at least these originals plus every notice required by the replacement binaries:

- Electron: `LICENSE` and `LICENSES.chromium.html` from the exact Electron runtime.
- better-sqlite3: `node_modules/better-sqlite3/LICENSE`.
- esbuild: every packaged `node_modules/**/esbuild/LICENSE.md` and platform package notice.
- Rspack: the target `node_modules/@rspack/binding-*/LICENSE`.
- sharp: `node_modules/sharp/LICENSE` and target binding `LICENSE`.
- source-map: `node_modules/source-map/LICENSE` and any packaged nested copy.
- fsevents: `node_modules/fsevents/LICENSE`.
- Inter webfonts: `node_modules/@fontsource/inter/LICENSE`.
- Lucide: `node_modules/lucide-react/LICENSE`.
- Replacement/copyleft media and image binaries: exact license texts, notices, build configuration, modifications, and corresponding source/relinking materials required by their licenses.
