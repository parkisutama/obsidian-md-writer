# Documentation guidelines

Dokumen ini membantu contributor menaruh konten di tempat yang tepat.

## Tentukan pembaca dulu

Sebelum menulis, tentukan pembaca utamanya:

- pengguna plugin,
- developer contributor,
- maintainer release,
- atau maintainer yang sedang membaca referensi teknis.

## Taruh berdasarkan aksi

- Pengguna ingin install plugin: `docs/for-users/install-md-writer.md`.
- Pengguna ingin memakai fitur: `docs/for-users/use-md-writer-features.md`.
- Pengguna mengalami masalah: `docs/for-users/troubleshooting.md`.
- Developer ingin setup repo: `docs/for-developers/setup-local-development.md`.
- Developer ingin mulai branch: `docs/for-developers/start-a-feature-or-bugfix.md`.
- Developer ingin QA: `docs/for-developers/run-qa-before-merge-or-release.md`.
- Maintainer ingin release: `docs/for-developers/create-a-github-release.md`.
- Maintainer butuh aturan stabil: `docs/reference/`.
- Dokumen sudah historis: `docs/archive/`.

## Jangan campur konteks

- Jangan taruh instruksi development panjang di README pengguna.
- Jangan taruh tutorial pengguna di release checklist.
- Jangan jadikan archive sebagai instruksi aktif.
- Jangan duplikasi prosedur panjang; tautkan dokumen yang sudah ada.

## Update index

Setiap menambah, memindah, atau menghapus dokumen, update:

- `docs/README.md`,
- `docs/index.md`,
- `docs/.vitepress/config.ts` jika sidebar atau nav berubah,
- link terkait dari `README.md` atau `DEVELOPMENT.md` bila perlu.
