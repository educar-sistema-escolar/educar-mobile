const { getDefaultConfig } = require('expo/metro-config');
const fs = require('node:fs');
const path = require('node:path');

// Windows can report OneDrive reparse points as symlinks in Dirent, while
// lstat correctly identifies them as ordinary files/directories.
if (process.platform === 'win32') {
  const readdir = fs.readdir;
  fs.readdir = function (directory, options, callback) {
    if (!options?.withFileTypes || typeof callback !== 'function') {
      return readdir.apply(this, arguments);
    }
    return readdir.call(this, directory, options, (error, entries) => {
      if (!error) entries = entries.map(entry => {
        if (!entry.isSymbolicLink()) return entry;
        let stat;
        try { stat = fs.lstatSync(path.join(String(directory), entry.name)); }
        catch { return entry; }
        if (stat.isSymbolicLink()) return entry;
        return new Proxy(entry, { get(target, property) {
          if (typeof property === 'string' && property.startsWith('is') && typeof stat[property] === 'function') return stat[property].bind(stat);
          return Reflect.get(target, property);
        } });
      });
      callback(error, entries);
    });
  };
}

const config = getDefaultConfig(__dirname);
// Use Node's filesystem crawler for OneDrive files on Windows.
if (process.platform === 'win32') config.resolver.useWatchman = false;

module.exports = config;
