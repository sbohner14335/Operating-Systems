var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
        }
        // Loads the program code (hex) into memory, provided via the load shell command.
        MemoryManager.prototype.allocateMemory = function (hexArray, priority) {
            // Check to see if the first segment of memory is available.
            if (_Memory.memory[_Memory.base] === "00") {
                for (i = 0; i < hexArray.length; i++) {
                    _Memory.memory[i] = hexArray[i];
                }
                // PCB created for a process.
                _ProcessManager.createProcess(_Memory.base, _Memory.segment1, priority);
            } else if (_Memory.memory[_Memory.segment1] === "00") { // Check for the second segment of memory.
                for (j = 0; j < hexArray.length; j++) {
                    _Memory.memory[_Memory.segment1++] = hexArray[j];
                }
                _Memory.segment1 = 256; // Reset memory segment after second segment is allocated.
                // PCB created for a process.
                _ProcessManager.createProcess(_Memory.segment1, _Memory.segment2, priority);
            } else if (_Memory.memory[_Memory.segment2] === "00") {
                // If the first two segments are filled, fill the last segment.
                for (k = 0; k < hexArray.length; k++) {
                    _Memory.memory[_Memory.segment2++] = hexArray[k];
                }
                _Memory.segment2 = 512;
                // PCB created for a process.
                _ProcessManager.createProcess(_Memory.segment2, _Memory.limit, priority);
            } else {
                _StdOut.putText("You can only allocate memory for up to 3 programs.");
            }
        };
        MemoryManager.prototype.deallocateMemory = function (base, limit) {
            for (i = base; i < limit; i++) {
                _Memory.memory[i] = "00";
            }
        };
        // Will return the value in memory based on the location in memory.
        MemoryManager.prototype.readMemoryAtLocation = function (location, limit) {
            if (location < limit) {
                return _Memory.memory[location];
            } else {
                _StdOut.putText("Cannot access out of bounds memory at " + location);
            }
        };
        // Writes to an assigned location in memory.
        MemoryManager.prototype.writeToMemory = function (location, param, limit) {
            if (location < limit) {
                _Memory.memory[location] = param;
            } else {
                _StdOut.putText("Cannot write to out of bounds memory at " + location);
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));