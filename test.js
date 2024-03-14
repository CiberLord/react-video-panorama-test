const array = [
    [30, 100, 10],
    [12, 99, 23],
    [10, 20, 40],
];

const result_array = [];


for (let i = 0; i < array.length; i = i + 1) {
    let current_item = array[i]

    for (let y = 0; y < current_item.length; y++) {
        let str = current_item[y]

        result_array.push(str)
    }
}
console.log(result_array)