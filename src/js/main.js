/*!
 * Demo collection timeline
 * Author: Barney Staddon 2015
 * Uses iscroll - https://github.com/cubiq/iscroll
 */

var MOLTime = MOLTime || {}; 

MOLTime.props = {

	scroll : null, 
	startYear : 1900,
	endYear : 2000,
	duration : null,
	yearWidth : 100,
	footerHeight : 48,
	objectMarkerWidth : 80,

	//apiURL : "http://coltest.museumoflondon.org.uk/timeline/api/objects/search/",
	apiURL : "http://localhost/skeleton/api/objects/search/",
	imageURL : "http://fe02.museumoflondon.org.uk/imagestore",

	itemIds : [

		'69.142',
		'34.170/975',
		'90.192a',
		'59.74/7',
		'88.18',
		'2003.98',
		'NN11664',
		'PLA646',
		'81.208/5',
		'45.15',
		'2000.255',
		'IN24510',
		'2007.1/172',
		'2003.2/282',
		'84.16/16',
		'93.104/11',
		'2003.5/61',
		'2008.43/40',
		'2000.36',
		'2007.1/153',
		'2000.230/3'
	],

	iscrollOptions : {  
						scrollX    : true,
						scrollY    : false,
						mouseWheel : true, 
						tap        : true, 
						bounce     : false, 
						probeType  : 3
					 },

	objectsData : [],
	markerOpen : false,
	transitionSpeed : 400,
	currentObject : null,
	markerOffset : 0,
	scrollEndHandlerArgs : null,
	movedWrapper : false,
	objectMap : null,



	objectPanel : null
}

MOLTime.buildTimelineDOM = function (objectsData, scrubber) {

	MOLTime.props.duration = MOLTime.props.endYear - MOLTime.props.startYear

	//build year list
	for(var i = 0,il = MOLTime.props.duration; i < il; i++ ){

		var yearHTML = '',
			listEl = document.createElement('li'),
			dateEl = document.createElement('div'),
			containerEl = document.createElement('div'),
			listId = 'year-' + Number(MOLTime.props.startYear + i),
			dateClass = i%2==0 ? 'dateline-even' : 'dateline-odd',
			yearObject = MOLTime.checkForYearObject(MOLTime.props.startYear + i, objectsData);

		$(listEl).attr('id', listId);
		$(containerEl).addClass('year-container');
		$(dateEl).addClass('dateline');
		$(dateEl).addClass(dateClass);
		$(dateEl).html(MOLTime.props.startYear + i);
		
		if(yearObject) {

			var objectEls = MOLTime.buildObjectMarker(MOLTime.props.startYear + i, yearObject);
			$(containerEl).append(objectEls[0]); //stick
			$(containerEl).append(objectEls[1]); //marker
		}

		$(containerEl).append(dateEl);
		$(listEl).append(containerEl);
		$('#tl-years').append(listEl);
	}

	$('#scroller').css('width', (MOLTime.props.yearWidth * MOLTime.props.duration) + 'px');
	$('#scroller li').css('width', MOLTime.props.yearWidth + 'px');

	document.addEventListener('touchmove', function (e) { 
	
			if(MOLTime.props.markerOpen = false) e.preventDefault(); //so we can still scroll vertically on an object page
		 
		 }, false);

	MOLTime.props.scroll = new IScroll('#wrapper', MOLTime.props.iscrollOptions);
	MOLTime.props.scroll.on('scroll', function(e) {
			scrubber.moveScrubber();
		});	
};


