var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = new TSOS.Queue();
            this.residentList = [];
            this.PID = -1;
        }
        // Creates a process and puts it into the resident list.
        ProcessManager.prototype.createProcess = function (base, limit, state) {
            _PCB = new TSOS.PCB(); // Creates a new PCB object.
            this.PID++;
            _PCB.PID = this.PID;
            _PCB.IR = _Memory.memory[base];
            _PCB.state = state;
            _PCB.base = base;
            _PCB.limit = limit;
            this.residentList.push(_PCB);
            _StdOut.putText("Program loaded into PID " + _PCB.PID);
            console.log(this.residentList);
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));