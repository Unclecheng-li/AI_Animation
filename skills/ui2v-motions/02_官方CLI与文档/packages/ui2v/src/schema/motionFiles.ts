import {
  isTextContentType,
  TEXT_FILE_EXTENSION_SET,
} from "./textFiles.js";

export const MOTION_BINARY_FILE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "woff",
  "woff2",
  "ttf",
  "otf",
  "mp3",
  "wav",
  "ogg",
  "mp4",
  "webm",
] as const;

export const MOTION_BINARY_FILE_EXTENSION_SET = new Set<string>(MOTION_BINARY_FILE_EXTENSIONS);

export const MOTION_PACKAGE_FILE_EXTENSION_SET = new Set<string>([
  ...TEXT_FILE_EXTENSION_SET,
  ...MOTION_BINARY_FILE_EXTENSION_SET,
]);

const MOTION_BINARY_CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  webm: "video/webm",
};

export function isMotionPackageFile(path: string, contentType?: string | null) {
  const trimmed = path.trim().toLowerCase();
  if (!trimmed) return false;
  if (contentType) {
    const normalized = contentType.split(";", 1)[0]?.trim().toLowerCase() ?? "";
    if (isTextContentType(contentType) || Object.values(MOTION_BINARY_CONTENT_TYPES).includes(normalized)) {
      return true;
    }
  }
  const extension = trimmed.split(".").at(-1) ?? "";
  return Boolean(extension && MOTION_PACKAGE_FILE_EXTENSION_SET.has(extension));
}

export function isRegistryItemPath(path: string) {
  const normalized = path.trim().replace(/\\/g, "/").toLowerCase();
  return normalized === "registry-item.json" || normalized.endsWith("/registry-item.json");
}
