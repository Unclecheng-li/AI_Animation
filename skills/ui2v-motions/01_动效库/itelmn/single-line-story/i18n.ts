export const locales = ["en", "zh", "ja", "ko", "es", "de", "fr", "pt"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
};

export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
  es: "es_ES",
  de: "de_DE",
  fr: "fr_FR",
  pt: "pt_BR",
};

export type Messages = {
  metaTitle: string;
  metaDescription: string;
  nav: { builder: string; styles: string; templates: string; workflow: string; prompts: string; install: string; menu: string; close: string; language: string };
  hero: { eyebrow: string; lineOne: string; lineTwo: string; tagInput: string; title: string; punch: string; install: string; templates: string };
  install: { eyebrow: string; lineOne: string; lineTwo: string; description: string; command: string; prompt: string };
  styles: { eyebrow: string; lineOne: string; lineTwo: string; lede: string; build: string };
  loom: { lineOne: string; lineTwo: string; punchOne: string; punchTwo: string };
  templates: { eyebrow: string; lineOne: string; lineTwo: string; lede: string; rendered: string };
  workflow: { eyebrow: string; lineOne: string; lineTwo: string };
  architecture: { eyebrow: string; lineOne: string; lineTwo: string; learn: string; github: string };
  prompts: { eyebrow: string; lineOne: string; lineTwo: string; copy: string };
  samplePrompts: { starter: string; style: string; cards: Array<{ label: string; text: string }> };
  builder: { eyebrow: string; lineOne: string; lineTwo: string };
  footer: { madeBy: string; alsoTry: string; github: string; llms: string; backTop: string };
};

const en: Messages = {
  metaTitle: "Plotbeat — Data, timed to the frame",
  metaDescription: "Turn files, APIs, and public data sources into deterministic, editable HyperFrames chart videos with an open-source AI skill and reusable motion templates.",
  nav: { builder: "Builder", styles: "Styles", templates: "Templates", workflow: "How it works", prompts: "Prompts", install: "Install skill", menu: "Menu", close: "Close menu", language: "Language" },
  hero: { eyebrow: "Open-source motion templates · Preview v0.1", lineOne: "Data, timed", lineTwo: "to the frame.", tagInput: "INPUT · CSV / JSON", title: "Turn your data into editable video.", punch: "Built for your AI agent. Powered by HyperFrames.", install: "Install the skill", templates: "See the templates" },
  install: { eyebrow: "Start here", lineOne: "One skill.", lineTwo: "Any dataset.", description: "Install Plotbeat, then attach a file or name the data source you want. The skill handles retrieval, template selection, mappings, pacing, validation, and the HyperFrames project.", command: "Install Plotbeat", prompt: "Sample prompt" },
  styles: { eyebrow: "One grammar · multiple visual systems", lineOne: "Choose", lineTwo: "the feeling.", lede: "Same data. Different direction.", build: "Build your own" },
  loom: { lineOne: "Meet the", lineTwo: "data loom.", punchOne: "Rows in.", punchTwo: "Chart frames out." },
  templates: { eyebrow: "Motion grammars", lineOne: "Choose", lineTwo: "the plot.", lede: "Pick a motion grammar.", rendered: "Rendered sample" },
  workflow: { eyebrow: "A visible production path", lineOne: "Rows in.", lineTwo: "Beats out." },
  architecture: { eyebrow: "The engine stays visible", lineOne: "Built on", lineTwo: "HyperFrames.", learn: "Learn about HyperFrames", github: "HyperFrames GitHub" },
  prompts: { eyebrow: "Direct the motion", lineOne: "Tell it what", lineTwo: "matters.", copy: "Copy prompt" },
  samplePrompts: {
    starter: "Use $plotbeat to fetch the last 10 years of monthly U.S. unemployment data from FRED, cite the series and retrieval date, then turn it into a quick, editable HyperFrames trend video. Help me choose a visual style and let me approve it before rendering.",
    style: "Use $plotbeat to turn my data into a quick, editable HyperFrames video using the {style} visual style. Choose the best template for the story and let me approve it before rendering.",
    cards: [
      { label: "Trend story", text: "Use $plotbeat to fetch the last 10 years of monthly U.S. unemployment data from FRED, cite the series and retrieval date, and turn it into a quick single-line HyperFrames story in the Studio Blueprint style." },
      { label: "Rank story", text: "Use $plotbeat to make a multi-line rank video from cohorts.csv in the Paper Cut style. Rank regions by active users over time, show the top eight, and end on a clean final table." },
      { label: "Map story", text: "Use $plotbeat to fetch the latest 30 days of magnitude 5+ earthquakes from the USGS GeoJSON feed, use magnitude as the value, and turn the locations into a quick Signal Noir animated HyperFrames map." },
    ],
  },
  builder: { eyebrow: "Plotbeat style builder · live preview", lineOne: "Build your own", lineTwo: "visual system." },
  footer: { madeBy: "Made by", alsoTry: "Also try", github: "GitHub", llms: "llms.txt", backTop: "Back to top ↑" },
};

