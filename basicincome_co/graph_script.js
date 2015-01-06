 var module = angular.module('app')

 
 
  module.controller('visualizationCtrl', ['$rootScope', '$network', '$vaultClient', '$MongoDB',
    function ($scope, $network, $vaultClient, $MongoDB)
  {
  	
$scope.network_type = "Safety Net"

$scope.change_views = function() { //not in use 
$scope.switcher = !$scope.switcher
}
$scope.change_to_safety_net_pathways = function() {  
$scope.switcher = false
$scope.network_type = "Safety Net"
$MongoDB.type1()
console.log("viewing safety nets")
}
$scope.change_to_dividend_pathways = function() {  
$scope.switcher = true
$scope.network_type = "Dividend Pathways"

$MongoDB.type2()

console.log("viewing dividend pathways")

}

$scope.submit = function(address){
	console.log("testt"+$scope.address)

	$scope.changeMode('individual')
	$scope.name_to_address(address, true)
	change_color()
}



    $network.shout()
    console.log("hej")

// Javascript for the visualization, using the D3 library -->
// CONSTANTS
var UNIX_RIPPLE_TIME = 946684800;
var RECURSION_DEPTH = 1;
var MAX_NUTL = 360;
var REFERENCE_NODE = 'rLaKjMvLbrAJwnH4VpawQ6ot9epZqJmbfQ';
var HALO_MARGIN = 6;
var COLOR_TABLE = {
//currency  |  center  |   rim  |
	"__Z": [["#dfe0e1","#999999"], //degree 0
/*GRAY*/  ["#ebecec","#aaa9a9"], //degree 1
          ["#ededee","#bcbbbb"], //etc.
          ["#f3f4f4","#d0cece"],
          ["#fdfdfe","#e5e4e3"]],
			
	"__N": [["#f05656","#ee2d2c"],
/*RED*/	  ["#f37a6f","#f16249"],
          ["#f6998b","#f5886d"],
          ["#fab9ac","#f9ad95"],
          ["#fddad1","#fcd4c4"]],
			
	"BTC": [["#f9b120","#b76f2f"],
/*ORANGE*/["#e5af65","#c38a57"],
          ["#e9c189","#d0a57e"],
          ["#edd2ad","#dcbfa6"],
          ["#f1e4d1","#e9dacd"]],
			
	"CNY": [["#fcf5a1","#fedb3d"],
/*YELLOW*/["#fdf7b4","#ffe069"],
          ["#fdf7c4","#ffe68d"],
          ["#fefad8","#ffed83"],
          ["#fffcea","#fff5d6"]],
			
	"USD": [["#99cc66","#669940"],
/*LIME*/  ["#acd585","#82a85d"],
          ["#c0dea1","#9eb880"],
          ["#d4e8be","#bbcba4"],
          ["#e8f2dd","#dae1cd"]],
			
	"AUD": [["#8dc198","#609869"],
/*GREEN*/ ["#a2cbab","#7eab85"],
          ["#b7d6bd","#9cbda1"],
          ["#cbe0d0","#b9d0bd"],
          ["#e0ebe2","#d7e2d9"]],
			
	"XRP": [["#55a7cc","#346aa9"],
/*BLUE*/  ["#83b8d6","#5083b9"],
          ["#a7cae1","#7ba1cb"],
          ["#d0e1ed","#a3c2dd"],
          ["#f2f6fa","#cee8f1"]],
			
	"___": [["#6566ae","#363795"], //I.e., any other currency.
/*INDIGO*/["#7e7cbb","#5855a5"],
          ["#9896c9","#7a74b6"],
          ["#b6b4da","#9e99cb"],
          ["#d7d6eb","#c9c6e3"]],
			
	"CAD": [["#8e68ad","#673695"],
/*VIOLET*/["#9f80ba","#7d58a5"],
          ["#8e68ad","#673695"],
          ["#c8b8da","#b29ecc"],
          ["#e0d8eb","#d4cae4"]],
			
	"EUR": [["#b76e99","#863d66"],
/*PINK*/  ["#c389ab","#9c6283"],
          ["#d0a4be","#b2879f"],
          ["#dcbfd0","#c9abbc"],
          ["#d9dae3","#dfd0d8"]],
          
   "DIV":  [["#f9b120","#b76f2f"],/*dividend-pathway*/
		  ["#e5af65","#c38a57"],
          ["#e9c189","#d0a57e"],
          ["#edd2ad","#dcbfa6"],
          ["#f1e4d1","#e9dacd"]],
	"SAF": [["#55a7cc","#346aa9"],
	      ["#83b8d6","#5083b9"], //safety net
          ["#a7cae1","#7ba1cb"],
          ["#d0e1ed","#a3c2dd"],
          ["#f2f6fa","#cee8f1"]],
};
          
var HIGH_SATURATION_COLORS = {
	"__N": "#f00", //RED	
	"BTC": "#fa0", //ORANGE
	"CNY": "#af0", //YELLOW
	"USD": "#0f0", //LIME
	"AUD": "#0fa", //GREEN
	"XRP": "#0af", //BLUE
	"___": "#00f", //INDIGO
	"CAD": "#a0f", //VIOLET
	"EUR": "#f0a",  //PINK
	"DIV": "#f0a",  //PINK
	"SAF": "#0af"  //PINK

};
var HEX_TO_PERCENT = {"0":0,"a":0.67,"f":1};

var REQUEST_REPETITION_INTERVAL = 8*1000; //milliseconds



var param = window.location.hash.replace(/\W/g, '');

var alreadyFailed = false;
var focalNode;
var transaction_id;

var changingFocus = false;

var command = param.hash
console.log("thisss"+command)
console.log("thisss"+param.hash)
if (param == "") {
	focalNode = REFERENCE_NODE;
} else if (param.charAt(0) == "r" ) {
	focalNode = param;
} else if ("0123456789ABCDEF".indexOf(param.charAt(0)) != -1) {
	transaction_id = param;
 
} else {
	focalNode = REFERENCE_NODE;
}


function gotoThing() {
  var string = $('#focus').val().replace(/\s+/g, '');
  if (string.length === 64) {
    console.log("HELLO!");
    eraseGraph();
    window.location.hash = string;
    remote.request_tx(string, handleIndividualTransaction);
  } else {
    changeMode('individual');
    refocus(string,true);
  }
}


var lastFocalNode = REFERENCE_NODE;
var currentCurrency = "XRP";
var currentLedger = {ledger_current_index: 2011754};
var w = 935;  //Width
var h = 1085; //Height
var hh = 710; //Height above the bottom bar

var nodes = [ {x:w/2, y:hh/2, account:{Account:focalNode, Balance:0}, trustLines:[], balances:{} }];
var le_links = [];
var nodeMap = {};
nodeMap[focalNode] = 0;
var degreeMap = {};
degreeMap[focalNode] = 0;
var expandedNodes = {};
var provisionallyExpandedNodes = {};
var txx;
var firstTime = true;




// Setup ripple-lib
var Remote = ripple.Remote;
var remote = new Remote({
	trace: false,
	trusted: true,
	local_signing: true,
	connection_offest: 60,
	servers: [{ 
		host: 's1.ripple.com'
		, port: 443
		, secure: true, pool: 3
	}]
});

//basicincome
// Setup vaultClient
var vaultClient = new ripple2.VaultClient();

//Opening sequence:
remote.connect(function() {
	//Subscriptions
	remote.on('ledger_closed', function(x,y){
		currentLedger = x;
		$("#ledgernumber").text(commas(parseInt(currentLedger.ledger_index)));
		remote.request_ledger('closed', handleLedger);
	});
	remote.on('transaction_all', handleTransaction);
	
	//Get current ledger
	remote.request_ledger('closed', handleLedger);

	if (firstTime) {
		if (transaction_id && transaction_id!="") {
			nodeMap = {};
			degreeMap = {};
			nodes = [];
      $('#focus').val(transaction_id);
			remote.request_tx(transaction_id, handleIndividualTransaction);
		} else {
			lastFocalNode = REFERENCE_NODE;
			expandNode(focalNode);
			addNodes(0);
			serverGetInfo(focalNode);
		}
	}
	firstTime = false;
});

var pendingRequests = {};

var requestRepetitionInterval = setInterval(function(){
	var now = new Date().getTime();
	var idsToDelete = [];
	var entriesToAdd = {};
	for (var id in pendingRequests) {
		if (pendingRequests.hasOwnProperty(id)) {
			var req = pendingRequests[id];
			if (req.timestamp + REQUEST_REPETITION_INTERVAL <= now) {
				console.log("Repeating request");
				var newID = req.func();
				entriesToAdd[newID] = {func: req.func, timestamp:now};
				idsToDelete.push(id);
			}
		}
	}
	for (var i=0; i<idsToDelete.length; i++) {
		delete pendingRequests[idsToDelete[i]];
	}
	for (var newID in entriesToAdd) {
		if (entriesToAdd.hasOwnProperty(newID)) {
			pendingRequests[newID] = entriesToAdd[newID];
		}
	}
}, REQUEST_REPETITION_INTERVAL);



//Repeatable methods for fetching from server
function serverGetLines(address) {
	if ($.isEmptyObject(nodes[nodeMap[address]].trustLines)) {
		//Get trust lines for address         ?  ??current?
		handleLines(address)
		/*
		var rral = (function() {return function() {
			var x = remote.request_account_lines(address, 0, 0, handleLines);

			//THIS
			return x.message.id;
		}})();
		
		*/
		/*
		var reqID = rral();
		pendingRequests[reqID] = {
			func:rral,
			timestamp:(new Date().getTime())
		}
		*/
		
	} else {
		addConnections(address, nodes[nodeMap[address]].trustLines);
	}
}

function serverGetInfo(address) {
	//console.log("serverGetInfo", address);
	if (nodes[nodeMap[address]] && nodes[nodeMap[address]].account.index) {
		// Don't do anything if we already have information about this account.
		// TODO: Why does this never happen?
	} else {
		//Get account info for address
		var rrai = (function() {return function() {
			var x = remote.request_account_info(address, handleAccountData);
			return x.message.id;
		}})();
		var reqID = rrai();
		pendingRequests[reqID] = {
			func:rrai,
			timestamp:(new Date().getTime())
		};
	}
}

var TRANSACTION_PAGE_LENGTH = 13;

function getNextTransactionPage() {
	//request transactions for the current account, with offset = nodes[nodeMap[address]].transactions.length
	var rrat = (function() {return function(){
		var x = remote.request_account_tx({
			account: focalNode,
			limit: TRANSACTION_PAGE_LENGTH,
			ledger_index_min: -1,
			ledger_index_max: -1,
			forward: false,
			marker: nodes[nodeMap[focalNode]].transactionMarker
		}, handleAccountTransactions);
		return x.message.id;
	}})();
	var reqID = rrat();
	pendingRequests[reqID] = {
		func:rrat,
		timestamp:(new Date().getTime())
	};
	//when the answer comes back, see if it's new information.
	//if so, update WITH THE NEW INFO ONLY (i.e., don't clear the whole table, only do
	//$("#transactionThrobber").remove();
	//and add the new stuff.
}


//Handlers

function handleLines(address) {

/*
	delete pendingRequests[this.message.id];
	if (err && err.remote && (err.remote.error === "actNotFound" || err.remote.error === "actMalformed") ) {
		$("#loading").text("Account not found!").css("color","#a00");
	} else {
		*/
  	/*if () {
			//serverGetLines(address);
      addConnections(obj.account, obj.lines);
		}*/
    
    //var shouldExpand = (mode=="transaction") || obj.lines.length<MAX_NUTL || confirm('This node has '+obj.lines.length+' unseen trust lines. Expanding it may slow down your browser. Are you sure?');
    //addConnections(obj.account, obj.lines, !shouldExpand);
    
// basicincome.co
$MongoDB.getpathways(address, filter_connections)


function filter_connections(data){
	var pathway = []

 	for(var i =0; i<data.length; i++){
 		pathway.push({"account": data[i].account, "balance": data[i].total_pathway, "currency": data[i].currency, "limit":"0","limit_peer":"0.25","quality_in":0,"quality_out":0, "taxRate": data[i].taxRate})

 	}
 	console.log("this"+address,pathway)
    addConnections(address, pathway);

}

    //if (
		//addConnections(obj.account, obj.lines);
	}


function handleTransaction(obj) {
    var tx  = obj.transaction;
    tx.meta = obj.meta;
	$("#transactionFeedTable").prepend(renderTransaction(tx));
	if (obj.transaction.TransactionType == "Payment") {
		animateTransaction(tx);
	}
}

function handleLedger(err, obj) {
	currentLedger = obj.ledger;
	$("#ledgernumber").text(commas(parseInt(currentLedger.ledger_index)));
	$("#totalripples").text(commas(parseInt(currentLedger.total_coins)/1000000));
}

function handleAccountData(err, obj) {
	delete pendingRequests[this.message.id];
	if (err && err.remote && (err.remote.error === "actNotFound" || err.remote.error === "actMalformed" )) {
		$("#loading").text("Account not found!").css("color","#a00");
	} else {
		if ($.isEmptyObject(obj.account_data)) {
			alert("This address is not valid!");
			console.log(obj);
			refocus(lastFocalNode,true);
		} else {
			var n = nodes[nodeMap[obj.account_data.Account]];
			n.account = obj.account_data; //XXXX Uncaught TypeError: Cannot set property 'account' of undefined
			if (currentCurrency == "XRP") { // Change the size of the circles, and recalculate the arrows.
				updated = svg.select("g#nodeGroup").select("circle#_"+obj.account_data.Account);
				updated.attr("r", nodeRadius(n));
				svg.select("g#haloGroup").select("circle#halo_"+obj.account_data.Account).attr("r", HALO_MARGIN+nodeRadius(n));;
			}
			if (obj.account_data.Account == focalNode) {
				//Update the XRP listing on the table below. (But don't rewrite the whole table)
				$("#xrpBalance").text(commas(n.account.Balance/1000000));
			}
		}
	}
}

function handleAccountTransactions(err, obj) {
	delete pendingRequests[this.message.id];
	var n = nodes[nodeMap[obj.account]];
	var noMoreTransactions = true;
	if (n.transactions) { //XXXX Uncaught TypeError: Cannot read property 'transactions' of undefined 
		//You don't want to add the same set of transactions more than once.
		//So, only add the transactions if one of the following is true:
		//1. We have no marker stored locally.
		//2. The message had no marker, and we are not yet finished with the list.
		//3. The message did have a marker, but its ledger number is less than that of the locally stored marker.
		if (!n.marker || (!obj.marker && !n.transactionsFinished) || (obj.marker && n.marker.ledger>obj.marker.ledger)) {
			n.transactions.push.apply(n.transactions, obj.transactions);
		}
	} else {
		n.transactions = obj.transactions;
	}
	
	if (obj.marker) {
		n.transactionMarker = obj.marker;
	} else {
		n.transactionsFinished = true;
	}
	if (obj.account == focalNode) {
		//updateTransactions(focalNode, true); //appending=true
	}
}

function handleIndividualTransaction(err, obj) {
	delete pendingRequests[this.message.id];
	txx = obj;
	changeMode("transaction", txx);
}






// MODE CHANGING

var mode = "individual";
var senderAddress;

function changeMode(newMode, data) {
	if (mode != newMode) {
		if (mode=="individual") {
			exitIndividualMode();
		} else if (mode=="transaction") {
			exitTransactionMode();
		} else if (mode=="feed") {
			exitFeedMode();
		}
		if (newMode=="individual") {
			enterIndividualMode(data);
		} else if (newMode=="transaction") {
			enterTransactionMode(data);
		} else if (newMode=="feed") {
			enterFeedMode();
		}
		mode = newMode;
	}
}

$scope.changeMode = function(newMode, data) {
	if (mode != newMode) {
		if (mode=="individual") {
			exitIndividualMode();
		} else if (mode=="transaction") {
			exitTransactionMode();
		} else if (mode=="feed") {
			exitFeedMode();
		}
		if (newMode=="individual") {
			enterIndividualMode(data);
		} else if (newMode=="transaction") {
			enterTransactionMode(data);
		} else if (newMode=="feed") {
			enterFeedMode();
		}
		mode = newMode;
	}
}

function enterIndividualMode(data) {
	if (mode != "individual") {
		$("#leftHeading").text("Balances");
		//$("#rightHeading").text("History");
		$("#rippleName").css("visibility","visible");
		$("#focalAddress").css("visibility","visible");
		$("#balanceTable").css("visibility","visible");
		$("#transactionTable").css("visibility","visible");
		$("#transactionInformationContainer").css("display","none"); //This is here because it is used by both feed and transaction modes.
		$("#feedTab").addClass("unselectedTab").removeClass("selectedTab").css("visibility","visible");
		$("#individualTab").removeClass("unselectedTab").addClass("selectedTab").css("visibility","visible");
		if (data) {
			expandNode(data);
			senderAddress = false;
		}
		mode = "individual";
	}
}
function exitIndividualMode() {
	if (mode == "individual") {
		$("#rightHeading").text("");
		$("#rippleName").css("visibility","hidden");
		$("#focalAddress").css("visibility","hidden");
		$("#balanceTable").css("visibility","hidden");
		$("#transactionTable").css("visibility","hidden");
		$("#transactionInformationContainer").css("display","inherit");
	}
}

function enterFeedMode() {
	if (mode != "feed") {
		$("#feedTab").removeClass("unselectedTab").addClass("selectedTab");
		$("#individualTab").addClass("unselectedTab").removeClass("selectedTab");
		$("#transactionFeed").css("display","inherit");
		$("#leftHeading").text("Live transaction feed");
		mode = "feed";
	}
}
function exitFeedMode() {
	if (mode == "feed") {
		$("#transactionFeed").css("display","none");
	}
}

function enterTransactionMode(tx) {
	if (mode != "transaction") {
		eraseGraph();
		txx = tx;
		$("#transactionInformation").html(txDescription(tx));
		var currency;
		if (tx.Amount.currency) {
			currency = tx.Amount.currency;
		} else {
			currency = "XRP";
		}
		var option = $("select#currency").find("option[value="+currency+"]");
		if (option.html()) {
			$("select#currency").selectbox("change", currency, option.html());
		} else {
			$("select#currency").selectbox("change", "___", "SSGSGS");
			$("#otherCurrency").attr("value",currency);
			$('#otherCurrency').css('font-style','inherit').css('color','inherit');
			changeCurrency("___");
		}
		senderAddress = tx.Account;
		
		walkPaths(tx, true);

		setTimeout(function(){animateTransaction(tx);}, 2000);
		$("#leftHeading").html("Transaction information <input type='button' style='position:absolute; top:56px; left:200px;' onclick='animateTransaction(txx);' value='Animate'/>");
		$("#feedTab").addClass("unselectedTab").removeClass("selectedTab");
		$("#individualTab").addClass("unselectedTab").removeClass("selectedTab");
		$("#transactionInformation").css("display","inherit");
		mode = "transaction";
	}
}
function exitTransactionMode() {
	if (mode == "transaction") {
		$("#transactionInformation").css("display","none");
	}
}


function walkPaths(tx, clearing) {
	var anyNewNodes = false;
	var numberOfExistingNodes = nodes.length-1;
	if ("undefined" == typeof nodeMap[tx.Account]) {
		nodes.push({x:w*Math.random(), y:hh*Math.random(), account:{Account:tx.Account, Balance:0}, trustLines:[], balances:{} }); //
		nodeMap[tx.Account] = nodes.length-1;
		degreeMap[tx.Account] = clearing ? 0 : 1;
		anyNewNodes = true;
	}
	if (tx.Paths) {
		for (var i=0; i<tx.Paths.length; i++) {
			for (var j=0; j<tx.Paths[i].length; j++) {
				var address = tx.Paths[i][j].account;
				if ("undefined" == typeof nodeMap[address]) {
					if (address) {
						nodes.push({x:w*Math.random(), y:hh*Math.random(), account:{Account:address, Balance:0}, trustLines:[], balances:{} });
						nodeMap[address] = nodes.length-1;
						degreeMap[address] = 1;
						console.log("Added node");
						anyNewNodes = true;
					}
				}
			}
		}
	}
	if ("undefined" == typeof nodeMap[tx.Destination]) {
		nodes.push({x:w*Math.random(), y:hh*Math.random(), account:{Account:tx.Destination, Balance:0}, trustLines:[], balances:{} });
		nodeMap[tx.Destination] = nodes.length-1;
		degreeMap[tx.Destination] = clearing ? 0 : 1;
		anyNewNodes = true;
	}
	if (anyNewNodes) {
		addNodes(1);
	}
	
	if (clearing) {	//Do this if we just cleared the graph and are displaying the transaction.
		for (var i=0; i<nodes.length; i++) {
			serverGetInfo(nodes[i].account.Account);
			serverGetLines(nodes[i].account.Account);
		}
	} else if (anyNewNodes) { //Do this if we're displaying in place:
		//Note: This will NOT display new connections between already existing nodes, even if the transaction uses them.
		displayingTransactionInPlace = true;
		for (var i=numberOfExistingNodes; i<nodes.length; i++) {
			serverGetInfo(nodes[i].account.Account);
			serverGetLines(nodes[i].account.Account);
		}
	}
}

function eraseGraph() {
	zoomLevel = 1;
	translationX = 0;
	translationY = 0;
	panAndZoom();
	$("#zoomInButton").attr("disabled","disabled");

	svg.select("g#nodeGroup").selectAll("circle.node").data([]).exit().remove();
	svg.select("g#linkGroup").selectAll("line")       .data([]).exit().remove();
	svg.select("g#haloGroup").selectAll("circle.halo").data([]).exit().remove();
	svg.select("g#arrowheadGroup").selectAll("path.arrowhead").data([]).exit().remove();
	
	nodes = [];
	le_links = [];
	nodeMap = {};
	expandedNodes = {};
	provisionallyExpandedNodes = {};
	animatorLinks = [];
	$("#loading").css("display","block").css("color","#aaa");;
	$("#loading").html('<img src="throbber4.gif" style="vertical-align: middle;" /> Loading...');
}


// DATA-TO-HTML FUNCTIONS
function renderTransaction(tx) {
	var transactionType;
	var from = tx.Account;
	var to = null;
	var amount = null;
	var currency = null;
	var secondAmount = null;
	var secondCurrency = null;
	if (tx.TransactionType == "Payment") {
		amount = tx.meta.DeliveredAmount || tx.Amount;
		transactionType = "send";
		to = tx.Destination;
	} else if (tx.TransactionType == "TrustSet") {
		amount = tx.LimitAmount;
		transactionType = "trustout";
		to = tx.LimitAmount.issuer;
	} else if (tx.TransactionType == "OfferCreate") {
		transactionType = "offerout";
		amount = tx.TakerGets;
		secondAmount = tx.TakerPays;
	} else if (tx.TransactionType == "OfferCancel") {
		transactionType = "canceloffer";
	} else {return;}
	if (amount) {
		if (amount.currency) {
			currency = amount.currency;
			amount = amount.value;
		} else {
			currency = "XRP";
			amount = amount/1000000;
		}
	}
	if (secondAmount) {
		if (secondAmount.currency) {
			secondCurrency = secondAmount.currency;
			secondAmount = secondAmount.value;
		} else {
			secondCurrency = "XRP";
			secondAmount = secondAmount/1000000;
		}
	}
	transactionMap[tx.hash] = tx;
	return ('<tr>'+
		'<td style="width:80px;">'+absoluteTime(tx.date)+'</td>'+
		'<td style="width:1px;">'+clickableAccountSpan(from)+'</td>'+
		'<td style="width:40px;"><div '+(transactionType=='send'?'oncontextmenu="animateInPlaceWithHash(\''+tx.hash+'\');return false;" onclick="showTransactionWithHash(\''+tx.hash+'\')"':'')+' class="'+transactionType+' icon" title="'+txAltText[transactionType]+'">&nbsp;</div></td>'+
		( to||secondAmount ?
			'<td style="width:1px;"><span class="bold amount small">'+commas(amount)+'</span>&nbsp;<span class="light small darkgray">'+currency+'</span></td>'+
			'<td style="text-align:center; width:20px;"><i class="light small darkgray">'+
			( to ?
				'to</i></td>'+
				'<td style="width:1px;">'+clickableAccountSpan(to)+'</td>'
				:
				'for</i></td>'+
				'<td style="width:1px;"><span class="bold amount small">'+commas(secondAmount)+'</span>&nbsp;<span class="light small darkgray">'+secondCurrency+'</span></td>'
			)
			:
			'<td colspan=3></td>'
		)+
		'</tr>');
}

function clickableAccountSpan(address) {
	var o = "<span class='light address' style='cursor:pointer;' "+
		"onmouseover='lightenAddress(\""+address+"\");' "+
		"onmouseout='darkenAddress(\""+address+"\");' "+
		"onclick='expandNode(\""+address+"\");'>"+
		address+"</span>";
	return o;
}

function txDescription(result) {
	console.log("TX INFO:",result);
  var xrpExpense;
  if (result.meta) {
    for (var i=0; i<result.meta.AffectedNodes.length; i++) {
      var an = result.meta.AffectedNodes[i];
      if (an.ModifiedNode && an.ModifiedNode.LedgerEntryType==="AccountRoot" && an.ModifiedNode.FinalFields.Account===result.Account) {
        xrpExpense = {before:an.ModifiedNode.PreviousFields.Balance/1000000 , after:an.ModifiedNode.FinalFields.Balance/1000000};
        break;
      }
    }
  }
    var amount = result.meta.DeliveredAmount || result.Amount;
	var output = (amount?"<b>Amount:</b> <span class='amount'>"+
		(amount.currency ? commas(amount.value)+" "+amount.currency : commas(amount/1000000)+" XRP")+"</span><br/>"+
		(amount.issuer ? "<b>Issuer:</b> "+clickableAccountSpan(amount.issuer)+"<br/>" : ""):"")+
		"<b>Path:</b><ul>"+
		(function(){
			var output = "";
			if (result.Paths) {
				for (var i=0; i<result.Paths.length; i++) {
					var listItem = "<li>"+clickableAccountSpan(result.Account) + " &rarr; ";
					for (var j=0; j<result.Paths[i].length; j++) {
						if (result.Paths[i][j].account) {
							listItem += clickableAccountSpan(result.Paths[i][j].account) + " &rarr; ";
						}
					}
					listItem += (clickableAccountSpan(result.Destination) + "</li>");
					output += listItem;
				}
			} else {
				output += ("<li>"+clickableAccountSpan(result.Account)+ " &rarr; "+clickableAccountSpan(result.Destination)+"</li>");
			}
			return output;
		})()+
		"</ul>"+
    (result.meta ? "<b>Result:</b> "+(result.meta.TransactionResult=="tesSUCCESS"?"<span>":"<span style='color:#900;'>")+result.meta.TransactionResult+"</span><br/>" : "")+
		(xrpExpense||xrpExpense===0 ? "<b>XRP change:</b> "+commas(xrpExpense.before) + " XRP &rarr; "+commas(xrpExpense.after)+" XRP ("+(xrpExpense.after>=xrpExpense.before?"+":"&ndash;")+commas(Math.round(1000000*Math.abs(xrpExpense.before-xrpExpense.after))/1000000)+" XRP)<br/>" : "")+
    (result.date ? "<b>Date:</b> "+absoluteDateOnly(result.date)+" "+absoluteTimeOnly(result.date)+"<br/>" : "")+
    (result.InvoiceID ? "<b>Invoice ID:</b> <tt>"+result.InvoiceID+"</tt><br/>" : "")+
    (result.DestinationTag ? "<b>Destination tag:</b> "+result.DestinationTag+"<br/>" : "")+
		"<b>Hash:</b> <tt>"+result.hash+"</tt><br/>"+
    (result.inLedger ? "<b>Ledger:</b> "+result.inLedger+"<br/>" : "")+
		"<b>Signing key:</b> <tt>"+result.SigningPubKey+
		"</tt><br/><b>Signature:</b><br/><div class='bigString' style='width:"+result.TxnSignature.length*4+"px;'>"+result.TxnSignature+"</div>";
		
	return output;
}


function currentCurrencyBalance(accountNode) {
	var output;
	if (currentCurrency == "XRP") {
		output = accountNode.account.Balance;
	} else {
		output = accountNode.balances[currentCurrency];
		if (!output) { output = 0; }
	}
	return output;
}

var displayingTransactionInPlace = false;

function addConnections(origin, trustLines) {

	console.log("this"+trustLines)
	var transactionMode = (mode=="transaction") || displayingTransactionInPlace;
	$("#loading").css("display","none");
	
	//Receive an array of the format:
	//[{"account":"rnziParaNb8nsU4aruQdwYE3j5jUcqjzFm","balance":"0","currency":"BTC","limit":"0","limit_peer":"0.25","quality_in":0,"quality_out":0},
	//{"account":"rU5KBPzSyPycRVW1HdgCKjYpU6W9PKQdE8","balance":"0","currency":"BTC","limit":"0","limit_peer":"10","quality_in":0,"quality_out":0}]
	nodes[nodeMap[origin]].trustLines = trustLines; //XXXX Uncaught TypeError: Cannot set property 'trustLines' of undefined 
	nodes[nodeMap[origin]].balances = getBalances(origin);

	if (origin == focalNode) {
		updateInformation(origin);
	}
	
	if (currentCurrency != "XRP") { // Change the size of the circle, if we needed to wait until now to figure out its balance (i.e. we're looking at a currency other than XRP.)
		svg.select("g#nodeGroup")
			.select("circle#_"+origin)
			.attr("r", nodeRadius(nodes[nodeMap[origin]]) );
		svg.select("g#haloGroup")
			.select("circle#halo_"+origin)
			.attr("r", HALO_MARGIN+nodeRadius(nodes[nodeMap[origin]]) );
	}

	if ((degreeMap[origin] < RECURSION_DEPTH || ( degreeMap[origin] == RECURSION_DEPTH) && transactionMode) && (transactionMode || trustLines.length<MAX_NUTL || confirm('This node has '+trustLines.length+' unseen trust lines. Expanding it may slow down your browser. Are you sure?')) ) {
		if (!transactionMode) {
			expandedNodes[origin] = true;
		} else {
			provisionallyExpandedNodes[origin] = true;
		}
		var newNodes = [];
		var newLinks = [];
		for (var i=0; i<trustLines.length; i++) {
			var linkWasToExisting = false;
			// add trustLines[i]["account"] to the list of nodes, if it's not on it already.
			// add a link from the current node to trustLines[i]["account"], if it's not there already.
			trustLine = trustLines[i];
			account = trustLine["account"];
			// Fetch the node corresponding to the counterparty of this trust line,
			// or if it's not on the list yet, create one and add it to the list.
			if ("undefined" == typeof nodeMap[account]) {
				if (!transactionMode && (parseFloat(trustLine.limit) != 0.0 ||  parseFloat(trustLine.limit_peer) != 0.0) ) {
					nodeMap[account]=nodes.length;
					degreeMap[account] = degreeMap[origin] + 1;
					var angle = Math.random() * 6.283185307179586;
					var radius= Math.random() * 100;
					var node = {
						x:nodes[nodeMap[origin]].x+Math.cos(angle)*radius,
						y:nodes[nodeMap[origin]].y+Math.sin(angle)*radius,
						account: {
							Account:account,
							Balance:"0",
						},
						trustLines: [],
						balances: {}
					}
					newNodes.push(node);
					nodes.push(node);
					//Only add the node if the trust line is non-zero.
					degreeMap[account] = degreeMap[origin] + 1; 
					serverGetInfo(account); //If this node is not on the list yet, we're going to need to get the info and trustLines for it.
					serverGetLines(account);
				}
			} else {
				var node = nodes[nodeMap[account]];
				linkWasToExisting = true;
			}
			// Now, create links to all of the counterparties that have not been expanded (ie., had their links displayed.). If we're in transaction mode, only add links to existing nodes.
			if ( (!transactionMode && !expandedNodes[account]) || (transactionMode && linkWasToExisting && !provisionallyExpandedNodes[account]) )  {
				var link={};
				function goon(link) {
					if (parseFloat(trustLine.limit) != 0.0 && parseFloat(trustLine.limit_peer) != 0.0) {
						link.strength = 0.5;
					} else {
						link.strength = 1;
					}
					link.currency=trustLines[i].currency;
					le_links.push(link);
				}
				if (parseFloat(trustLine.limit) != 0.0) {
					link.source=nodes[nodeMap[ origin ]];
					link.target=node;
					link.value= parseFloat(trustLine.limit);
					goon(link);
				}
				if (parseFloat(trustLine.limit_peer) != 0.0) {
					var link={};
					link.target=nodes[nodeMap[ origin ]];
					link.source=node;
					link.value= parseFloat(trustLine.limit_peer);
					goon(link);
				}
			}
			
			if (linkWasToExisting) {
			//If we're adding a trust line to an already-existing node, check that node again to see if we should put a halo on it.
				svg.select("g#haloGroup").select("circle#halo_"+account)
					.style("stroke", (numberOfUnseenTrustLines(node)>0)?"#aaa":"none" );
			}
		}
	}
	
	reassignColors(origin);
	addNodes(degreeMap[origin]+1);
	

	//should we add a halo to origin?
	svg.select("g#haloGroup").select("circle#halo_"+origin)
		.style("stroke", (numberOfUnseenTrustLines(nodes[nodeMap[origin]])>0)?"#aaa":"none" );
	displayingTransactionInPlace = false; //really?
}



var svg = d3.select("#visualization")
	.append("svg:svg")
	.attr("width", "100%")
	.attr("height", h).attr("pointer-events", "all")
	.style("background-color", "#fff").on("click",function(){
		if($('.sbOptions').css("display") == "block") {
			$('.sbToggle').trigger('click');
		}
		if($('#otherCurrency').css("display") == "block") {
			$('#otherCurrency').trigger('blur');
		}
	})
	.style("float","left")//.style({"border-left":"1px solid #c8c8c8", "border-right":"1px solid #c8c8c8", "border-top":"1px solid #c8c8c8"})
	.style("margin-right","10").call(d3.behavior.drag().on("drag", redraw));

var zoomLevel = 1;
var translationX = 0;
var translationY = 0;
var panOffset = [0,0];
function redraw() {
  translationX += d3.event.dx;
  translationY += d3.event.dy;
  panAndZoom();
}	


$scope.zoomOut = function(){
	if (zoomLevel >= 1) {
		$("#zoomInButton").removeAttr("disabled");
	}
	translationX += (w/8 * zoomLevel);
	translationY += (hh/8 * zoomLevel);
	panOffset[0] -= (w/8 * zoomLevel);
	panOffset[1] -= (hh/8 * zoomLevel);
	zoomLevel *= 0.75;
	panAndZoom();
}

$scope.zoomIn=function() {
	zoomLevel /= 0.75;
	if (zoomLevel >= 1) {
		zoomLevel = 1;
		$("#zoomInButton").attr("disabled","disabled");
	}
	translationX -= (w/8 * zoomLevel);
	translationY -= (hh/8 * zoomLevel);
	panOffset[0] += (w/8 * zoomLevel);
	panOffset[1] += (hh/8 * zoomLevel);
	panAndZoom();
}

function panAndZoom() {
	linkGroup.attr     ("transform","translate(" + [translationX,translationY] + "),scale("+zoomLevel+")");
	nodeGroup.attr     ("transform","translate(" + [translationX,translationY] + "),scale("+zoomLevel+")");
	haloGroup.attr     ("transform","translate(" + [translationX,translationY] + "),scale("+zoomLevel+")");
	arrowheadGroup.attr("transform","translate(" + [translationX,translationY] + "),scale("+zoomLevel+")");
}

var defs = svg.append("defs");

function defineRadialGradient(name, innerColor, outerColor) {
	var radGrad = defs.append("radialGradient")
		.attr("id", name)
		.attr("fx", "50%")
		.attr("fy", "50%")
		.attr("r", "100%")
		.attr("spreadMethod", "pad");
	radGrad.append("stop")
		.attr("offset","0%")
		.attr("stop-color",innerColor)
		.attr("stop-opacity","1");
	radGrad.append("stop")
		.attr("offset","100%")
		.attr("stop-color",outerColor)
		.attr("stop-opacity","1");
}

for (var cur in COLOR_TABLE) {
	var shades
if($scope.network_type !='Dividend Pathways'){
	console.log("s")
	shades = COLOR_TABLE["SAF"];
	}
	else shades = COLOR_TABLE["DIV"];console.log("Dividendpathway"+shades)

	for (var i=0; i<shades.length; i++) {
		defineRadialGradient("gradient"+cur+i, shades[i][0], shades[i][1]);
	}
}

function change_color(){
for (var cur in COLOR_TABLE) {
	var shades
if($scope.network_type !='Dividend Pathways'){
	console.log("s")
	shades = COLOR_TABLE["SAF"];
	}
	else shades = COLOR_TABLE["DIV"];console.log("Dividendpathway"+shades)

	for (var i=0; i<shades.length; i++) {
		defineRadialGradient("gradient"+cur+i, shades[i][0], shades[i][1]);
	}
}


if($scope.network_type !='Dividend Pathways'){$scope.$apply(function(){
$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1] }
})

console.log(COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1])
	console.log(JSON.stringify($scope.myStyle) + "haha")

}
else {$scope.$apply(function(){
	$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'DIV')][0][1] }})
	
	console.log(JSON.stringify($scope.myStyle) + "haha")
}

}

