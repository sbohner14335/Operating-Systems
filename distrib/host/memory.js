/* ------------
     memory.js

     Requires global.js.

     Routines for the host Memory simulation, NOT for the OS itself.
     This file defines the maximum memory that our "hardware" will use.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.
     ------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.memory = new Array(_MaxMemory);
            this.base = 0;
            this.segment1 = 256;
            this.segment2 = 512;
            this.limit = _MaxMemory;
        }
        // Initializes the memory space, setting all values to 00.
        Memory.prototype.clearMemory = function () {
            for (i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));