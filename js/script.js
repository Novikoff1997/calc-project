const title = document.getElementsByTagName("h1")[0];
const calcButton = document.getElementsByClassName("handler_btn")[0];
const resetButton = document.getElementsByClassName("handler_btn")[1];
const addButton = document.querySelector(".screen-btn");
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
let screens = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  screensCount: 0,
  adaptive: true,
  rollback: 0,
  fullPrice: 0,
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  servicePercentPrice: 0,
  servicesPercent: {},
  servicesNumber: {},

  addTitle: function () {
    document.title = title.textContent;
  },
  init: function () {
    appData.addTitle();
    calcButton.addEventListener("click", appData.start);
    addButton.addEventListener("click", appData.addScreenBlock);
    appData.addRollback();
  },
  showResult: function () {
    totalInput.value = appData.screenPrice;
    totalCountOtherInput.value = appData.servicePricesPercent + appData.servicePricesNumber;
    totalFullCountInput.value = appData.fullPrice;
    totalCountRollbackInput.value = appData.servicePercentPrice;
    totalCountInput.value = appData.screensCount;
  },
  addScreens: function () {
    screens = document.querySelectorAll(".screen");

    screens.forEach((screen, index) => {
      const select = screen.querySelector("select"); // Поле выбора экранов
      const input = screen.querySelector("input"); // Поле ввода количества экранов
      const seclectName = select.options[select.selectedIndex].textContent; // Название выбранного экрана
      const price = +select.value * +input.value;
      if (price) {
        appData.screens.push({
          id: index,
          name: seclectName,
          price: price,
          count: input.value,
        });
      } else {
        appData.screens = [];
      }
    });
    if (appData.screens.length === 0) {
      alert("Не все поля экранов заполнены!");
    }
  },
  addRollback: function () {
    inputRange.addEventListener("input", (event) => {
      rangeValue.textContent = inputRange.value + "%";
      appData.calcRollback();
    });
  },
  calcRollback: function () {
    appData.rollback = inputRange.value;
    appData.servicePercentPrice = appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
    totalCountRollbackInput.value = appData.servicePercentPrice;
  },
  addServices: function () {
    percentItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]"); // Заносим чекбокс
      const label = item.querySelector("label"); // Заносим лейбел
      const input = item.querySelector("input[type=text]"); // Заносим инпут со значением

      // Проверяем что чекбокс нажат
      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value; // Заносим значения в объект
      }
    });
    numberItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    });
  },
  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);

    screens[screens.length - 1].after(cloneScreen);
  },
  addPrices: function () {
    if (appData.screens.length !== 0) {
      for (let screenPrice of appData.screens) {
        appData.screenPrice += +screenPrice.price;
        appData.screensCount += +screenPrice.count;
      }
      for (let key in appData.servicesNumber) {
        appData.servicePricesNumber += appData.servicesNumber[key];
      }

      for (let key in appData.servicesPercent) {
        appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
      }
      appData.fullPrice =
        appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber;

      appData.servicePercentPrice =
        appData.fullPrice - appData.fullPrice * (appData.rollback / 100);
    }
  },
  clearData: function () {
    appData.screens = [];
    appData.screenPrice = 0;
    appData.screensCount = 0;
    appData.adaptive = true;
    appData.rollback = 0;
    appData.fullPrice = 0;
    appData.servicePricesPercent = 0;
    appData.servicePricesNumber = 0;
    appData.servicePercentPrice = 0;
    appData.servicesPercent = {};
    appData.servicesNumber = {};
  },
  start: function () {
    appData.clearData();
    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    appData.calcRollback();
    appData.showResult();
    appData.logger();
  },
  logger: function () {
    console.log("Логгер:");
    console.log(appData);
  },
};

appData.init();