function defineFilter(name, red, green, blue) {
	var filter = defs.append("filter").attr("id",name).attr("x","-200%").attr("y","-200%").attr("width","800%").attr("height","800%");
	var fct = filter.append("feComponentTransfer").attr("in","SourceAlpha");
	fct.append("feFuncR").attr("type","discrete").attr("tableValues",red+" 1");
	fct.append("feFuncG").attr("type","discrete").attr("tableValues",green+" 1");
	fct.append("feFuncB").attr("type","discrete").attr("tableValues",blue+" 1");
	filter.append("feGaussianBlur").attr("stdDeviation","20");
	filter.append("feOffset").attr("dx","0").attr("dy","0").attr("result","shadow");
	filter.append("feComposite").attr("in","SourceGraphic").attr("in2","shadow").attr("operator","over");
}


for (cur in HIGH_SATURATION_COLORS) {
	var red = HEX_TO_PERCENT[HIGH_SATURATION_COLORS[cur].charAt(1)];
	var green = HEX_TO_PERCENT[HIGH_SATURATION_COLORS[cur].charAt(2)];
	var blue = HEX_TO_PERCENT[HIGH_SATURATION_COLORS[cur].charAt(3)];
	defineFilter("shine"+cur, red, green, blue);
}


var haloGroup = svg.append("g").attr("id","haloGroup");
var linkGroup = svg.append("g").attr("id","linkGroup");
var arrowheadGroup = svg.append("g").attr("id","arrowheadGroup");
var nodeGroup = svg.append("g").attr("id","nodeGroup");

