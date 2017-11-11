var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.ticks = 0;
        }
        CpuScheduler.prototype.contextSwitch = function () {
            // Reset the clock ticks.
            this.ticks = 0;
            // Save the state of the PCB that was on the CPU.
            var storedPCB = new TSOS.PCB();
            storedPCB.PID = _PCB.PID;
            storedPCB.state = "Waiting";
            storedPCB.PC = _PCB.PC;
            storedPCB.AC = _PCB.AC;
            storedPCB.IR = _PCB.IR;
            storedPCB.xRegister = _PCB.xRegister;
            storedPCB.yRegister = _PCB.yRegister;
            storedPCB.zFlag = _PCB.zFlag;
            storedPCB.base = _PCB.base;
            storedPCB.limit = _PCB.limit;
            // Put the storedPCB back into the ready queue.
            _ProcessManager.readyQueue.unshift(storedPCB);
            updateProcess(storedPCB);
            // Set the PCB to the next process waiting on the ready queue.
            var newPCB = _ProcessManager.readyQueue.pop();
            _ProcessManager.loadCurrentPCB(newPCB);
            _PCB.state = "Running";
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
