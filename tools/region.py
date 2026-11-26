"""Swap in only the part of a frame that really changed (e.g. a waving arm) onto the base frame."""
import sys
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
def region(base, frame, out, keep=1, grow=14, feather=6):
    A = Image.open(base).convert('RGB'); F = Image.open(frame).convert('RGB')
    d = np.abs(np.asarray(A).astype(int) - np.asarray(F).astype(int)).sum(2)
    blur = np.asarray(Image.fromarray(np.clip(d, 0, 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(12))) > 40
    lab, n = ndimage.label(blur)
    sizes = ndimage.sum(blur, lab, range(1, n + 1))
    big = np.argsort(sizes)[::-1][:keep] + 1
    m = ndimage.binary_dilation(np.isin(lab, big), iterations=grow)
    mask = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(feather))
    Image.composite(F, A, mask).save(out)
if __name__ == '__main__':
    region(sys.argv[1], sys.argv[2], sys.argv[3], keep=int(sys.argv[4]) if len(sys.argv) > 4 else 1)