function nodeRadius(accountNode) {
	var bal = currentCurrencyBalance(accountNode);
	if (currentCurrency != "XRP") {
		bal = bal * 1000000000;
	} 
	return 14+Math.pow(Math.log(Math.abs(bal)+1),3) / 2000;
	//TESTING FUN STUFF
	/*var tl = accountNode.trustLines.length;
	return 2+Math.pow(Math.log(1+tl),4)/25;*/
}

var force = d3.layout.force()
	.size([(window.innerWidth > 0) ? window.innerWidth : screen.width, 710]) //w
	.linkDistance(80)
	.linkStrength(function(d) {
		if (currentCurrency == "XRP" || currentCurrency == d.currency) {
			return d.strength * 0.25;
		} else {
			return 0;
		}
	}).friction(0.5)
	.charge(-1500).nodes([]).links([]).start();

	



function expandNode(address) {
	if (typeof(nodes[nodeMap[address]]) !== "undefined") {
		var nutl = numberOfUnseenTrustLines(nodes[nodeMap[address]]);
	} else {
		var nutl = 0;
	}
	
	changingFocus = true;
	window.location.hash = address;
	changeMode("individual");
	lastFocalNode = focalNode;
	focalNode = address;
	if ("undefined" == typeof nodeMap[address]) {
		refocus(address, false);
	} else {
		if (!nodes[nodeMap[address]].transactions || nodes[nodeMap[address]].transactions.length === 0) {
			getNextTransactionPage();
		}
		degreeMap = {};
		degreeMap[address] = 0;
		reassignColors(address);
		colorRogueNodes();
		if (expandedNodes[address]) {} else {
			if (nutl<MAX_NUTL || confirm('This node has '+nutl+' unseen trust lines. Expanding it may slow down your browser. Are you sure?')) {
				serverGetLines(address);
			} 
		}
		updateInformation(address);
	}
	
}


