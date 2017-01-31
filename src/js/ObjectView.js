/* ObjectView class */

function ObjectView (props, utils, objectDataContainer) {

	var props = props;
	var utils = utils;
	var objectDataContainer = objectDataContainer;

	this.init = function (date) {

		props.currentObject = MOLTime.checkForYearObject('19' + date, props.objectsData);

		var objectImg = new Image(); //preload
			objectImgEl = document.createElement('img'), 
			imageURL = props.imageURL + props.currentObject.originalMediaLocation[0];

		objectImg.onload = function(){
	  		buildObjectPanel(this, date);
		}

		$(objectImg).attr('id','object-image');
		objectImg.src = imageURL;

	};

	var buildObjectPanel = function (objectImg, date) {

		//clear everything
		objectDataContainer.empty();

		var containerEl = null,
	    	rowEl = null,
	    	imageItems = [ objectImg ],
	    	fieldItems = [ '<span>Item:</span> ' + utils.capitalizeFirstLetter(props.currentObject.primaryTitle || MOLTime.props.currentObject.name[0] || MOLTime.props.currentObject.summaryTitle),
							'<span>ID:</span> ' + props.currentObject.idNumber,
							'<span>Date:</span> ' + props.currentObject.dateMadeLatest[0],
							'<span>Maker: </span>' + (props.currentObject.makerString || 'Unknown'),
							'<span>Measurement:</span> ' + props.currentObject.primaryMeasurement,
							'<span>Material:</span> ' + utils.capitalizeFirstLetter(props.currentObject.primaryMaterial) ],
			summaryItems = [ props.currentObject.description || 
							"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." ];
		//image section
		containerEl = document.createElement('div');
	    $(containerEl).addClass('container');
	    $(containerEl).addClass('image-container');
	    $(containerEl).append( objectImg ); 
	    objectDataContainer.append(containerEl);

	    //data section
	    containerEl = document.createElement('div');
	    rowEl = document.createElement('div');
	    $(containerEl).addClass('container');
	    $(rowEl).addClass('row'); 
	    $(rowEl).append(createRowList( summaryItems ) ); 							
		$(rowEl).append(createRowList( fieldItems ) ); 
	    $(containerEl).append(rowEl);
	    objectDataContainer.append(containerEl);

	    //reveal
		$('#object-overlay').css('display', 'block');

		MOLTime.checkObjectImageFit();
	   
		setTimeout(function(){
			$('#object-overlay').css('opacity', 1);
			//MOLTime.initializeMap();
		},0);
		
		$('#close-button').one('click', function(){

			$('#object-overlay').one(utils.whichTransitionEvent(), function(ev) {
				$('#object-overlay').css('display', 'none');
				MOLTime.reversePositionAnimation(date);
			});

			$('#object-overlay').css('opacity', 0);
		});

	};


	var createRowList = function (items) {

	    var colEl = document.createElement('div');
	    $(colEl).addClass('one-half');
	    $(colEl).addClass('column');

	     //left column content
	    var listContainerEl = document.createElement('ul'),
			listItems = items,
			il = listItems.length;

		$(listContainerEl).addClass('list-group');

		for(var i = 0; i < il; i++){

			var listEl = document.createElement('li');
			$(listEl).addClass('list-group-item');
			$(listEl).html(listItems[i]);
			$(listContainerEl).append(listEl);

		} 

		 $(colEl).append(listContainerEl);

		return colEl;	

	}; 

};