const string = 'Аналитическая Геометрия'
const shortString = (string) => {
    if(string === null) return
    const slicedString = string.includes('(') ? string.slice(0, string.indexOf('(')) : string;
    const splited = slicedString.split(' ');
    const vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я', 'А', 'Е', 'Ё', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я'];
    const consonants = ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];
    let words = []
    splited.forEach(word => {
        if (word.length < 4) {
            return
        }
        word = word.slice(0, 4)
        if (vowels.includes(word[word.length - 1])) {
            word = word.slice(0, word.length - 1)
        }
        if (consonants.includes(word[1]) && vowels.includes(word[2]) && vowels.includes(word[0])) {
            word = word.slice(0, 2)
        }
        let finalWord = word[0].toUpperCase() + word.slice(1)
        words.push(finalWord)
        words = words.filter(word => word != '')
    });
    return `${words.join('. ')}`
}

export default shortString