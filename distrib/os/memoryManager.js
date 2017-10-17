var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(PID, memoryArray) {
            this.PID = PID;
            this.memoryArray = _Memory.memory;
        }
        MemoryManager.prototype.loadProgram = function () {
            this.PID = 0;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));