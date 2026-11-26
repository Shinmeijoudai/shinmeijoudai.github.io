"""Remove a flat magenta (#FF00FF-ish) background and return a clean transparent PNG."""
import sys
from PIL import Image, ImageFilter
import numpy as np

def key(src, dst, lo=45, hi=200):
    im = Image.open(src).convert('RGB')
    c = np.asarray(im).astype(np.float32)
    # Background colour: median of the border pixels.
    border = np.concatenate([c[:8].reshape(-1,3), c[-8:].reshape(-1,3), c[:, :8].reshape(-1,3), c[:, -8:].reshape(-1,3)])
    bg = np.median(border, axis=0)
    r, g, b = c[...,0], c[...,1], c[...,2]
    m = np.minimum(r, b) - g                       # "magenta-ness": high on background, low on the character
    alpha = 1 - np.clip((m - lo) / (hi - lo), 0, 1)
    # Remove magenta spill from edge pixels: un-mix the background colour.
    a = np.maximum(alpha, 1e-3)[..., None]
    fg = (c - (1 - a) * bg) / a
    fg = np.where(alpha[..., None] < 0.999, fg, c)
    # Any leftover pink cast on edges: pull red/blue down toward green where they exceed it.
    edge = (alpha > 0) & (alpha < 1)
    excess = np.clip(np.minimum(fg[...,0], fg[...,2]) - fg[...,1] - 10, 0, None) * edge
    fg[...,0] -= excess; fg[...,2] -= excess
    fg = np.clip(fg, 0, 255)
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8))
    # Drop isolated specks and very faint fringe.
    al = np.asarray(alpha_img.filter(ImageFilter.MedianFilter(3))).astype(np.float32)
    al[al < 12] = 0
    out = np.dstack([fg, al]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(dst, optimize=True)
    print(dst, 'bg', bg.round(), 'opaque px', int((al > 250).sum()))

if __name__ == '__main__':
    key(sys.argv[1], sys.argv[2])
