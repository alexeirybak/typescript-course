"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products = ["мышь", "клавиатура"];
const product = products.find((item) => item === "монитор");
if (product !== undefined) {
    console.log(product.toUpperCase());
}
else {
    console.log("Товар не найден");
}
const cities = ["Москва", "Санкт-Петербург", "Казань"];
const city = cities[10];
if (city !== undefined) {
    console.log(city.toUpperCase());
}
else {
    console.log("Город не найден");
}
const user1 = {};
const user2 = { nickname: undefined };
function getDiscount(isVip) {
    if (isVip) {
        return 0.2;
    }
}
