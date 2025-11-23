
document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
    //...
});

let txt1, txt2, btn, lblRes;

function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.querySelector('#txt2');
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");
    opSelect = document.getElementById("op");
    btn.addEventListener('click', () => {
        calculate();
    });
}

//-Helper validation 
function setValidation(element, isValid) {
    if (isValid)
        element.classList.remove('is-invalid');
    else
        element.classList.add('is-invalid'); // Adds red border
}

function calculate() {
    let txt1Text = txt1.value;
    let num1 = parseFloat(txt1Text);

    let txt2Text = txt2.value;
    let num2 = parseFloat(txt2Text);

    //-Check validity
    let isNum1Valid = !isNaN(num1) && txt1Text.trim() !== "";
    let isNum2Valid = !isNaN(num2) && txt2Text.trim() !== "";

    setValidation(txt1, isNum1Valid);
    setValidation(txt2, isNum2Valid);

    if (!isNum1Valid || !isNum2Valid) {
        lblRes.innerText = "Error";
        lblRes.className = "text-danger fw-bold"; // Bootstrap red color
        return; // Stop the function here!
    }

    let result = 0;
    let operator = opSelect.value;

    switch (operator) {
        case "+": result = num1 + num2; break;
        case "-": result = num1 - num2; break;
        case "*": result = num1 * num2; break;
        case "/":
            if (num2 === 0) { alert("Cannot divide by 0"); return; }
            result = num1 / num2;
            break;
    }

    lblRes.innerText = result;
    lblRes.style.color = "text-success fw-bold";

    let logMsg = `${num1} ${operator} ${num2} = ${result}`;
    print(logMsg, true);
}

const btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => { print("btn2 clicked: " + btn2.id + " | " + btn2.innerText, true); });
//function func1(){}
//btn2.addEventListener("click",func1);

// =============================================
// HELPER: PRINT TO TEXTAREA
// =============================================
function print(msg, shouldAppend = false) {
    //--Get TextArea Element reference
    const ta = document.getElementById("output");
    if (ta) {
        if (shouldAppend) {
            //--Write msg to TextArea text
            // APPEND MODE:
            // If there is already text, add a new line (\n) before the new message
            ta.value += (ta.value ? "\n" : "") + msg;
        } else {
            // OVERWRITE MODE (Default):
            ta.value = msg;
        }
    } else {
        //write Log
        console.log(msg);
    }
}

// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) {
        return fn(a, b);
    }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    // Print to Log
    print(out);
}