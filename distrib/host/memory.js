var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memory = new Array(_MemorySize);
        }
        // Initializes the memory space (displayed in the process memory table).
        Memory.prototype.init = function () {
            console.log(this.memory.length);
            var memoryTable = document.getElementById("memoryTable");
            for (i = 0; i < this.memory.length - 8; i++) {
                this.memory[i] = "00";
                memoryTable.insertRow(i);
            }
        };
        Memory.prototype.clearMemory = function () {
            for (i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));