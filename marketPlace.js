class Order {
	constructor(id, userId, orderQuantity, pricePerKg, orderType){
		this.id = id;
		this.userId = userId;
		this.orderQuantity = orderQuantity;
		this.pricePerKg = pricePerKg;
		this.orderType = orderType;
	}
}

class MarketPlace {

	//Shared Instance
	static sharedInstance;
	static getInstance(){
		//Checking if the shared instance is not present
		if(!MarketPlace.sharedInstance){
			MarketPlace.sharedInstance = new MarketPlace();
		}
		return MarketPlace.sharedInstance;
	}

	//possible order types
	orderType = {
		SELL: "SELL",
		BUY: "BUY"
	}

	sellOrders = [];
	buyOrders = [];

	//this is gonna be the unique id for orders, just for now it's an increament value starting from 1
	orderCount = 1;

	//liveOrderBoard will contain the grouped data based on the price
	liveOrderBoard = {buy:[], sell:[]};

	//liveOrderBoardSummary will contain the summary for our live order board
	liveOrderBoardSummary = {buy:[], sell:[]};

	currency = "";

	constructor(currency){
		this.currency = currency || "$"
	}

	getPricePerKg(){
		return `${Math.floor(Math.random()*10) + 300}`; // randomly generating the price between 300 and 309
	}

	/**
		registerOrder takes 3 parameters in order ie.,
		userId, orderQuantity(10, 2.5), orderType(BUY or SELL)
		and returns the newly created Order object.
	**/
	registerOrder(userId, orderQuantity, orderType){
		const currentPricePerKg = this.getPricePerKg();
		const newOrder = new Order(this.orderCount, userId, orderQuantity, currentPricePerKg, orderType);
		this.updateOrders(newOrder);
		this.updateLiveOrderBoard();
		this.orderCount++;
		return newOrder;
	}

	updateOrders(newOrder){
		if(newOrder.orderType.toUpperCase() == this.orderType.BUY){
			this.buyOrders.push(newOrder);
		} else {
			this.sellOrders.push(newOrder);
		}
	}

	//returns true if cancelled otherwise false
	cancelOrder(userId, id){
		let order = this.buyOrders.find(order => {
			return ((order.userId === userId) && (order.id === id));
		});

		if(!order){
			order = this.sellOrders.find(order => {
				return ((order.userId === userId) && (order.id === id));
			});
		}

		if(!order){
			console.log("MESSAGE: Not a legit user for this user id or the order id is not present");
			return false;
		}

		// here, the order is the one which needs to be cancel.
		this.removeOrder(order);
		this.updateLiveOrderBoard();

		console.log(`MESSAGE: Order id: ${id} is successfully cancelled`);
		return true;
	}

	removeOrder(order){
		if(order.orderType.toUpperCase() == this.orderType.BUY){
			this.buyOrders = this.buyOrders.filter(buyOrder => buyOrder.id !== order.id);
		} else {
			this.sellOrders = this.sellOrders.filter(sellOrder => sellOrder.id !== order.id);
		}
	}

	// returns the live order board summary
	getLiveOrderBoardSummary(){
		return this.liveOrderBoardSummary;
	}

	getBoardSummaryList(type, obj){
		return this.sortOrders(type, obj).map(([price, orders]) => {
			let orderIds = ``;
			let quantity = 0;
			orders.forEach((order, index) => {
				orderIds = `${orderIds}${index !== 0 ? " & " : ""}order ${order.id}`;
				quantity = quantity + order.orderQuantity;
			});
			return `${type}: ${quantity} kg for ${this.currency}${price} ${orderIds}`;
		});
	}

	sortOrders(type, obj){
		if(type == this.orderType.BUY){
			//Buy will be sorted in descending order
			return Object.entries(obj).sort((a, b) => {
				return a[1].price <= b[1].price ? 1 : -1;
			});
		} else {
			//Sell will be sorted in ascending order
			return Object.entries(obj).sort((a, b) => {
				return a[1].price <= b[1].price ? -1 : 1;
			});
		}
	}

	/**
		updateLiveOrderBoard updates the liverOrderBoard and liveOrderBoardSummary
	**/
	updateLiveOrderBoard(){
		const key = "pricePerKg";
		this.liveOrderBoard.buy = this.groupOrders(this.buyOrders, key);
		this.liveOrderBoard.sell = this.groupOrders(this.sellOrders, key);
		this.liveOrderBoardSummary.buy = this.getBoardSummaryList(this.orderType.BUY, this.liveOrderBoard.buy);
		this.liveOrderBoardSummary.sell = this.getBoardSummaryList(this.orderType.SELL, this.liveOrderBoard.sell);
	}

	groupOrders(obj, key){
		return obj.reduce((result, currentValue)=>{
			(result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
			return result;
		}, {});
	}

}

module.exports = MarketPlace;