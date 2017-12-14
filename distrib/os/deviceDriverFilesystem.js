var TSOS;
(function (TSOS) {
    var FileSystemDriver = (function () {
        function FileSystemDriver() {
            this.formatted = false;
            this.bit = 1; // Bit that distinguishes whether the block is set or not.
        }
        // Used for initializing an HDD block.
        FileSystemDriver.prototype.formattedBlock = function () {
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
            var formatBlock = this.formattedBlock();
            for (i = 0; i < _HDD.tracks; i++) {
                for (j = 0; j < _HDD.sectors; j++) {
                    for (k = 0; k < _HDD.blocks; k++) {
                        // Set the key as the track, sector and block.
                        sessionStorage.setItem(i + ":" + j + ":" + k, formatBlock);
                    }
                }
            }
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
            if (filename.length > _HDD.blockSize - _HDD.headerSize) {
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
                        sessionStorage.setItem(nextFreeBlock, this.bit);
                        var freeBlockKey = nextFreeBlock.split(":").join("");
                        sessionStorage.setItem(track + ":" + j + ":" + k, this.bit + freeBlockKey + filename);
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
        };
        // Displays all current files located on the HDD.
        FileSystemDriver.prototype.listFiles = function () {
            var track = 0;
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    var block = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(block.substring(0, 1));
                    if (bit === 1) {
                        _StdOut.putText("  " + block.substring(_HDD.headerSize));
                        _Console.advanceLine();
                    }
                }
            }
        };
        // Logic that concatenates data to the string of a designated block.
        FileSystemDriver.prototype.writeToFile = function (filename, data) {
            var key = this.findFileByName(filename);
            var dataArray = [];
            var dataLength = data.length;
            if (key !== undefined) {
                // Check if the length of the data will fit into the block.
                if (dataLength < (_HDD.blockSize - _HDD.headerSize)) {
                    return sessionStorage.setItem(key, this.bit + "000" + data);
                } else {
                    // Split the data up into groups of 60 bits and put in dataArray.
                    while (dataLength % (_HDD.blockSize - _HDD.headerSize) >= 1) {
                        var data60Bits = data.substring(0, (_HDD.blockSize - _HDD.headerSize));
                        dataArray.push(data60Bits);
                        data = data.replace(data60Bits, "");
                        dataLength = dataLength - (_HDD.blockSize - _HDD.headerSize);
                    }
                    // Fill all blocks with appropriate data.
                    var TSBpointer = this.findFreeBlock();
                    TSBpointer = TSBpointer.split(":").join("");
                    sessionStorage.setItem(key, this.bit + TSBpointer + dataArray[0]);
                    for (i = 1; i < dataArray.length; i++) {
                        var pointerKey = this.findFreeBlock();
                        sessionStorage.setItem(pointerKey, this.bit);
                        var nextBlock = this.findFreeBlock(); // This block will be used as a reference.
                        nextBlock = nextBlock.split(":").join("");
                        if (i !== dataArray.length -1) {
                            sessionStorage.setItem(pointerKey, this.bit + nextBlock + dataArray[i]);
                        } else {
                            sessionStorage.setItem(pointerKey, this.bit + "000" + dataArray[i]);
                        }
                    }
                }
            }
            displayHDD();
        };
        // Reads the data of a file based on the filename provided.
        FileSystemDriver.prototype.readFromFile = function (filename) {
            var key = this.findFileByName(filename);
            if (key !== undefined) {
                var block = sessionStorage.getItem(key);
                var TSB = block.substring(1, 2) + ":" + block.substring(2, 3) + ":" + block.substring(3, 4);
                var contents = block.substring(4);
                while (TSB !== "0:0:0") {
                    block = sessionStorage.getItem(TSB);
                    TSB = block.substring(1, 2) + ":" + block.substring(2, 3) + ":" + block.substring(3, 4);
                    contents += block.substring(4);
                }
                _StdOut.putText(contents);
            }
        };
        // Deletes a file that is in storage on HDD.
        FileSystemDriver.prototype.deleteFile = function (filename) {
            // Delete all file pointers.
            var key = this.findFileByName(filename);
            var clearedBlock = this.formattedBlock(); // Get a cleared disk block.
            if (key !== undefined) {
                // Get the block based on the filename
                var block = sessionStorage.getItem(key);
                // Get the TSB for the block the file is pointing to.
                var TSB = block.substring(1, 2) + ":" + block.substring(2, 3) + ":" + block.substring(3, 4);
                sessionStorage.setItem(key, clearedBlock);
                while (TSB !== "0:0:0") {
                    block = sessionStorage.getItem(TSB);
                    sessionStorage.setItem(TSB, clearedBlock);
                    TSB = block.substring(1, 2) + ":" + block.substring(2, 3) + ":" + block.substring(3, 4);
                }
            }
            // Clear the actual file (directory) on HDD.
            var track = 0;
            for (j = 0; j < _HDD.sectors; j++) {
                for (k = 0; k < _HDD.blocks; k++) {
                    var fileBlock = sessionStorage.getItem(track + ":" + j + ":" + k);
                    var bit = parseInt(fileBlock.substring(0, 1));
                    if (bit === 1) {
                        var file = fileBlock.substring(4);
                        if (filename === file) {
                            sessionStorage.setItem(track + ":" + j + ":" + k, clearedBlock);
                            return _StdOut.putText(filename + " and its contents deleted.");
                        }
                    }
                }
            }
        };
        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));
