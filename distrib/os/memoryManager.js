var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(PID, memoryArray) {
            this.PID = PID;
            this.memoryArray = memoryArray;
        }
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));