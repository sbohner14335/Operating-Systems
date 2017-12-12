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
                        sessionStorage.setItem(i + ":" + j + ":" + k, formatBlock);
                        displayHDD(i, j, k);
                    }
                }
            }
            this.formatted = true;
        };
        FileSystemDriver.prototype.createFile = function () {

        };

        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));
