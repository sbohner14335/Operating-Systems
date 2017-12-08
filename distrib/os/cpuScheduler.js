var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = _DefaultQuantum;
            this.ticks = 0;
            this.algorithm = "Round Robin";
        }
        // Based on the scheduling algorithm, this function appropriately gets the next process.
        CpuScheduler.prototype.nextProcess = function () {
            if (_PCB.state !== "Running" && this.algorithm === "Priority") {
                // Sort processes by their assigned priority.
                _ProcessManager.readyQueue.sort(function(a, b){return b.priority - a.priority});
            }
            if (_PCB.state !== "Running" && _ProcessManager.readyQueue.length !== 0) {
                // Check to see if the CPU is running and if the readyQueue has a process, if so dequeue the next process and run it.
                var PCB = _ProcessManager.readyQueue.pop();
                _ProcessManager.loadCurrentPCB(PCB);
                _PCB.state = "Running";
            }
        };
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
