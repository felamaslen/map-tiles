import { connect } from 'react-redux';
import { tileLoaded } from '../../actions/app.actions';
import React from 'react';
import MapViewer from '../../components/MapViewer';

function MapContainer(props) {
    return (
        <MapViewer {...props} />
    );
}

const mapStateToProps = state => ({
    tiles: state.tiles,
    posX: state.posX,
    posY: state.posY,
    width: state.width,
    height: state.height
});

const mapDispatchToProps = dispatch => ({
    onTileLoad: id => () => dispatch(tileLoaded(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);

