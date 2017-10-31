var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.PID = -1;
        }
        // Loads the program code (hex) into memory, provided via the load shell command.
        MemoryManager.prototype.allocateMemory = function (hexArray) {
            // Check to see if the first segment of memory is available.
            if (_Memory.memory[_Memory.base] === "00") {
                for (i = 0; i < hexArray.length; i++) {
                    _Memory.memory[i] = hexArray[i];
                }
            } else if (_Memory.memory[_Memory.segment1] === "00") { // Check for the second segment of memory.
                for (j = 0; j < hexArray.length; j++) {
                    _Memory.memory[_Memory.segment1++] = hexArray[j];
                }
                _Memory.segment1 = 256; // Reset memory segment after second segment is allocated.
            } else {
                // If the first two segments are filled, fill the last segment.
                for (k = 0; k < hexArray.length; k++) {
                    _Memory.memory[_Memory.segment2++] = hexArray[k];
                }
            }
            console.log(_Memory.memory);
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