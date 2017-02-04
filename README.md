## Synopsis

This is an interactive timeline populated with objects from a museum's collection.

## Motivation

This project explored the way in which objects from a museum's collection can be placed on an easy-to-use interative timeline. 

## Installation

Amend the apiURL path in src/main.js according to the location of the project's 'api' directory:

```
MOLTime.props = {
...
	//amend as required
	apiURL : "http://localhost/timeline/api/objects/search/",
...
}

```

Then rebuild the project by running:

```
npm run build

``` 






