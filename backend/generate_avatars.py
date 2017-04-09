from os import listdir
from os.path import isfile, join
from PIL import Image, ImageOps, ImageDraw


IMAGES_PATH = './images'
FILES = [f for f in listdir(IMAGES_PATH)
         if isfile(join(IMAGES_PATH, f))]

for f in FILES:
    size = (200, 200)
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask) 
    draw.ellipse((0, 0) + size, fill=255)
    im = Image.open(join(IMAGES_PATH, f))
    output = ImageOps.fit(im, mask.size, centering=(0.5, 0.5))
    output.putalpha(mask)
    output.save(join(IMAGES_PATH, f.split('.')[0] + '_avatar.png'))
