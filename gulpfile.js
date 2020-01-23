/* eslint-disable */
const autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  cleanCSS = require('gulp-clean-css'),
  copyDepsYaml = './copydeps.yml',
  cssImporter = require('node-sass-css-importer')({
    import_paths: ['./scss']
  }),
  del = require('del'),
  eslint = require('gulp-eslint'),
  ghPages = require('gulp-gh-pages'),
  gulp = require('gulp'),
  handlebars = require('gulp-handlebars'),
  wrap = require('gulp-wrap'),
  declare = require('gulp-declare'),
  concat = require('gulp-concat'),
  log = require('fancy-log'),
  merge = require('merge-stream');
  newer = require('gulp-newer'),
  path = require('path'),
  reload = browserSync.reload,
  rename = require('gulp-rename'),
  rollup = require('rollup'),
  rollupBabel = require('rollup-plugin-babel'),
  rollupCommonjs = require('rollup-plugin-commonjs'),
  rollupResolve = require('rollup-plugin-node-resolve'),
  rollupUglify = require('rollup-plugin-uglify').uglify,
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  themeYaml = './theme.yml',
  year = new Date().getFullYear(),
  yaml = require('yamljs');

let copyDeps = yaml.load(copyDepsYaml);
let theme = yaml.load(themeYaml);

const babelConfig = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        exclude: ['transform-typeof-symbol']
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  },
  exclude: 'node_modules/**', // Only transpile our source code
  externalHelpersWhitelist: [ // Include only required helpers
    'defineProperties',
    'createClass',
    'inheritsLoose',
    'defineProperty',
    'objectSpread2'
  ],
};

getPaths = () => {
  return {
    here: './',
    pages: {
      all: ['pages/**/*'],
      configs: 'dist',
      bizdayla_css: 'pages/assets/bizdayla/css',
      bizdayla_fonts: 'pages/assets/bizdayla/fonts',
      bizdayla_js_context: 'pages/assets/bizdayla/js/context',
      bizdayla_js_custom: 'pages/assets/bizdayla/js/',
      bizdayla_js_partials: 'pages/assets/bizdayla/js/partials',
      bizdayla_js_hbs: 'pages/assets/bizdayla/js/hbs',
      bizdayla_img: 'pages/assets/bizdayla/img',
      folder: 'pages',
      html: 'pages/*.html',
      liquid: 'pages/**/*.liquid',
      liquidRoot: 'pages/',
      includes: 'pages/include/',
      layouts: 'pages/layouts'
    },
    src: {
      all: ['src/**/*'],
      bizdayla_css: 'src/css/**/*.css',
      bizdayla_favicon: ['src/*.ico', 'src/*.svg', 'src/*.png', 'src/*.webmanifest'],
      bizdayla_fonts: ['src/fonts/*.woff', 'src/fonts/*.woff2'],
      bizdayla_js_all: 'src/js/**/*',
      bizdayla_js_context: 'src/js/context/**/*.js',
      bizdayla_js_custom: 'src/js/*.js',
      bizdayla_js_helpers: 'src/js/helpers/**/*.js',
      bizdayla_js_partials: 'src/js/partials/**/*.hbs',
      bizdayla_js_templates: 'src/js/templates/**/*.hbs',
      bizdayla_html: 'src/*.html',
      bizdayla_img: 'src/img/**/*'
    },
    js: {
      all: "js/**/*",
      bootstrap: {
        all: [
          "./js/bootstrap/util.js",
          "./js/bootstrap/alert.js",
          "./js/bootstrap/button.js",
          "./js/bootstrap/carousel.js",
          "./js/bootstrap/collapse.js",
          "./js/bootstrap/dropdown.js",
          "./js/bootstrap/modal.js",
          "./js/bootstrap/tooltip.js",
          "./js/bootstrap/popover.js",
          "./js/bootstrap/scrollspy.js",
          "./js/bootstrap/toast.js",
          "./js/bootstrap/tab.js"
        ],
        index: "./js/bootstrap/index.js"
      },
      mrare: {
        all: "js/mrare/**/*.js",
        index: "js/mrare/index.js",
      }
    },
    scss: {
      all: 'scss/**/*',
      folder: 'scss',
      root: 'scss/*.scss',
      themeScss: ['scss/theme.scss', '!scss/user.scss', '!scss/user-variables.scss'],
    },
    assets: {
      all: 'pages/assets/**/*',
      folder: 'pages/assets',
      allFolders: ['pages/assets/bizdayla', 'pages/assets/css', 'pages/assets/img', 'pages/assets/fonts', 'pages/assets/video'],
    },
    configs: {
      cname: 'CNAME'
    },
    css: {
      folder: 'assets/css',
    },
    fonts: {
      all: 'assets/fonts/*.*',
      folder: 'assets/fonts',
    },
    images: {
      all: 'assets/img/*.*',
      folder: 'assets/img',
    },
    videos: {
      all: 'assets/video/*.*',
      folder: 'assets/video',
    },
    dist: {
      all: 'dist/**/*',
      assets: 'dist/assets',
      bizdayla_css: 'dist/assets/bizdayla/css',
      bizdayla_fonts: 'dist/assets/bizdayla/fonts',
      bizdayla_js: 'dist/assets/bizdayla/js',
      css: 'dist/assets/css',
      documentation: 'dist/documentation',
      folder: 'dist',
      fonts: 'dist/assets/fonts',
      img: 'dist/assets/img',
      js: 'dist/assets/js',
      jsSources: 'dist/js',
      packageFolder: '',
      pages: 'dist/pages',
      scssSources: 'dist/scss',
      video: 'dist/assets/video',
      exclude: ['!**/desktop.ini', '!**/.DS_store'],
    },
    copyDependencies: copyDeps,
  }
};

