var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.PID = 0;
            this.programCode = [];
        }
        // Will return the value in memory based on the location in memory.
        MemoryManager.prototype.read = function (location) {
            return _Memory.memory[location];
        };
        // Writes to an assigned location in memory.
        MemoryManager.prototype.write = function (location, param) {
            _Memory.memory[location] = param.toString();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));