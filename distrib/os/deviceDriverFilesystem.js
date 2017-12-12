var TSOS;
(function (TSOS) {
    var FileSystemDriver = (function () {
        function FileSystemDriver() {
            this.tracks = _HDD.tracks;
            this.sectors = _HDD.sectors;
            this.blocks = _HDD.blocks;
            this.blockSize = _HDD.blockSize;
            this.headerSize = _HDD.headerSize;
        }
        return FileSystemDriver;
    })();
    TSOS.FileSystemDriver = FileSystemDriver;
})(TSOS || (TSOS = {}));
