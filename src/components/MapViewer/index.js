import React from 'react';
import PropTypes from 'prop-types';
import MapTile from '../MapTile';

export default function MapViewer({ tiles, posX, posY, width, height, onTileLoad }) {
    const tileViews = tiles.map(tile => (
        <MapTile key={tile.id} {...tile} posX={posX} posY={posY} onLoad={onTileLoad} />
    ));

    const style = { width, height };

    return (
        <div className="map-viewer" style={style}>
            {tileViews}
        </div>
    );
}

MapViewer.propTypes = {
    tiles: PropTypes.array.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onTileLoad: PropTypes.func.isRequired
};

