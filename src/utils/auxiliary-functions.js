//  --------------------------------------------  Вспомогательные функции

//  --------------------  Создание случайного целого числа

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

//  --------------------  Возвращение случайного элемента массива

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

//  --------------------  Создания массива случайных неповторяющихся чисел

export const getRandomNumbersArray = (min, max) => {
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

export const getRandomMixedArray = (array, number) => {
  const mixedArray = [];
  const randomNumbersArray = getRandomNumbersArray(0, array.length);
  for (let i = 0; i < number; i++) {
    mixedArray[i] = array[randomNumbersArray[i]];
  }
  return mixedArray;
};

//  --------------------  Перевод минут в формат часы + минуты

export const getTimeFromMins = (mins) => {
  let hours = Math.trunc(mins / 60);
  let minutes = mins % 60;
  const time = hours + `h` + ` ` + minutes + `m`;
  return time;
};
