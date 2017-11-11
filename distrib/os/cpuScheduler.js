var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.ticks = 0;
            this.storedPCB = new TSOS.PCB();
            this.processIndex = 0;
        }
        CpuScheduler.prototype.contextSwitch = function () {
            // Reset the clock ticks.
            this.ticks = 0;
            // Save the state of the PCB that was on the CPU.
            this.storedPCB.PID = _PCB.PID;
            this.storedPCB.state = _PCB.state;
            this.storedPCB.PC = _PCB.PC;
            this.storedPCB.AC = _PCB.AC;
            this.storedPCB.IR = _PCB.IR;
            this.storedPCB.xRegister = _PCB.xRegister;
            this.storedPCB.yRegister = _PCB.yRegister;
            this.storedPCB.zFlag = _PCB.zFlag;
            this.storedPCB.base = _PCB.base;
            this.storedPCB.limit = _PCB.limit;
            // Set the PCB to the next process waiting on the ready queue.
            this.processIndex = _ProcessManager.readyQueue.length -1;
            var newPCB = _ProcessManager.readyQueue[this.processIndex];
            _ProcessManager.loadCurrentPCB(newPCB);
            this.processIndex--;
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
