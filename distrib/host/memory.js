var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memory = new Array(_MemorySize);
        }
        // Initializes the memory space, setting all values to 00.
        Memory.prototype.clearMemory = function () {
            for (i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        };
        // Logic for displaying the memory in the HTML Process Memory table.
        Memory.prototype.displayProcessMemory = function () {
            var memoryTable = document.getElementById("memoryTable");
            var row;
            var rowCount = 0;   // Every 8 columns create a new row (increment this by 1).
            var cellCount;
            for (i = 0; i < _Memory.memory.length; i++) {
                if (i === 0 || i % 8 === 0) {
                    row = memoryTable.insertRow(rowCount);
                    rowCount++;
                    cellCount = 0;
                    // Logic used to parse memory rows.
                    if (i < 10) {
                        row.insertCell(cellCount).innerHTML = "0x00" + i.toString();
                        row.insertCell(cellCount+1).innerHTML = _Memory.memory[i].toString();
                    } else if (i < 100) {
                        row.insertCell(cellCount).innerHTML = "0x0" + i.toString();
                        row.insertCell(cellCount+1).innerHTML = _Memory.memory[i].toString();
                    } else {
                        row.insertCell(cellCount).innerHTML = "0x" + i.toString();
                        row.insertCell(cellCount+1).innerHTML = _Memory.memory[i].toString();
                    }
                } else {
                    cellCount++;
                    row.insertCell(cellCount).innerHTML = _Memory.memory[i].toString();
                }
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));