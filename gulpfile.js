const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;


let browserHost = () => {
    browserSync.init({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: `./temp`,
        },
        open: true,
    });

    watch(`dev/html/*.html`, series(copyHTML)).on(`change`, reload);
    watch(`dev/js/*.js`, series(lintJS, transpileJSForProd)).on(`change`, reload);
    watch(`dev/css/*.css`, series(lintCSS)).on(`change`, reload);
};

let lintJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/dev/js`));
};

let compressHTML = () => {
    return src(`dev/html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/dev/html`));
};

let transpileJSForProd = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/dev/js`));
};

let copyHTML = () => {
    return src(`dev/html/*html`)
        .pipe(dest(`temp`));
};

let lintCSS = () => {
    return src(`dev/css/style.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let copyUnprocessedAssetsForDev = () => {
    return src([
        `json*/*.json`,
        `dev/css*/*.css`,
        `dev/html/index.html`
    ], {dot: true})
        .pipe(dest(`temp`));
};

let serve = () => {
    browserSync({
        notify: true,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `dev`,
                `dev/html`
            ]
        }
    });

    watch(`dev/js/*.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`dev/css/*.css`)
        .on(`change`, reload);
};


exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.transpileJSForProd = transpileJSForProd;
exports.copyUnprocessedAssetsForDev = copyUnprocessedAssetsForDev;
exports.lintCSS = lintCSS;
exports.default = series(
    lintJS,
    lintCSS,
    transpileJSForDev,
    copyUnprocessedAssetsForDev,
    serve,
    browserHost
);
exports.build = series(
    compressHTML,
    transpileJSForProd,
);