$scope.expandNode = function(address) {
	if (typeof(nodes[nodeMap[address]]) !== "undefined") {
		var nutl = numberOfUnseenTrustLines(nodes[nodeMap[address]]);
	} else {
		var nutl = 0;
	}
	
	changingFocus = true;
	window.location.hash = address;
	changeMode("individual");
	lastFocalNode = focalNode;
	focalNode = address;
	if ("undefined" == typeof nodeMap[address]) {
		refocus(address, false);
	} else {
		if (!nodes[nodeMap[address]].transactions || nodes[nodeMap[address]].transactions.length === 0) {
			getNextTransactionPage();
		}
		degreeMap = {};
		degreeMap[address] = 0;
		reassignColors(address);
		colorRogueNodes();
		if (expandedNodes[address]) {} else {
			if (nutl<MAX_NUTL || confirm('This node has '+nutl+' unseen trust lines. Expanding it may slow down your browser. Are you sure?')) {
				serverGetLines(address);
			} 
		}
		updateInformation(address);
	}
	
}


function borderColor(cur, colorDegree) {
	if (colorDegree == 0) {
		return "#fc0"; //It actually doesn't use the border color for the focal node.
	} else {
		return COLOR_TABLE[cur][colorDegree-1][1]; //Use the rim color of the next darkest degree.
	}
}


