var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = [];
            this.residentList = [];
            this.PID = -1;
        }
        // Creates a process and puts it into the resident list.
        ProcessManager.prototype.createProcess = function (base, limit) {
            var newProcess = new TSOS.PCB(); // Creates a new PCB object.
            this.PID++;
            newProcess.PID = this.PID;
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
            displayProcessdata(newProcess);
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