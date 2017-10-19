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
            if (IR === void 0) { IR = "" }
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
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Load the current PCB in to prepare for fetch, decode and execute.
            _PCB.state = "Running";
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
                    this.systemCall();
                    break;
                default:
                    _StdOut("There is an illegal instruction in memory.");
                    this.isExecuting = false;
            }
            // Code below runs directly after an instruction is executed.
            this.isExecuting = false;
            displayCPUdata();
            _PCB.updatePCB(this.PC, this.Acc, this.IR, this.Xreg, this.Yreg, this.Zflag);
        };
        // Load the accumulator with a constant.
        Cpu.prototype.loadConstant = function () {
            this.PC++;
            this.Acc = parseInt(_MemoryManager.readMemory(this.PC), 16);
            this.PC++;
        };
        // Load accumulator from memory.
        Cpu.prototype.loadAccumulator = function () {
            this.PC++;
        };
        // Store the AC in memory.
        Cpu.prototype.storeAC = function () {
            this.PC++;
            _MemoryManager.writeToMemory(this.PC, this.Acc);
            this.PC++;
        };
        // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
        Cpu.prototype.addWithCarry = function () {
            this.PC++;
            var number = parseInt(_MemoryManager.readMemory(this.PC), 16);
            this.Acc += number;
            this.PC++;
        };
        // Load the xreg with a constant.
        Cpu.prototype.loadXwithConstant = function () {
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.programCode[this.PC], 16);
            this.PC++;
        };
        // Load the xreg from memory.
        Cpu.prototype.loadXfromMemory = function () {
            this.PC++;
        };
        // Load the yreg with a constant.
        Cpu.prototype.loadYwithConstant = function () {
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.programCode[this.PC], 16);
            this.PC++;
        };
        // Load the yreg from memory.
        Cpu.prototype.loadYfromMemory = function () {
            this.PC++;
        };
        // Break (system call)
        Cpu.prototype.break = function () {
            this.PC++;
        };
        // Compare a byte in memory to the xreg, sets the zflag if equal.
        Cpu.prototype.compareByte = function () {
            this.PC++;
        };
        // Branch n bytes if zflag = 0
        Cpu.prototype.branchBytes = function () {
            this.PC++;
        };
        // Increment the value of a byte.
        Cpu.prototype.incrementValue = function () {
            this.PC++;
        };
        // System call: xreg = print the int stored in the yreg.
        // xreg = print the 00-terminated string stored at the address in the yreg.
        Cpu.prototype.systemCall = function () {

        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