MOLTime.buildObjectMarker = function (year, yearObject) {

	var objectHeight = Math.floor((MOLTime.props.yearWidth/100) * MOLTime.props.objectMarkerWidth),
		vertPosDeterminant = Math.round(Math.random()),
		midLine = Math.floor( window.innerHeight/2 - 15),
		objectTop;

	//somewhere above the line or somewhere below the line - tweak as necessary	
	if(vertPosDeterminant) objectTop = 25 + Math.floor( Math.random() * ( midLine - ( objectHeight * 2.5 ) ) );
	else objectTop = Math.floor((window.innerHeight/2) +  Math.floor( Math.random() * ( midLine - ( objectHeight * 2 ) ) ) );

	var lineTop = vertPosDeterminant ? objectTop : midLine,
		lineHeight = vertPosDeterminant ? midLine  - objectTop : objectTop - midLine,
		stickEl = document.createElement('div'),
		markerEl = document.createElement('div');
		
	$(stickEl).addClass('stick');
	$(stickEl).attr('id','stick-' + year);
	$(stickEl).attr('data-height', lineHeight);
	$(stickEl).css('top', lineTop + 'px');
	$(stickEl).css('height', lineHeight + 'px');

	$(markerEl).addClass('object-marker');
	$(markerEl).attr('id','object-marker-' + year);
	$(markerEl).attr('data-height', objectTop);
	$(markerEl).css('top', objectTop + 'px');
	$(markerEl).css('height', objectHeight + 'px');
	$(markerEl).css('background-image', 'url(' + MOLTime.props.imageURL + yearObject.originalMediaLocation[0] + ')');		
	
	$(markerEl).on("tap", MOLTime.markerHandler); //'tap' is an iScroll event 

	return [stickEl, markerEl];
};


MOLTime.markerHandler = function (ev) {

	if(!MOLTime.props.markerOpen){

		//var date = ev.originalEvent.srcElement.id.substr(ev.originalEvent.srcElement.id.length - 2),
		//	top = ev.originalEvent.srcElement.style.top.substr(0, ev.originalEvent.srcElement.style.top.length - 2);
		var date = ev.target.id.substr(ev.target.id.length - 2),
			top = ev.target.style.top.substr(0, ev.target.style.top.length - 2);
		 	totalWidth = MOLTime.props.duration * MOLTime.props.yearWidth,
		 	currentOffset = MOLTime.props.scroll.x,
		 	targetXPos = date * MOLTime.props.yearWidth,
		 	centreX = Math.floor(window.innerWidth/2) - ( MOLTime.props.yearWidth/2 ),
		 	targetOffset = 0 - (targetXPos - centreX),
		 	offsetDist = targetOffset - currentOffset;

		 // +++++++++++++ TO DO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		 //for IE8/9 fallback see http://stackoverflow.com/questions/20693190/i-need-css3-transition-to-work-in-ie9
		 // +++++++++++++ END TO DO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		
		//grow marker
		$('#object-marker-19' + date).addClass('object-marker-grow');

		//check to make sure we don't move the timeline too far, past its ends
		if( (currentOffset + offsetDist) <= 0 && (currentOffset + offsetDist) >= 0 - (totalWidth - window.innerWidth) ){ 

			//move the marker into the middle
			MOLTime.props.markerOffset = offsetDist; 
			MOLTime.props.scroll.scrollBy(offsetDist, 0, MOLTime.props.transitionSpeed);
			$('#year-19' + date + ' .dateline' ).css('color', '#FFCC00');


			MOLTime.props.scrollEndHandlerArgs = { 'date' : date, 'top' : top };
			MOLTime.props.scroll.on('scrollEnd', MOLTime.scrollEndHandler);	
		}
		else{ //if moving the timeline isn't feasible, we move the whole wrapper 

			MOLTime.props.movedWrapper = true;

			$('#wrapper').one(MOLTime.utils.whichTransitionEvent(), function(ev) {
			    MOLTime.animateObjectMarker(date, top);
			});

			$('#year-19' + date + ' .dateline' ).css('color', '#FFCC00'); //year text
			$('#wrapper').css({"-webkit-transform":"translateX(" + offsetDist + "px)"});
			$('#wrapper').css({"-ms-transform":"translateX(" + offsetDist + "px)"});
			$('#wrapper').css({"transform":"translateX(" + offsetDist + "px)"});

		}

	}
};

