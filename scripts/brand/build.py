"""
Rebuilds Mouna's logo (M.ELQADD'ARTchitects) in the site palette from the original
artwork in brand-source/logo-original.jpg.

The original is a mockup on textured black paper, so the parts are separated:
the grey M is redrawn as an exact polygon traced from the artwork (geom.py), and
the Q ring, compass, construction lines and lettering are taken from the artwork
by brightness. Light version: M concrete + ink; dark version: dark grey M + paper.

Usage: python3 scripts/brand/build.py brand-source/logo-original.jpg public
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from geom import M_POLY, WINDOW, Q_INNER, Q_OUTER
from PIL import Image, ImageDraw, ImageFilter, ImageChops
src = Image.open(sys.argv[1]).convert('L'); out = sys.argv[2]
W, H = src.size; SS = 4
def mask(draw_fn):
    big = Image.new('L', (W * SS, H * SS), 0); draw_fn(ImageDraw.Draw(big)); return big.resize((W, H), Image.LANCZOS)
sc = lambda b: [v * SS for v in b]
m_poly = mask(lambda d: d.polygon([(x * SS, y * SS) for x, y in M_POLY], fill=255))
q_zone = mask(lambda d: d.ellipse(sc(Q_OUTER), fill=255))
GAP = 7  # the original separates the Q ring from the M with a thin dark gap
q_cut = (Q_OUTER[0] - GAP, Q_OUTER[1] - GAP, Q_OUTER[2] + GAP, Q_OUTER[3] + GAP)
m = mask(lambda d: (d.polygon([(x * SS, y * SS) for x, y in M_POLY], fill=255), d.rectangle(sc(WINDOW), fill=0), d.ellipse(sc(q_cut), fill=0)))
def ramp(lo, hi): return lambda v: 0 if v <= lo else 255 if v >= hi else int((v - lo) * 255 / (hi - lo))
soft = src.filter(ImageFilter.GaussianBlur(0.6))
general = soft.point(ramp(52, 105))     # lettering, construction lines, compass
in_m = soft.point(ramp(150, 200))       # inside the M: only clearly bright strokes, not its texture
ring = soft.point(ramp(45, 80))         # the Q ring: solid, including its darker metallic side
lines = Image.composite(in_m, general, m_poly.filter(ImageFilter.MaxFilter(13)))  # also just around the M, where the mockup adds a bevel highlight
lines = Image.composite(ring, lines, q_zone)
m = ImageChops.subtract(m, lines)
PALETTE = {'light': ((184, 181, 173), (23, 23, 23)), 'dark': ((70, 68, 64), (241, 239, 232))}
def render(variant, box):
    mcol, lcol = PALETTE[variant]
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    img.paste(Image.new('RGBA', (W, H), mcol + (255,)), (0, 0), m)
    img.paste(Image.new('RGBA', (W, H), lcol + (255,)), (0, 0), lines)
    return img.crop(box)
FULL = (160, 205, 1080, 962); MARK = (300, 205, 1050, 845)
os.makedirs(f'{out}/brand', exist_ok=True)
def fit(img, w=None, h=None):
    s = (w / img.width) if w else (h / img.height)
    return img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
for v in ('light', 'dark'):
    full = render(v, FULL); mark = render(v, MARK)
    full.save(f'{out}/brand/logo-{v}.png', optimize=True)            # full-resolution masters
    fit(full, w=760).save(f'{out}/brand/logo-{v}.webp', 'WEBP', quality=92, method=6)   # footer / about
    fit(mark, h=176).save(f'{out}/brand/mark-{v}.webp', 'WEBP', quality=92, method=6)   # header (44px @4x)
def icon(size, variant, bg, pad):
    mk = render(variant, MARK); s = (size * (1 - 2 * pad)) / max(mk.size)
    mk = mk.resize((round(mk.width * s), round(mk.height * s)), Image.LANCZOS)
    c = Image.new('RGBA', (size, size), bg); c.alpha_composite(mk, ((size - mk.width) // 2, (size - mk.height) // 2)); return c
PAPER, INK = (241, 239, 232, 255), (23, 23, 23, 255)
icon(180, 'light', PAPER, 0.12).convert('RGB').save(f'{out}/apple-touch-icon.png')
icon(512, 'light', PAPER, 0.1).save(f'{out}/brand/icon-512.png')
# small tab icons: dark square reads better at 16-32px
icon(64, 'dark', INK, 0.06).save(f'{out}/favicon-64.png')
icon(32, 'dark', INK, 0.04).save(f'{out}/favicon-32.png')
