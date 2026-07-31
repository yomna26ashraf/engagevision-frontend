# Connecting this frontend to the M-LATTE backend

## What changed vs. the original Lovable export
- `src/lib/api.ts` — new file, the only place that talks to the backend.
- `src/routes/demo.tsx` — uploads a real file to `POST /api/predict`, shows
  real score/level/confidence instead of a hashed fake prediction.
- `src/routes/dashboard.tsx` — fetches `GET /api/dashboard` (polls every
  15s), shows real prediction history/distribution instead of fixtures.
- `src/routes/performance.tsx` — fetches `GET /api/performance`, shows the
  real training curves/confusion matrix from `checkpoints/results.json`
  once you've trained, and an honest "no run yet" state until then.
- `src/routes/live.tsx` — relabeled to the 4 real DAiSEE-style levels, and
  clearly marked as a **simulated preview** (multi-face live detection
  needs a face-detector model that isn't part of M-LATTE — see the main
  project README's roadmap section).
- `src/routes/__root.tsx` — fixed the meta description, which described a
  different architecture (EfficientNet/CNN+LSTM) than what's actually
  implemented.

## Running both together

**Terminal 1 — backend:**
```bash
cd mlatte/backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
It'll work even before training finishes (falls back to an ImageNet-init
model and reports `model_status: "untrained_demo"` everywhere in the UI),
so you can wire up and test the connection today.

**Terminal 2 — frontend:**
```bash
cp .env.example .env.local     # only needed if your backend isn't on localhost:8000
npm install    # or bun install, per bun.lock
npm run dev    # or bun run dev
```

Open the dev server URL, go to **AI Demo**, upload an image or short
clip, and you should see a real (if not-yet-trained) prediction. Once
`scripts/train_daisee.py` finishes and writes `checkpoints/results.json`,
restart the backend and the **Model Performance** page will populate
automatically.

## CORS note
`backend/app.py` currently allows all origins (`allow_origins=["*"]`) for
easy local development. Tighten this to your deployed frontend's exact
origin before putting this anywhere public.