let paths = getPaths();

// DEFINE TASKS

gulp.task('clean:dist', function (done) {
  del.sync(paths.dist.all, {
    force: true
  });
  done();
});

// Copy html files to dist
gulp.task('html', function () {
  return gulp.src(paths.pages.all, {
      base: paths.pages.folder
    })
    .pipe(newer(paths.dist.folder))
    .pipe(gulp.dest(paths.dist.folder))
    .pipe(reload({
      stream: true
    }));
});

// Copy caname to pages
gulp.task('configs', () => {
  return gulp.src(paths.configs.cname, {
    allowEmpty: true,
  })
    .pipe(newer(paths.pages.configs))
    .pipe(gulp.dest(paths.pages.configs));
})

// Copy custom css to pages
gulp.task('bizdayla_css', () => {
  return gulp.src(paths.src.bizdayla_css)
    .pipe(gulp.dest(paths.pages.bizdayla_css))
});

// Copy favicon files to pages
gulp.task('bizdayla_favicon', () => {
  return gulp.src(paths.src.bizdayla_favicon)
    .pipe(gulp.dest(paths.pages.folder))
});

// Copy custom css to pages
gulp.task('bizdayla_fonts', () => {
  return gulp.src(paths.src.bizdayla_fonts)
    .pipe(gulp.dest(paths.pages.bizdayla_fonts))
});

// Copy template data to pages
gulp.task('bizdayla_js_context', () => {
  return gulp.src(paths.src.bizdayla_js_context)
    .pipe(gulp.dest(paths.pages.bizdayla_js_context))
});

// Copy custom js to pages
gulp.task('bizdayla_js_custom', () => {
  return gulp.src(paths.src.bizdayla_js_custom)
    .pipe(gulp.dest(paths.pages.bizdayla_js_custom))
});

