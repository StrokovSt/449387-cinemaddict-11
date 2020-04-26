//  --------------------------------------------  Вспомогательные функции

//  --------------------  Создание случайного целого числа

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

//  --------------------  Возвращение случайного элемента массива

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

//  --------------------  Создания массива случайных неповторяющихся чисел

const getRandomNumbersArray = (min, max) => {
  const randomNumberArray = [];
  while (randomNumberArray.length < max) {
    const randomNumber = getRandomIntegerNumber(min, max);
    if (randomNumberArray.indexOf(randomNumber) === -1) {
      randomNumberArray.push(randomNumber);
    }
  }
  return randomNumberArray;
};

//  --------------------  Перемешивание элементов массива в случайном порядке

const getRandomMixedArray = (array, number) => {
  const mixedArray = [];
  const randomNumbersArray = getRandomNumbersArray(0, number);
  for (let i = 0; i < number; i++) {
    mixedArray[i] = array[randomNumbersArray[i]];
  }
  return mixedArray;
};

export {getRandomIntegerNumber, getRandomArrayItem, getRandomNumbersArray, getRandomMixedArray};
