const title = document.getElementsByTagName("h1")[0];
const calcButton = document.getElementsByClassName("handler_btn")[0];
const resetButton = document.getElementsByClassName("handler_btn")[1];
const addButton = document.querySelector(".screen-btn");
const otherItems = document.querySelectorAll(".other-items");
const percentItems = document.querySelectorAll(".other-items.percent");
const numberItems = document.querySelectorAll(".other-items.number");
const inputRange = document.querySelector(".rollback").querySelector('[type = "range"]');
const rangeValue = document.querySelector(".rollback").querySelector(".range-value");
const totalInputs = document.getElementsByClassName("total-input");
const totalInput = totalInputs[0];
const totalCountInput = totalInputs[1];
const totalCountOtherInput = totalInputs[2];
const totalFullCountInput = totalInputs[3];
const totalCountRollbackInput = totalInputs[4];
let screen = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  fullPrice: 0,
  allServicePrices: 0,
  servicePercentPrice: 0,
  services: {},
  isNumber: function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  isString: function (string) {
    if (appData.isNumber(string) || string.trim() === "") {
      return false;
    }
    return true;
  },
  asking: function () {
    do {
      appData.title = prompt("Как называется ваш проект?", "Калькулятор верстки");
    } while (!appData.isString(appData.title));

    for (let i = 0; i < 2; i++) {
      let name;
      do {
        name = prompt("Какие типы экранов нужно разработать?");
      } while (!appData.isString(name));
      let price = 0;
      do {
        price = prompt("Сколько будет стоить данная работа?");
      } while (!appData.isNumber(price));
      appData.screens.push({ id: i, name: name, price: price });
    }

    for (let i = 0; i < 2; i++) {
      let name;
      do {
        name = prompt("Какой дополнительный тип услуги нужен?");
      } while (!appData.isString(name));
      let price = 0;

      do {
        price = prompt("Сколько это будет стоить?");
      } while (!appData.isNumber(price));
      appData.services[i + "_" + name] = +price;
    }
    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },
  addPrices: function () {
    appData.screens.reduce((sum, price) => {
      appData.screenPrice = +sum.price + +price.price;
    });

    for (let key in appData.services) {
      appData.allServicePrices += appData.services[key];
    }
  },
  getFullPrice: function () {
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
  },
  getTitle: function () {
    const trimmedTitle = appData.title.trim();
    appData.title = trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.slice(1);
  },
  getServicePercentPrices: function () {
    appData.servicePercentPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
  },
  getRollackMessage: function (price) {
    if (price > 30000) {
      price = price - (price / 100) * 10;
      return "Вам предоставлена скидка в 10%. Итоговая сумма: " + price;
    } else if (price > 15000 && price < 30000) {
      price = price - (price / 100) * 5;
      return "Вам доступна скидка в 5%. Итоговая самму: " + price;
    } else if (price < 15000 && price > 0) {
      return "Скидка не предусмотрена";
    } else if (price < 0) {
      return "Что то пошло не так!";
    }
  },
  start: function () {
    appData.asking();
    appData.addPrices();
    appData.getFullPrice();
    appData.getServicePercentPrices();
    appData.getTitle();

    appData.logger();
  },
  logger: function () {
    console.log(appData.getRollackMessage(appData.fullPrice));
    console.log(appData.title);

    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screenPrice);

    console.log(appData.screens);
  },
};

appData.start();