function findCur(d) {
	var cur = currentCurrency;
	if(cur != "XRP") {
		if(!d.balances[cur]){cur="__Z";}
		else if(d.balances[cur]<0){cur="__N";}
		else if(!COLOR_TABLE.hasOwnProperty(cur)) {cur = "___";}
	}
	return cur;
}

function lightenNodeFunction(colorDegree) {
	return function(d) {
		var cur = findCur(d);
		d3.select(d3.event.target).style("fill", "url(#gradient"+cur+(colorDegree+1)+")").style("stroke-width", 2).style("stroke", "#fc0" );
	}
}
function darkenNodeFunction(colorDegree) {
	return function(d) {
		var cur = findCur(d);
		d3.select(d3.event.target).style("fill", "url(#gradient"+cur+(colorDegree)+")").style("stroke-width", (colorDegree==0?5:0.5)).style("stroke", function(d){var cur = findCur(d); return borderColor(cur,colorDegree);} );
	}
}
function lightenAddress(address) {
	if (typeof degreeMap[address] != "undefined") {
		var colorDegree = Math.min(degreeMap[address], 3);
		var cur = findCur(force.nodes()[nodeMap[address]]);
		nodeGroup.select("#_"+address).style("fill", "url(#gradient"+cur+(colorDegree+1)+")").style("stroke-width", 2).style("stroke", "#fc0" );
	}
}

$scope.lightenAddress = function(address) {
	if (typeof degreeMap[address] != "undefined") {
		var colorDegree = Math.min(degreeMap[address], 3);
		var cur = findCur(force.nodes()[nodeMap[address]]);
		nodeGroup.select("#_"+address).style("fill", "url(#gradient"+cur+(colorDegree+1)+")").style("stroke-width", 2).style("stroke", "#fc0" );
	}
}


function darkenAddress(address) {
	if (typeof degreeMap[address] != "undefined") {
		var colorDegree = Math.min(degreeMap[address], 3);
		var cur = findCur(force.nodes()[nodeMap[address]]);
		nodeGroup.select("#_"+address).style("fill", "url(#gradient"+cur+(colorDegree)+")").style("stroke-width", (colorDegree==0?5:0.5)).style("stroke", function(d){var cur = findCur(d); return borderColor(cur,colorDegree);} );
	}
}


$scope.darkenAddress = function(address) {
	if (typeof degreeMap[address] != "undefined") {
		var colorDegree = Math.min(degreeMap[address], 3);
		var cur = findCur(force.nodes()[nodeMap[address]]);
		nodeGroup.select("#_"+address).style("fill", "url(#gradient"+cur+(colorDegree)+")").style("stroke-width", (colorDegree==0?5:0.5)).style("stroke", function(d){var cur = findCur(d); return borderColor(cur,colorDegree);} );
	}
}


function numberOfUnseenTrustLines(aNode) {
	var output = 0;
	var trustLines = aNode.trustLines;
	for (var i=0; i<trustLines.length; i++) {
		if ((trustLines[i].limit!=0 || trustLines[i].limit_peer!=0) && isLineInvisible(aNode.account.Account, trustLines[i].account)) {
			output++;
		}
	}
	return output;
}

function isLineInvisible(source, target) {
	for (var j=0; j<le_links.length; j++) {
		if ((le_links[j].source.account.Account==source && le_links[j].target.account.Account==target) ||
			(le_links[j].source.account.Account==target && le_links[j].target.account.Account==source)  ) {
			return false;
		}
	}
	return true;
}


function colorNodes(nodeSelection, colorDegree) {
	nodeSelection.style("fill", function(d) { 
			var cur = findCur(d);
			return ("url(#gradient"+cur+colorDegree+")");
		})
		.style("stroke", function(d){var cur = findCur(d); return borderColor(cur,colorDegree);} )
		.style("stroke-width", 0.5 )
		.on("mouseover", lightenNodeFunction(colorDegree))
		.on("mouseout", darkenNodeFunction(colorDegree));
	if (colorDegree == 0) {
		nodeSelection.style("stroke-width", 5);
	}
}

function reassignColors(address) {
	var colorDegree = Math.min(degreeMap[address], 3);
	colorNodes(svg.select("g#nodeGroup").select("circle#_"+address), colorDegree)
	
	function goon(counterparty) { // ...then reassign the colors of each counterparty too,
		//only if the new degree is lower than the previous one (or the degree is as yet unknown)
		if (typeof degreeMap[counterparty] == "undefined" || degreeMap[counterparty] > degreeMap[address]+1) {
			degreeMap[counterparty] = degreeMap[address]+1;
			reassignColors(counterparty);
		}
	}
	for (var i=0; i<le_links.length; i++) {
		var link = le_links[i];
		if (link.source.account.Account == address) { // If this address is party to the link...
			goon(link.target.account.Account);
		} else if (link.target.account.Account == address) {
			goon(link.source.account.Account);
		}
	}
}

function colorRogueNodes() {
	for (var address in nodeMap) {
		if (typeof degreeMap[address] == "undefined") {
			degreeMap[address] = Infinity;
			colorNodes(svg.select("g#nodeGroup").select("circle#_"+address), 3);
		}
	}	
}





function lineLength(lineElement) {
	return Math.sqrt(Math.pow(lineElement.attr("x1")-lineElement.attr("x2"),2) + Math.pow(lineElement.attr("y1")-lineElement.attr("y2"),2));
}

function shine(onOrOff, address, cur) {
	$("#_"+address).attr("filter",(onOrOff ? "url(#shine"+cur+")" : "none"));
}



var animatorLinks = [];



