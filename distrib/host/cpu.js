///<reference path="../globals.ts" />
/* ------------
     CPU.js

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, IR, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (IR === void 0) { IR = "00" }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.IR = IR;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.loadPCB = function () {
            this.PC = _PCB.PC;
            this.Acc = _PCB.AC;
            this.IR = _PCB.IR;
            this.Xreg = _PCB.xRegister;
            this.Yreg = _PCB.yRegister;
            this.Zflag = _PCB.zFlag;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // Find the next process if needed.
            _CpuScheduler.nextProcess();
            // Load the current PCB in to prepare for fetch, decode and execute.
            this.loadPCB();
            // Switch case for decoding the instruction.
            switch (this.IR) {
                case "A9":
                    this.loadConstant();
                    break;
                case "AD":
                    this.loadAccumulator();
                    break;
                case "8D":
                    this.storeAC();
                    break;
                case "6D":
                    this.addWithCarry();
                    break;
                case "A2":
                    this.loadXwithConstant();
                    break;
                case "AE":
                    this.loadXfromMemory();
                    break;
                case "A0":
                    this.loadYwithConstant();
                    break;
                case "AC":
                    this.loadYfromMemory();
                    break;
                case "EA":
                    this.PC++;
                    break;
                case "00":
                    this.break();
                    break;
                case "EC":
                    this.compareByte();
                    break;
                case "D0":
                    this.branchBytes();
                    break;
                case "EE":
                    this.incrementValue();
                    break;
                case "FF":
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL_IRQ, ''));
                    this.systemCall();
                    break;
                default:
                    _StdOut.putText("There is an illegal instruction in memory.");
                    _PCB.state = "Terminated";
                    this.isExecuting = false;
            }
            // Code below runs directly after an instruction is executed.
            displayCPUdata();
            _PCB.updatePCB(this.PC, this.Acc, _Memory.memory[this.PC], this.Xreg, this.Yreg, this.Zflag);
            _CpuScheduler.ticks++;
            // Enforce a context switch if the ticks are greater than the quantum and the ready queue has a process waiting.
            if (_CpuScheduler.algorithm === "Round Robin" && _CpuScheduler.ticks >= _CpuScheduler.quantum && _ProcessManager.readyQueue.length > 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ''));
                _CpuScheduler.contextSwitch();
            }
        };
        // Load the accumulator with a constant.
        Cpu.prototype.loadConstant = function () {
            this.PC++;
            this.Acc = parseInt(_MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit), 16);
            this.PC++;
        };
        // Load accumulator from memory.
        Cpu.prototype.loadAccumulator = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            // Convert the hex string to base 10.
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            this.Acc = parseInt(_MemoryManager.readMemoryAtLocation(memoryLoc, _PCB.limit), 16);
            this.PC++;
        };
        // Store the accumulator in memory.
        Cpu.prototype.storeAC = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            _MemoryManager.writeToMemory(memoryLoc, this.Acc.toString(16), _PCB.limit);
            this.PC++;
        };
        // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
        Cpu.prototype.addWithCarry = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            this.Acc += parseInt(_MemoryManager.readMemoryAtLocation(memoryLoc, _PCB.limit), 16);
            this.PC++;
        };
        // Load the xreg with a constant.
        Cpu.prototype.loadXwithConstant = function () {
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit), 16);
            this.PC++;
        };
        // Load the xreg from memory.
        Cpu.prototype.loadXfromMemory = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            this.Xreg = parseInt(_Memory.memory[memoryLoc], 16);
            this.PC++;
        };
        // Load the yreg with a constant.
        Cpu.prototype.loadYwithConstant = function () {
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit), 16);
            this.PC++;
        };
        // Load the yreg from memory.
        Cpu.prototype.loadYfromMemory = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            this.Yreg = parseInt(_Memory.memory[memoryLoc], 16);
            this.PC++;
        };
        // Break (system call)
        Cpu.prototype.break = function () {
            _MemoryManager.deallocateMemory(_PCB.base, _PCB.limit);
            displayMemory();
            _PCB.state = "Terminated";
            _StdOut.putText(_OsShell.promptStr);
            // If the ready queue is empty, clear the CPU.
            if (_ProcessManager.readyQueue.length === 0) {
                this.init();
            }
        };
        // Compare a byte in memory to the xreg, sets the zflag if equal.
        Cpu.prototype.compareByte = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            if (this.Xreg === parseInt(_Memory.memory[memoryLoc], 16)) {
                this.Zflag = 1;
            }
            this.PC++;
        };
        // Branch n bytes if zflag = 0
        Cpu.prototype.branchBytes = function () {
            if (this.Zflag === 0) {
                this.PC++;
                var jump = parseInt(_MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit), 16); // Read how far to jump.
                this.PC++;
                // If the jump will send us out of bounds.
                if (this.PC + jump > _PCB.limit -1) {
                    // find the value that will get us to our bound.
                    var toMax = _PCB.limit - this.PC;
                    jump -= toMax;
                    this.PC = jump; // Set the PC to the remaining jump.
                } else {
                    this.PC += jump;
                }
            } else {
                this.PC+=2; // Increment by 2 to avoid the hex after the D0 OP code.
            }
        };
        // Increment the value of a byte.
        Cpu.prototype.incrementValue = function () {
            this.PC++;
            var memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit);
            this.PC++;
            memoryLoc = _MemoryManager.readMemoryAtLocation(this.PC, _PCB.limit) + memoryLoc;
            memoryLoc = parseInt(memoryLoc, 16) + _PCB.base;
            var incremented = parseInt(_Memory.memory[memoryLoc], 16);
            incremented++;
            _MemoryManager.writeToMemory(memoryLoc, incremented.toString(16), _PCB.limit);
            this.PC++;
        };
        // System call: xreg = print the int stored in the yreg.
        // xreg = print the 00-terminated string stored at the address in the yreg.
        Cpu.prototype.systemCall = function () {
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString());
            } else {
                var output = "";
                var address = this.Yreg + _PCB.base;
                var string = _MemoryManager.readMemoryAtLocation(address, _PCB.limit);
                while (string !== "00") {
                    var print = String.fromCharCode(parseInt(string, 16));
                    output += print;
                    address++;
                    string = _MemoryManager.readMemoryAtLocation(address, _PCB.limit);
                }
                _StdOut.putText(output);
            }
            _Console.advanceLine();
            this.PC++;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
