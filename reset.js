var watch = require('watch'),
    fs = require('fs'),
    wrench = require('wrench'),
    minimist = require('minimist'),
    argv = require('minimist')(process.argv.slice(2)),
    exec = require('child_process').exec,
    usage = 'reset.js --version <VERSION> --config <Config PATH> [-r]',
    asarBuildFolder = 'Z:\\Projects\\runtime-core',
    version = argv['version'],
    launchConfig = argv['config'],
    reset = argv['r'],
    help = argv['h'],
    completionTrigger = asarBuildFolder + '\\staging\\core\\package.json', //currently the last thing in the grunt build-dev to get moved
    artifact = asarBuildFolder + '\\staging\\core',
    ofApp = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\runtime\\' + version + '\\OpenFin\\resources\\default_app',
    appASAR = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\runtime\\' + version + '\\OpenFin\\resources\\app.asar',
    ofCache = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\cache',
    killProcesses = 'taskkill /f /im "openfin.exe" /T',
    launcher = 'C:\\Users\\Dwaynekj\\AppData\\Local\\OpenFin\\runtime\\' + version + '\\OpenFin\\openfin.exe',
    launchCommand = launcher + ' -l -c --startup-url="' +launchConfig+ '"';

if (help || !version || !launchConfig) {
  console.log(argv);
  console.log(usage);
  return
}

if (reset){
    if (fs.existsSync(completionTrigger)) {
        if (fs.existsSync(ofApp)) {
          wrench.rmdirSyncRecursive(ofApp, false);
          console.log("deleted old default_app");
        }

        if (fs.existsSync(appASAR)) {
          wrench.rmdirSyncRecursive(appASAR, false);
          console.log("deleted app.asar");
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
    console.log('default_app updated!');
    }
}

exec(killProcesses, function(error, stdout, stderr) {
    console.log(killProcesses);
    console.log(stdout);
    console.log(stderr);
    if (fs.existsSync(ofCache)) {
        wrench.rmdirSyncRecursive(ofCache, false);
        console.log("deleted cache");
    }

    if (launchConfig){
      console.log(launchCommand);
      exec(launchCommand, function(error, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
      });
    }
});
