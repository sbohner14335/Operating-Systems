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
                formatted += "-";
            }
            return formatted;
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
                        return _StdOut.putText(filename + " has been created!");
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

        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));