export const messages: Record<Locale, Messages> = {
  en,
  zh: {
    ...en,
    metaTitle: "Plotbeat — 让数据踩准每一帧",
    metaDescription: "使用开源 AI 技能和可复用的 HyperFrames 动效模板，把文件、API 与公开数据源变成确定、可编辑的图表视频。",
    nav: { builder: "样式构建器", styles: "视觉风格", templates: "模板", workflow: "工作流程", prompts: "提示词", install: "安装技能", menu: "菜单", close: "关闭菜单", language: "语言" },
    hero: { eyebrow: "开源动效模板 · v0.1 预览", lineOne: "让数据", lineTwo: "踩准每一帧。", tagInput: "输入 · CSV / JSON", title: "把数据变成可编辑视频。", punch: "为你的 AI 智能体而生，由 HyperFrames 驱动。", install: "安装技能", templates: "查看模板" },
    install: { eyebrow: "从这里开始", lineOne: "一个技能。", lineTwo: "任意数据。", description: "安装 Plotbeat，然后附上文件或指定数据源。技能会处理获取、模板选择、字段映射、节奏、验证和 HyperFrames 项目。", command: "安装 Plotbeat", prompt: "示例提示词" },
    styles: { eyebrow: "一种动效语法 · 多套视觉系统", lineOne: "选择", lineTwo: "画面气质。", lede: "同一份数据，不同的表达方向。", build: "自定义风格" },
    loom: { lineOne: "认识", lineTwo: "数据织机。", punchOne: "数据行输入。", punchTwo: "图表帧输出。" },
    templates: { eyebrow: "动效语法", lineOne: "选择", lineTwo: "图表叙事。", lede: "选择一种动效语法。", rendered: "真实渲染示例" },
    workflow: { eyebrow: "清晰可见的制作流程", lineOne: "数据行输入。", lineTwo: "节拍输出。" },
    architecture: { eyebrow: "底层引擎始终可见", lineOne: "构建于", lineTwo: "HyperFrames。", learn: "了解 HyperFrames", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "指导动效", lineOne: "告诉它", lineTwo: "什么最重要。", copy: "复制提示词" },
    samplePrompts: {
      starter: "使用 $plotbeat 从 FRED 获取过去 10 年的美国月度失业率数据，注明数据序列和获取日期，然后制作一段节奏明快、可编辑的 HyperFrames 趋势视频。帮我选择视觉风格，并在渲染前让我确认。",
      style: "使用 $plotbeat 将我的数据制作成一段节奏明快、可编辑的 HyperFrames 视频，并采用 {style} 视觉风格。为数据故事选择最合适的模板，并在渲染前让我确认。",
      cards: [
        { label: "趋势故事", text: "使用 $plotbeat 从 FRED 获取过去 10 年的美国月度失业率数据，注明数据序列和获取日期，并以 Studio Blueprint 风格制作一段节奏明快的单折线 HyperFrames 视频。" },
        { label: "排名故事", text: "使用 $plotbeat 将 cohorts.csv 制作成 Paper Cut 风格的多折线排名视频。按活跃用户数展示地区随时间的排名变化，只保留前八名，并以清晰的最终榜单收尾。" },
        { label: "地图故事", text: "使用 $plotbeat 从 USGS GeoJSON 数据源获取最近 30 天内 5 级以上地震，以震级作为数值，并将地点制作成一段节奏明快的 Signal Noir 风格 HyperFrames 动态地图。" },
      ],
    },
    builder: { eyebrow: "Plotbeat 样式构建器 · 实时预览", lineOne: "创建你的", lineTwo: "视觉系统。" },
    footer: { madeBy: "作者", alsoTry: "也可试试", github: "GitHub", llms: "llms.txt", backTop: "返回顶部 ↑" },
  },
  ja: {
    ...en,
    metaTitle: "Plotbeat — データを、フレームに合わせる",
    metaDescription: "ファイル、API、公開データを、オープンソースのAIスキルと再利用可能なHyperFramesテンプレートで編集可能なチャート動画へ。",
    nav: { builder: "ビルダー", styles: "スタイル", templates: "テンプレート", workflow: "使い方", prompts: "プロンプト", install: "スキルを追加", menu: "メニュー", close: "メニューを閉じる", language: "言語" },
    hero: { eyebrow: "オープンソース・モーションテンプレート · v0.1", lineOne: "データを、", lineTwo: "フレームに。", tagInput: "入力 · CSV / JSON", title: "データを編集可能な動画へ。", punch: "AIエージェント向け。HyperFramesで動作。", install: "スキルを追加", templates: "テンプレートを見る" },
    install: { eyebrow: "ここから開始", lineOne: "ひとつのスキル。", lineTwo: "どんなデータでも。", description: "Plotbeatを追加し、ファイルを添付するかデータソースを指定してください。取得、テンプレート選択、マッピング、テンポ、検証、HyperFramesプロジェクトまで処理します。", command: "Plotbeatを追加", prompt: "サンプルプロンプト" },
    styles: { eyebrow: "ひとつの文法 · 複数のビジュアル", lineOne: "雰囲気を", lineTwo: "選ぶ。", lede: "同じデータ、違う演出。", build: "自分で作る" },
    loom: { lineOne: "データ織機を", lineTwo: "紹介します。", punchOne: "行を入力。", punchTwo: "チャートフレームを出力。" },
    templates: { eyebrow: "モーション文法", lineOne: "プロットを", lineTwo: "選ぶ。", lede: "モーション文法を選択。", rendered: "レンダリング例" },
    workflow: { eyebrow: "見える制作フロー", lineOne: "行を入力。", lineTwo: "ビートを出力。" },
    architecture: { eyebrow: "エンジンは見えるまま", lineOne: "HyperFrames", lineTwo: "上に構築。", learn: "HyperFramesについて", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "モーションを指示", lineOne: "大切なことを", lineTwo: "伝える。", copy: "プロンプトをコピー" },
    samplePrompts: {
      starter: "FREDから過去10年間の米国の月次失業率データを取得し、系列名と取得日を明記して、テンポのよい編集可能なHyperFramesトレンド動画にしてください。$plotbeatを使い、ビジュアルスタイルの選択を手伝い、レンダリング前に確認させてください。",
      style: "$plotbeatを使って、私のデータを{style}のビジュアルスタイルで、テンポのよい編集可能なHyperFrames動画にしてください。ストーリーに最適なテンプレートを選び、レンダリング前に確認させてください。",
      cards: [
        { label: "トレンド", text: "$plotbeatを使ってFREDから過去10年間の米国の月次失業率データを取得し、系列名と取得日を明記して、Studio Blueprintスタイルのテンポのよい単一折れ線HyperFrames動画にしてください。" },
        { label: "ランキング", text: "$plotbeatを使ってcohorts.csvからPaper Cutスタイルの複数系列ランキング動画を作成してください。地域をアクティブユーザー数で時系列に順位付けし、上位8件を表示して、見やすい最終表で締めてください。" },
        { label: "マップ", text: "$plotbeatを使ってUSGS GeoJSONフィードから直近30日間のマグニチュード5以上の地震を取得し、マグニチュードを値として、Signal NoirスタイルのテンポのよいHyperFramesアニメーションマップにしてください。" },
      ],
    },
    builder: { eyebrow: "Plotbeatスタイルビルダー · ライブプレビュー", lineOne: "自分だけの", lineTwo: "ビジュアルを。" },
    footer: { madeBy: "制作", alsoTry: "こちらも", github: "GitHub", llms: "llms.txt", backTop: "トップへ ↑" },
  },
  ko: {
    ...en,
    metaTitle: "Plotbeat — 데이터를 프레임에 맞추세요",
    metaDescription: "파일, API, 공개 데이터 소스를 오픈소스 AI 스킬과 재사용 가능한 HyperFrames 템플릿으로 편집 가능한 차트 영상으로 바꾸세요.",
    nav: { builder: "빌더", styles: "스타일", templates: "템플릿", workflow: "작동 방식", prompts: "프롬프트", install: "스킬 설치", menu: "메뉴", close: "메뉴 닫기", language: "언어" },
    hero: { eyebrow: "오픈소스 모션 템플릿 · v0.1 미리보기", lineOne: "데이터를", lineTwo: "프레임에 맞게.", tagInput: "입력 · CSV / JSON", title: "데이터를 편집 가능한 영상으로.", punch: "AI 에이전트를 위해 만들고 HyperFrames로 구동합니다.", install: "스킬 설치", templates: "템플릿 보기" },
    install: { eyebrow: "여기서 시작", lineOne: "스킬 하나.", lineTwo: "어떤 데이터든.", description: "Plotbeat를 설치하고 파일을 첨부하거나 데이터 소스를 지정하세요. 검색, 템플릿 선택, 매핑, 속도, 검증, HyperFrames 프로젝트를 처리합니다.", command: "Plotbeat 설치", prompt: "샘플 프롬프트" },
    styles: { eyebrow: "하나의 문법 · 다양한 비주얼 시스템", lineOne: "느낌을", lineTwo: "선택하세요.", lede: "같은 데이터, 다른 연출.", build: "직접 만들기" },
    loom: { lineOne: "데이터 룸을", lineTwo: "소개합니다.", punchOne: "행 입력.", punchTwo: "차트 프레임 출력." },
    templates: { eyebrow: "모션 문법", lineOne: "플롯을", lineTwo: "선택하세요.", lede: "모션 문법을 고르세요.", rendered: "렌더링 샘플" },
    workflow: { eyebrow: "한눈에 보이는 제작 과정", lineOne: "행 입력.", lineTwo: "비트 출력." },
    architecture: { eyebrow: "엔진은 계속 보입니다", lineOne: "HyperFrames", lineTwo: "위에 구축.", learn: "HyperFrames 알아보기", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "모션 디렉팅", lineOne: "중요한 것을", lineTwo: "말하세요.", copy: "프롬프트 복사" },
    samplePrompts: {
      starter: "$plotbeat를 사용해 FRED에서 지난 10년간 미국 월별 실업률 데이터를 가져오고, 시리즈와 조회 날짜를 명시한 뒤 빠르고 편집 가능한 HyperFrames 추세 영상으로 만들어 주세요. 시각 스타일 선택을 도와주고 렌더링 전에 확인받아 주세요.",
      style: "$plotbeat를 사용해 내 데이터를 {style} 비주얼 스타일의 빠르고 편집 가능한 HyperFrames 영상으로 만들어 주세요. 스토리에 가장 적합한 템플릿을 선택하고 렌더링 전에 확인받아 주세요.",
      cards: [
        { label: "추세 스토리", text: "$plotbeat를 사용해 FRED에서 지난 10년간 미국 월별 실업률 데이터를 가져오고 시리즈와 조회 날짜를 명시한 뒤 Studio Blueprint 스타일의 빠른 단일 라인 HyperFrames 영상으로 만들어 주세요." },
        { label: "순위 스토리", text: "$plotbeat를 사용해 cohorts.csv를 Paper Cut 스타일의 다중 라인 순위 영상으로 만들어 주세요. 시간에 따른 지역별 활성 사용자 순위를 매기고 상위 8개를 보여 준 뒤 깔끔한 최종 표로 마무리해 주세요." },
        { label: "지도 스토리", text: "$plotbeat를 사용해 USGS GeoJSON 피드에서 최근 30일간 규모 5 이상 지진을 가져오고 규모를 값으로 사용해 Signal Noir 스타일의 빠른 HyperFrames 애니메이션 지도로 만들어 주세요." },
      ],
    },
    builder: { eyebrow: "Plotbeat 스타일 빌더 · 실시간 미리보기", lineOne: "나만의", lineTwo: "비주얼 시스템." },
    footer: { madeBy: "만든 사람", alsoTry: "함께 보기", github: "GitHub", llms: "llms.txt", backTop: "맨 위로 ↑" },
  },
  es: {
    ...en,
    metaTitle: "Plotbeat — Datos al ritmo de cada fotograma",
    metaDescription: "Convierte archivos, APIs y fuentes públicas en vídeos de gráficos editables con una skill de IA abierta y plantillas reutilizables de HyperFrames.",
    nav: { builder: "Editor", styles: "Estilos", templates: "Plantillas", workflow: "Cómo funciona", prompts: "Prompts", install: "Instalar skill", menu: "Menú", close: "Cerrar menú", language: "Idioma" },
    hero: { eyebrow: "Plantillas de motion open source · Vista previa v0.1", lineOne: "Datos al ritmo", lineTwo: "de cada frame.", tagInput: "ENTRADA · CSV / JSON", title: "Convierte tus datos en vídeo editable.", punch: "Hecho para tu agente de IA. Impulsado por HyperFrames.", install: "Instalar la skill", templates: "Ver plantillas" },
    install: { eyebrow: "Empieza aquí", lineOne: "Una skill.", lineTwo: "Cualquier dataset.", description: "Instala Plotbeat y adjunta un archivo o indica la fuente. La skill gestiona la obtención, plantilla, mapeo, ritmo, validación y proyecto de HyperFrames.", command: "Instalar Plotbeat", prompt: "Prompt de ejemplo" },
    styles: { eyebrow: "Una gramática · múltiples sistemas visuales", lineOne: "Elige", lineTwo: "la sensación.", lede: "Los mismos datos. Otra dirección.", build: "Crear mi estilo" },
    loom: { lineOne: "Conoce el", lineTwo: "telar de datos.", punchOne: "Entran filas.", punchTwo: "Salen frames." },
    templates: { eyebrow: "Gramáticas de movimiento", lineOne: "Elige", lineTwo: "la trama.", lede: "Elige una gramática de movimiento.", rendered: "Muestra renderizada" },
    workflow: { eyebrow: "Un proceso de producción visible", lineOne: "Entran filas.", lineTwo: "Salen beats." },
    architecture: { eyebrow: "El motor sigue visible", lineOne: "Creado sobre", lineTwo: "HyperFrames.", learn: "Conocer HyperFrames", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "Dirige el movimiento", lineOne: "Dile qué", lineTwo: "importa.", copy: "Copiar prompt" },
    samplePrompts: {
      starter: "Usa $plotbeat para obtener de FRED los datos mensuales de desempleo de EE. UU. de los últimos 10 años, cita la serie y la fecha de consulta, y conviértelos en un vídeo de tendencia HyperFrames rápido y editable. Ayúdame a elegir el estilo visual y pídeme aprobación antes de renderizar.",
      style: "Usa $plotbeat para convertir mis datos en un vídeo HyperFrames rápido y editable con el estilo visual {style}. Elige la plantilla más adecuada para la historia y pídeme aprobación antes de renderizar.",
      cards: [
        { label: "Historia de tendencia", text: "Usa $plotbeat para obtener de FRED los datos mensuales de desempleo de EE. UU. de los últimos 10 años, cita la serie y la fecha de consulta, y crea una historia HyperFrames rápida de una sola línea con el estilo Studio Blueprint." },
        { label: "Historia de ranking", text: "Usa $plotbeat para crear desde cohorts.csv un vídeo de ranking multilínea con el estilo Paper Cut. Ordena las regiones por usuarios activos a lo largo del tiempo, muestra las ocho primeras y termina con una tabla final limpia." },
        { label: "Historia de mapa", text: "Usa $plotbeat para obtener del feed GeoJSON de USGS los terremotos de magnitud 5 o superior de los últimos 30 días, usa la magnitud como valor y conviértelos en un mapa HyperFrames animado y rápido con el estilo Signal Noir." },
      ],
    },
    builder: { eyebrow: "Editor de estilos Plotbeat · vista en vivo", lineOne: "Crea tu propio", lineTwo: "sistema visual." },
    footer: { madeBy: "Creado por", alsoTry: "Prueba también", github: "GitHub", llms: "llms.txt", backTop: "Volver arriba ↑" },
  },
  de: {
    ...en,
    metaTitle: "Plotbeat — Daten im Takt jedes Frames",
    metaDescription: "Verwandle Dateien, APIs und öffentliche Datenquellen mit einem offenen KI-Skill und wiederverwendbaren HyperFrames-Vorlagen in editierbare Diagramm-Videos.",
    nav: { builder: "Builder", styles: "Stile", templates: "Vorlagen", workflow: "So funktioniert’s", prompts: "Prompts", install: "Skill installieren", menu: "Menü", close: "Menü schließen", language: "Sprache" },
    hero: { eyebrow: "Open-Source-Motion-Templates · Vorschau v0.1", lineOne: "Daten im Takt", lineTwo: "jedes Frames.", tagInput: "INPUT · CSV / JSON", title: "Daten in editierbare Videos verwandeln.", punch: "Für deinen KI-Agenten. Angetrieben von HyperFrames.", install: "Skill installieren", templates: "Vorlagen ansehen" },
    install: { eyebrow: "Hier starten", lineOne: "Ein Skill.", lineTwo: "Jeder Datensatz.", description: "Installiere Plotbeat und hänge eine Datei an oder nenne die Datenquelle. Der Skill übernimmt Abruf, Vorlage, Mapping, Timing, Prüfung und das HyperFrames-Projekt.", command: "Plotbeat installieren", prompt: "Beispiel-Prompt" },
    styles: { eyebrow: "Eine Grammatik · mehrere visuelle Systeme", lineOne: "Wähle", lineTwo: "das Gefühl.", lede: "Gleiche Daten. Andere Richtung.", build: "Eigenen Stil bauen" },
    loom: { lineOne: "Der", lineTwo: "Datenwebstuhl.", punchOne: "Zeilen rein.", punchTwo: "Diagramm-Frames raus." },
    templates: { eyebrow: "Motion-Grammatiken", lineOne: "Wähle", lineTwo: "den Plot.", lede: "Wähle eine Motion-Grammatik.", rendered: "Gerendertes Beispiel" },
    workflow: { eyebrow: "Ein sichtbarer Produktionsweg", lineOne: "Zeilen rein.", lineTwo: "Beats raus." },
    architecture: { eyebrow: "Die Engine bleibt sichtbar", lineOne: "Gebaut auf", lineTwo: "HyperFrames.", learn: "HyperFrames kennenlernen", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "Motion dirigieren", lineOne: "Sag, was", lineTwo: "zählt.", copy: "Prompt kopieren" },
    samplePrompts: {
      starter: "Nutze $plotbeat, um die monatlichen US-Arbeitslosendaten der letzten zehn Jahre von FRED abzurufen. Nenne Reihe und Abrufdatum und verwandle die Daten in ein schnelles, editierbares HyperFrames-Trendvideo. Hilf mir bei der Stilwahl und hole vor dem Rendern meine Freigabe ein.",
      style: "Nutze $plotbeat, um meine Daten im visuellen Stil {style} in ein schnelles, editierbares HyperFrames-Video zu verwandeln. Wähle die beste Vorlage für die Geschichte und hole vor dem Rendern meine Freigabe ein.",
      cards: [
        { label: "Trend-Story", text: "Nutze $plotbeat, um die monatlichen US-Arbeitslosendaten der letzten zehn Jahre von FRED abzurufen. Nenne Reihe und Abrufdatum und erstelle eine schnelle einlinige HyperFrames-Story im Stil Studio Blueprint." },
        { label: "Ranking-Story", text: "Nutze $plotbeat, um aus cohorts.csv ein Mehrlinien-Rankingvideo im Stil Paper Cut zu erstellen. Ordne Regionen im Zeitverlauf nach aktiven Nutzern, zeige die besten acht und schließe mit einer klaren Endtabelle ab." },
        { label: "Karten-Story", text: "Nutze $plotbeat, um die Erdbeben der Stärke 5 oder höher aus den letzten 30 Tagen vom USGS-GeoJSON-Feed abzurufen. Verwende die Magnitude als Wert und erstelle eine schnelle animierte HyperFrames-Karte im Stil Signal Noir." },
      ],
    },
    builder: { eyebrow: "Plotbeat Style Builder · Live-Vorschau", lineOne: "Baue dein", lineTwo: "visuelles System." },
    footer: { madeBy: "Von", alsoTry: "Auch testen", github: "GitHub", llms: "llms.txt", backTop: "Nach oben ↑" },
  },
  fr: {
    ...en,
    metaTitle: "Plotbeat — Les données au rythme de chaque image",
    metaDescription: "Transformez fichiers, API et sources publiques en vidéos de graphiques éditables avec une skill IA open source et des modèles HyperFrames réutilisables.",
    nav: { builder: "Éditeur", styles: "Styles", templates: "Modèles", workflow: "Fonctionnement", prompts: "Prompts", install: "Installer la skill", menu: "Menu", close: "Fermer le menu", language: "Langue" },
    hero: { eyebrow: "Modèles de motion open source · Aperçu v0.1", lineOne: "Les données au rythme", lineTwo: "de chaque image.", tagInput: "ENTRÉE · CSV / JSON", title: "Transformez vos données en vidéo éditable.", punch: "Conçu pour votre agent IA. Propulsé par HyperFrames.", install: "Installer la skill", templates: "Voir les modèles" },
    install: { eyebrow: "Commencez ici", lineOne: "Une skill.", lineTwo: "Toutes les données.", description: "Installez Plotbeat, joignez un fichier ou indiquez la source. La skill gère la récupération, le modèle, le mapping, le rythme, la validation et le projet HyperFrames.", command: "Installer Plotbeat", prompt: "Exemple de prompt" },
    styles: { eyebrow: "Une grammaire · plusieurs systèmes visuels", lineOne: "Choisissez", lineTwo: "l’ambiance.", lede: "Mêmes données. Autre direction.", build: "Créer mon style" },
    loom: { lineOne: "Découvrez le", lineTwo: "métier à données.", punchOne: "Lignes en entrée.", punchTwo: "Images en sortie." },
    templates: { eyebrow: "Grammaires de mouvement", lineOne: "Choisissez", lineTwo: "l’intrigue.", lede: "Choisissez une grammaire de mouvement.", rendered: "Exemple rendu" },
    workflow: { eyebrow: "Un parcours de production visible", lineOne: "Lignes en entrée.", lineTwo: "Beats en sortie." },
    architecture: { eyebrow: "Le moteur reste visible", lineOne: "Construit sur", lineTwo: "HyperFrames.", learn: "Découvrir HyperFrames", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "Dirigez le mouvement", lineOne: "Dites ce qui", lineTwo: "compte.", copy: "Copier le prompt" },
    samplePrompts: {
      starter: "Utilisez $plotbeat pour récupérer sur FRED les données mensuelles du chômage aux États-Unis sur les dix dernières années, citez la série et la date de consultation, puis transformez-les en une vidéo de tendance HyperFrames rapide et modifiable. Aidez-moi à choisir le style visuel et demandez mon accord avant le rendu.",
      style: "Utilisez $plotbeat pour transformer mes données en une vidéo HyperFrames rapide et modifiable avec le style visuel {style}. Choisissez le modèle le plus adapté au récit et demandez mon accord avant le rendu.",
      cards: [
        { label: "Récit de tendance", text: "Utilisez $plotbeat pour récupérer sur FRED les données mensuelles du chômage aux États-Unis sur les dix dernières années, citez la série et la date de consultation, puis créez un récit HyperFrames rapide à une seule courbe dans le style Studio Blueprint." },
        { label: "Récit de classement", text: "Utilisez $plotbeat pour créer depuis cohorts.csv une vidéo de classement multiligne dans le style Paper Cut. Classez les régions par utilisateurs actifs au fil du temps, affichez les huit premières et terminez par un tableau final épuré." },
        { label: "Récit cartographique", text: "Utilisez $plotbeat pour récupérer dans le flux GeoJSON de l’USGS les séismes de magnitude 5 ou plus des 30 derniers jours, utilisez la magnitude comme valeur et créez une carte HyperFrames animée et rapide dans le style Signal Noir." },
      ],
    },
    builder: { eyebrow: "Éditeur de styles Plotbeat · aperçu en direct", lineOne: "Créez votre", lineTwo: "système visuel." },
    footer: { madeBy: "Créé par", alsoTry: "À essayer aussi", github: "GitHub", llms: "llms.txt", backTop: "Retour en haut ↑" },
  },
  pt: {
    ...en,
    metaTitle: "Plotbeat — Dados no ritmo de cada frame",
    metaDescription: "Transforme arquivos, APIs e fontes públicas em vídeos de gráficos editáveis com uma skill de IA open source e templates HyperFrames reutilizáveis.",
    nav: { builder: "Editor", styles: "Estilos", templates: "Templates", workflow: "Como funciona", prompts: "Prompts", install: "Instalar skill", menu: "Menu", close: "Fechar menu", language: "Idioma" },
    hero: { eyebrow: "Templates de motion open source · Prévia v0.1", lineOne: "Dados no ritmo", lineTwo: "de cada frame.", tagInput: "ENTRADA · CSV / JSON", title: "Transforme seus dados em vídeo editável.", punch: "Feito para seu agente de IA. Com HyperFrames.", install: "Instalar a skill", templates: "Ver templates" },
    install: { eyebrow: "Comece aqui", lineOne: "Uma skill.", lineTwo: "Qualquer dataset.", description: "Instale o Plotbeat e anexe um arquivo ou informe a fonte. A skill cuida da coleta, template, mapeamento, ritmo, validação e projeto HyperFrames.", command: "Instalar Plotbeat", prompt: "Prompt de exemplo" },
    styles: { eyebrow: "Uma gramática · vários sistemas visuais", lineOne: "Escolha", lineTwo: "a sensação.", lede: "Mesmos dados. Outra direção.", build: "Criar meu estilo" },
    loom: { lineOne: "Conheça o", lineTwo: "tear de dados.", punchOne: "Linhas entram.", punchTwo: "Frames saem." },
    templates: { eyebrow: "Gramáticas de movimento", lineOne: "Escolha", lineTwo: "o enredo.", lede: "Escolha uma gramática de movimento.", rendered: "Amostra renderizada" },
    workflow: { eyebrow: "Um fluxo de produção visível", lineOne: "Linhas entram.", lineTwo: "Beats saem." },
    architecture: { eyebrow: "O motor continua visível", lineOne: "Criado sobre", lineTwo: "HyperFrames.", learn: "Conhecer HyperFrames", github: "HyperFrames GitHub" },
    prompts: { eyebrow: "Dirija o movimento", lineOne: "Diga o que", lineTwo: "importa.", copy: "Copiar prompt" },
    samplePrompts: {
      starter: "Use $plotbeat para buscar no FRED os dados mensais de desemprego dos EUA dos últimos 10 anos, cite a série e a data de consulta e transforme-os em um vídeo de tendência HyperFrames rápido e editável. Ajude-me a escolher o estilo visual e peça minha aprovação antes de renderizar.",
      style: "Use $plotbeat para transformar meus dados em um vídeo HyperFrames rápido e editável com o estilo visual {style}. Escolha o template mais adequado para a história e peça minha aprovação antes de renderizar.",
      cards: [
        { label: "História de tendência", text: "Use $plotbeat para buscar no FRED os dados mensais de desemprego dos EUA dos últimos 10 anos, cite a série e a data de consulta e crie uma história HyperFrames rápida de linha única no estilo Studio Blueprint." },
        { label: "História de ranking", text: "Use $plotbeat para criar a partir de cohorts.csv um vídeo de ranking com várias linhas no estilo Paper Cut. Classifique as regiões por usuários ativos ao longo do tempo, mostre as oito primeiras e finalize com uma tabela limpa." },
        { label: "História de mapa", text: "Use $plotbeat para buscar no feed GeoJSON do USGS os terremotos de magnitude 5 ou maior dos últimos 30 dias, use a magnitude como valor e transforme os locais em um mapa HyperFrames animado e rápido no estilo Signal Noir." },
      ],
    },
    builder: { eyebrow: "Editor de estilos Plotbeat · prévia ao vivo", lineOne: "Crie seu próprio", lineTwo: "sistema visual." },
    footer: { madeBy: "Criado por", alsoTry: "Experimente também", github: "GitHub", llms: "llms.txt", backTop: "Voltar ao topo ↑" },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function displayTitle(locale: Locale, value: string) {
  return locale === "en" ? value : value.replace(/[.!?。！？]+$/u, "");
}

export function localizePath(locale: Locale, path = "/") {
  if (locale === "en") return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

export function localeAlternates(path = "/") {
  return Object.fromEntries(locales.map((locale) => [locale, localizePath(locale, path)]));
}
