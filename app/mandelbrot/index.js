const { spawn } = require('child_process');
const path = require('path');

const MAP_RANGE = [-2, 1, -1, 1];
const MAX_ZOOM = 10;

function getRangeFromTile(tileX, tileY, zoom) {
    const maxTileSize = Math.min(MAP_RANGE[3] - MAP_RANGE[2], MAP_RANGE[1] - MAP_RANGE[0]);
    const minTileSize = maxTileSize / 1000;

    const tileSize = maxTileSize + (minTileSize - maxTileSize) * zoom / MAX_ZOOM;

    const minX = MAP_RANGE[0] + tileX * tileSize;
    const maxY = MAP_RANGE[3] - tileY * tileSize;

    return { minX, maxY, tileSize };
}

function generateTile(minX, maxY, tileSize) {
    const child = spawn(path.join(__dirname, '../../lib/mandelbrot/mandelbrot'), [minX, maxY, tileSize]);

    return child.stdout;
}

function routeMandelbrot() {
    return (req, res) => {
        const tileX = Math.round(Number(req.params.posX) || 0);
        const tileY = Math.round(Number(req.params.posY) || 0);
        const zoom = Math.min(MAX_ZOOM, Math.max(0, Math.floor(Number(req.params.zoom) || 0)));

        const { minX, maxY, tileSize } = getRangeFromTile(tileX, tileY, zoom);

        const png = generateTile(minX, maxY, tileSize);

        res.setHeader('Content-type', 'image/png');

        png.pipe(res);
    };
}

module.exports = { routeMandelbrot };

