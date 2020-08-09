'use strict';

let log = [];
let logPointer = -1;
let lockInput = false;

window.addEventListener("resize", (event) => console.log(window.innerWidth));

document.addEventListener("DOMContentLoaded", async () => {
    await startAnimation();
});

async function startAnimation() {
    async function exeCmd(cmd) {
        setCmd(cmd);
        await enterKey();
    }
    await exeCmd("help");
    await exeCmd("ls");
    await exeCmd("cat welcome.html");
    await exeCmd("cat about.html");
    await exeCmd("cat projects.html");
    await exeCmd("cat enterprise.html");
    await exeCmd("cat end.html");
    await exeCmd("cat contact.html");
}

document.addEventListener("paste", async (event) => {
    async function exeCmd(cmd) {
        setCmd(cmd);
        await enterKey();
    }
    let cmds = event.clipboardData.getData('Text').split("\n");
    for (let cmd of cmds) {
        await exeCmd(cmd);
    }
});

document.addEventListener("keydown", async (event) => {
    switch(event.key) {
        case("ArrowLeft"): case("ArrowRight"): case("ArrowUp"): case("ArrowDown"): event.preventDefault(); break;
    }
}, false);

document.addEventListener("keydown", async (event) => {
    await performEvent(event);
});

async function performEvent(event) {
    if (lockInput) {
        return;
    }

    if (!event.ctrlKey && !event.altKey && isAllowed(event.key)) {
        insertEventCharIntoInputLine(event.key);
    } else {
        switch(event.key) {
            case("Backspace"):        backspaceKey();   break;
            case("Delete"):           deleteKey();      break;
            case("Enter"):      await enterKey();       break;
            case("ArrowLeft"):        arrowLeftKey();   break;
            case("ArrowRight"):       arrowRightKey();  break;
            case("ArrowUp"):          arrowUpKey();     break;
            case("ArrowDown"):        arrowDownKey();   break;
        }
    }

    setAnimationsPercentage(document.getElementById("terminal-cursor"), 0.5);
    scrollIntoView();
}

function backspaceKey() {
    let toDelete = getLeftChar();
    if (toDelete !== null) {
        toDelete.remove();
    }
}

function deleteKey() {
    let toDelete = getRightChar();
    if (toDelete !== null && toDelete.nextSibling !== null) {
        toDelete.remove();
    }
}

async function enterKey() {
    write(`<outputCmd>${getInputLine().replace(/<br>/g, "\u00a0")}</outputCmd><br>`);
    let cmd = getCmd();
    if (cmd.length > 0) {
        log.push(cmd);
        if (!executeLocalCommand(cmd)) {
            await fetchTerminalResponse(getDir(), cmd).then((response) => {
                write(`<outputCmdRes>${response}</outputCmdRes>`);
            });
        }
        clearCmd();
        addCursor();
        logPointer = -1;
    }
}

function arrowLeftKey() {
    let newPosition = getLeftChar();
    if (newPosition !== null) {
        removeCursor();
        moveCursorTo(newPosition);
    }
}

function arrowRightKey() {
    let newPosition = getRightChar();
    if (newPosition !== null) {
        removeCursor();
        moveCursorTo(newPosition);
    }
}

function arrowUpKey() {
    if (logPointer === -1) {
        logPointer = log.length - 1;
    } else {
        addToLogPointer(-1);
    }
    setInputToLog(logPointer);
    addCursor();
}

function arrowDownKey() {
    if (logPointer === -1) {
        logPointer = 0;
    } else {
        addToLogPointer(1);
    }
    setInputToLog(logPointer);
    addCursor();
}

function addToLogPointer(toAdd) {
    logPointer += toAdd;
    if (log.length === 0) {
        logPointer = -1;
    } else if (logPointer < 0) {
        logPointer = 0;
    } else  if (logPointer >= log.length) {
        logPointer = log.length - 1;
    }
}

function setInputToLog(index) {
    setCmd(log[index]);
}

function getLeftChar() {
    return document.getElementById("terminal-cursor").previousSibling;
}

function getRightChar() {
    return document.getElementById("terminal-cursor").nextSibling;
}

function isAllowed(keyStr) {
    // Only allow single characters
    return keyStr.length === 1;
}

function insertEventCharIntoInputLine(char) {
    char = char === " " ? "\u00a0" : char; // white space character is &nbsp; 

    if (char === "\n") {
        enterKey();
    } else {
        let cursor = document.getElementById("terminal-cursor");
        insertHTMLbyChar(cursor, "beforebegin", char, "div");
    }
}

function getCmd() {
    let inputElement = document.getElementById("input");
    return inputElement.textContent.replace(/\u00a0/g, " ").trim();
}

function setCmd(newCmd) {
    clearCmd();
    let inputElement = document.getElementById("input");
    insertHTMLbyChar(inputElement, "beforeend", newCmd, "div");
}

function clearCmd() {
    let inputElement = document.getElementById("input");
    inputElement.textContent = "";
}

function getDir() {
    let dirElement = document.getElementById("dir");
    return dirElement.textContent.trim();
}

function setDir(newDir) {
    document.getElementById("dir").textContent = newDir;
}

function addCursor() {
    let inputElement = document.getElementById("input");
    inputElement.insertAdjacentHTML("beforeend", `<div id="terminal-cursor" class="blink">\u00a0</div>`);
}

function removeCursor() {
    let currCursor = document.getElementById("terminal-cursor");
    currCursor.classList.remove("blink");
    currCursor.removeAttribute("id");
}

function moveCursorTo(element) {
    element.classList.add("blink");
    element.setAttribute("id", "terminal-cursor");
}

function getInputLine() {
    return document.querySelector("#terminal-input .terminal-line").textContent.replace(/\u00a0/g, " ").trim();
}

function scrollIntoView() {
    console.log("scrollIntoView");
    document.getElementById("terminal-input").scrollIntoView();
}

function writeLine(str) {
    write(str + "<br>");
}

function write(str) {
    let outputElement = document.getElementById("terminal-output");
    // str = str.replace(/\n/g, "<br>");
    outputElement.insertAdjacentHTML("beforeend", str);
}

function insertHTMLbyChar(parent, where, str, element) {
    for (let i = 0; i < str.length; i++) {
        parent.insertAdjacentHTML(where, `<${element}>${str.charAt(i)}</${element}>`);
    }
}

function executeLocalCommand(str) {
    switch(str) {
        case "clear": clearCommand();   break;
        case "start": startAnimation(); break;
        default: return false;
    }
    return true;
}

function clearCommand() {
    let outputElement = document.getElementById("terminal-output");
    outputElement.textContent = "";
}

async function fetchTerminalResponse(directory, cmd) {
    return await fetch("/terminal", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            directory: directory,
            cmd: cmd
        })
    }).then((response) => response.json());
}

function setAnimationsPercentage(element, percentage) {
    let animations = element.getAnimations();
    for (let i = 0; i < animations.length; i++) {
        let animation = animations[i];
        setAnimationPercentage(animation, percentage);
    }
}

function setAnimationPercentage(animation, percentage) {
    let animationTiming = animation.effect.getTiming();
    animation.currentTime = animationTiming.delay + animationTiming.duration * percentage;
}