function animateLink(onOrOff, speed, from, to, cur, callback) {
	if (typeof nodeMap[from] == "undefined" || typeof nodeMap[to] == "undefined") {
		setTimeout(callback, 10.0/speed);
	} else {
		var animator = $("#" + from + "_" + to + "_" + cur);
		if (animator.length == 0) {
			animatorLinks.push({source:nodes[nodeMap[from]], target:nodes[nodeMap[to]], value:100, currency:currency, strength:0});
			var alink = svg.select("g#linkGroup").selectAll("line.animator").data(animatorLinks)
				.enter().append("svg:line")
				.attr("x1", function(d){ return d.source.x; })
				.attr("y1", function(d){ return d.source.y; })
				.attr("x2", function(d){ return d.target.x; })
				.attr("y2", function(d){ return d.target.y; })
				.attr("class", "animator")
				.attr("id", from + "_" + to + "_" + cur )
				.style("stroke",function(d){ return HIGH_SATURATION_COLORS[cur];} )
				.style("z-index","2")
				.style("stroke-dasharray","0,999999")
				.attr("stroke-width", 10);
			animator = $("#" + from + "_" + to + "_" + cur);
		}

		animator.css("display","inherit");
		var pct = 1;
		var interval = setInterval( function(){
			var len = lineLength(animator) * (1-pct);
			if (onOrOff == true) { //If we're turning it on
				animator.css("stroke-dasharray",len+", 999999");
			} else { //If we're turning it off
				animator.css("stroke-dasharray","0, "+len+", 999999");
			}
			pct -= speed;
			if (pct <= 0) {
				if (onOrOff == true) {
					animator.css("stroke-dasharray","");
				} else {
					animator.css("display","none");
				}
				clearInterval(interval);
				callback();
			}
		}, 10 );
	}
}


function animateTransaction(tx) {
	var cur;

	
	var initialCur;
	if (tx.SendMax && tx.SendMax.currency) {
		initialCur = tx.SendMax.currency;
		if(!HIGH_SATURATION_COLORS.hasOwnProperty(initialCur)) {initialCur = "___";}
	} else {
		initialCur = "XRP";
	}	
	shine(true, tx.Account, initialCur);
	
	if (tx.Amount.currency) {
		finalCur = tx.Amount.currency;
		if(!HIGH_SATURATION_COLORS.hasOwnProperty(finalCur)) {finalCur = "___";}
	} else {
		finalCur = "XRP";
	}	
	
	var finalCur;
	if (tx.Amount.currency) {
		finalCur = tx.Amount.currency;
		if(!HIGH_SATURATION_COLORS.hasOwnProperty(finalCur)) {finalCur = "___";}
	} else {
		finalCur = "XRP";
	}
	
	var pathList;
	if (tx.Paths) {
		pathList = [];
		for (var i=0; i<tx.Paths.length; i++) {
			var thisOldPath = tx.Paths[i];
			var thisPath = [];
			for (var j=0; j<thisOldPath.length; j++) {
				if (thisOldPath[j].account) {
					thisPath.push(thisOldPath[j]);
				}
			}
			pathList.push(thisPath);
		}
		for (var i=0; i<pathList.length; i++) {
			animatePath(true, i);
		}
	} else {
		pathList = [[]];
		animatePath(true, 0);
	}
	
	function animatePath(onOrOff, i) {
		if (i==pathList.length) {
			console.log("Done with every path!");
		} else {
			var path = pathList[i];
			var lastNode = tx.Account;
			var nextNode;
			var speed = 0.01 * (path.length + 1);
			function animatePathLink(j) {
				if (j==path.length) {
					animateLink(onOrOff, speed, lastNode, tx.Destination, finalCur, function(){shine(onOrOff, tx.Destination, finalCur); if(onOrOff) {shine(false, tx.Account); animatePath(false, i);} });
				} else {
					nextNode = path[j].account;
					if (path[j].currency) {
						cur = path[j].currency;
						if(!HIGH_SATURATION_COLORS.hasOwnProperty(cur)) {cur = "___";}
					} else {
						cur = "XRP";
					}
					
					animateLink(onOrOff, speed, lastNode, nextNode, cur, function(){shine(onOrOff, nextNode, cur); animatePathLink(j+1)});
					lastNode = nextNode;
				}
			}
			animatePathLink(0);
		}
	}
}





var lastNodeTouched = "";

function stopExpandResume(d) {
	force.stop();
	expandNode(d.account.Account);
	setTimeout(force.resume,500);
}

function addNodes(degree) {

	force.nodes(nodes).links(le_links);
	var timer;
	var colorDegree = Math.min(degree, 3);
	var node = svg.select("g#nodeGroup").selectAll("circle.node").data(nodes)
		.enter().append("svg:circle")
		.attr("class", "node")
		.attr("id", function(d) { return "_"+d.account.Account;})
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", nodeRadius )
		.attr("title", function(d) { return d.account.Account; })
		.style("cursor", "pointer")
		.on("touchstart", function() {  } )
		.on("touchmove", function(d) { lastNodeTouched=d.account.Account; } )
		.on("touchend", function(d) { if (lastNodeTouched != d.account.Account) {stopExpandResume(d); lastNodeTouched=d.account.Account;} else {lastNodeTouched="";} } )
		.on("click", stopExpandResume );
	colorNodes(node, colorDegree);
	node.append("svg:title").text( function(d) { return d.account.Account;} );
	node.call(force.drag);
	
	

	var link = svg.select("g#linkGroup").selectAll("line.static").data(force.links())
		.enter().append("svg:line")
		.attr("class","static")
		.style("stroke","#000")
		.style("opacity","0.2")
		.attr("stroke-width", linkOrNot);


	function arrowheadPath(radius, theta) {
		var rCosTheta = radius*Math.cos(theta);
		var rSinTheta = radius*Math.sin(theta);
		return "M 0 0 L "+
			rCosTheta+" "+rSinTheta+" L "+
			(rCosTheta+rSinTheta*Math.sqrt(3))+" 0 L "+
			rCosTheta+" "+(-rSinTheta)+" z";
	}
	var arrowhead = svg.select("g#arrowheadGroup").selectAll("path.arrowhead").data(force.links())
		.enter().append("svg:path")
		.attr("class", "arrowhead");


	arrowhead = setArrowheads(arrowhead);
	
	function euclidean(pointA, pointB) {
		return Math.sqrt(Math.pow(pointA.x-pointB.x,2)
			+Math.pow(pointA.y-pointB.y,2));
	}
	
	function projection(distance, origin, towards) {
		var farDistance = euclidean(origin, towards);
		var scalar = distance/farDistance;
		var xOutput = origin.x + (towards.x-origin.x)*scalar;
		var yOutput = origin.y + (towards.y-origin.y)*scalar;
		return {x:xOutput, y:yOutput};
	}
	
	function angle(pointA, pointB) {
		return 180/Math.PI * Math.atan2(pointB.y-pointA.y, pointB.x-pointA.x);
	}
	
	function thetaValue(value) {
		return value/(1+value) * 1.04719755 // max = 60 degrees in radians
	}
	
	function setArrowheads(selection) {
		return selection
			.attr("transform", function(d) {
				var position = d.source;
				return "translate("+position.x+","+position.y+"), rotate("+angle(d.source,d.target)+",0,0)";
			})
			.attr("d", function(d) {return arrowheadPath(parseFloat($("#_"+d.source.account.Account).attr("r")), thetaValue(d.value)); } )
			.style("fill", function(d){ return (isLinkVisible(d) ? "#000" : "none"); } );

	}

	
	var halo = svg.select("g#haloGroup").selectAll("circle.halo").data(nodes)
		.enter().append("svg:circle")
		.attr("class", "halo")
		.attr("id", function(d) { return "halo_"+d.account.Account;})
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.attr("r", function(d){ return HALO_MARGIN+nodeRadius(d);} )
		.style("fill", "none" )
		.style("stroke", "none" )
		.style("stroke-width", 1 );
		
	force.start();
  


	

	force.on("tick", function(e) {
		var node = svg.selectAll("circle.node");
		var halo = svg.selectAll("circle.halo");
		var arrowhead = svg.selectAll("path.arrowhead");
		var link = svg.selectAll("line");
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		link.attr("x1", function(d) {return d.source.x;})
			.attr("y1", function(d) {return d.source.y;})
			.attr("x2", function(d) {return d.target.x;})
			.attr("y2", function(d) {return d.target.y;});
		halo.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		setArrowheads(arrowhead);
	});
}

function name_to_address(focus, erase, noExpand){//search nodes by ripple-name
console.log($scope.address)

//basicincome
if(focus.length !== 34){
	vaultClient.getAuthInfo(focus, ripple_name);
}
else refocus(focus, erase, noExpand)

	function ripple_name(err, data){
		console.log(data)
		if(err)console.log(err)
		var authInfo = data
		refocus(authInfo.address, erase, noExpand)
	}
}

$scope.name_to_address = function(focus, erase, noExpand){//search nodes by ripple-name


//basicincome
if(focus.length !== 34){
	vaultClient.getAuthInfo(focus, ripple_name);
}
else refocus(focus, erase, noExpand)

	function ripple_name(err, data){
		console.log(data)
		if(err)console.log(err)
		var authInfo = data
		refocus(authInfo.address, erase, noExpand)
	}
}

function refocus(focus, erase, noExpand) {
	

	changingFocus = true;
	if (erase) {
		eraseGraph();
	}
	window.location.hash = focus;
	lastFocalNode = focalNode;
	focalNode = focus;
	nodeMap[focalNode] = nodes.length;
	nodes.push({x:0.5*w, y:hh/2, account:{Account:focalNode, Balance:0}, trustLines:[], balances:{} });
	degreeMap = {};
	degreeMap[focalNode] = 0;
	if (!noExpand) {
		serverGetLines(focalNode);
	}
	addNodes(0);
	reassignColors(focalNode);
	colorRogueNodes();
	//serverGetInfo(focalNode);
	updateInformation(focus);
  getNextTransactionPage();
}



$scope.commas = function(number){
	console.log("thisssss " +number)
	  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}