// Transpile partials and templates and copy into pages
gulp.task('bizdayla_js_hbs', function() {

  let helpers = gulp.src([paths.src.bizdayla_js_helpers])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.registerHelper("scriptLoaderFromArray", arr => { let body = document.body; arr.forEach(url => { const script = document.createElement("script"); script.src = url; script.type="text/javascript"; body.append(script); }) });'));

  // Assume all partials start with an underscore
  // You could also put them in a folder such as source/templates/partials/*.hbs
  var partials = gulp.src([paths.src.bizdayla_js_partials])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          // Strip the extension and the underscore
          // Escape the output with JSON.stringify
          return JSON.stringify(path.basename(fileName, '.js'));
        }
      }
    }));

  var templates = gulp.src(paths.src.bizdayla_js_templates)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Bizdayla.templates',
      noRedeclare: true // Avoid duplicate declarations
    }));

  // Output both the partials and the templates as build/js/templates.js
  return merge(helpers, partials, templates)
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.pages.bizdayla_js_hbs));
});

gulp.task('src_html_to_pages_html', () => {
  return gulp.src(paths.src.bizdayla_html)
    .pipe(gulp.dest(paths.pages.folder))
})

gulp.task('src_img_to_pages_img', () => {
  return gulp.src(paths.src.bizdayla_img)
    .pipe(gulp.dest(paths.pages.bizdayla_img))
})

gulp.task('sass', function () {
  return gulp.src(paths.scss.themeScss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: [cssImporter]
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream({
      match: "**/theme*.css"
    }));
});

gulp.task('sass-min', function () {
  return gulp.src(paths.scss.themeScss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      importer: [cssImporter]
    }).on('error', sass.logError))
    .pipe(cleanCSS({
      compatibility: 'ie9'
    }))
    .pipe(autoprefixer())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream({
      match: "**/theme*.css"
    }));
});

gulp.task('bootstrapjs', async (done) => {
  let fileDest = 'bootstrap.js';
  const banner = `/*!
  * Bootstrap v${theme.bootstrap_version}
  * Copyright 2011-${year} The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */`;
  const external = ['jquery', 'popper.js'];
  const plugins = [
    rollupBabel(babelConfig),
    rollupUglify({
      output: {
        comments: "/^!/"
      }
    }),
  ];
  const globals = {
    jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
    'popper.js': 'Popper'
  };

  const bundle = await rollup.rollup({
    input: paths.js.bootstrap.index,
    external,
    plugins
  });

  await bundle.write({
    file: path.resolve(__dirname, `./${paths.dist.js}${path.sep}${fileDest}`),
    banner,
    globals,
    format: 'umd',
    name: 'bootstrap',
    sourcemap: true,
  });
  // Reload Browsersync clients
  reload();
  done();
});

gulp.task('mrarejs', async (done) => {
  gulp.src(paths.js.mrare.all)
    .pipe(eslint())
    .pipe(eslint.format());

  let fileDest = 'theme.js';
  const banner = `/*!
  * ${theme.name}
  * Copyright 2018-${year} Medium Rare (${theme.purchase_link})
  */`;
  const external = [...theme.scripts.external];
  const plugins = [
    rollupCommonjs(),
    rollupResolve({
      browser: true,
    }),
    rollupBabel(babelConfig),
    theme.minify_scripts === true ? rollupUglify({
      output: {
        comments: "/^!/"
      }
    }) : null,
  ];
  const globals = theme.scripts.globals;

  const bundle = await rollup.rollup({
    input: paths.js.mrare.index,
    external,
    plugins,
    onwarn: function (warning) {
      // Skip certain warnings
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }
      // console.warn everything else
      console.warn(warning.message);
    }
  });

  await bundle.write({
    file: path.resolve(__dirname, `./${paths.dist.js}${path.sep}${fileDest}`),
    banner,
    globals,
    format: 'umd',
    name: 'theme',
    sourcemap: true,
    sourcemapFile: path.resolve(__dirname, `./${paths.dist.js}${path.sep}${fileDest}.map`),
  });
  // Reload Browsersync clients
  reload();
  done();
});

