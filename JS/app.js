"use strict";
let n;
let k;
let heaps = [];
const firstButton = document.getElementById('first-submit');
const secondButton = document.getElementById('final-submit');
// Take data and insert inputs.
firstButton.addEventListener('click', (event) => {
    event.preventDefault();
    n = +document.getElementById('heapsCount').value;
    k = +document.getElementById('canTake').value;
    const hostElement = document.getElementById('heap-inputs');
    const template = document.getElementById('for-heaps');
    const importedNode = document.importNode(template.content, true);
    const inputElem = importedNode.firstElementChild;
    inputElem.id = 'heap';
    console.log(n);
    console.log(k);
    for (let i = n; i > 0; i--) {
        inputElem.className = i.toString();
        hostElement.prepend(inputElem.cloneNode(true));
    }
    secondButton.style.visibility = 'visible';
});
// Start calculation.
secondButton.addEventListener('click', (event) => {
    event.preventDefault();
    for (let i = 1; i <= n; i++) {
        const element = document.getElementsByClassName(i.toString())[0];
        const input = element.querySelector('input');
        const value = +input.value;
        heaps.push(value);
    }
    console.log(heaps);
    start();
});
// Function which calculates the result.
function start() {
    const heaps2 = []; // stores the heaps in binary system.
    const usedHeaps = []; // stores the heaps which are already used.
    const finalHeaps = []; // stores the heaps after calculation.
    let longestCharNumber = 0; // check the longest char combination ([1001, 111] longestCharNumber = 4).
    let sumOfBits = ''; // stores the sum of bits in of all heaps ([1001, 0111] sumOfBits = '1112').
    for (let i = 0; i < heaps.length; i++) {
        heaps2.push(heaps[i].toString(2)); // transforming decimal heaps to binary.
    }
    // Looking for the longest number in binary system.
    for (let i = 0; i < heaps2.length; i++) {
        if (heaps2[i].length > longestCharNumber) {
            longestCharNumber = heaps2[i].length;
        }
    }
    // Assert the missing '0' at the start (longest comb = 4 then '111' = '0111').
    for (let i = 0; i < heaps2.length; i++) {
        if (heaps2[i].length < longestCharNumber) {
            heaps2[i] = '0'.repeat(longestCharNumber - heaps2[i].length) + heaps2[i];
        }
    }
    console.log('start heap:', heaps2);
    // Finding the sum of bits of all heaps in every position saving module dividing on k+1.
    for (let j = 0; j < longestCharNumber; j++) {
        let sum = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);
        }
        sumOfBits += (sum % (k + 1)).toString();
    }
    console.log(sumOfBits);
    // Check if sum of bits is 0
    let check = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }
    let isFilled = false; // Check if we used all possible heaps.
    if (check === 0) {
        alert("Програшна позиція");
    }
    else {
        for (let i = 0; i < sumOfBits.length; i++) { // Check every bit position.
            if (sumOfBits.charAt(i) !== '0') {
                let bit = +sumOfBits.charAt(i); // Check how many bits need to be deleted.
                let moves = k; // Check how many moves exist.
                for (let j = 0; j < heaps2.length && bit > 0 && moves > 0; j++) { // Checks every heap.
                    let minus = +heaps2[j].charAt(i); // How many bits is possible to delete at this heap.
                    if (minus > 0) {
                        if (!(j in usedHeaps) && !isFilled) { // Check if we already used this heap.
                            usedHeaps.push(j);
                            if (usedHeaps.length === k)
                                isFilled = true;
                        }
                        if (checkIn(j, usedHeaps)) { // Same check but with custom function, because 'in' works incorrect sometimes.
                            bit -= minus;
                            let temp = +heaps2[j].charAt(i) - minus;
                            heaps2[j] = heaps2[j].substr(0, i) + temp.toString() + heaps2[j].substr(i + 1); // Delete the bits from the heap.
                            moves--;
                        }
                    }
                }
                console.log('usedHeaps:', usedHeaps);
                console.log('isFilled: ', isFilled);
            }
        }
    }
    console.log('final heap: ', heaps2);
    // Finding the sum of bits of final heaps in every position saving module dividing on k+1.
    sumOfBits = '';
    for (let j = 0; j < longestCharNumber; j++) {
        let sum = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);
        }
        sumOfBits += (sum % (k + 1)).toString();
    }
    // Check if sum of bits is 0
    check = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }
    // Adding bits if needed
    let checkSums; // Stores the sum of bits of all heaps at needed position.
    if (check !== 0) {
        for (let i = 0; i < sumOfBits.length; i++) { // Checks every bit.
            if (sumOfBits.charAt(i) !== '0') {
                checkSums = checkSum(i, heaps2, usedHeaps);
                if (isFilled) { // Check if we used all possible heaps.
                    if (k + 1 - checkSums[0] <= checkSums[1]) { // Checks if we the difference between all possible moves +1 and sum of bits is less than zero bits count in used heaps.
                        let difference = k + 1 - checkSums[0]; // The difference between all possible moves +1 and sum of bits.
                        for (let j = 0; j < heaps2.length && difference > 0; j++) { // Go through every heap.
                            if (checkIn(j, usedHeaps) && heaps2[j].charAt(i) === '0') {
                                heaps2[j] = heaps2[j].substr(0, i) + '1' + heaps2[j].substr(i + 1); // Change the heap.
                                difference--;
                            }
                        }
                    }
                }
                else {
                    if (k + 1 - checkSums[0] <= checkSums[1]) { // Checks if we the difference between all possible moves +1 is less than zero bits count in used heaps.
                        let difference = k + 1 - checkSums[0]; // The difference between all possible moves +1 and sum of bits
                        for (let j = 0; j < heaps2.length && difference > 0; j++) { // Go through every heap.
                            if (checkIn(j, usedHeaps) && heaps2[j].charAt(i) === '0') {
                                heaps2[j] = heaps2[j].substr(0, i) + '1' + heaps2[j].substr(i + 1); // Change the heap.
                                difference--;
                            }
                        }
                    }
                    else {
                        // if needed difference <= all heaps zeros at i position && zeros count except used heaps <= possible heaps count to use
                        if (k + 1 - checkSums[0] <= heaps2.length - checkSums[0] && heaps2.length - checkSums[0] - checkSums[1] <= k - usedHeaps.length) {
                            let difference = k + 1 - checkSums[0]; // The difference between all possible moves +1 and sum of bits
                            for (let j = 0; j < heaps2.length && difference; j++) { // Go through every heap.
                                if (checkIn(j, usedHeaps) && heaps2[j].charAt(i) === '0') { //If heap was already used.
                                    heaps2[j] = heaps2[j].substr(0, i) + '1' + heaps2[j].substr(i + 1); // Change the heap.
                                    difference--;
                                }
                                else {
                                    if (heaps2[j].charAt(i) === '0') {
                                        usedHeaps.push(j); // Heap wasn't used so we add it to used.
                                        if (usedHeaps.length === k)
                                            isFilled = true;
                                        heaps2[j] = heaps2[j].substr(0, i) + '1' + heaps2[j].substr(i + 1); // Change the heap.
                                        difference--;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log('final-final heaps: ', heaps2);
    // Finding the sum of bits of final-final heaps in every position saving module dividing on k+1.
    sumOfBits = '';
    for (let j = 0; j < longestCharNumber; j++) {
        let sum = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);
        }
        sumOfBits += (sum % (k + 1)).toString();
    }
    // Check if sum of bits is 0
    check = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }
    if (check === 0) {
        for (let i = 0; i < heaps2.length; i++) {
            finalHeaps.push(parseInt(heaps2[i], 2)); // Converting binary heaps to decimal.
        }
        alert("Використано купок:\n" + usedHeaps.length + "\n" + "Стан після виграшного ходу:\n" + finalHeaps);
    }
    else {
        alert('Виграш неможливий');
    }
}
// Works the same as 'x in array'. Created, because regular 'in' sometimes works incorrect.
function checkIn(a, array) {
    for (let i = 0; i < array.length; i++) {
        if (a === array[i]) {
            return true;
        }
    }
    return false;
}
// Saves the sum of all bits from all heaps and zeros at used heaps.
function checkSum(position, array, used) {
    let sum = 0;
    let zeros = 0;
    for (let i = 0; i < array.length; i++) {
        if (checkIn(i, used)) {
            if (array[i].charAt(position) === '0')
                zeros++;
        }
        sum += +array[i].charAt(position);
    }
    return [sum, zeros];
}
