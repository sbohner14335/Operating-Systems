/* ------------
     processControlBlock.js

     Requires globals.js

     The Process Control Block - This is used to track data for a running a program.
     PID = Process identification number
     state = state of the running process
     PC = Program Counter
     AC = Accumulator
     IR = Instruction register
     x,y registers
     z flag
     base memory
     limit memory
     ------------ */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PID, priority, state, PC, AC, IR, xRegister, yRegister, zFlag, base, limit) {
            if (PID === void 0) { PID = -1; }
            if (priority === void 0) { priority = -1; }
            if (state === void 0) { state = ""; }
            if (PC === void 0) { PC = 0; }
            if (AC === void 0) { AC = 0; }
            if (IR === void 0) { IR = ""; }
            if (xRegister === void 0) { xRegister = 0; }
            if (yRegister === void 0) { yRegister = 0; }
            if (zFlag === void 0) { zFlag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = _MaxMemory; }
            this.PID = PID;
            this.priority = priority;
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
        PCB.prototype.updatePCB = function (PC, AC, IR, xRegister, yRegister, zFlag) {
            this.PC = PC;
            this.AC = AC;
            this.IR = IR;
            this.xRegister = xRegister;
            this.yRegister = yRegister;
            this.zFlag = zFlag;
            updateProcess(this);
        };
    return PCB;
})();
TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));