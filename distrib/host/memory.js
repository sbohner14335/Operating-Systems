var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memory = new Array(_MemorySize);
        }
        Memory.prototype.clearMemory = function () {
            for (i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));