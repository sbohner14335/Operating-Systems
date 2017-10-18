var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.PID = 0;
            this.memoryArray = new Array(_MemorySize);
        }
        MemoryManager.prototype.read = function () {
            for (i = 0; i < _Memory.memory.length; i++) {
                this.memoryArray[i] = _Memory.memory[i];
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));