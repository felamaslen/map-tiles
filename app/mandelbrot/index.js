const { PNG } = require('pngjs');

const MAX_ITERATIONS = 1000;
const RESOLUTION = 200;
const TILE_SIZE_PIXELS = 240;
const MAP_RANGE = [-2, 1, -1, 1];

function recursiveMandelbrotSetTest(valX, valY, zTestX = 0, zTestY = 0, iteration = 0) {
    // test if Z = X + iY is in the mandelbrot set
    // note that this results in an approximation (i.e. high-likelihood guess)

    const zNextX = zTestX ** 2 - zTestY ** 2 + valX;
    const zNextY = 2 * zTestX * zTestY + valY;

    const zNextAbsoluteValue = zNextX ** 2 + zNextY ** 2;

    if (zNextAbsoluteValue <= 4) {
        if (iteration < MAX_ITERATIONS) {
            return recursiveMandelbrotSetTest(valX, valY, zNextX, zNextY, iteration + 1);
        }

        return true;
    }

    return false;
}

function generateTile(minX, maxY, tileSize) {
    const resolutionFactor = TILE_SIZE_PIXELS / RESOLUTION;

    const png = new PNG({
        width: TILE_SIZE_PIXELS,
        height: TILE_SIZE_PIXELS,
        filterType: -1
    });

    // using for loops for performance

    for (let iY = 0; iY < RESOLUTION; iY++) {

        const pixYStart = Math.floor(iY * resolutionFactor);
        const pixYEnd = Math.floor((iY + 1) * resolutionFactor);

        const valY = maxY - iY * tileSize / RESOLUTION;

        for (let iX = 0; iX < RESOLUTION; iX++) {

            const pixXStart = Math.floor(iX * resolutionFactor);
            const pixXEnd = Math.floor((iX + 1) * resolutionFactor);

            const valX = minX + tileSize * iX / RESOLUTION;

            const valInSet = recursiveMandelbrotSetTest(valX, valY);
            const color = 0xff * (!valInSet >> 0);

            for (let pixY = pixYStart; pixY < pixYEnd; pixY++) {
                for (let pixX = pixXStart; pixX < pixXEnd; pixX++) {

                    const index = (png.width * pixY + pixX) << 2;

                    png.data[index] = color;
                    png.data[index + 1] = color;
                    png.data[index + 2] = color;
                    png.data[index + 3] = 0xff;
                }
            }
        }
    }

    return png.pack();
}

function getRangeFromTile(tileX, tileY) {
    const tileSize = 2;

    const minX = MAP_RANGE[0] + tileX * tileSize;
    const maxY = MAP_RANGE[3] - tileY * tileSize;

    return { minX, maxY, tileSize };
}

function routeMandelbrot() {
    return (req, res) => {
        const tileX = Math.round(Number(req.params.posX) || 0);
        const tileY = Math.round(Number(req.params.posY) || 0);

        const { minX, maxY, tileSize } = getRangeFromTile(tileX, tileY);

        const png = generateTile(minX, maxY, tileSize);

        res.setHeader('Content-type', 'image/png');

        png.pipe(res);
    };
}

module.exports = { routeMandelbrot };

