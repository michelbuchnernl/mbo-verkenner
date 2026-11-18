#!/usr/bin/env python3
"""Wissel de linker- en rechterscene van een RIASOC-vraagplaatje om.

Gebruik: swap_sides.py <bron.png> <doel.png>
De snede ligt in de lege band rond het midden; de afgeronde hoeken en de
achtergrondtint (lichte vignettering) blijven op hun plek.
"""
import sys
import numpy as np
from PIL import Image

def ink_columns(rgb):
    lum = rgb.astype(int).mean(axis=2)
    return (lum > np.median(lum) + 60)

def find_gap(rgb):
    col = ink_columns(rgb).sum(axis=0)
    W = rgb.shape[1]
    lo, hi = int(W * .3), int(W * .7)
    best, start = (0, 0, 0), None
    for x in range(lo, hi + 1):
        if x < hi and col[x] <= 1:
            if start is None:
                start = x
        elif start is not None:
            if x - start > best[0]:
                best = (x - start, start, x)
            start = None
    if best[0] < 12:
        raise SystemExit(f'geen schone band in het midden (breedte {best[0]} px)')
    return (best[1] + best[2]) // 2, best[0]

def column_tone(rgb, ink):
    """Mediane achtergrondkleur per kolom (zonder krijtlijnen), gladgestreken."""
    H, W, _ = rgb.shape
    prof = np.zeros((W, 3))
    for x in range(W):
        px = rgb[:, x][~ink[:, x]]
        prof[x] = np.median(px, axis=0) if len(px) else np.nan
    for c in range(3):
        v = prof[:, c]
        ok = ~np.isnan(v)
        v[~ok] = np.interp(np.flatnonzero(~ok), np.flatnonzero(ok), v[ok])
        k = 21
        pad = np.pad(v, k // 2, mode='edge')
        prof[:, c] = np.convolve(pad, np.ones(k) / k, mode='valid')
    return prof

def swap(src, dst):
    im = np.array(Image.open(src).convert('RGBA'))
    H, W = im.shape[:2]
    alpha = im[..., 3].copy()
    rgb = im[..., :3].copy()
    for y in range(H):  # transparante hoeken vullen met gespiegelde buurpixels
        op = np.where(alpha[y] >= 250)[0]
        if not len(op):
            continue
        a, b = op[0], op[-1]
        if a > 0:
            rgb[y, :a] = rgb[y, a:2 * a][::-1]
        if b < W - 1:
            k = W - 1 - b
            rgb[y, b + 1:] = rgb[y, b - k + 1:b + 1][::-1]
    g, width = find_gap(rgb)
    ink = ink_columns(rgb)
    tone_before = column_tone(rgb, ink)
    new = np.concatenate([rgb[:, g:], rgb[:, :g]], axis=1).astype(float)
    ink_new = np.concatenate([ink[:, g:], ink[:, :g]], axis=1)
    tone_after = column_tone(new.astype(np.uint8), ink_new)
    shift = tone_before - tone_after  # additief: laat de witte krijtlijnen ongemoeid
    new = np.clip(new + shift[None, :, :], 0, 255).astype(np.uint8)
    Image.fromarray(np.dstack([new, alpha]), 'RGBA').save(dst, optimize=True)
    return g, width

if __name__ == '__main__':
    g, w = swap(sys.argv[1], sys.argv[2])
    print(f'{sys.argv[2]}: snede op x={g}, lege band {w}px')
