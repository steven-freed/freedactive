#!/usr/bin/env node

const colors = require('colors');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar');
const client = require('https');
const serve = require('./dev-server');

const HOST = 'steven-freed.github.io';
const PATH = '/freedactive/cli/hello-world.tar.gz';
const CREATE = colors.rainbow('THANK YOU ') +
                colors.magenta('for choosing') +
                colors.rainbow(' Freedactive! ') + 
                '🤙\n' +
                colors.magenta('Get started by looking at our documentation ') +
                colors.magenta('https://github.com/steven-freed/freedactive/tree/master/README.md\n') +
                colors.red('OR\n') +
                colors.magenta('Some examples ') +
                colors.magenta('https://github.com/steven-freed/freedactive/tree/master/examples');
const COMPONENT = (name) => colors.america(`Component ${name} has been created!`);

const generateProject = function(dir, callback) {

    if(fs.existsSync(dir))
        return callback(new Error('Project already exists'));
     
    const options = {
        hostname: HOST,
        path: PATH,
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip' }
    };

    client.request(options, (res) => {
        res
        .pipe(zlib.createGunzip())
        .pipe(tar.extract())
        .on('end', () => {
            rename(dir)
            .then(console.log(CREATE))
            .catch((err) => callback(err));    
        })
    })
    .on('error', () => callback(new Error('Network error obtaining boilerplate code from Freedactive')))
    .end();

};

const rename = function(dir) {
    return new Promise(function(resolve, reject) {
        try {
            const oldIndex = 'hello-world/index.html';
            const oldDir = 'hello-world/';
            let buf = fs.readFileSync(oldIndex, 'utf8');
            buf = buf.replace(/<title>(.*?)<\/title>/g, '<title>' + dir + '</title>');
            fs.writeFileSync(oldIndex, buf, 'utf8');
            fs.renameSync(oldDir, dir);
            resolve();
        } catch {
            reject('Opps Something went wrong 😬');
        }
    });
};

const generateComponent = function(args, callback) {
    const identifier = args.component.toLowerCase().replace(" ", "-");
    args.component = args.component.replace(" ", "");
    let componentJs, componentCss;
    if (args['-es'] === undefined) args['-es'] = 5;
    if (parseInt(args['-es']) === 5) {
        componentJs = `${args.component}.prototype = new Component;\n\n` +
            `function ${args.component}() { /* constructor */ }\n\n` + 
            `${args.component}.prototype.markup = function() {\n` +
            `\treturn ('<div id="${identifier}"><h1>Component ${args.component}</h1></div>');\n` +
            `}\n\n` +
            `${args.component}.prototype.componentMounted = function() { /* component has been mounted to DOM */ }`;
            componentCss = `#${identifier} {\n\ttext-align: center;\n\tdisplay: inline-block;\n}`;
    } else if (parseInt(args['-es']) === 6) {
        componentJs = `class ${args.component} extends Component {\n\n` +
            `\tconstructor() {\n` +
            `\t\tsuper();\n` +
            `\t}\n\n` +
            `\tmarkup() {\n` +
            `\t\treturn (\`<div id="${identifier}"><h1>Component ${args.component}</h1></div>\`);\n` +
            `\t}\n\n` +
            `\tcomponentMounted() { /* component has been mounted to DOM */ }\n\n` +
            `}`
            componentCss = `#${identifier} {\n\ttext-align: center;\n\tdisplay: inline-block;\n}`;
    }
    fs.writeFileSync(`${args.component}.js`, componentJs);
    fs.writeFileSync(`${args.component}.css`, componentCss);
    callback(COMPONENT(args.component));
};

const createApp = function(dir, callback) {
    if(!dir)
        return callback(new Error('The "create" command should be followed by your projects name'));
    
    generateProject(dir, (err) => err ? console.log(colors.red(err)) : null);
};

const createComponent = function(args, callback) {
    if(args.component === undefined)
        return callback(new Error('No component name specified'));
    else 
        generateComponent(args, (res) => console.log(res));
};

var args = {};
switch(process.argv[2]) {
    case 'create':
        createApp(process.argv[3], (err) => err ? console.log(colors.red(err)) : null);
        break;
    case 'serve':
        args = {
            '-p': process.argv[4]
        }
        if(args['-p'])
            serve(parseInt(args['-p']));
        else
            serve();
        break;
    /*case 'build':
        args = {
            '-d': process.argv[3] === '-d' ? process.argv[4] : process.argv[6],
            '-es': process.argv[3] === '-es' ? process.argv[4] : process.argv[6]
        }
        createBuild(args);
        break;*/
    case 'component':
        args = {
            'component': process.argv[2] == 'component' ? process.argv[3] : process.argv[5],
            '-es': process.argv[2] == '-es' ? process.argv[3] : process.argv[5] 
        }
        createComponent(args, (err) => err ? console.log(colors.red(err)) : null);
        break;
    default:
        break;
};




/*
const createBuild = async function(args) {
    var dir = args['-d'] ? args['-d'] : '.';
    minifyCode(dir, parseInt(args['-es']));
};

function minifyCode(dir, es=5) {
    var outputDir = 'prod/';
    var paths = {
        assets: {
          */ // src: dir + '/**/*.{jpg,gif,png,bmp}', 
           /* dest: outputDir
        },
        markup: {
          */ // src: dir + '/**/*.html',
          /*  dest: outputDir
        },
        styles: {
         */ // src: dir + '/**/*.css',
         /* dest: outputDir
        },
        scripts: {
        */ // src: dir + '/**/*.js',
         /* dest: outputDir
        }
    };
    
    gulp.task('script', function() {
        return gulp.src(paths.scripts.src, { sourcemaps: true })
            .pipe(babel())
            .pipe(concat(paths.scripts.dest))
            .pipe(uglify())
            .pipe(grename({
                basename: 'main',
                suffix: '.min',
                extname: '.js'
            }))
            .pipe(gulp.dest(paths.scripts.dest));
    });

    gulp.task('style', function() {
        return gulp.src(paths.styles.src)
            .pipe(concat(paths.scripts.dest))
            .pipe(less())
            .pipe(cleanCSS())
            .pipe(grename({
                basename: 'main',
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.styles.dest));
    });

    gulp.task('markup', function() {
        return gulp.src(paths.markup.src)
            .pipe(gulp.dest(paths.markup.dest));
    });

    gulp.task('assets', function() {
        return gulp.src(paths.assets.src)
            .pipe(gulp.dest(paths.assets.dest));
    });

    gulp.task('clean', function() {
        return del([outputDir]);
    });

    gulp.series(gulp.task('clean'), gulp.parallel(gulp.task('style'),
                                    gulp.task('script'),
                                    gulp.task('markup'),
                                    gulp.task('assets')))();
    console.log(colors.magenta('Production bundle ready in directory "' + outputDir + '" ') + '🤙');
}*/