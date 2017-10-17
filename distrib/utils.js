/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(i) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };

        return Utils;
    })();
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));

    // Below are all of the utility functions that are used to manipulate tables in html and display the data from CPU, PCB and Memory
    displayCPUdata = function () {
        // Function that displays data currently in cpu.js and the currently executing PCB.
        var cpuDisplayValues = document.getElementById("cpuDisplayValues");
        _PCB = new TSOS.PCB(); // Initialize the global PCB object to display the Instruction register.
        var generatedRow = "<tr align='center'> <td>" + _CPU.PC + "</td>" +
            "<td>" + _CPU.Acc + "</td>" +
            "<td>" + _PCB.IR + "</td>" +
            "<td>" + _CPU.Xreg + "</td>" +
            "<td>" + _CPU.Yreg + "</td>" +
            "<td>" + _CPU.Zflag + "</td> </tr>";
        cpuDisplayValues.innerHTML = generatedRow;
    };
    // Logic for displaying the memory in the HTML Process Memory table.
    displayProcessMemory = function () {
        var memoryTable = document.getElementById("memoryTable");
        var row;
        var rowCount = 0;   // Every 8 columns create a new row (increment this by 1).
        var cellCount;
        for (i = 0; i < _Memory.memory.length; i++) {
            if (i === 0 || i % 8 === 0) {
                row = memoryTable.insertRow(rowCount);
                rowCount++;
                cellCount = 0;
                // Logic used to parse memory rows.
                if (i < 10) {
                    row.insertCell(cellCount).innerHTML = "0x00" + i.toString();
                    cellCount++;
                    row.insertCell(cellCount).innerHTML = _Memory.memory[i].toString();
                } else if (i < 100) {
                    row.insertCell(cellCount).innerHTML = "0x0" + i.toString();
                    cellCount++;
                    row.insertCell(cellCount).innerHTML = _Memory.memory[i].toString();
                } else {
                    row.insertCell(cellCount).innerHTML = "0x" + i.toString();
                    cellCount++;
                    row.insertCell(cellCount).innerHTML = _Memory.memory[i].toString();
                }
            } else {
                cellCount++;
                row.insertCell(cellCount).innerHTML = _Memory.memory[i].toString();
            }
        }
    };

    getTime = function () {
        // Clock that displays hours, minutes and seconds when the OS is running.
        var date = new Date(); // Date object created for a clock.
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
        _Time = hours + ":" + minutes + ":" + seconds;
        document.getElementById("time").innerHTML = "Time: " + _Time;
        var t = setTimeout(getTime, 500);
    };
    checkTime = function (i) {
        if (i < 10) {
            i = "0" + i
        }  // add zero in front of numbers < 10
        return i;
    };
