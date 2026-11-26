"""Paste only the eye area of a frame onto the base frame, so blinks never shimmer."""
import sys
from PIL import Image, ImageDraw, ImageFilter
def eyes(base, frame, out, boxes):
    A = Image.open(base).convert('RGB'); F = Image.open(frame).convert('RGB')
    m = Image.new('L', A.size, 0); d = ImageDraw.Draw(m)
    for b in boxes: d.ellipse(b, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(8))
    Image.composite(F, A, m).save(out)
EYES = [(385, 425, 550, 560), (570, 425, 735, 560)]
if __name__ == '__main__':
    eyes(sys.argv[1], sys.argv[2], sys.argv[3], EYES)
