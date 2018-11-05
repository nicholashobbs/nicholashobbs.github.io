
    // create an array with nodes
    var nodes = new vis.DataSet([
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
    var edges = new vis.DataSet([
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

    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
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

    var network = new vis.Network(container, data, options);

    clicks = 0;
    network.on("click", function (params) {
        clicks = clicks + 1;
        nodejson = JSON.stringify(params.nodes, null, 4);
        nodenumber = /\d+/.exec(nodejson);
        params.event = "[original event]";
        document.getElementById("number" + nodenumber).style.opacity = "1";
        document.getElementById("number" + nodenumber).style.zIndex = clicks;
        console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });
    network.on("doubleClick", function (params) {
        params.event = "[original event]";
    });
    network.on("oncontext", function (params) {
        params.event = "[original event]";
    });
    network.on("dragStart", function (params) {
        params.event = "[original event]";
    });
    network.on("dragging", function (params) {
        params.event = "[original event]";
    });
    network.on("dragEnd", function (params) {
        params.event = "[original event]";
    });
    network.on("zoom", function (params) {
    });
    network.on("showPopup", function (params) {
    });
    network.on("hidePopup", function () {
        console.log('hidePopup Event');
    });
    network.on("select", function (params) {
        console.log('select Event:', params);
    });
    network.on("selectNode", function (params) {
        console.log('selectNode Event:', params);
    });
    network.on("selectEdge", function (params) {
        console.log('selectEdge Event:', params);
    });
    network.on("deselectNode", function (params) {
        console.log('deselectNode Event:', params);
    });
    network.on("deselectEdge", function (params) {
        console.log('deselectEdge Event:', params);
    });
    network.on("hoverNode", function (params) {
        console.log('hoverNode Event:', params);
    });
    network.on("hoverEdge", function (params) {
        console.log('hoverEdge Event:', params);
    });
    network.on("blurNode", function (params) {
        console.log('blurNode Event:', params);
    });
    network.on("blurEdge", function (params) {
        console.log('blurEdge Event:', params);
    });
