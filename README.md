# LICENSING ARENA

Web game realtime tiếng Việt dành cho một quản trò và 7 điện thoại đại diện đội. Database là nguồn sự thật; đồng hồ, khóa đáp án, chấm điểm và Royalty Boost đều được xác thực atomically trong PostgreSQL.

## Có gì trong project

- Next.js App Router, TypeScript, Tailwind CSS 4
- Supabase PostgreSQL, Anonymous Auth và Realtime (không polling)
- Host session ký bằng HMAC trong cookie HttpOnly; secret/PIN không vào client bundle
- State machine: `LOBBY → COUNTDOWN → QUESTION_OPEN → QUESTION_LOCKED → REVEAL → LEADERBOARD → FINAL_RESULTS`
- QR lobby, claim 7 team độc quyền, reconnect/refresh bằng anonymous session
- Timer theo timestamp server, submit một lần, chấm điểm server-side, boost ×1.5 một lần
- Reveal, fastest answer, streak, animated race leaderboard, Boss Round và podium
- Projector mode; phím Space/R/L/N/F/M; giao diện mobile có tap target lớn

## Yêu cầu

- Node.js 22 trở lên (khuyến nghị Node 24 LTS)
- Một project Supabase và tài khoản Vercel nếu muốn deploy

## Setup Supabase

1. Tạo project mới tại Supabase.
2. Vào **Authentication → Providers → Anonymous Sign-Ins** và bật anonymous sign-ins.
3. Mở **SQL Editor**, chạy toàn bộ `supabase/migrations/202608110001_licensing_arena.sql`.
4. Chạy `supabase/seed.sql`.
5. Trong Project Settings/API, lấy Project URL, publishable key và secret key. Không đưa secret key vào biến `NEXT_PUBLIC_*`.

Nếu dùng Supabase CLI đã link đúng project:

```bash
npx supabase db push
npx supabase db reset  # chỉ dùng local; chạy migration + seed lại từ đầu
```

Migration bật RLS trên mọi bảng. Player không có quyền đọc trực tiếp bảng gameplay; chỉ gọi RPC snapshot đã lọc. Trước `REVEAL`, RPC không trả `correct_option`, `explanation`, `is_correct` hay `awarded_points`. Realtime chỉ phát bảng event an toàn, rồi client tải lại canonical snapshot.

## Biến môi trường và chạy local

```bash
cp .env.example .env.local
```

Điền:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
ADMIN_PIN=YOUR_PRIVATE_HOST_PIN
NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
```

Sau đó:

```bash
npm install
npm run dev
```

Mở `http://localhost:3000/admin`, nhập PIN, tạo phòng. Chiếu `/host/ROOM`, để người chơi scan QR và chọn nhóm. Mỗi nhóm chỉ dùng một điện thoại đại diện. Không đóng tab trong trận; nếu reload, anonymous session được khôi phục tự động.

## Kiểm thử

```bash
npm test
npm run lint
npm run build
```

`src/lib/scoring.test.ts` kiểm tra mốc 0/3/12/15 giây, đúng/sai và boost. `supabase/tests/database.sql` kiểm tra seed/phân phối điểm; các constraint và transaction RPC bảo vệ duplicate answer, expired answer và boost lần hai.

QA nhiều thiết bị: tạo phòng, mở 7 browser profile/incognito riêng, claim Team 1–7, refresh một player, bắt đầu câu hỏi, double-tap đáp án, ngắt/bật mạng, và theo dõi host cập nhật không reload. Trong DevTools player trước reveal, payload question không được có `correct_option`, `is_correct`, `explanation` hoặc điểm thưởng.

## Điều khiển host

- Space: hành động chính theo state
- R: reveal; L: leaderboard; N: câu tiếp theo
- F: fullscreen; M: mute
- Projector Mode ẩn thanh điều khiển
- Unlock Team giải phóng điện thoại; Reset yêu cầu xác nhận

Host API luôn kiểm cookie HttpOnly. Các route đặc quyền dùng secret key duy nhất ở server. Không dùng publishable key cho công việc quản trị.

## Deploy Vercel

### A — GitHub + Vercel (khuyến nghị)

```bash
git init
git add .
git commit -m "Build Licensing Arena"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

Import repository vào Vercel, chọn production branch `main`, khai báo đủ 5 env vars (đặc biệt secret chỉ ở server), rồi Deploy. Mỗi push vào `main` sẽ cập nhật production.

### B — Vercel CLI

```bash
npx vercel
# kiểm tra preview
npx vercel --prod
```

Thêm env vars trong Vercel dashboard hoặc qua CLI trước production. URL QR tự lấy từ `location.origin`, nên hoạt động đúng ở preview/production.

## Xử lý sự cố

- **Thiếu cấu hình Supabase:** kiểm `.env.local`, không để dấu nháy thừa, restart dev server.
- **Anonymous sign-in lỗi:** bật Anonymous Sign-Ins và kiểm URL/key.
- **Không thấy realtime:** kiểm migration đã thêm `game_events` vào `supabase_realtime`; reload một lần để lấy canonical state.
- **Team đã có đại diện:** quản trò dùng Unlock Team. Mất mạng không tự giải phóng slot.
- **Unauthorized host:** quay lại `/admin`; cookie host hết hạn sau 8 giờ.
- **Migration báo table đã nằm trong publication:** project đã chạy migration một phần; reset database local hoặc bỏ dòng publication chỉ khi chắc chắn bảng đã được thêm.

## Cấu trúc chính

- `src/app` — routes/pages và API server
- `src/components` — host/player stage
- `src/hooks/use-realtime-snapshot.ts` — Realtime + reconnect canonical fetch
- `src/lib/host-session.ts` — session host HttpOnly
- `supabase/migrations` — schema, RLS, RPC atomic, state machine
- `supabase/seed.sql` — đúng 10 câu hỏi Licensing

Không commit `.env.local`, Supabase secret key hoặc PIN.
