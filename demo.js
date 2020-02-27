
const MarketPlace = require("./marketPlace");

//MarketPlace is a singleton class, so only one instance of that can be created
const marketPlace = MarketPlace.getInstance();

class User {
	constructor(id){
		this.id = id;
	}

	registerOrder(orderQuantity, orderType){
		/**
			marketPlace.registerOrder takes 3 parameters in order ie.,
			userId, orderQuantity(10, 2.5), orderType(BUY or SELL) and
			returns a newly created Order object
		**/
		return marketPlace.registerOrder(this.id, orderQuantity, orderType);
	}

	cancelOrder(id){
		/**
			marketPlace.canceOrder takes 2 parameters in order ie.,
			userId, orderId and true if success otherwise false
		*/
		return marketPlace.cancelOrder(this.id, id);
	}
}

/**
	How to use marketPlace library
*/
const user1 = new User(1);

//Register order: single user scenario
console.log("****************Register order: single user scenario****************");
const firstOrder = user1.registerOrder(10, "BUY");
const secondOrder = user1.registerOrder(1.5, "SELL");

// marketPlace.getLiveOrderBoardSummary function returns the live board both buy and sell
console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//Cancel Order: user cancelled the an order
console.log("****************Cancel Order: user cancelled the an order****************");
const isSecondOrderCancelled = user1.cancelOrder(secondOrder.id);
console.log(isSecondOrderCancelled); // should be true

console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//User again place an order
console.log("****************User again place an order****************");
user1.registerOrder(100, "BUY");
console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//More than one user scenario
console.log("****************More than one user scenario****************");
const user2 = new User(2);
user2.registerOrder(10, "BUY");
user2.registerOrder(100, "SELL");
console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//Cancel Order:
console.log("****************Cancel Order: user cancelled the an order****************");
user2.cancelOrder(9);
user2.cancelOrder(7);
console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//User again place an order
console.log("****************User again place an order****************");
user2.registerOrder(1.20, "SELL");
console.log(marketPlace.getLiveOrderBoardSummary());
console.log("\n");

//If a different user tries to cancel the order
console.log("****************If a different user tries to cancel the order****************");
const isCancelled = user2.cancelOrder(firstOrder.id);
console.log(isCancelled); // should be false
console.log("\n");