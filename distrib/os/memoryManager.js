var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.PID = -1;
            this.programCode = [];
            this.base = 0;
            this.segment1 = 256;
            this.segment2 = 512;
            this.limit = _MaxMemory;
        }
        // Reads from memory (host).
        MemoryManager.prototype.read = function () {
            if (_Memory.memory.length > this.segment1 -1) {

            } else if (_Memory.memory.length > this.segment2 -1) {

            }
            for (i = 0; i < _Memory.memory.length; i++) {
                this.programCode[i] = _Memory.memory[i];
            }
        };
        // Will return the value in memory based on the location in memory.
        MemoryManager.prototype.readMemoryAtLocation = function (location) {
            if (location < 256) {
                return _Memory.memory[location];
            } else {
                alert("Cannot access out of bounds memory at" + location);
            }
        };
        // Writes to an assigned location in memory.
        MemoryManager.prototype.writeToMemory = function (location, param) {
            if (location < 256) {
                _Memory.memory[location] = param;
            } else {
                alert("Cannot write to out of bounds memory at" + location);
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));