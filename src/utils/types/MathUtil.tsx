export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 최댓값은 제외, 최솟값은 포함
}
export function getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 최댓값도 포함, 최솟값도 포함
}