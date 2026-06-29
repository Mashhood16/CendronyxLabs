from PIL import Image

# Load image
img = Image.open('public/logo.png').convert('RGB')
pixels = img.load()

width, height = img.size
new_img = Image.new("RGBA", (width, height))
new_pixels = new_img.load()

for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        # Calculate alpha as the maximum of R, G, B channels
        a = max(r, g, b)
        
        if a > 0:
            # Normalize RGB channels by alpha
            r_new = min(255, int((r / a) * 255))
            g_new = min(255, int((g / a) * 255))
            b_new = min(255, int((b / a) * 255))
            new_pixels[x, y] = (r_new, g_new, b_new, a)
        else:
            new_pixels[x, y] = (0, 0, 0, 0)

out_img = new_img.resize((width // 4, height // 4), Image.Resampling.LANCZOS)
out_img.save('public/logo.png')
print("Successfully converted logo.png to a transparent PNG!")
