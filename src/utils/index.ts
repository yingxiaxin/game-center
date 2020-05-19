export function removeArrayItem(array, condition) {
    const index = array.findIndex(val => {
        return condition(val);
    });

    array.splice(index, 1);
    return array;
}