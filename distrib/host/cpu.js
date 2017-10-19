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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
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
            this.Xreg = _PCB.xRegister;
            this.Yreg = _PCB.yRegister;
            this.Zflag = _PCB.zFlag;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _PCB.state = "Running";
            // Switch case for decoding the instruction.
            switch (_PCB.IR) {
                case "A9":
                    // Load the accumulator with a constant.
                    this.loadConstant();
                    break;
                case "AD":
                    // Load accumulator from memory.
                    this.loadAccumulator();
                    break;
                case "8D":
                    // Store the AC in memory.
                    this.storeAC();
                    break;
                case "6D":
                    // Add with carry
                    this.addWithCarry();
                    break;
                case "A2":
                    // Load the xreg with a constant.
                    this.loadXwithConstant();
                    break;
                case "AE":
                    // Load the xreg from memory.
                    this.loadXfromMemory();
                    break;
                case "A0":
                    // Load the yreg with a constant.
                    this.loadYwithConstant();
                    break;
                case "AC":
                    // Load the yreg from memory.
                    this.loadYfromMemory();
                    break;
                case "EA":
                    // No operation.
                    this.noOperation();
                    break;
                case "00":
                    // Break (system call)
                    this.break();
                    break;
                case "EC":
                    // Compare a byte in memory to the xreg, sets the zflag if equal.
                    this.compareByte();
                    break;
                case "D0":
                    // Branch n bytes if zflag = 0
                    this.branchBytes();
                    break;
                case "EE":
                    // Increment the value of a byte.
                    this.incrementValue();
                    break;
                case "FF":
                    // System call: xreg = print the int stored in the yreg.
                    // xreg = print the 00-terminated string stored at the address in the yreg.
                    this.systemCall();
                    break;
                default:
                    _StdOut("There is an illegal instruction in memory.");
                    this.isExecuting = false;
            }
            // Load the accumulator with a constant.
            Cpu.prototype.loadConstant = function () {

            };
            // Load accumulator from memory.
            Cpu.prototype.loadAccumulator = function () {

            };
            // Store the AC in memory.
            Cpu.prototype.storeAC = function () {

            };
            // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
            Cpu.prototype.addWithCarry = function () {

            };
            // Load the xreg with a constant.
            Cpu.prototype.loadXwithConstant = function () {

            };
            // Load the xreg from memory.
            Cpu.prototype.loadXfromMemory = function () {

            };
            // Load the yreg with a constant.
            Cpu.prototype.loadYwithConstant = function () {

            };
            // Load the yreg from memory.
            Cpu.prototype.loadYfromMemory = function () {

            };
            // No operation.
            Cpu.prototype.noOperation = function () {

            };
            // Break (system call)
            Cpu.prototype.break = function () {

            };
            // Compare a byte in memory to the xreg, sets the zflag if equal.
            Cpu.prototype.compareByte = function () {

            };
            // Branch n bytes if zflag = 0
            Cpu.prototype.branchBytes = function () {

            };
            // Increment the value of a byte.
            Cpu.prototype.incrementValue = function () {

            };
            // System call: xreg = print the int stored in the yreg.
            // xreg = print the 00-terminated string stored at the address in the yreg.
            Cpu.prototype.systemCall = function () {

            };
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
