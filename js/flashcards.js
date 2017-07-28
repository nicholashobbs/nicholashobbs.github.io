function FlashcardApp(){
  // index of the current card set
  var deck = Object.keys( data )[ 0 ];
  // the data for setting upt the card contents
  var _data = {};
  // controls if back or front is shown first
  var reversed = false;
  // index of the current card
  var cardIndex = 0;
  // the app elements
  var card          = new Card();
  var sideBar       = new SideBar();
  var controlBar    = new ControlBar();
  var restartButton = new RestartButton();
  // getter functions
  this.getDeck      = function(){ return deck; }
  this.getData      = function(){ return _data; }
  this.isReversed   = function(){ return reversed; }
  this.getCardIndex = function(){ return cardIndex; }
  // setter functions
  this.setDeck = function( newDeck ){ deck = newDeck; }
  // initialize the app
  this.init = function(){
    _data = shuffle( data[ deck ].concat( [] ) );
    this.render();
  }
  // put elements to page
  this.render = function(){
    // the sidebar
    sideBar.render();
    // the buttons
    controlBar.render();
    // the card
    card.render();
  }
  // shuffle a pair array
  var shuffle = function( array ){
    var currentIndex = array.length, temporaryTextValue, temporaryTranslationValue, randomIndex;
    // While there remain elements to shuffle...
    while ( 0 !== currentIndex ){
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      if( randomIndex % 2 != 0 ){ randomIndex -= 1; }
      currentIndex -= 2;
      // And swap it with the current element.
      temporaryTextValue        = array[ currentIndex ];
      temporaryTranslationValue = array[ currentIndex + 1 ];
      array[ currentIndex ]     = array[ randomIndex ];
      array[ currentIndex + 1 ] = array[ randomIndex + 1 ];
      array[ randomIndex ]      = temporaryTextValue;
      array[ randomIndex + 1 ]  = temporaryTranslationValue;
    }
    return array;
  };
  // reverse order of card faces
  this.reverse = function(){
    reversed = !reversed;
    card.render();
  }
  // set content of html elem
  this.setElemHTML = function( klass, content ){
    document.getElementsByClassName( klass )[ 0 ].innerHTML = content;
  }
  // show other side of card
  this.flipCard = function( event ){
    card.flip();
  }
  // bind the f key to a card flip
  this.flipOnEnter = function( event ){
    if ( event.which == 102 ){
      this.flipCard();
    }
  }
  // remove card from current deck
  this.remove = function(){
    _data.splice( cardIndex, 2 );
    // no cards left in deck
    if( _data.length == 0 ){ this.finish(); return; }
    this.validateCardIndex();
    card.render();
  }
  // go to next card
  this.skip = function(){
    cardIndex += 2;
    this.validateCardIndex();
    card.render();
  }
  // go back to first card if end of deck is reached
  this.validateCardIndex = function(){
    if( cardIndex > _data.length - 1 ){ cardIndex = 0; }
  }
  // replace card and controls with restart button
  this.finish = function(){
    restartButton.render();
  }
  // load a new deck of cards
  this.changeDeck = function( newDeck ){
    this.setDeck( Object.keys( data )[ newDeck ] );
    this.init();
  }
}
// flashcard
function Card(){
  // put element to page
  this.render = function(){
    app.setElemHTML( "card-container", this.html() );
    document.activeElement.blur();
    document.getElementById( "card" ).className = "focused";
  };
  // html of the eleent
  this.html = function(){
    return "<div id='card' onClick='app.flipCard();'>" +
            this.face( "front", this.text( false ) ) +
            this.face( "back", this.text( true ) ) +
          "</div>"
  };
  // either front or back of the card
  this.face = function( name, text ){
    return "<figure class='" + name + "'>" +
            "<span class='front-text'>" + text + "</span>" +
             this.counter() +
           "</figure>"
  }
  // text of back or front
  this.text = function( isDataValue ){
    return app.getData()[ app.isReversed() ^ isDataValue ?  app.getCardIndex() + 1 :  app.getCardIndex() ];
  }
  // info about position in deck
  this.counter = function(){
    return "<span class='counter'>" + (  app.getCardIndex() / 2  + 1 ) + "/" + app.getData().length / 2 + "</span>";
  }
  // turn card over
  this.flip = function(){
    if ( document.getElementById( "card" ).className == "focused" ){
      this.showFace( "flipped" );
    }else{
      this.showFace( "focused" );
    }
    document.getElementsByClassName( "skip" )[ 0 ].focus();
  }
  // show either front or back of card
  this.showFace = function( className ){
    var card = document.getElementById( "card" );
    card.className = className;
  }
}
// the main controls
function ControlBar(){
  // put element to page
  this.render = function(){
    app.setElemHTML( "controls", this.html() );
  }
  // html of the eleent
  this.html = function(){
    return this.skipButton() + this.removeButton()
  }
  // html of the remove button - onclick removes card from deck
  this.removeButton = function(){
    return "<input class='remove' type='button' onClick='app.remove();' name='reset' value='Remove' title='Remove' tabindex='2'/>";
  }
  // html of the skip button - onclick loads next card from deck
  this.skipButton = function(){
    return "<input class='skip' type='button' onClick='app.skip();' value='Skip' title='Skip' tabindex='1'/>";
  }
}
// additional controls
function SideBar(){
  // put element to page
  this.render = function(){
    app.setElemHTML( "sidebar", this.html() );
  }
  // html of the eleent
  this.html = function(){
    return this.deckPicker() + this.reverseCheckbox();
  }
  // list of available card decks
  this.deckPicker = function(){
    var content = "<ul class='deck-picker' >";
    for( var i = 0; i < Object.keys( data ).length; i++ ){
      content += "<li onClick='app.changeDeck(" + i + ");' " + "class='" + this.className( i ) + "'>" +
                   Object.keys( data )[ i ] +
                 "</li>";
    }
    content += "</ul>";
    return content;
  }
  // class deck picker item
  this.className = function( i ){
    return app.getDeck() == Object.keys( data ) [ i ] ? "selected" : "";
  }
  // control for changing which card side is show first
  this.reverseCheckbox = function(){
    return "<label>Reverse" +
           "<input class='reverse' " +
           "type='checkbox' " +
           "onChange='app.reverse();' " +
           "title='Reverse'" +
           ( app.isReversed() ? " checked" : "" ) +
           "></label>";
  }
}
// button for refilling a deck
function RestartButton(){
  // put element to page
  this.render = function(){
    app.setElemHTML( "card-container", this.html() );
    app.setElemHTML( "controls", "" );
    document.getElementsByClassName( "init" )[ 0 ].focus();
  }
  // html of the element
  this.html = function(){
    return "<input class='restart' type='button' onClick='app.init();' value='Restart' />";
  }
}
