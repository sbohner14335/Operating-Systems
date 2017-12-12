var TSOS;
(function (TSOS) {
    var HDD = (function () {
        function HDD() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 64;
            this.headerSize = 4;
        }
        return HDD;
    })();
    TSOS.HDD = HDD;
})(TSOS || (TSOS = {}));
