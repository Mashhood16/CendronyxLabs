from PIL import Image

# Load the ruined image
img = Image.open('public/logo.png').convert('RGBA')
pixels = img.load()
width, height = img.size

new_img = Image.new("RGB", (width, height))
new_pixels = new_img.load()

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Reconstruct original
        r_orig = int((r / 255.0) * a)
        g_orig = int((g / 255.0) * a)
        b_orig = int((b / 255.0) * a)
        new_pixels[x, y] = (r_orig, g_orig, b_orig)

# Wait, the thresholding artifacts are already baked in. Let's apply a threshold now to clean it up!
# The original JPEG had compression artifacts. By reconstructing it, we get the exact same compression artifacts.
# Let's clean up the background by setting any pixel where max(R,G,B) < 40 to pure black!
for y in range(height):
    for x in range(width):
        r, g, b = new_pixels[x, y]
        if max(r, g, b) < 40:
            new_pixels[x, y] = (0, 0, 0)

new_img.save('public/logo.jpg')
print("Successfully restored logo.jpg with a pure black background!")
