# ══════════════════════════════════════════════════════════════════
# Stage 1 — Build
# Dùng node:24-slim (Debian/glibc) vì pnpm-workspace.yaml đã xoá
# hết các binary musl/alpine cho esbuild, rollup, lightningcss, v.v.
# ══════════════════════════════════════════════════════════════════
FROM node:24-slim AS builder

# Kích hoạt pnpm qua corepack
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# ── 1. Copy workspace manifests trước (tận dụng layer cache) ──────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./

# ── 2. Copy tất cả workspace packages ────────────────────────────
COPY lib/            lib/
COPY artifacts/      artifacts/
COPY scripts/        scripts/

# ── 3. Cài dependencies (locked) ─────────────────────────────────
RUN pnpm install --frozen-lockfile

# ── 4. Build minh-thu ────────────────────────────────────────────
# vite.config.ts yêu cầu PORT + BASE_PATH; dùng giá trị placeholder
# cho build (không ảnh hưởng runtime vì output là static files)
ENV PORT=3000
ENV BASE_PATH=/
ENV NODE_ENV=production

RUN pnpm --filter @workspace/minh-thu run build

# ══════════════════════════════════════════════════════════════════
# Stage 2 — Serve
# nginx:alpine nhỏ gọn; Render inject $PORT lúc runtime,
# nginx template engine (envsubst) tự xử lý biến môi trường.
# ══════════════════════════════════════════════════════════════════
FROM nginx:1.27-alpine

# Xoá config mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy static files đã build
COPY --from=builder /app/artifacts/minh-thu/dist/public /usr/share/nginx/html

# Template — nginx tự chạy envsubst khi khởi động
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
