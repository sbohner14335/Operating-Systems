var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = [];
            this.residentList = [];
            this.PID = -1;
        }
        // Creates a process and puts it into the resident list.
        ProcessManager.prototype.createProcess = function (base, limit, priority) {
            var newProcess = new TSOS.PCB(); // Creates a new PCB object.
            this.PID++;
            newProcess.PID = this.PID;
            newProcess.priority = priority;
            newProcess.state = "Loaded";
            newProcess.PC = base;
            newProcess.AC = 0;
            newProcess.IR = _Memory.memory[base];
            newProcess.xRegister = 0;
            newProcess.yRegister = 0;
            newProcess.zFlag = 0;
            newProcess.base = base;
            newProcess.limit = limit;
            this.residentList.push(newProcess);
            _StdOut.putText("Program loaded into PID " + newProcess.PID);
            if (newProcess.priority !== -1) {
                _Console.advanceLine();
                _StdOut.putText("  Priority - " + newProcess.priority);
            }
            displayProcessdata(newProcess);
        };
        // Kills a selected process.
        ProcessManager.prototype.killProcess = function (index) {
            // Clear the memory block for a killed process.
            _MemoryManager.deallocateMemory(_ProcessManager.readyQueue[index].base, _ProcessManager.readyQueue[index].limit);
            _ProcessManager.readyQueue[index].state = "Killed";
            updateProcess(_ProcessManager.readyQueue[index]);
            _StdOut.putText("Process ID " + _ProcessManager.readyQueue[index].PID + " killed.");
            _ProcessManager.readyQueue.splice(index, 1);
        };
        // Loads the current PCB when the user runs a program.
        ProcessManager.prototype.loadCurrentPCB = function (PCB) {
            _PCB.PID = PCB.PID;
            _PCB.state = PCB.state;
            _PCB.PC = PCB.PC;
            _PCB.AC = PCB.AC;
            _PCB.IR = PCB.IR;
            _PCB.xRegister = PCB.xRegister;
            _PCB.yRegister = PCB.yRegister;
            _PCB.zFlag = PCB.zFlag;
            _PCB.base = PCB.base;
            _PCB.limit = PCB.limit;
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));