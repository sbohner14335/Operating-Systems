var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.PID = -1;
            this.programCode = [];
        }
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