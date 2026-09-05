"""Generate the PWA icons using only Python's standard library."""

from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "icons"
SIZES = (192, 512)


def put_pixel(pixels: bytearray, size: int, x: int, y: int, color: tuple[int, int, int, int]) -> None:
    if 0 <= x < size and 0 <= y < size:
        offset = (y * size + x) * 4
        pixels[offset : offset + 4] = bytes(color)


def draw_shape(size: int, scale: int = 4) -> bytearray:
    raster_size = size * scale
    pixels = bytearray(raster_size * raster_size * 4)

    for y in range(raster_size):
        for x in range(raster_size):
            put_pixel(pixels, raster_size, x, y, (9, 9, 9, 255))

    def distance_to_segment(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
        dx, dy = bx - ax, by - ay
        length_squared = dx * dx + dy * dy
        if length_squared == 0:
            return math.hypot(px - ax, py - ay)
        t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / length_squared))
        return math.hypot(px - (ax + t * dx), py - (ay + t * dy))

    def paint_circle(cx: float, cy: float, radius: float, stroke: float, color: tuple[int, int, int, int]) -> None:
        for y in range(raster_size):
            for x in range(raster_size):
                px, py = x + 0.5, y + 0.5
                distance = abs(math.hypot(px - cx, py - cy) - radius)
                if distance <= stroke / 2:
                    put_pixel(pixels, raster_size, x, y, color)

    def paint_line(ax: float, ay: float, bx: float, by: float, width: float, color: tuple[int, int, int, int]) -> None:
        for y in range(raster_size):
            for x in range(raster_size):
                if distance_to_segment(x + 0.5, y + 0.5, ax, ay, bx, by) <= width / 2:
                    put_pixel(pixels, raster_size, x, y, color)

    center = raster_size / 2
    ivory = (241, 238, 232, 255)
    blue = (95, 168, 255, 255)
    radius = raster_size * 0.29
    stroke = raster_size * 0.045

    paint_circle(center, center, radius, stroke, ivory)
    paint_line(center, center, center, center - radius * 0.62, stroke * 0.9, blue)
    paint_line(center, center, center + radius * 0.58, center + radius * 0.28, stroke * 0.9, blue)
    paint_circle(center, center, stroke * 0.62, stroke * 1.24, blue)

    # Downsample with a simple box filter for clean edges without dependencies.
    output = bytearray(size * size * 4)
    for y in range(size):
        for x in range(size):
            channels = [0, 0, 0, 0]
            for sy in range(scale):
                for sx in range(scale):
                    offset = (((y * scale + sy) * raster_size) + x * scale + sx) * 4
                    for channel in range(4):
                        channels[channel] += pixels[offset + channel]
            offset = (y * size + x) * 4
            output[offset : offset + 4] = bytes(value // (scale * scale) for value in channels)
    return output


def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF)


def write_png(path: Path, size: int, pixels: bytearray) -> None:
    rows = b"".join(b"\x00" + pixels[y * size * 4 : (y + 1) * size * 4] for y in range(size))
    png = b"\x89PNG\r\n\x1a\n"
    png += png_chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += png_chunk(b"IDAT", zlib.compress(rows, 9))
    png += png_chunk(b"IEND", b"")
    path.write_bytes(png)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        output = OUTPUT_DIR / f"pwa-{size}.png"
        write_png(output, size, draw_shape(size))
        print(f"generated {output}")


if __name__ == "__main__":
    main()
