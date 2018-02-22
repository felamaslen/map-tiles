import { connect, Provider } from 'react-redux';
import { appLoaded } from '../../actions/app.actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import App from '../../components/App';

class Root extends Component {
    componentDidMount() {
        this.props.onLoad();
    }
    render() {
        return (
            <Provider store={this.props.store}>
                <App />
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    onLoad: () => dispatch(appLoaded())
});

export default connect(null, mapDispatchToProps)(Root);

