var MOLTime = MOLTime || {}; 


MOLTime.utils = {

	capitalizeFirstLetter : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},


	// http://davidwalsh.name/css-animation-callback
	whichTransitionEvent : function ( ) {
	  	
	  	var t,
	      	el = document.createElement("fakeelement");
		  	transitions = {
	    		"transition"      : "transitionend",
	    		"OTransition"     : "oTransitionEnd",
	    		"MozTransition"   : "transitionend",
	    		"WebkitTransition": "webkitTransitionEnd"
	  		}

	  	for (t in transitions){
	    	if (el.style[t] !== undefined){
	      		return transitions[t];
	    	}
	  	}
	}
};