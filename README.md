# Frame Zetu — Print. Frame. Inspire.

React + TypeScript + Vite storefront for Frame Zetu (Nairobi framing studio).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Pages
- `#/` home: centred hero, left-to-right art row, salon wall, moods, process, makeover promo
- `#/shop` the wall, with category, mood and search filters
- `#/art/:id` live frame configurator (size, 6 mouldings, mount board) with an in-room preview
- `#/studio` upload your own photo and frame it
- `#/makeover` house-makeover packages and booking form
- `#/pinned` wishlist moodboard
- `#/checkout` M-Pesa STK, card or cash on delivery
- `#/account` order history and sign out

## Note before going live
Auth, orders, bookings and payments are **front-end demos** stored in `localStorage`.
Before launch, wire them to a real backend: M-Pesa Daraja STK Push, a card processor such as Paystack or Flutterwave, and server-side accounts.
Artwork photos in `public/art/` were cropped from @framezetu posts. Swap in the original high-res files when available.

## Stock art
`src/lib/stock.ts` lists 34 public-domain works held by the Art Institute of Chicago (Van Gogh, Monet, Renoir, Hokusai, Kandinsky and others).
The image files are public-domain scans from Wikimedia Commons, saved in `public/art/stock/` and served by the site itself, so there is no hotlinking.
Each entry's `source` field links its Commons file page.
