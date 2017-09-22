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
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, commandArray, startIndex, endIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (commandArray === void 0) { commandArray = []; }
            if (startIndex === void 0) { startIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.commandArray = commandArray;
            if (endIndex === void 0) { endIndex = this.commandArray.length; }
            this.startIndex = startIndex;
            this.endIndex = endIndex;
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
                    // Push command to array.
                    this.commandArray.push(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    console.log(this.commandArray);
                } else if (chr === String.fromCharCode(8)) {
                    this.backspace();
                } else if (chr === String.fromCharCode(38) || chr === String.fromCharCode(40)) {
                    this.commandHistory();
                } else if (chr === String.fromCharCode(9)) {
                    _OsShell.tabCompletion(this.buffer);
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.commandHistory = function () {
                if (this.startIndex < this.commandArray.length) {
                    // Clear the screen and prints the previous command.
                    this.clearRow();
                    // Show the most recent command.
                    this.putText(this.commandArray[this.startIndex]);
                    // Put the command in the buffer.
                    this.buffer = this.commandArray[this.startIndex];
                    this.startIndex++;
                } else if (this.endIndex > this.startIndex) {
                    this.clearRow();
                    this.putText(this.commandArray[this.endIndex]);
                    this.buffer = this.commandArray[this.endIndex];
                    this.endIndex--;
                } else {
                    this.clearRow();
                    this.startIndex = 0;
                    this.endIndex = this.commandArray.length - 1;
                    this.putText(this.commandArray[this.startIndex]);
                    this.buffer = this.commandArray[this.startIndex];
                    this.startIndex++;

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
