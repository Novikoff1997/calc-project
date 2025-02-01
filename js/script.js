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

  clearData: function () {
    this.screens = [];
    this.screenPrice = 0;
    this.screensCount = 0;
    this.adaptive = true;
    this.rollback = 0;
    this.fullPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.servicePercentPrice = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
  },
  elementsDisabled: function () {
    screens.forEach((elem) => {
      elem.querySelector('[type = "text"]').setAttribute("disabled", "");
      elem.querySelector("select").setAttribute("disabled", "");
    });
    addButton.setAttribute("disabled", "");
  },
  elementsEnabled: function () {
    screens.forEach((elem) => {
      elem.querySelector('[type = "text"]').removeAttribute("disabled");
      elem.querySelector("select").removeAttribute("disabled");
    });
    addButton.removeAttribute("disabled");
  },
  removeScreens: function () {
    for (let i = screens.length - 1; i > 0; i--) {
      screens[i].parentNode.removeChild(screens[i]);
    }
    screens = document.querySelectorAll(".screen");

    screens[0].querySelector('[type = "text"]').value = "";
    screens[0].querySelector("select").selectedIndex = 0;
  },
  resetCheckbox: function () {
    percentItems.forEach((element) => {
      element.querySelector('[type = "checkbox"]').checked = false;
    });
    numberItems.forEach((element) => {
      element.querySelector('[type = "checkbox"]').checked = false;
    });
  },
  resetRange: function () {
    inputRange.value = 0;
    rangeValue.textContent = inputRange.value + "%";
  },
  resetData: function () {
    resetButton.addEventListener("click", () => {
      calcButton.style.display = "block";
      resetButton.style.display = "none";
      appData.elementsEnabled();
      appData.clearData();
      appData.showResult();
      appData.removeScreens();
      appData.resetCheckbox();
      appData.resetRange();
    });
  },
  reset: function () {
    calcButton.style.display = "none";
    resetButton.style.display = "block";
    appData.elementsDisabled();
    appData.resetData();
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  init: function () {
    this.addTitle();
    calcButton.addEventListener("click", this.start);
    addButton.addEventListener("click", this.addScreenBlock);
    inputRange.addEventListener("input", this.addRollback);
  },
  showResult: function () {
    totalInput.value = this.screenPrice;
    totalCountOtherInput.value = this.servicePricesPercent + this.servicePricesNumber;
    totalFullCountInput.value = this.fullPrice;
    totalCountRollbackInput.value = this.servicePercentPrice;
    totalCountInput.value = this.screensCount;
  },
  addScreens: function () {
    screens = document.querySelectorAll(".screen");

    screens.forEach((screen, index) => {
      const select = screen.querySelector("select"); // Поле выбора экранов
      const input = screen.querySelector("input"); // Поле ввода количества экранов
      const seclectName = select.options[select.selectedIndex].textContent; // Название выбранного экрана
      const price = +select.value * +input.value;
      if (price) {
        this.screens.push({
          id: index,
          name: seclectName,
          price: price,
          count: input.value,
        });
      } else {
        this.screens = [];
      }
    });
    if (this.screens.length === 0) {
      alert("Не все поля экранов заполнены!");
    } else {
      appData.reset();
    }
  },
  addRollback: function () {
    rangeValue.textContent = inputRange.value + "%";
    appData.calcRollback();
  },
  calcRollback: function () {
    this.rollback = inputRange.value;
    this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
    totalCountRollbackInput.value = this.servicePercentPrice;
  },
  addServices: function () {
    percentItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]"); // Заносим чекбокс
      const label = item.querySelector("label"); // Заносим лейбел
      const input = item.querySelector("input[type=text]"); // Заносим инпут со значением

      // Проверяем что чекбокс нажат
      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value; // Заносим значения в объект
      }
    });
    numberItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },
  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);
    screens[screens.length - 1].after(cloneScreen);
  },
  addPrices: function () {
    if (this.screens.length !== 0) {
      for (let screenPrice of this.screens) {
        this.screenPrice += +screenPrice.price;
        this.screensCount += +screenPrice.count;
      }
      for (let key in this.servicesNumber) {
        this.servicePricesNumber += this.servicesNumber[key];
      }

      for (let key in this.servicesPercent) {
        this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100);
      }
      this.fullPrice = this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;

      this.servicePercentPrice = this.fullPrice - this.fullPrice * (this.rollback / 100);
    }
  },
  start: function () {
    appData.clearData();
    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    appData.calcRollback();
    appData.showResult();
    // appData.logger();
  },
  logger: function () {
    console.log("Логгер:");
    console.log(appData);
  },
};

appData.init();
