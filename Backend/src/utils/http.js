export const ok = (res, data) => res.json({ ok: true, data });
export const created = (res, data) => res.status(201).json({ ok: true, data });
export const badRequest = (res, message) => res.status(400).json({ ok: false, message });
export const notFound = (res, message) => res.status(404).json({ ok: false, message });
