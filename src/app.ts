
let n: number;
let k: number;
let heaps: number[] = [];


const firstButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('first-submit');
const secondButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('final-submit');

// Take data and insert inputs.

firstButton.addEventListener('click', (event: Event) => {
    event.preventDefault();
    n = +(<HTMLInputElement>document.getElementById('heapsCount')).value;
    k = +(<HTMLInputElement>document.getElementById('canTake')).value;
    const hostElement: HTMLDivElement = <HTMLDivElement>document.getElementById('heap-inputs');
    const template: HTMLTemplateElement = <HTMLTemplateElement>document.getElementById('for-heaps');
    const importedNode = document.importNode(template.content, true);
    const inputElem: HTMLDivElement = <HTMLDivElement>importedNode.firstElementChild;
    inputElem.id = 'heap';

    console.log(n);
    console.log(k);
    for (let i = n; i > 0; i--) {
        inputElem.className = i.toString();
        hostElement.prepend(inputElem.cloneNode(true));
    }
    secondButton.style.visibility = 'visible';

})

// Start calculation.

secondButton.addEventListener('click', (event: Event) => {
    event.preventDefault();
    for (let i = 1; i <= n; i++) {
        const element: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName(i.toString())[0];
        const input: HTMLInputElement = <HTMLInputElement>element.querySelector('input');
        const value: number = +input.value;
        heaps.push(value);
    }
    console.log(heaps);

    start();
})

// Function which calculates the result.

function start() {
    const heaps2: string[] = []; // stores the heaps in binary system.
    const usedHeaps: number[] = []; // stores the heaps which are already used.
    const finalHeaps: number[] = []; // stores the heaps after calculation.

    let longestCharNumber: number = 0; // check the longest char combination ([1001, 111] longestCharNumber = 4).
    let sumOfBits: string = ''; // stores the sum of bits in of all heaps ([1001, 0111] sumOfBits = '1112').

    for (let i = 0; i < heaps.length; i++) {
        heaps2.push(heaps[i].toString(2));  // transforming decimal heaps to binary.
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
        let sum: number = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);

        }
        sumOfBits += (sum % (k + 1)).toString();
    }

    console.log(sumOfBits);

    // Check if sum of bits is 0
    let check: number = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }

    let isFilled: boolean = false; // Check if we used all possible heaps.
    if (check === 0) {
        alert("Програшна позиція");
    } else {
        for (let i = 0; i < sumOfBits.length; i++) { // Check every bit position.
            if (sumOfBits.charAt(i) !== '0') {
                let bit: number = +sumOfBits.charAt(i); // Check how many bits need to be deleted.
                let moves: number = k; // Check how many moves exist.
                for (let j = 0; j < heaps2.length && bit > 0 && moves > 0; j++) { // Checks every heap.
                    let minus: number = +heaps2[j].charAt(i); // How many bits is possible to delete at this heap.
                    if (minus > 0) {

                        if (!(j in usedHeaps) && !isFilled) { // Check if we already used this heap.
                            usedHeaps.push(j);
                            if (usedHeaps.length === k) isFilled = true;
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
    console.log('final heap: ',heaps2);

    // Finding the sum of bits of final heaps in every position saving module dividing on k+1.
    sumOfBits = '';

    for (let j = 0; j < longestCharNumber; j++) {
        let sum: number = 0;
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
        alert("Стан після виграшного ходу:\n" + finalHeaps);
    } else {
        alert('Виграш неможливий');
    }




}




function checkIn(a: number, array: number[]): boolean {
    for (let i = 0; i < array.length; i++) {
        if (a === array[i]) {
            return true;
        }
    }
    return false;
}