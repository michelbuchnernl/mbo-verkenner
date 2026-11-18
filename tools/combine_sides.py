#!/usr/bin/env python3
"""Maak één vraagplaatje uit twee losse scènes van bestaande plaatjes.

Gebruik: combine_sides.py <bron_links.png> <L|R> <bron_rechts.png> <L|R> <doel.png>

De eerste bron levert de linkerscène van het nieuwe plaatje, de tweede de
rechterscène. L of R zegt welke helft van de bron wordt gebruikt. De
afgeronde hoeken en de achtergrondtint worden overgenomen van de eerste bron.
"""
import sys
import numpy as np
from PIL import Image
from swap_sides import ink_columns, find_gap, column_tone

def load(path):
    im = np.array(Image.open(path).convert('RGBA'))
    alpha, rgb = im[..., 3].copy(), im[..., :3].copy()
    H, W = alpha.shape
    for y in range(H):
        op = np.where(alpha[y] >= 250)[0]
        if not len(op):
            continue
        a, b = op[0], op[-1]
        if a > 0:
            rgb[y, :a] = rgb[y, a:2 * a][::-1]
        if b < W - 1:
            k = W - 1 - b
            rgb[y, b + 1:] = rgb[y, b - k + 1:b + 1][::-1]
    return rgb, alpha

def panel(rgb, side, width):
    """Knip een paneel van `width` kolommen rond de scène in de gekozen helft."""
    W = rgb.shape[1]
    g, _ = find_gap(rgb)
    ink = ink_columns(rgb).sum(axis=0)
    lo, hi = (0, g) if side == 'L' else (g, W)
    cols = np.where(ink[lo:hi] > 1)[0] + lo
    centre = (cols[0] + cols[-1]) // 2
    start = min(max(centre - width // 2, 0), W - width)
    window = np.arange(start, start + width)
    other = (window >= g) if side == 'L' else (window < g)
    if ink[window[other]].sum() > 2:  # schuif weg van de andere scène
        start = max(g - width, 0) if side == 'L' else min(g, W - width)
    if cols[0] < start or cols[-1] >= start + width:
        raise SystemExit('scène past niet in een half plaatje')
    return rgb[:, start:start + width]

def combine(left_src, left_side, right_src, right_side, dst):
    rgb_l, alpha = load(left_src)
    rgb_r, _ = load(right_src)
    W = rgb_l.shape[1]
    half = W // 2
    new = np.concatenate([panel(rgb_l, left_side, half), panel(rgb_r, right_side, W - half)], axis=1)
    # Sommige bronnen hebben een lichte rand boven en onder; vervang die door
    # de gespiegelde rijen ernaast zodat de twee helften op elkaar aansluiten.
    edge = 5
    new[:edge] = new[edge:2 * edge][::-1]
    new[-edge:] = new[-2 * edge:-edge][::-1]
    tone_ref = column_tone(rgb_l, ink_columns(rgb_l))
    tone_new = column_tone(new, ink_columns(new))
    new = np.clip(new.astype(float) + (tone_ref - tone_new)[None, :, :], 0, 255).astype(np.uint8)
    Image.fromarray(np.dstack([new, alpha]), 'RGBA').save(dst, optimize=True)

if __name__ == '__main__':
    combine(*sys.argv[1:6])
    print('geschreven:', sys.argv[5])