function commas(number) {
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function abbreviate(address) {
	return address.slice(0,25)+"...";
}

function magnitude(oom) {
  var mfo3 = Math.floor(oom/3);
  var text = {1:"K", 2:"M", 3:"B", 4:"T", 5:"Q"}[mfo3];
  var value;
  if (text) {
    value = Math.pow(1000, mfo3);
  } else {
    value = Math.pow(10, oom);
    text = "&times;10<sup>"+(""+oom).replace("-","&#8209;")+"</sup>";
  }
  return {value:value, text:text};
}

function roundNumber(number) {
  var man = Math.abs(number);
	if (number == 0 || (man < 100000.00 && man > 0.00001)) {
		return commas(Math.round(number*100)/100);
	} else {
		var oom = Math.floor((Math.log(man)+0.00000000000001) / Math.LN10);
    var mag = magnitude(oom);
    var rounded = Math.round(number/mag.value*100)/100;
		return commas(rounded) + mag.text;
	}
}

$scope.roundNumber = function(number) {
  var man = Math.abs(number);
	if (number == 0 || (man < 100000.00 && man > 0.00001)) {
		return commas(Math.round(number*100)/100);
	} else {
		var oom = Math.floor((Math.log(man)+0.00000000000001) / Math.LN10);
    var mag = magnitude(oom);
    var rounded = Math.round(number/mag.value*100)/100;
		return commas(rounded) + mag.text;
	}
}

function updateInformation(address) {
	$('#focus').val(address);
	
	function update_html(err, rippleName){
			$('#rippleName').text("~"+rippleName);
	}
	
	$('#focalAddress').text(address);
	
	$vaultClient.vaultClient.getRippleName(address, "https://id.ripple.com", update_html)



	var currencies = [];
	var balances = getBalances(address);
	$scope.balances = balances
	console.log("balances "+JSON.stringify(balances))
	for (var cur in balances) {
		currencies.push(cur);
	}
	currencies.sort(function(a,b){return (Math.abs(balances[b])-Math.abs(balances[a]))});
	
	var trustLines = nodes[nodeMap[address]].trustLines;
	if (!trustLines) {
		trustLines = [];
	}
	
update_basicincome_co_data()
function update_basicincome_co_data(){	
//BASICINCOME.CO

$MongoDB.get_consumption_outside_network(address, update_table)

function update_table(data){
	
if(data[0].total_amount>0){	
$scope.penalty = data[0].total_amount	
	
}
else $scope.penalty = 0
}


if($scope.network_type !='Dividend Pathways'){
$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1] }
console.log(COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'SAF')][0][1])
	console.log(JSON.stringify($scope.myStyle) + "haha")

}
else {
	$scope.myStyle = {'fill' : COLOR_TABLE[(COLOR_TABLE.hasOwnProperty(cur)?cur:'DIV')][0][1] }
	console.log(JSON.stringify($scope.myStyle) + "haha")
}



$MongoDB.get_tax_blob(address, a)
	
function a(data){
	if(data[0].total_amount>0){	

$scope.unpaid_tax = roundNumber(data[0].total_amount)	
	}
	else $scope.unpaid_tax = 0
}	
}
	
	for (var i=0; i<currencies.length; i++) {
		var cur = currencies[i];
		$scope.cur = cur
		var trustLinesForCur = [];
		for (var j=0; j<trustLines.length; j++) {
			var trustLine = trustLines[j];
			if (trustLine.currency == cur) {
				trustLinesForCur.push(trustLine);
			}
		}
		$scope.trustLinesForCur = trustLinesForCur
		trustLinesForCur.sort(function(a,b){return Math.abs(b.balance)-Math.abs(a.balance);});

	
	}
	//updateTransactions(address);
}














var txAltText = {
	"send"       :"Sent payment to...",
	"receive"    :"Received payment from...",
	"intermediate":"Intermediated payment of...",
	"sendfailed" :"Failed to send payment to...",
	"receivefailed":"Failed to receive payment from...",
	"intermediatefailed":"Failed to intermediate payment of...",
	"trustout"   :"Sent trust to...",
	"trustinfailed"    :"Failed to receive trust from...",
	"trustoutfailed"   :"Failed to send trust to...",
	"trustin"    :"Received trust from...",
	"offerout"   :"Made offer to give...",
	"offerin"    :"Accepted offer and got...",
	"offeroutfailed"   :"Failed to make offer to give...",
	"offerinfailed"    :"Failed to accept offer and get...",
	"canceloffer":"Canceled offer",
  "accountset":"Edited account properties"
};

function showTransactionWithHash(hash) {
	changingFocus = true;
	window.location.hash = hash;
	changeMode("transaction",transactionMap[hash]);
}
var transactionMap = {};
	/*
function updateTransactions(address, appending) {
	if (!appending) {
		$('#transactionTable').text("");
	}
	$("#transactionThrobber").remove();
	if (nodes[nodeMap[address]].transactions) {
		for (var i=$('#transactionTable tr').length; i<nodes[nodeMap[address]].transactions.length; i++) {
			var tx = nodes[nodeMap[address]].transactions[i].tx;
			var meta = nodes[nodeMap[address]].transactions[i].meta;
			var transactionType;
			var counterparty = "";
			var amount = null;
			var currency = null;
			var aissuer = null;
			var secondAmount = null;
			var secondCurrency = null;
			var secondAissuer = null;

			if (tx.TransactionType == "Payment") {
				amount = meta.DeliveredAmount || tx.Amount;
				if (tx.Account == address) {
					transactionType = "send";
					counterparty = tx.Destination;
				}
				else if (tx.Destination == address) {
					transactionType = "receive";
					counterparty = tx.Account;
				} else {
					transactionType = "intermediate";
				}
			} else if (tx.TransactionType == "TrustSet") {
				amount = tx.LimitAmount;
				if (tx.Account == address) {
					transactionType = "trustout";
					counterparty = tx.LimitAmount.issuer;
				}
				else if (tx.LimitAmount.issuer == address) {
					transactionType = "trustin";
					counterparty = tx.Account;
				} else {
					console.log("Could not interpret transaction TrustSet!");
					continue;
				}
			} else if (tx.TransactionType == "OfferCreate") {
				if (tx.Account == address) {
					transactionType = "offerout";
					amount = tx.TakerGets;
					secondAmount = tx.TakerPays;
				} else {
					//console.log("An offer was made, but not by you. We must now scour the meta-data to find out how exactly this transaction affected you.");
					var affectedBalances = {};
					for (var j=0; j<meta.AffectedNodes.length; j++) {
						var mn = meta.AffectedNodes[j].ModifiedNode || meta.AffectedNodes[j].DeletedNode || meta.AffectedNodes[j].CreatedNode;
						var LatestFields = mn.FinalFields || mn.NewFields;
						if (mn && LatestFields) {
							if (LatestFields.Account == address || (LatestFields.HighLimit && LatestFields.HighLimit.issuer == address) ) {
								var let = mn.LedgerEntryType;
								if (let == "AccountRoot") {
									var diff = LatestFields.Balance - (mn.PreviousFields ? mn.PreviousFields.Balance : 0);
									if (affectedBalances["XRP"]) {
										affectedBalances["XRP"]+=diff;
									} else {
										affectedBalances["XRP"]=diff;
									}
								} else if (let == "RippleState") {
									//console.log("Affected RippleState:", mn);
									//Not sure why this is reversed, but that's the way it is:
									var diff = 0-(LatestFields.Balance.value - (mn.PreviousFields ? mn.PreviousFields.Balance.value : 0));
									var cur = LatestFields.Balance.currency;
									var issuer = LatestFields.LowLimit.issuer;
									var cip = cur;//+":"+issuer; //Do we need this?
									//console.log("Got/gave", cip, ":", diff);
									if (affectedBalances[cip]) {
										affectedBalances[cip]+=diff;
									} else {
										affectedBalances[cip]=diff;
									}
								} else {
									//console.log("Affected my", let,  mn);
								}

							} else {
								//console.log("Did not affect me?", mn);
							}
						}
					}
					var affectedKeys = Object.keys(affectedBalances)
					if (affectedKeys.length == 2) {
						var fip = affectedBalances[affectedKeys[0]] > 0;
						var posKey = fip > 0 ? 0 : 1;
						var negKey = fip > 0 ? 1 : 0;
						var positive = affectedBalances[affectedKeys[posKey]];
						var negative = affectedBalances[affectedKeys[negKey]];
						if (positive * negative > 0) {
							console.log("Could not interpret as offerin.");
							continue;	
						} else {
							transactionType = "offerin";
							amount = affectedKeys[posKey]=="XRP" ? positive : {value: positive, currency: affectedKeys[posKey], issuer:issuer};
							secondAmount = affectedKeys[negKey]=="XRP" ? -negative : {value: -negative, currency: affectedKeys[negKey], issuer:issuer};
						}
					} else {
						console.log("Could not interpret as offerin.", affectedBalances);
						continue;
					}
				}
			} else if (tx.TransactionType == "OfferCancel") {
				transactionType = "canceloffer";
			} else if (tx.TransactionType == "AccountSet") {
        transactionType = "accountset";
      } else {console.log("Could not interpret transaction: "+tx.transactionType);}

			if (amount) {
				if (amount.currency) {
					currency = amount.currency;
					aissuer = amount.issuer;
					amount = amount.value;
				} else {
					currency = "XRP";
					amount = amount/1000000;
				}
			}
			
			if (secondAmount) {
				if (secondAmount.currency) {
					secondCurrency = secondAmount.currency;
					secondAissuer = secondAmount.issuer;
					secondAmount = secondAmount.value;
				} else {
					secondCurrency = "XRP";
					secondAmount = secondAmount/1000000;
				}
			}
			
			transactionMap[tx.hash] = tx;
			transactionMap[tx.hash].meta = meta;
			var success = meta.TransactionResult == "tesSUCCESS" ? "" : "failed";
			var result =  meta.TransactionResult == "tesSUCCESS" ? "" : "["+meta.TransactionResult+"] ";

			$('#transactionTable').append(
				'<tr hash="'+tx.hash+'">'+
					'<td style="width:10%;"><div '+(transactionType=='send'||transactionType=='receive'||transactionType=='intermediate'?'oncontextmenu="animateInPlaceWithHash(\''+tx.hash+'\');return false;" onclick="showTransactionWithHash(\''+tx.hash+'\');"':'style="cursor:default;"')+' class="'+transactionType+success+' icon" title="'+result+txAltText[transactionType+success]+'">&nbsp;</div></td>'+
					'<td style="width:90%"'+(counterparty==""?' colspan="1"':'')+'><span style="float:left"><span '+(aissuer&&!(transactionType=='trustin'||transactionType=='trustout')?'title="'+aissuer+'"':'')+'>'+(amount?('<span class="bold amount small" >'+commas(amount)+'</span> <span class="light small darkgray" style="margin-right:5px">'+currency+'</span></span>'+
					(secondAmount?' <i class="light small darkgray" style="margin-right:5px">for</i> <span '+(secondAissuer&&!(transactionType=='trustin'||transactionType=='trustout')?'title="'+secondAissuer+'"':'')+'><span class="bold amount small">'+commas(secondAmount)+'</span> <span class="light small darkgray" style="margin-right:5px">'+secondCurrency+'</span></span>':'')):'')+
					agoDate(tx.date)+'</span>'+
					(counterparty!=""?'<span style="display:block; margin-top:3px; overflow:hidden; text-overflow:ellipsis;" class="light address right"><span style="cursor:pointer;" '+
							'onmouseover="lightenAddress(\''+counterparty+'\');"'+
							'onmouseout="darkenAddress(\''+counterparty+'\');"'+
							'onclick="expandNode(\''+counterparty+'\');">'+//"HASH:"+tx.hash+
							counterparty+'</span></span></td>' : '')+
					//'<td class="marginalcell"/>'+
				'</tr>');

		}
		
		if (!nodes[nodeMap[address]].transactionsFinished) { //Are there more?
			$('#transactionTable').append('<tr id="transactionThrobber"><td colspan=3 style="text-align:center; padding:10px"><img src="throbber4.gif" width=30 height=30 /></td></tr>');
			$('#transactionThrobber').bind('inview', function (event, visible) {
				if (visible == true) {
					getNextTransactionPage();
				}
			});
		} else {
			console.log("Looks like we're finished?", nodes[nodeMap[address]]);
		}

	}
}
*/