MOLTime.scrollEndHandler = function () {

	MOLTime.props.scroll.off('scrollEnd', MOLTime.scrollEndHandler);
	MOLTime.animateObjectMarker( MOLTime.props.scrollEndHandlerArgs.date,
							 	 MOLTime.props.scrollEndHandlerArgs.top   );

};

MOLTime.animateObjectMarker = function (date, top) {

	MOLTime.disableTimeline(true);

	//get actual marker width;
	var markerHeight = Math.floor((MOLTime.props.yearWidth/100) * MOLTime.props.objectMarkerWidth),
		markerScaledHeight = Math.floor(markerHeight * 1.5),
		markerPadding = 30, 
		vertDist,
		markerTargetTop;

	//when stick finished...
	$('#stick-19' + date).one(MOLTime.utils.whichTransitionEvent(), function(ev) {
		MOLTime.initObjectPanel(date);
	});

	if(top < (window.innerHeight/2)){

		//marker in top
		markerTargetTop = 0 + markerPadding;
		vertDist = 0 - (top - markerTargetTop);

		$('#stick-19' + date).addClass('stick-grow');

		//may need to tweak this
		$('#stick-19' + date).css('height', ((window.innerHeight/2) - (markerTargetTop + 30)) + 'px');
		$('#stick-19' + date).css({"-webkit-transform":"translateY(" + vertDist + "px)"});
		$('#stick-19' + date).css({"-ms-transform":"translateY(" + vertDist + "px)"});
		$('#stick-19' + date).css({"transform":"translateY(" + vertDist + "px)"});
	} 
	else {//marker in bottom

		$('#stick-19' + date).addClass('stick-grow');
		$('#stick-19' + date).css('height', Math.floor((window.innerHeight/2) - (markerHeight + MOLTime.props.footerHeight)) + 'px');

		markerTargetTop = window.innerHeight - (markerHeight + markerPadding + MOLTime.props.footerHeight); //footer
		vertDist = markerTargetTop - top;
	}

	$('#object-marker-19' + date).css({"-webkit-transform":"translateY(" + vertDist + "px) scale(1.5)"});
	$('#object-marker-19' + date).css({"-ms-transform":"translateY(" + vertDist + "px scale(1.5)"});
	$('#object-marker-19' + date).css({"transform":"translateY(" + vertDist + "px) scale(1.5)"});
		
};


MOLTime.initObjectPanel = function (date) {


	MOLTime.props.objectPanel = new ObjectView(  MOLTime.props,
												 MOLTime.utils,
												 $('#object-data-container')  );
	MOLTime.props.objectPanel.init(date);
};


MOLTime.checkObjectImageFit = function ( ) {

	var imageContainerWidth = $('.image-container').width();    	
    $('#object-image').css('width', imageContainerWidth + 'px');
};


MOLTime.initializeMap = function () {
  	MOLTime.props.objectMap = new google.maps.Map(document.getElementById('map-canvas'), {
    	zoom: 10,
    	center: {lat: 51.507300, lng: 0.12755}
  	});
};


MOLTime.scrollEndReverseHandler = function ( ) {

	MOLTime.props.scroll.off('scrollEnd', MOLTime.scrollEndReverseHandler);
	MOLTime.reverseMarkerAnimation(MOLTime.props.scrollEndHandlerArgs.date); 
};


