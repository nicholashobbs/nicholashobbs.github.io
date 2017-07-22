    var section = document.querySelector('section');
    var requestURL = 'https://nicholashobbs.github.io/newdata.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      var superHeroes = request.response;
      showHeroes(superHeroes);
    }
    function showHeroes(jsonObj) {
      var heroes = jsonObj['members'];
      for(var i = 0; i < heroes.length; i++) {
        var myArticle = document.createElement('article');
        var myH1 = document.createElement('h1');
        var myH2 = document.createElement('h2');
        var myPara1 = document.createElement('p');
        var myPara2 = document.createElement('p');
        var myPara3 = document.createElement('p');
        var myList = document.createElement('ul');
        myH1.textContent = jsonObj['squadName'];
        myH2.textContent = heroes[i].name;
        myPara1.textContent = 'Secret identity: ' + heroes[i].secretIdentity;
        myPara2.textContent = 'Age: ' + heroes[i].age;
        myPara3.textContent = 'Superpowers:';
          
        var superPowers = heroes[i].powers;
        for(var j = 0; j < superPowers.length; j++) {
          var listItem = document.createElement('li');
          listItem.textContent = superPowers[j];
          myList.appendChild(listItem);
        }
        myArticle.appendChild(myH1);
        myArticle.appendChild(myH2);
        myArticle.appendChild(myPara1);
        myArticle.appendChild(myPara2);
        myArticle.appendChild(myPara3);
        myArticle.appendChild(myList);
        section.appendChild(myArticle);
      }
    }