function animateInPlaceWithHash(hash) {
	var tx = transactionMap[hash];
	//walk the paths to see if any nodes need to be added.
	walkPaths(tx);
	animateTransaction(tx);
}


function agoDate(secondsSince2000) {
	var currentTime = new Date().getTime() / 1000 - UNIX_RIPPLE_TIME;
	var secondsAgo = currentTime-parseInt(secondsSince2000);
	var number;
	var unit;
	if (secondsAgo < 1) {
		number = 0;
		unit = "moment";
	} else if (secondsAgo < 60) {
		number = Math.floor(secondsAgo);
		unit = "second";
	} else if (secondsAgo < 3600) {
		number = Math.floor(secondsAgo/60);
		unit = "minute";
	} else if (secondsAgo < 86400) {
		number = Math.floor(secondsAgo/3600);
		unit = "hour";
	} else if (secondsAgo < 604800) {
		number = Math.floor(secondsAgo/86400);
		unit = "day";
	} else if (secondsAgo < 2629746) {
		number = Math.floor(secondsAgo/604800);
		unit = "week";
	} else if (secondsAgo < 31556952) {
		number = Math.floor(secondsAgo/2629746);
		unit = "month";
	} else {
		number = Math.floor(secondsAgo/31556952);
		unit = "year";
	}
	if (number != 1) {
		unit += "s"
	}
	if (number == 0) {
		number = "";
	}
	
	var d = new Date(0);
	d.setUTCSeconds(secondsSince2000+UNIX_RIPPLE_TIME);
	return '<span style="margin-right:5px" class="light small mediumgray date" title="'+d.toUTCString()+'">'+number+" "+unit+' ago</span>';
}

function absoluteDateOnly(secondsSince2000) {
	var d = new Date(0);
	d.setUTCSeconds(secondsSince2000+UNIX_RIPPLE_TIME);
	return d.getUTCDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+d.getUTCFullYear()
}

function absoluteTimeOnly(secondsSince2000) {
	var d = new Date(0);
	d.setUTCSeconds(secondsSince2000+UNIX_RIPPLE_TIME);
	return d.getUTCHours()+':'+(d.getUTCMinutes()<10 ? '0'+d.getUTCMinutes() : d.getUTCMinutes())+':'+(d.getUTCSeconds()<10 ? '0'+d.getUTCSeconds() : d.getUTCSeconds());
}



function absoluteDate(secondsSince2000) {
	var d = new Date(0);
	d.setUTCSeconds(secondsSince2000+UNIX_RIPPLE_TIME);
	return '<span class="light small mediumgray date" title="'+absoluteTimeOnly(secondsSince2000)+'">'+absoluteDateOnly(secondsSince2000)+'</span>';
}
function absoluteTime(secondsSince2000) {
	var d = new Date(0);
	d.setUTCSeconds(secondsSince2000+UNIX_RIPPLE_TIME);
	return '<span class="light small mediumgray date" title="'+absoluteDateOnly(secondsSince2000)+'">'+absoluteTimeOnly(secondsSince2000)+'</span>';
}




function getBalances(address) {
	var balances = {};
	if (nodes[nodeMap[address]].trustLines) {
		for (var i=0; i<nodes[nodeMap[address]].trustLines.length; i++) {
			var trustLine = nodes[nodeMap[address]].trustLines[i];
			if (balances[trustLine.currency]) {
				balances[trustLine.currency] += parseFloat(trustLine.balance);
			} else {
				balances[trustLine.currency] = parseFloat(trustLine.balance);
			}
		}
	}
	return balances;
}


$scope.getBalances = function(address) {
	var balances = {};
	if (nodes[nodeMap[address]].trustLines) {
		for (var i=0; i<nodes[nodeMap[address]].trustLines.length; i++) {
			var trustLine = nodes[nodeMap[address]].trustLines[i];
			if (balances[trustLine.currency]) {
				balances[trustLine.currency] += parseFloat(trustLine.balance);
			} else {
				balances[trustLine.currency] = parseFloat(trustLine.balance);
			}
		}
	}
	return balances;
}


function linkOrNot(d) {
	if(currentCurrency=="XRP" || currentCurrency==d.currency) {
		var o = 5*Math.pow(Math.log(1+d.value),0.3333);;
		return o;
	} 
	else{return 0;}
}

function isLinkVisible(d) {
	return currentCurrency=="XRP" || currentCurrency==d.currency
}

function changeCurrency(newCurrency) {
	var isOther = (newCurrency == '___');
	if (isOther && $('#otherCurrency').css('font-style')!='italic') {
		newCurrency = $('#otherCurrency').attr('value');
	}
	if (newCurrency == "___") {
		$("#otherCurrency").css("display","block");
	} else {
		if (isOther) {
			$("#otherCurrency").css("display","block");
		} else {
			$("#otherCurrency").css("display","none");
		}
		currentCurrency = newCurrency;
		degreeMap = {};
		degreeMap[focalNode] = 0;
		reassignColors(focalNode);
		colorRogueNodes();
		updated = svg.select("g#nodeGroup").selectAll("circle.node");
		updated.attr("r", nodeRadius );
		svg.select("g#haloGroup").selectAll("circle.halo").attr("r", function(d){return HALO_MARGIN+nodeRadius(d);} );
		svg.select("g#linkGroup").selectAll("line.static").attr("stroke-width", linkOrNot);
		force.start();
	}
}



$scope.toggleExpansion = function (row) {
	console.log("hejhejeh")
	var cur = row.getAttribute("sublistid");
	var numberOfSubrows = parseInt(row.getAttribute("numberofsubrows"));
	var expander = document.getElementById(cur+"Expander");
	if (expander.innerHTML == "+") {
		$('#'+cur+'Inner').animate({height:(11+(numberOfSubrows+1)*25.5)+'px'});
				$('#'+cur).show()
		expander.innerHTML = "&ndash;";
	} else {
		$('#'+cur+'Inner').animate({height:'0px'}, {complete: function(){$('#'+cur).hide();} });
		expander.innerHTML = "+";
	}
}

/*
function focusOtherCurrency(that) {
	if ($(that).css('font-style')=='italic') {
		$(that).css('font-style','inherit').css('color','inherit').attr('value','');
	}
}

function blurOtherCurrency(that) {
	if ($(that).attr('value')=='' || $(that).css('font-style')=='italic') { 
		$(that).css('font-style','italic').css('color','#999').attr('value','other');
	} else {
		var upper=$(that).attr('value').toUpperCase();
		$(that).attr('value',upper);
		changeCurrency('___');
	}
}
*/

window.onhashchange = function(){
	if (!changingFocus) {
		if (window.location.hash == "" || window.location.hash == "#") {
			refocus(REFERENCE_NODE, true);
		} else if (window.location.hash.charAt(1) == "r") {
			if (nodeMap[window.location.hash.substring(1)]) {
				expandNode(window.location.hash.substring(1));
			}
		} else if ("0123456789ABCDEF".indexOf(window.location.hash.charAt(1)) != -1) {
			showTransactionWithHash(window.location.hash.substring(1));
		}
    
	} else {
	}
	changingFocus = false;
};


	$(function () {$('.scroll-pane').jScrollPane({autoReinitialise: true, hideFocus: true});});
	$(function () {$("#currency").selectbox();});
	$("#focus").keyup(function(event){
		if(event.keyCode == 13){
			$("#searchButton").click();
		}
	});
	$("#otherCurrency").keyup(function(event){
		if(event.keyCode == 13){
			$(this).blur();
		}
	});
	updateInformation(focalNode);
	
  }]);