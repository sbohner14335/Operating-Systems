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
                formatted += 0;
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
        // Creates a file directory in the HDD.
        FileSystemDriver.prototype.createFile = function (filename) {
            var track = 0;
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    // Get the first bit to verify whether the block is set or not.
                    var block = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(block.substring(0, 1));
                    // Check only the first track (since that is only for files).
                    if (bit !== 1) {
                        // Ensure there is not a file already created with the same name.
                        if (block.indexOf(filename) === -1) {
                            if (filename.length > 60) {
                                _StdOut.putText("The filename is too long to be stored.");
                                break;
                            } else {
                                sessionStorage.setItem(track + ":" + j + ":" + k, 1 + track+1 + filename);
                                break;
                            }
                        } else {
                            _StdOut.putText(filename + " already exists.");
                            break;
                        }
                    } else {
                        _StdOut.putText("The max amount of directories have been reached.");
                        break;
                    }
                }
            }
            displayHDD();
        };

        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));
