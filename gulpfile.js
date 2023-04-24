const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    cleanCSS = require(`gulp-clean-css`),
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `firefox`;

let compileCSSForDev = (`minify-css`, () => {
    return src(`dev/css/*.css`)
        .pipe(cleanCSS({compatibility: `ie8`}))
        .pipe(dest(`temp/css`));
});

let lintJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsLinter(`.eslintrc`))
        .pipe(jsLinter.formatEach(`compact`));
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

let transpileJSForDev = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let compressHTML = () => {
    return src([`dev/html/index.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compileCSSForProd = (`minify-css`, () => {
    return src(`dev/css/*.css`)
        .pipe(cleanCSS({compatibility: `ie8`}))
        .pipe(dest(`prod/css`));
});

let transpileJSForProd = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let copyUnprocessedAssetsForDev = () => {
    return src([
        `dev/html/index.html`    // index.html
    ], {dot: true})
        .pipe(dest(`temp`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
            ]
        }
    });

    watch(`dev/js/app.js`, series(lintJS , transpileJSForDev))
        .on(`change`, reload);

    watch(`dev/css/style.css`, series(lintCSS, compileCSSForDev))
        .on(`change`, reload);

    watch(`dev/html/*.html`, copyUnprocessedAssetsForDev)
        .on(`change`, reload);
};

exports.compileCSSForDev = compileCSSForDev;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.compileCSSForProd = compileCSSForProd;
exports.transpileJSForProd = transpileJSForProd;
exports.copyUnprocessedAssetsForDev = copyUnprocessedAssetsForDev;
exports.lintCSS = lintCSS;
exports.default = series(
    copyUnprocessedAssetsForDev,
    lintCSS,
    compileCSSForDev,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    compileCSSForProd,
    transpileJSForProd,
);