MOLTime.reversePositionAnimation = function (date) {
	
	var markerOffset = MOLTime.props.markerOffset < 0 ? MOLTime.props.markerOffset * -1 : 0 - MOLTime.props.markerOffset;

	//move back either the 'wrapper'
	if(MOLTime.props.movedWrapper){

		//when wrapper finished...
		$('#wrapper').one(MOLTime.utils.whichTransitionEvent(), function(ev) {
			MOLTime.reverseMarkerAnimation(date); 
			MOLTime.props.movedWrapper = false;
		});

		$('#wrapper').css({"-webkit-transform":"translateX(0px)"});
		$('#wrapper').css({"-ms-transform":"translateX(0px)"});
		$('#wrapper').css({"transform":"translateX(0px)"});

	}
	else{ //...or the marker, depending on what was moved in the first place

		MOLTime.props.scroll.on('scrollEnd', MOLTime.scrollEndReverseHandler);
		MOLTime.props.scroll.scrollBy(markerOffset, 0, MOLTime.props.transitionSpeed);

	}
};


MOLTime.reverseMarkerAnimation = function (date) {

	$('#year-19' + date + ' .dateline' ).css('color', '#FFF');

	$('#stick-19' + date).one(MOLTime.utils.whichTransitionEvent(), function(ev) {
		
		MOLTime.props.markerOffset = 0;
		MOLTime.enableTimeline(true);
	});	

	$('#stick-19' + date).css('height', $('#stick-19' + date)[0].dataset.height + 'px');
	$('#stick-19' + date).css({"-webkit-transform":"translateY(0px)"});
	$('#stick-19' + date).css({"-webkit-transform":"translateY(0px)"});
	$('#stick-19' + date).css({"-ms-transform":"translateY(0px)"});
	$('#stick-19' + date).css({"transform":"translateY(0px)"});

	//marker 
	$('#object-marker-19' + date).css({"-webkit-transform":"translateY(0px) scale(1)"});
	$('#object-marker-19' + date).css({"-ms-transform":"translateY(0px) scale(1)"});
	$('#object-marker-19' + date).css({"transform":"translateY(0px) scale(1)"});
};


MOLTime.disableTimeline = function (setMarkerFlag){

	if(setMarkerFlag) MOLTime.props.markerOpen = true;
	MOLTime.props.scroll.disable(); 
};


MOLTime.enableTimeline = function (undoMarkerFlag){

	if(undoMarkerFlag) MOLTime.props.markerOpen = false;
	MOLTime.props.scroll.enable(); 
};



MOLTime.fetchObjectsData = function (items) {

	for(var i = 0, il = items.length; i < il;i++ ){

		(function(i) {

			//swap slashes for hyphens
			var formattedId = MOLTime.props.itemIds[i].replace("/", "-"); 
			
			//get data for each spec'd item
			$.get(MOLTime.props.apiURL + formattedId, function(data, status){
	        	
	        	var parsedData = JSON.parse(data);
	        	
	        	MOLTime.props.objectsData.push(parsedData.response.docs[0]);        	
	        	
	        	if(MOLTime.props.objectsData.length == items.length){
	        		
	        		MOLTime.buildTimelineDOM(MOLTime.props.objectsData, new Scrubber(MOLTime.props));
	      		} 
	    	});

	    })(i);
	} 

};

MOLTime.checkForYearObject = function (year, objectsData) {

	for(var i = 0, il = objectsData.length; i < il;i++ ){

		if(objectsData[i].dateMadeLatest[0] == year){
			return objectsData[i]; 
		}
	}
	return false;
};

MOLTime.addResizingHandler = function () {

	$(window).resize( function() {
  		
  			if(MOLTime.props.objectsData.length > 0){ //data loaded

  				if(MOLTime.props.scroll != null){ //iscroll initialised
  					$('#tl-years').empty();
  					MOLTime.props.scroll.destroy();
	        		MOLTime.buildTimelineDOM(MOLTime.props.objectsData, new Scrubber(MOLTime.props));
  				}

  				if(MOLTime.props.markerOpen){
  					MOLTime.checkObjectImageFit();	
  				}
  			}

	});

};


MOLTime.init = function () {

	MOLTime.addResizingHandler();
	MOLTime.fetchObjectsData(MOLTime.props.itemIds); 
};