// Assets
gulp.task('copy-assets', function () {
  return gulp.src(paths.assets.all, {
      base: paths.assets.folder
    })
    .pipe(newer(paths.dist.assets))
    .pipe(gulp.dest(paths.dist.assets))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('deps', async (done) => {
  await paths.copyDependencies.forEach(function (filesObj) {
    let files;
    if (typeof filesObj.files == 'object') {
      files = filesObj.files.map((file) => {
        console.log('[fileName]:', file);
        return `${filesObj.from}/${file}`;
      });
    } else {
      files = `${filesObj.from}/${filesObj.files}`;
    }

    gulp.src(files)
      .pipe(gulp.dest(filesObj.to, { overwrite: true }));
  });
  done();
});

// watch files for changes and reload
gulp.task('serve', function (done) {
  browserSync({
    server: {
      baseDir: './dist',
      index: "index.html"
    }
  });
  done();
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', () => {
  // console.log('[TEST]', gulp.src(paths.configs.cname))
  return gulp.src(paths.dist.all)
    .pipe(ghPages())
});

gulp.task('watch', function (done) {

  // PAGES
  // Watch only .html pages as they can be recompiled individually
  gulp.watch([paths.pages.html], {
    cwd: './'
  }, gulp.series('html', function reloadPage(done) {
    reload();
    done();
  }));

  gulp.watch([paths.src.bizdayla_html], {
    cwd: './'
  }, gulp.series(['src_html_to_pages_html'], function reloadPage(done) {
    reload();
    done();
  }));

  gulp.watch([paths.src.bizdayla_img], {
    cwd: './'
  }, gulp.series(['src_img_to_pages_img'], function reloadPage(done) {
    reload();
    done();
  }));
  
  gulp.watch([paths.src.bizdayla_css], {
    cwd: './'
  }, gulp.series('bizdayla_css', function reloadPage(done) {
    reload();
    done();
  }));
  
  gulp.watch([paths.src.bizdayla_js_all], {
    cwd: './'
  }, gulp.series('bizdayla_js_hbs', 'bizdayla_js_context', function reloadPage(done) {
    reload();
    done();
  }));

  // SCSS
  // Any .scss file change will trigger a sass rebuild
  gulp.watch([paths.scss.all], {
    cwd: './'
  }, gulp.series('sass'));

  // JS
  // Rebuild bootstrap js if files change
  gulp.watch([...paths.js.bootstrap.all], {
    cwd: './'
  }, gulp.series('bootstrapjs'));

  // Rebuild mrare js if files change
  gulp.watch([paths.js.mrare.all], {
    cwd: './'
  }, gulp.series('mrarejs'));

  // Rebuild mrare js if files change
  const assetsWatcher = gulp.watch([paths.assets.all, ...paths.assets.allFolders], {
    cwd: './'
  }, gulp.series('copy-assets'));

  assetsWatcher.on('change', function (path) {
    console.log('File ' + path + ' was changed');
  });

  assetsWatcher.on('unlink', function (path) {
    const changedDistFile = path.resolve(paths.dist.assets, path.relative(path.resolve(paths.assets.folder), event.path));
    console.log('File ' + path + ' was removed');
    del.sync(path);
  });

  done();
  // End watch task

});

gulp.task('default', gulp.series('clean:dist', 'deps', gulp.series('src_html_to_pages_html', 'src_img_to_pages_img', 'bizdayla_css', 'bizdayla_favicon', 'bizdayla_fonts', 'bizdayla_js_custom', 'bizdayla_js_context', 'bizdayla_js_hbs','sass', 'sass-min', 'bootstrapjs', 'mrarejs'), gulp.parallel('html', 'copy-assets'), gulp.series('configs', 'serve', 'watch')));

gulp.task('build', gulp.series('clean:dist', 'deps', gulp.series('src_html_to_pages_html', 'src_img_to_pages_img', 'bizdayla_css', 'bizdayla_favicon',  'bizdayla_fonts', 'bizdayla_js_custom', 'bizdayla_js_context', 'bizdayla_js_hbs', 'sass', 'sass-min', 'bootstrapjs', 'mrarejs'), gulp.parallel('html', 'copy-assets'), gulp.series('configs', 'deploy')));
