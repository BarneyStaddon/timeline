/* Scrubber class */

function Scrubber(props){


	var progress = $('.progress-bar');
	var scrubber = $('.scrubber');
	var props = props;
	var scrubStartPos = 0;
	var scrubStartEvent = '';

	this.init = function ( ) {

		//ensure progress and scrubber at zero if resizing
		setScrubberPosition('0%', '0px')
		scrubber.on('touchstart mousedown', scrubberStartHandler);
	}

	this.moveScrubber = function ( ) {

		var scrollX = Math.abs(props.scroll.x), 
			max =  Math.floor(props.duration * props.yearWidth) - window.innerWidth;  
			min = 0,
			scrubberWidth = scrollX / (max/100);  

		setScrubberPosition(scrubberWidth + '%', scrubberWidth + '%');
	};

	var setScrubberPosition = function (progressWidth, scrubberLeft) {

		progress.css('width', progressWidth);
		scrubber.css('left', scrubberLeft);
	};

	var scrubberStartHandler = function (e) {

		if(!props.markerOpen && scrubStartEvent == ''){ //double check

			scrubStartEvent = e.type;
			$('body').on('touchend mouseup', scrubberEndHandler);		
			$('body').on('touchmove mousemove', scrubMoveHandler);
		}

	};

	var scrubberEndHandler = function (e) {

		$('body').off('touchend mouseup', scrubberEndHandler);
		$('body').off('touchmove mousemove', scrubMoveHandler);
		//reset
		scrubStartPos = 0;
		scrubStartEvent = '';
	};

	var scrubMoveHandler = function (e) {

		var cursorXPos = (e.type == 'mousemove') ? e.pageX : (e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX);
			max = window.innerWidth,  
			min = 0,
			scrubberWidth = cursorXPos / (max/100),
			scrubberX = Math.floor(scrubStartPos + cursorXPos);

		if(scrubberWidth < 0) {

			setScrubberPosition('0%', '0px');
			positionTimelineFromScrubber(0);
		}
		else if(scrubberWidth > 100){

			setScrubberPosition('100%', window.innerWidth + 'px');
			positionTimelineFromScrubber(100);
		}
		else{

			setScrubberPosition(scrubberWidth + '%', scrubberX + 'px');
			positionTimelineFromScrubber(scrubberWidth);
		}

	};

	var positionTimelineFromScrubber = function (mouseXPC) {

		var totalTimelineXRange =  Math.floor(props.duration * props.yearWidth) - window.innerWidth,
			timelineXOffset = Math.floor((totalTimelineXRange/100)*mouseXPC);

		props.scroll.scrollTo(0-timelineXOffset,0);	
	};

	this.init();

};


