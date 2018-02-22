import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TILE_SIZE } from '../../constants/tiles';

export default function MapTile({ id, tileX, tileY, posX, posY, loading, onLoad }) {
    const className = classNames('img', { loading });

    const src = `/mandelbrot/${id}`;

    const style = {
        marginLeft: -posX,
        marginTop: -posY,
        left: tileX * TILE_SIZE,
        top: tileY * TILE_SIZE
    };

    return (
        <div className="map-tile" style={style}>
            <img src={src} className={className} onLoad={onLoad(id)} />
        </div>
    );
}

MapTile.propTypes = {
    id: PropTypes.string.isRequired,
    tileX: PropTypes.number.isRequired,
    tileY: PropTypes.number.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired
};

