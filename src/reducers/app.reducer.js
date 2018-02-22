import { TILE_SIZE } from '../constants/tiles';

const getTileId = (tileX, tileY, zoom) => `${tileX}/${tileY}/${zoom}`;

export function onTileRequested(state) {
    // divide the map into a grid of tiles
    const offsetX = state.posX % TILE_SIZE;
    const offsetY = state.posY % TILE_SIZE;

    const numSquaresX = Math.ceil(state.width / TILE_SIZE);
    const numSquaresY = Math.ceil(state.height / TILE_SIZE);

    const missingTile = new Array(numSquaresY).fill(0)
        .map(() => new Array(numSquaresX).fill(0))
        .reduce((missing, itemY, row) => {
            if (missing) {
                return missing;
            }

            return itemY.reduce((last, itemX, col) => {
                if (last) {
                    return last;
                }

                const haveTile = Boolean(state.tiles.find(({ tileX, tileY }) => {
                    return tileX * TILE_SIZE - offsetX === col * TILE_SIZE &&
                        tileY * TILE_SIZE - offsetY === row * TILE_SIZE;
                }));

                if (!haveTile) {
                    return { row, col };
                }

                return null;

            }, null);
        }, null)

    if (!missingTile) {
        return state;
    }

    const { col: tileX, row: tileY } = missingTile;
    const id = getTileId(tileX, tileY, state.zoom);
    const zoom = state.zoom;
    const loading = true;

    return {
        ...state,
        tiles: [
            ...state.tiles,
            { id, tileX, tileY, zoom, loading }
        ]
    };
}

export function onTileLoaded(state, { id }) {
    return {
        ...state,
        tiles: state.tiles.map(tile => {
            if (tile.id === id) {
                return { ...tile, loading: false };
            }

            return tile;
        })
    };
}

