///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays your current location.");
            this.commandList[this.commandList.length] = sc;
            // Cool quote
            sc = new TSOS.ShellCommand(this.shellQuote, "rollerball", "- The Corporations");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;
            // BSOD (blue screen of death)
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- When all else fails...");
            this.commandList[this.commandList.length] = sc;
            // load (check for hex and spaces)
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates user code and loads it into memory.");
            this.commandList[this.commandList.length] = sc;
            // run <pid> will run a loaded program
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Run a loaded program.");
            this.commandList[this.commandList.length] = sc;
            // runall will execute all loaded programs at once.
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Runs all loaded programs at once.");
            this.commandList[this.commandList.length] = sc;
            // clearmem will clear all memory partitions/segments.
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clears all memory partitions/segments.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Lists the running processes and their PIDs.");
            this.commandList[this.commandList.length] = sc;
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kills a selected process.");
            this.commandList[this.commandList.length] = sc;
            // quantum <int> - sets the quantum for round robin scheduling.
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets the quantum for round robin scheduling.");
            this.commandList[this.commandList.length] = sc;
            // setschedule <rr, fcfs, priority> - sets the cpu scheduling algorithm.
            sc = new TSOS.ShellCommand(this.shellSetschedule, "setschedule", "<string> - Sets the CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // getschedule - displays the current CPU scheduling algorithm.
            sc = new TSOS.ShellCommand(this.shellGetschedule, "getschedule", "- Displays the current CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // format - initializes all tracks, sectors, and blocks in the HDD.
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Initializes all tracks, sectors, and blocks in the HDD.");
            this.commandList[this.commandList.length] = sc;
            // create - creates a file in the HDD and denotes success or failure.
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Creates a file on the HDD.");
            this.commandList[this.commandList.length] = sc;
            // ls - lists all files currently stored on the HDD.
            sc = new TSOS.ShellCommand(this.shellList, "ls", "- Lists all files on the HDD.");
            this.commandList[this.commandList.length] = sc;
            // write - write to a file in the HDD and denote success or failure.
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> - Write to a file on the HDD.");
            this.commandList[this.commandList.length] = sc;
            // read - reads a file based on a provided filename.
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Reads from a file based on the filename.");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string> Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string> Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            getTime();
            _StdOut.putText(_Time);
            _StdOut.advanceLine();
            _StdOut.putText(_Date);
        };
        Shell.prototype.shellWhereami = function () {
            _StdOut.putText("You're speeding on rollerblades in a pit with a ball in your hand.");
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                var status = args.toString(); // Parse the array using toString.
                document.getElementById("status").innerText = "{" + status.split(",").join(" ") + "}";
            } else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        };
        Shell.prototype.shellQuote = function () {
            var quote = document.getElementById("quote");
            if (quote.style.display === "none") {
                quote.style.display = "inline-block";
            } else {
                quote.style.display = "none"
            }
        };
        Shell.prototype.shellBSOD = function () {
            _Kernel.krnTrapError("BSOD");
        };
        Shell.prototype.shellLoad = function (args) {
            // Get the user input through the textarea and place all of the hex commands in an array.
            var userCodeInput = document.getElementById("taProgramInput").value.trim().toUpperCase();
            var hexArray = userCodeInput.split(" ");
            var validHex = false;
            // Check for an empty textarea.
            if (userCodeInput === "") {
                _StdOut.putText("There is nothing in the program input to load... derp");
            } else if (hexArray.length > 255) {
                _StdOut.putText("There is not enough memory to run your program!");
            } else {
                // Creating a regular expression for valid hex characters. (Accept 0-9 and a-f while ignoring the case)
                var regex = /^[0-9a-f]+$/i;
                for (i = 0; i < hexArray.length; i++) {
                    if (regex.test(hexArray[i]) === false) {
                        _StdOut.putText("Invalid hex, valid hex characters include A-F and/or 0-9");
                        break;
                    } else {
                        // This runs if a valid command is loaded.
                        validHex = true;
                    }
                }
                // Next, check for priority scheduling.
                var priority = -1; // This represents the default priority if the priority algorithms is NOT selected.
                if (_CpuScheduler.algorithm === "Priority") {
                    // Make sure the user selects a priority with their loaded process.
                    var command = args[0];
                    if (args.length > 0) {
                        priority = parseInt(command);
                        // If hex is valid, allocate memory for the process.
                        if (validHex && !isNaN(priority)) {
                            _MemoryManager.allocateMemory(hexArray, priority); // Put the program commands in memory.
                        } else {
                            _StdOut.putText("Please give a valid priority from 1-10.");
                        }
                    } else {
                        _StdOut.putText("Usage: Priority <int> Please supply a priority from 1-10.");
                    }
                } else {
                    if (validHex) {
                        _MemoryManager.allocateMemory(hexArray, priority); // Put the program commands in memory.
                    }
                }
            }
            displayMemory();
        };
        // This command runs the currently loaded program.
        Shell.prototype.shellRun = function (args) {
            var command = args[0];
            var validPID = false;
            // Run the loaded program if the PID is in the resident list.
            for (i = 0; i < _ProcessManager.residentList.length; i++) {
                if (command === _ProcessManager.residentList[i].PID.toString()) {
                    // Place the desired process onto the ready queue and remove it from the resident list.
                    _ProcessManager.readyQueue.push(_ProcessManager.residentList[i]);
                    _ProcessManager.residentList.splice(i, 1);
                    validPID = true;
                    break;
                }
            }
            // Checks if a valid PID was found.
            if (validPID) {
                _CPU.isExecuting = true;
            } else {
                _StdOut.putText("You did not enter a valid PID.");
            }
        };
        // This command will run all loaded programs at once.
        Shell.prototype.shellRunall = function () {
            if (_ProcessManager.residentList.length !== 0) {
                for (i = 0; i < _ProcessManager.residentList.length; i++) {
                    // Place the desired processes onto the ready queue and remove it from the resident list.
                    _ProcessManager.readyQueue.unshift(_ProcessManager.residentList[i]);
                    _ProcessManager.residentList.splice(i, 1); // Removes process from residentList.
                    i--;
                }
                _CPU.isExecuting = true;
            } else {
                _StdOut.putText("There are no programs to run.");
            }
        };
        // This command clears all memory partitions/segments.
        Shell.prototype.shellClearmem = function () {
            _Memory.clearMemory();
            displayMemory();
        };
        // This command will display the running processes and their IDs.
        Shell.prototype.shellPs = function () {
            if (_CPU.isExecuting) {
                _StdOut.putText("Processes running:");
                _Console.advanceLine();
                // Displays the current PCB.
                if (_PCB.PID > -1) {
                    _StdOut.putText("PID " + _PCB.PID);
                    _Console.advanceLine();
                }
                // Displays all other processes currently in the ready queue.
                for (i = 0; i < _ProcessManager.readyQueue.length; i++) {
                    _StdOut.putText("PID " + _ProcessManager.readyQueue[i].PID);
                    _Console.advanceLine();
                }
            } else {
                _StdOut.putText("There are currently no running processes.");
            }
        };
        // This command will kill a currently running process.
        Shell.prototype.shellKill = function (args) {
            var command = args[0];
            if (args.length > 0) {
                // Checks if the PID is the current PCB.
                if (command === _PCB.PID.toString()) {
                    _MemoryManager.deallocateMemory(_PCB.base, _PCB.limit);
                    _PCB.state = "Killed";
                    updateProcess(_PCB);
                    _StdOut.putText("Process ID " + command + " killed.")
                } else {
                    // Checks if there was a match in the ready queue.
                    for (i = 0; i < _ProcessManager.readyQueue.length; i++) {
                        if (command === _ProcessManager.readyQueue[i].PID.toString()) {
                            _ProcessManager.killProcess(i);
                            break;
                        }
                    }
                }
            } else {
                _StdOut.putText("Usage: PID <string> Please supply a PID.");
            }
        };
        // Sets a quantum for round robin CPU scheduling.
        Shell.prototype.shellQuantum = function (args) {
            var command = args[0];
            if (args.length > 0) {
                _CpuScheduler.quantum = parseInt(command);
            } else {
                _StdOut.putText("Usage: Quantum <int> Please supply a quantum.");
            }
        };
        // Sets the CPU scheduling algorithm for running programs.
        Shell.prototype.shellSetschedule = function (args) {
            var command = args[0];
            if (args.length > 0) {
                if (command === "rr") {
                    _CpuScheduler.algorithm = "Round Robin";
                    _CpuScheduler.quantum = _DefaultQuantum;
                    _StdOut.putText("Scheduling algorithm switched to " + _CpuScheduler.algorithm);
                    _Console.advanceLine();
                    _StdOut.putText("  Quantum: " + _CpuScheduler.quantum);
                } else if (command === "fcfs") {
                    _CpuScheduler.algorithm = "First Come First Serve";
                    _CpuScheduler.quantum = 10000000; // Really big quantum to achieve First Come First Serve CPU scheduling.
                    _StdOut.putText("Scheduling algorithm switched to " + _CpuScheduler.algorithm);
                } else if (command === "priority") {
                    _CpuScheduler.algorithm = "Priority";
                    _StdOut.putText("Scheduling algorithm switched to " + _CpuScheduler.algorithm);
                } else {
                    _StdOut.putText("Valid CPU scheduling algorithms:");
                    _Console.advanceLine();
                    _StdOut.putText("  rr - Round Robin (Quantum = 6)");
                    _Console.advanceLine();
                    _StdOut.putText("  fcfs - First Come First Serve");
                    _Console.advanceLine();
                    _StdOut.putText("  priority - Priority (Scale: 1-10)");
                }
            } else {
                _StdOut.putText("Usage: Algorithm <string> Please set a scheduling algorithm - rr, fcfs, or priority.");
            }
        };
        // Displays the current CPU scheduling algorithm.
        Shell.prototype.shellGetschedule = function () {
            _StdOut.putText("CPU Scheduling Algorithm - " + _CpuScheduler.algorithm);
            if (_CpuScheduler.algorithm === "Round Robin") {
                _Console.advanceLine();
                _StdOut.putText("  Quantum: " + _CpuScheduler.quantum);
            }
        };
        // Initializes all tracks, sectors, and blocks in the HDD.
        Shell.prototype.shellFormat = function () {
            _FileSystemDriver.formatHDD();
            _StdOut.putText("The HDD has been formatted successfully!");
        };
        // Creates a file in the HDD and denotes success or failure.
        Shell.prototype.shellCreate = function (args) {
            if (_FileSystemDriver.isFormatted()) {
                var command = args[0];
                if (args.length > 0) {
                    _FileSystemDriver.createFile(command);
                } else {
                    _StdOut.putText("Usage: File <filename> Please supply a filename.");
                }
            }
        };
        // Lists all files currently on the HDD.
        Shell.prototype.shellList = function () {
            if (_FileSystemDriver.isFormatted()) {
                if (sessionStorage.getItem('0:0:0').substring(0, 1) === "0") {
                    _StdOut.putText("There are no files on the HDD.");
                } else {
                    _StdOut.putText("HDD Files:");
                    _Console.advanceLine();
                    _FileSystemDriver.listFiles();
                }
            }
        };
        // Write to a file in the HDD and denote success or failure.
        Shell.prototype.shellWrite = function (args) {
            if (_FileSystemDriver.isFormatted()) {
                var filename = args[0];
                var data = "";
                if (args.length > 0) {
                    // Ensure that the entry is valid.
                    if (args.length < 2) {
                        _StdOut.putText("Please provide data to write within quotations:");
                        _StdOut.advanceLine();
                        _StdOut.putText("  write <filename> " + "\"data\"");
                    } else {
                        // Loop through the arguments to form the "data".
                        for (i = 1; i < args.length; i++) {
                            data += args[i] + " ";
                        }
                        data = data.trim();
                        // Ensure the data is surrounded by quotations
                        if (data.substring(0, 1) !== "\"" && data.substring(data.length-1, data.length) !== "\"") {
                            _StdOut.putText("Please surround the data with " + "\"quotations\".");
                        } else {
                            data = data.replace(/"/g, "");
                            _FileSystemDriver.writeToFile(filename, data);
                        }
                    }
                } else {
                    _StdOut.putText("Usage: File <filename> Please supply a filename.");
                }
            }
        };
        // Reads a file based on a provided filename.
        Shell.prototype.shellRead = function (args) {
            if (_FileSystemDriver.isFormatted()) {
                var filename = args[0];
                if (args.length > 0) {
                    _FileSystemDriver.readFromFile(filename);
                } else {
                    _StdOut.putText("Usage: File <filename> Please supply a filename.");
                }
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
