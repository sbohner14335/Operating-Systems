/* ------------
     processControlBlock.js

     Requires globals.js

     The Process Control Block - This is used to track data for a running a program.
     PID = Process identification number
     state = state of the running process
     PC = Program Counter
     AC = Accumulator
     IR =
     x,y registers
     z flag
     ------------ */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PID, state, PC, AC, IR, xRegister, yRegister, zFlag, base, limit) {
            if (PID === void 0) { PID = -1; }
            if (state === void 0) { state = ""; }
            if (PC === void 0) { PC = 0; }
            if (AC === void 0) { AC = 0; }
            if (IR === void 0) { IR = ""; }
            if (xRegister === void 0) { xRegister = 0; }
            if (yRegister === void 0) { yRegister = 0; }
            if (zFlag === void 0) { zFlag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            this.PID = PID;
            this.state = state;
            this.PC = PC;
            this.AC = AC;
            this.IR = IR;
            this.xRegister = xRegister;
            this.yRegister = yRegister;
            this.zFlag = zFlag;
            this.base = base;
            this.limit = limit;
        }
    return PCB;
})();
TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));