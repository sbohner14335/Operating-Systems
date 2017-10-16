var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memory = new Array(_MemorySize);
        }
        // Initializes the memory space (displayed in the process memory table).
        Memory.prototype.init = function () {
            var memoryTable = document.getElementById("memoryTable");
            var j = 0; // Increments the row by 1 every 8 columns.
            for (i = 0; i < this.memory.length; i+=8) {
                var row = memoryTable.insertRow(j);
                j++;
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                var cell3 = row.insertCell(3);
                var cell4 = row.insertCell(4);
                var cell5 = row.insertCell(5);
                var cell6 = row.insertCell(6);
                var cell7 = row.insertCell(7);
                var cell8 = row.insertCell(8);
                // Logic for parsing the cell data in the HTML table.
                if (i < 10) {
                    cell0.innerHTML = "0x" + "00" + i.toString() ;
                } else if (i < 100){
                    cell0.innerHTML = "0x" + i.toString();
                } else {
                    cell0.innerHTML = "0x" + i.toString();
                }
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