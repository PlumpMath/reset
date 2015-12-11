var watch = require('watch'),
    fs = require('fs'),
    wrench = require('wrench'),
    exec = require('child_process').exec,
    asarBuildFolder = 'Z:\\Projects\\runtime-core',
    version = process.argv[2],
    completionTrigger = asarBuildFolder + '\\staging\\core\\package.json', //currently the last thing in the grunt build-dev to get moved
    artifact = asarBuildFolder + '\\staging\\core',
    ofApp = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\runtime\\' + version + '\\OpenFin\\resources\\default_app',
    ofCache = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\cache',
    launcher = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\runtime\\' + version + '\\OpenFin\\openfin.exe';

//watch.watchTree(asarBuildFolder, function() {
    if (fs.existsSync(completionTrigger)) {
        if (fs.existsSync(ofApp)) {
          wrench.rmdirSyncRecursive(ofApp, false);
        }
        wrench.copyDirSyncRecursive(artifact, ofApp, {
            forceDelete: true, // Whether to overwrite existing directory or not
            excludeHiddenUnix: false, // Whether to copy hidden Unix files or not (preceding .)
            preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
            preserveTimestamps: false, // Preserve the mtime and atime when copying files
            inflateSymlinks: false // Whether to follow symlinks or not when copying files
            // filter: regexpOrFunction, // A filter to match files against; if matches, do nothing (exclude).
            // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
            // include: regexpOrFunction, // An include filter (either a regexp or a function)
            // exclude: regexpOrFunction // An exclude filter (either a regexp or a function)
        });
        console.log('changed!');
        exec('taskkill /f /im "OpenFinRVM.exe" /T', function(error, stdout, stderr) {

            if (fs.existsSync(ofCache)) {

                wrench.rmdirSyncRecursive(ofCache, false);
            }
        });
    }
//});
