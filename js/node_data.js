// MATH NETWORK
    // create an array with nodes
    var mathnodes = new vis.DataSet([
        //Tier 1
        {id: 1, label: ' ', shape: 'text'},
        {id: 2, label: 'Concepts', shape: 'text', font: '24px Computer Modern Serif black', margin: { top: 8, right: 8, bottom: 8, left: 8 }},
        {id: 3, label: 'Tools', shape: 'text', font: '24px Computer Modern Serif black', margin: { top: 8, right: 8, bottom: 8, left: 8 }},

          //Tier 2

          //Concepts (2)
          {id: 4, label: 'Data Structures', shape: 'text', margin: { top: 8, right: 8, bottom: 8, left: 8 }},
          {id: 5, label: 'Algorithms', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 6, label: 'CS Fundamentals', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 7, label: 'Database Design', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

          //Tools (3)
          {id: 8, label: 'Linux', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 9, label: 'Networking', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 10, label: 'Security', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 11, label: 'Python', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 12, label: 'R', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 13, label: 'SQL', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
          {id: 14, label: 'NoSQL', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Tier 3 - Concepts

            //Data Structures (4)
            {id: 15, label: 'Primitive Types', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 16, label: 'Arrays', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 17, label: 'Strings', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 18, label: 'Lists', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 19, label: 'Stacks', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 20, label: 'Queues', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 21, label: 'Binary Trees', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 22, label: 'Heaps', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 23, label: 'Searching', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 24, label: 'Hash Tables', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 25, label: 'Sorting', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 26, label: 'Binary Search Trees', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 27, label: 'Recursion', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 28, label: 'Dynamic Programming', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 29, label: 'Greedy Algorithms and Invariants', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 30, label: 'Graphs', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Algorithms (5)
            {id: 31, label: 'Time and Space Complexity', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 32, label: 'Operations on Data Structures', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 33, label: 'Array Sorting Algorithms', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Tier 3 - Tools

            //Linux (8)
            {id: 34, label: 'Commandline', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 35, label: 'Filesystem', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 36, label: 'Searching', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 37, label: 'Hard Drive Utilities', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 38, label: 'Partitioning', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 39, label: 'Terminal Tools', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Networking (9)
            {id: 40, label: 'Concepts', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 41, label: 'Tools', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Security (10)
            {id: 42, label: 'Concepts', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 43, label: 'Tools', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 44, label: 'Web App Hacking', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //Python (11)
            {id: 45, label: 'Tools and Basics', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 46, label: 'Pandas', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 47, label: 'Numpy', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 48, label: 'Scipy', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 49, label: 'Matplotlib', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 50, label: 'Seaborn', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 51, label: 'SQLAlchemy', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 52, label: 'BeautifulSoup', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 53, label: 'Sklearn', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 54, label: 'Tensorflow', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

            //R (12)
            {id: 55, label: 'Tools and Basics', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
            {id: 56, label: 'Tidyverse', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }}
    ]);

    // create an array with edges
    var mathedges = new vis.DataSet([
        {from: 1, to: 2},
        {from: 1, to: 3},

        {from: 2, to: 4},
        {from: 2, to: 5},
        {from: 2, to: 6},
        {from: 2, to: 7},

        {from: 3, to: 8},
        {from: 3, to: 9},
        {from: 3, to: 10},
        {from: 3, to: 11},
        {from: 3, to: 12},
        {from: 3, to: 13},
        {from: 3, to: 14},

        {from: 4, to: 15},
        {from: 4, to: 16},
        {from: 4, to: 17},
        {from: 4, to: 18},
        {from: 4, to: 19},
        {from: 4, to: 20},
        {from: 4, to: 21},
        {from: 4, to: 22},
        {from: 4, to: 23},
        {from: 4, to: 24},
        {from: 4, to: 25},
        {from: 4, to: 26},
        {from: 4, to: 27},
        {from: 4, to: 28},
        {from: 4, to: 29},
        {from: 4, to: 30},

        {from: 5, to: 31},
        {from: 5, to: 32},
        {from: 5, to: 33},

        {from: 8, to: 34},
        {from: 8, to: 35},
        {from: 8, to: 36},
        {from: 8, to: 37},
        {from: 8, to: 38},
        {from: 8, to: 39},

        {from: 9, to: 40},
        {from: 9, to: 41},

        {from: 10, to: 42},
        {from: 10, to: 43},
        {from: 10, to: 44},

        {from: 11, to: 45},
        {from: 11, to: 46},
        {from: 11, to: 47},
        {from: 11, to: 48},
        {from: 11, to: 49},
        {from: 11, to: 50},
        {from: 11, to: 51},
        {from: 11, to: 52},
        {from: 11, to: 53},
        {from: 11, to: 54},

        {from: 12, to: 55},
        {from: 12, to: 56}
    ]);


    // create a network

    var mathcontainer = document.getElementById('MathTab');
    var mathdata = {
        nodes: mathnodes,
        edges: mathedges
    };

    var mathoptions = {
      interaction:{hover:false},
        "edges": {
          "smooth": false
        },
        "physics": {
          "enabled": false
        },
        "interaction": {
          "dragNodes": false
        },
        "edges": {
          "color": '#878787'
        },
        "nodes": {
          "font": '18px Computer Modern Serif black'
        },
        "layout":{
          "randomSeed": 21}
      };

    var mathnetwork = new vis.Network(mathcontainer, mathdata, mathoptions);

    clicks = 0;
    mathnetwork.on("click", function (params) {
        clicks = clicks + 1;
        nodejson = JSON.stringify(params.nodes, null, 4);
        nodenumber = /\d+/.exec(nodejson);
        params.event = "[original event]";
        document.getElementById("number" + nodenumber).style.opacity = "1";
        document.getElementById("number" + nodenumber).style.zIndex = clicks;
        console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });
    mathnetwork.on("doubleClick", function (params) {
        params.event = "[original event]";
    });
    mathnetwork.on("oncontext", function (params) {
        params.event = "[original event]";
    });
    mathnetwork.on("dragStart", function (params) {
        params.event = "[original event]";
    });
    mathnetwork.on("dragging", function (params) {
        params.event = "[original event]";
    });
    mathnetwork.on("dragEnd", function (params) {
        params.event = "[original event]";
    });
    mathnetwork.on("zoom", function (params) {
    });
    mathnetwork.on("showPopup", function (params) {
    });
    mathnetwork.on("hidePopup", function () {
        console.log('hidePopup Event');
    });
    mathnetwork.on("select", function (params) {
        console.log('select Event:', params);
    });
    mathnetwork.on("selectNode", function (params) {
        console.log('selectNode Event:', params);
    });
    mathnetwork.on("selectEdge", function (params) {
        console.log('selectEdge Event:', params);
    });
    mathnetwork.on("deselectNode", function (params) {
        console.log('deselectNode Event:', params);
    });
    mathnetwork.on("deselectEdge", function (params) {
        console.log('deselectEdge Event:', params);
    });
    mathnetwork.on("hoverNode", function (params) {
        console.log('hoverNode Event:', params);
    });
    mathnetwork.on("hoverEdge", function (params) {
        console.log('hoverEdge Event:', params);
    });
    mathnetwork.on("blurNode", function (params) {
        console.log('blurNode Event:', params);
    });
    mathnetwork.on("blurEdge", function (params) {
        console.log('blurEdge Event:', params);
    });

// COMPUTER NETWORK
    // create an array with nodes
    var computernodes = new vis.DataSet([
      {id: 1, label: ' ', shape: 'text'},
      {id: 2, label: 'Math', shape: 'text', font: '24px Computer Modern Serif black', margin: { top: 8, right: 8, bottom: 8, left: 8 }},
      {id: 3, label: 'Computer', shape: 'text', font: '24px Computer Modern Serif black', margin: { top: 8, right: 8, bottom: 8, left: 8 }},
      {id: 4, label: 'Additional Topics', shape: 'text', font: '24px Computer Modern Serif black', margin: { top: 8, right: 8, bottom: 8, left: 8 }},

      {id: 5, label: 'Calculus', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 6, label: 'Linear Algebra', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 7, label: 'Differential Equations', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 8, label: 'Statistics', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 9, label: 'Statistical Inference', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 10, label: 'Probability', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

      {id: 11, label: 'Practice Problems', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 12, label: 'Algorithms', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 13, label: 'Hardware', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 14, label: 'Software Design', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 15, label: 'OS', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 16, label: 'Languages', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 17, label: 'AI', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

      {id: 18, label: 'Number Theory/Cryptography', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 19, label: 'Functional Programming', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 20, label: 'Information Theory', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},
      {id: 21, label: 'Complexity', shape: 'text', margin: { top: 5, right: 5, bottom: 5, left: 5 }},

      {id: 22, label: 'Python', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},
      {id: 23, label: 'C++', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},
      {id: 24, label: 'Javascript', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},
      {id: 25, label: 'Linux', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},

      {id: 26, label: 'Theory/Philosophy/History', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},
      {id: 27, label: 'Machine Learning', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }},
      {id: 28, label: 'Deep Learning', shape: 'text', font: '12px Computer Modern Serif black', margin: { top: 1, right: 1, bottom: 1, left: 1 }}

        ]);

        // create an array with edges
        var computeredges = new vis.DataSet([
            {from: 1, to: 2},
            {from: 1, to: 3},
            {from: 1, to: 4},

            {from: 2, to: 5},
            {from: 2, to: 6},
            {from: 2, to: 7},
            {from: 2, to: 8},
            {from: 2, to: 9},
            {from: 2, to: 10},

            {from: 3, to: 11},
            {from: 3, to: 12},
            {from: 3, to: 13},
            {from: 3, to: 14},
            {from: 3, to: 15},
            {from: 3, to: 16},
            {from: 3, to: 17},

            {from: 4, to: 18},
            {from: 4, to: 19},
            {from: 4, to: 20},
            {from: 4, to: 21},

            {from: 16, to: 22},
            {from: 16, to: 23},
            {from: 16, to: 24},
            {from: 16, to: 25},

            {from: 17, to: 26},
            {from: 17, to: 27},
            {from: 17, to: 28}
        ]);


        // create a network

        var computercontainer = document.getElementById('ComputerTab');
        var computerdata = {
            nodes: computernodes,
            edges: computeredges
        };

        var computeroptions = {
          interaction:{hover:false},
            "edges": {
      "smooth": false
            },
            "physics": {
      "enabled": false
            },
            "interaction": {
      "dragNodes": false
            },
            "edges": {
      "color": '#878787'
            },
            "nodes": {
      "font": '18px Computer Modern Serif black'
            },
            "layout":{
      "randomSeed": 21}
          };

        var computernetwork = new vis.Network(computercontainer, computerdata, computeroptions);

        clicks = 0;
        computernetwork.on("click", function (params) {
            clicks = clicks + 1;
            nodejson = JSON.stringify(params.nodes, null, 4);
            nodenumber = /\d+/.exec(nodejson);
            params.event = "[original event]";
            document.getElementById("number" + nodenumber).style.opacity = "1";
            document.getElementById("number" + nodenumber).style.zIndex = clicks;
            console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
        });
        computernetwork.on("doubleClick", function (params) {
            params.event = "[original event]";
        });
        computernetwork.on("oncontext", function (params) {
            params.event = "[original event]";
        });
        computernetwork.on("dragStart", function (params) {
            params.event = "[original event]";
        });
        computernetwork.on("dragging", function (params) {
            params.event = "[original event]";
        });
        computernetwork.on("dragEnd", function (params) {
            params.event = "[original event]";
        });
        computernetwork.on("zoom", function (params) {
        });
        computernetwork.on("showPopup", function (params) {
        });
        computernetwork.on("hidePopup", function () {
            console.log('hidePopup Event');
        });
        computernetwork.on("select", function (params) {
            console.log('select Event:', params);
        });
        computernetwork.on("selectNode", function (params) {
            console.log('selectNode Event:', params);
        });
        computernetwork.on("selectEdge", function (params) {
            console.log('selectEdge Event:', params);
        });
        computernetwork.on("deselectNode", function (params) {
            console.log('deselectNode Event:', params);
        });
        computernetwork.on("deselectEdge", function (params) {
            console.log('deselectEdge Event:', params);
        });
        computernetwork.on("hoverNode", function (params) {
            console.log('hoverNode Event:', params);
        });
        computernetwork.on("hoverEdge", function (params) {
            console.log('hoverEdge Event:', params);
        });
        computernetwork.on("blurNode", function (params) {
            console.log('blurNode Event:', params);
        });
        computernetwork.on("blurEdge", function (params) {
            console.log('blurEdge Event:', params);
        });
