///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, commandArray, index) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (commandArray === void 0) { commandArray = []; }
            if (index === void 0) { index = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.commandArray = commandArray;
            this.index = index;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // Push command to array if it is not already in the array.
                    if (this.buffer.trim() !== "") {
                        this.commandArray.push(this.buffer.trim());
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                    console.log(this.commandArray);
                } else if (chr === String.fromCharCode(8)) {
                    this.backspace();
                } else if (chr === String.fromCharCode(38)) {
                    this.commandHistory("up");
                } else if (chr === String.fromCharCode(40)) {
                    this.commandHistory("down");
                } else if (chr === String.fromCharCode(9)) {
                    this.tabCompletion();
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.commandHistory = function (text) {
            if (this.commandArray.length !== 0) {
                if (text === "up") {
                    // Make sure the next increment will not hit the length of the array.
                    if (this.index +1 !== this.commandArray.length) {
                        // Clear the screen and prints the previous command.
                        this.clearRow();
                        console.log(this.index);
                        this.putText(this.commandArray[this.index]);
                        // Put the command in the buffer.
                        this.buffer = this.commandArray[this.index];
                        // Increment the array index by 1.
                        this.index++;
                    } else {
                        // If it hits the length of the array, set the index back to 0.
                        this.index = 0;
                        this.clearRow();
                        console.log(this.index);
                        this.putText(this.commandArray[this.index]);
                        this.buffer = this.commandArray[this.index];
                    }
                } else if (text === "down") {
                    // Make sure the next decrement will not go out of bounds.
                    if (this.index -1 !== -1) {
                        this.clearRow();
                        // Decrement index by 1.
                        this.index--;
                        console.log(this.index);
                        this.putText(this.commandArray[this.index]);
                        this.buffer = this.commandArray[this.index];
                    } else {
                        // If it goes out of bounds, clear screen and set index to 0.
                        this.clearRow();
                        this.index = 0;
                        this.buffer = "";
                    }
                }
            }
        };
        Console.prototype.tabCompletion = function () {
            var possibleCommands = [];
            for (i = 0; i < _OsShell.commandList.length; i++) {
                // If the command is found, print it and put it in the buffer.
                if (_OsShell.commandList[i].command.indexOf(this.buffer) === 0) {
                    possibleCommands.push(_OsShell.commandList[i].command);
                } else {
                    possibleCommands.push(_OsShell.commandList[i].command);
                }
            }
            // If there is 1 possible command.
            if (possibleCommands.length < 1) {
                this.clearRow();
                var command = possibleCommands.pop();
                this.putText(command);
                this.buffer = command;
            } else {
                // More than 1 possible command.
                this.putText("Possible Commands:");
                for (j = 0; j < possibleCommands.length; j++) {
                    this.advanceLine();
                    this.putText("  " + possibleCommands[j]);
                }
            }
        };
        Console.prototype.backspace = function () {
            // Store the buffer before we clear it through clearRow.
            var buffBeforeBackspace = this.buffer;
            this.clearRow();
            // Take one character off the buffer and push the new buffer to the actual buffer.
            buffBeforeBackspace = buffBeforeBackspace.substring(0, buffBeforeBackspace.length - 1);
            this.putText(buffBeforeBackspace);
            this.buffer = buffBeforeBackspace;
        };
        Console.prototype.clearRow = function () {
            // Clears a row of text on the canvas.
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
            this.currentXPosition = this.currentXPosition - offset;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition + 1 - this.currentFontSize, _Canvas.width, this.currentFontSize);
            this.buffer = "";
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // Scrolls when the advanceLine goes off of the canvas.
            if (this.currentYPosition > _Canvas.height) {
                var imageData = _DrawingContext.getImageData(0, 20, _Canvas.width, _Canvas.height);
                this.clearScreen();
                _DrawingContext.putImageData(imageData, 0, 0);
                this.currentYPosition = _Canvas.height - 5;
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));