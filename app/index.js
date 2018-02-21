/* eslint-disable global-require */

const path = require('path');
const express = require('express');
const { version } = require('../package.json');
const { routeMandelbrot } = require('./mandelbrot');

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    require('dotenv').config();
}

function setupDevServer(app) {
    if (process.env.SKIP_APP !== 'true' && process.env.NODE_ENV === 'development') {
        const config = require('../webpack.config')();
        const compiler = require('webpack')(config);

        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: config.output.publicPath,
            stats: {
                colors: true,
                modules: false,
                chunks: false,
                reasons: false
            },
            hot: true,
            quiet: false,
            noInfo: false
        }));

        app.use(require('webpack-hot-middleware')(compiler, {
            log: console.log
        }));
    }
}

function setupViews(app) {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../src/templates'));

    setupDevServer(app);

    app.use('/', express.static(path.join(__dirname, '../static')));

    app.get('/*', (req, res) => res.render('index', {
        htmlWebpackPlugin: {
            options: {
                version
            }
        }
    }));
}

function setupMandelbrot(app) {
    app.get('/mandelbrot/:posX/:posY/:zoom?', routeMandelbrot());
}

function run() {
    const app = express();

    setupMandelbrot(app);

    setupViews(app);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log('App listening on port', port);
    });
}

module.exports = { run };

