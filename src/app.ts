
let n: number;
let k: number;
let heaps: number[] = [];


const firstButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('first-submit');
const secondButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('final-submit');

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
function start() {
    const heaps2: string[] = [];
    const usedHeaps: number[] = [];
    const finalHeaps: number[] = [];

    let longestCharNumber: number = 0;
    let sumOfBits: string = '';

    for (let i = 0; i < heaps.length; i++) {
        heaps2.push(heaps[i].toString(2));
    }

    for (let i = 0; i < heaps2.length; i++) {
        if (heaps2[i].length > longestCharNumber) {
            longestCharNumber = heaps2[i].length;
        }
    }

    for (let i = 0; i < heaps2.length; i++) {
        if (heaps2[i].length < longestCharNumber) {
            heaps2[i] = '0'.repeat(longestCharNumber - heaps2[i].length) + heaps2[i];
        }

    }

    console.log(heaps2);


    for (let j = 0; j < longestCharNumber; j++) {
        let sum: number = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);

        }
        sumOfBits += (sum % (k + 1)).toString();
    }

    console.log(sumOfBits);

    let check: number = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }

    let isFilled: boolean = false;
    if (check === 0) {
        alert("Програшна позиція");
    } else {
        for (let i = 0; i < sumOfBits.length; i++) {
            if (sumOfBits.charAt(i) !== '0') {
                let bit: number = +sumOfBits.charAt(i);
                let moves: number = k;
                for (let j = 0; j < heaps2.length && bit > 0 && moves > 0; j++) {
                    let minus: number = +heaps2[j].charAt(i);
                    if (minus > 0) {
                        if (j in usedHeaps) {
                            if (minus > bit) minus = bit;
                            bit -= minus;
                            let temp = +heaps2[j].charAt(i) - minus;
                            heaps2[j] = heaps2[j].substr(0, i) + temp.toString() + heaps2[j].substr(i + 1);
                            moves--;
                        } else if (!isFilled && !(j in usedHeaps)) {
                            usedHeaps.push(j);
                            if (minus > bit) minus = bit;
                            bit -= minus;
                            let temp = +heaps2[j].charAt(i) - minus;
                            heaps2[j] = heaps2[j].substr(0, i) + temp.toString() + heaps2[j].substr(i + 1);
                        }
                    }
                }
                if (usedHeaps.length === k) isFilled = true;
            }

        }
    }
    console.log(heaps2);

    sumOfBits = '';

    for (let j = 0; j < longestCharNumber; j++) {
        let sum: number = 0;
        for (let i = 0; i < heaps2.length; i++) {
            sum += +heaps2[i].charAt(j);

        }
        sumOfBits += (sum % (k + 1)).toString();
    }

    check = 0;
    for (let i = 0; i < sumOfBits.length; i++) {
        check += +sumOfBits.charAt(i);
    }

    if (check === 0) {
        for (let i = 0; i < heaps2.length; i++) {
            finalHeaps.push(parseInt(heaps2[i], 2));

        }
        alert("Стан після виграшного ходу:\n" + finalHeaps);
    } else {
        alert('Виграш неможливий');
    }




}