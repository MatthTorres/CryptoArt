#!/usr/bin/env python3
"""Genera los assets sociales de MarketPulse.

  assets/og-marketpulse.png     1200x630  tarjeta al compartir (Open Graph)
  assets/apple-touch-icon.png   180x180   icono en pantalla de inicio (iOS)

Reproduce la paleta de css/style.css (--bg-0 #0b0f1a, --bg-1 #10162a,
--accent #f2a900, --accent-2 #17e6b0) para que la tarjeta coincida con la web.

Uso:  python tools/make_social_image.py
"""
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
FONTS = r"C:\Windows\Fonts"
BOLD = os.path.join(FONTS, "segoeuib.ttf")
LIGHT = os.path.join(FONTS, "segoeuisl.ttf")

BG0 = (11, 15, 26)
BG1 = (16, 22, 42)
ACCENT = (242, 169, 0)
ACCENT2 = (23, 230, 176)
TEXT = (245, 247, 251)
MUTED = (185, 194, 214)
DIM = (124, 134, 160)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(len(a)))


def vgradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=lerp(top, bottom, y / max(1, h - 1)))
    return img


def diag_gradient(w, h, c1, c2):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = lerp(c1, c2, (x + y) / max(1, w + h - 2))
    return img


def gradient_text(img, xy, text, font, c1, c2):
    """Pinta `text` con un degradado horizontal usando la propia forma del texto."""
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).text(xy, text, font=font, fill=255)
    bbox = mask.getbbox()
    if not bbox:
        return
    x0, y0, x1, y1 = bbox
    grad = Image.new("RGB", img.size, c1)
    gd = ImageDraw.Draw(grad)
    for x in range(x0, x1 + 1):
        gd.line([(x, y0), (x, y1)], fill=lerp(c1, c2, (x - x0) / max(1, x1 - x0)))
    img.paste(grad, (0, 0), mask)


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def og_image():
    w, h = 1200, 630
    base = vgradient(w, h, BG1, BG0).convert("RGBA")

    # destellos de marca, igual que .bg-glow del sitio
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-220, -260, 520, 380], fill=ACCENT + (70,))
    gd.ellipse([720, 300, 1440, 860], fill=ACCENT2 + (55,))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(140)))

    d = ImageDraw.Draw(base)
    d.rounded_rectangle([28, 28, w - 29, h - 29], radius=28, outline=(255, 255, 255, 18), width=2)

    # icono de marca con degradado
    icon_size = 120
    icon = diag_gradient(icon_size, icon_size, ACCENT, ACCENT2).convert("RGBA")
    ImageDraw.Draw(icon).text(
        (icon_size / 2, icon_size / 2), "MP",
        font=ImageFont.truetype(BOLD, 54), fill=BG0, anchor="mm",
    )
    icon.putalpha(rounded_mask((icon_size, icon_size), 30))
    base.alpha_composite(icon, (96, 96))

    # logotipo: Market en blanco + Pulse con degradado
    x_title, y_title = 96 + icon_size + 34, 104
    d = ImageDraw.Draw(base)
    f_title = ImageFont.truetype(BOLD, 78)
    d.text((x_title, y_title), "Market", font=f_title, fill=TEXT)
    x_pulse = x_title + d.textlength("Market", font=f_title) + 16
    gradient_text(base, (x_pulse, y_title), "Pulse", f_title, ACCENT, ACCENT2)

    d = ImageDraw.Draw(base)
    d.text((96, 96 + icon_size + 58), "Cripto · Metales · Forex — Análisis diario",
           font=ImageFont.truetype(LIGHT, 44), fill=MUTED)
    d.text((96, 96 + icon_size + 124),
           "Fundamental + Técnico · Probabilidades · Rango estimado del día",
           font=ImageFont.truetype(LIGHT, 31), fill=DIM)

    # barra de acento inferior
    base.alpha_composite(diag_gradient(260, 8, ACCENT, ACCENT2).convert("RGBA"), (96, h - 96))

    out = os.path.join(ASSETS, "og-marketpulse.png")
    base.convert("RGB").save(out, optimize=True)
    return out


def touch_icon():
    size = 180
    tile = diag_gradient(size, size, ACCENT, ACCENT2)
    ImageDraw.Draw(tile).text(
        (size / 2, size / 2), "MP",
        font=ImageFont.truetype(BOLD, 76), fill=BG0, anchor="mm",
    )
    # fondo opaco por si el SO aplica su propia máscara
    canvas = Image.new("RGBA", (size, size), BG0 + (255,))
    canvas.paste(tile.convert("RGBA"), (0, 0), rounded_mask((size, size), 40))
    out = os.path.join(ASSETS, "apple-touch-icon.png")
    canvas.convert("RGB").save(out, optimize=True)
    return out


if __name__ == "__main__":
    for path in (og_image(), touch_icon()):
        with Image.open(path) as im:
            print(f"{os.path.relpath(path, ROOT)} -> {im.size[0]}x{im.size[1]} "
                  f"({os.path.getsize(path)} bytes)")
