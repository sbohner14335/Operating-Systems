var TSOS;
(function (TSOS) {
    var FileSystemDriver = (function () {
        function FileSystemDriver() {
            this.formatted = false;
        }
        // Used for initializing an HDD block.
        FileSystemDriver.prototype.formatBlock = function () {
            var formatted = "";
            for (i = 0; i < _HDD.blockSize; i++) {
                formatted += "0";
            }
            return formatted;
        };
        FileSystemDriver.prototype.isFormatted = function () {
            if (this.formatted !== true) {
                _StdOut.putText("The HDD has not been formatted!");
            } else {
                return true;
            }
        };
        // Formats the HDD by looping through all tracks, sectors, and blocks of the HDD and declaring the keys/values in HTML session storage.
        FileSystemDriver.prototype.formatHDD = function () {
            sessionStorage.clear();
            var formatBlock = this.formatBlock();
            for (i = 0; i < _HDD.tracks; i++) {
                for (j = 0; j < _HDD.sectors; j++) {
                    for (k = 0; k < _HDD.blocks; k++) {
                        // Set the key as the track, sector and block.
                        sessionStorage.setItem(i + ":" + j + ":" + k, formatBlock);
                    }
                }
            }
            displayHDD();
            this.formatted = true;
        };
        // Checks all blocks for an free block and returns it (Start from 2nd track).
        FileSystemDriver.prototype.findFreeBlock = function () {
            for (i = 1; i < _HDD.tracks; i++) {
                for (j = 0; j < _HDD.sectors; j++) {
                    for (k = 0; k < _HDD.blocks; k++) {
                        var block = sessionStorage.getItem(i + ":" + j + ":" + k);
                        var bit = parseInt(block.substring(0, 1));
                        if (bit !== 1) {
                            return i + ":" + j + ":" + k;
                        }
                    }
                }
            }
        };
        // Finds a file by name and returns the track, sector and block (or key).
        FileSystemDriver.prototype.findFileByName = function (filename) {
            var track = 0;
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    var block = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(block.substring(0, 1));
                    if (bit === 1) {
                        var file = block.substring(4);
                        if (filename === file) {
                            return block.substring(1, 2) + ":" + block.substring(2, 3) + ":" + block.substring(3, 4);
                        }
                    }
                }
            }
            return _StdOut.putText("Filename does not exist.");
        };
        // Creates a file directory in the HDD.
        FileSystemDriver.prototype.createFile = function (filename) {
            var track = 0;
            if (filename.length > 60) {
                return _StdOut.putText("The filename is too long to be stored.");
            }
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    // Get the first bit to verify whether the block is set or not.
                    var block = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(block.substring(0, 1));
                    // Check only the first track (since that is only for files).
                    if (bit !== 1) {
                        // Ensure there is not a file already created with the same name.
                        var nextFreeBlock = this.findFreeBlock();
                        sessionStorage.setItem(nextFreeBlock, 1);
                        var freeBlockKey = nextFreeBlock.split(":").join("");
                        sessionStorage.setItem(track + ":" + j + ":" + k, 1 + freeBlockKey + filename);
                        return _StdOut.putText("File " + "\"" + filename + "\"" + " has been created!");
                    } else {
                        if (block.toString().indexOf(filename) !== -1) {
                            return _StdOut.putText("The filename: " + "\"" + filename + "\"" + " already exists.");
                        }
                    }
                    if (i >= 7 && k >= 7) {
                        return _StdOut.putText("The max amount of directories have been reached.");
                    }
                }
            }
            displayHDD();
        };
        // Displays all current files located on the HDD.
        FileSystemDriver.prototype.listFiles = function () {
            var track = 0;
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    var block = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(block.substring(0, 1));
                    if (bit === 1) {
                        _StdOut.putText("  " + block.substring(4));
                        _Console.advanceLine();
                    }
                }
            }
        };
        // Logic that concatenates data to the string of a designated block.
        FileSystemDriver.prototype.writeToFile = function (filename, data) {
            var key = this.findFileByName(filename);
            if (key !== undefined) {
                var block = sessionStorage.getItem(key);
                if (data.length > 60) {
                    // TODO: Loop that for the length of the data, will enter the next HDD block.

                } else {
                    sessionStorage.setItem(key, block + data);
                }
            }
            displayHDD();
        };
        // Reads the data of a file based on the filename provided.
        FileSystemDriver.prototype.readFromFile = function (filename) {
            var key = this.findFileByName(filename);
            if (key !== undefined) {
                var block = sessionStorage.getItem(key);
            }
        };
        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));
