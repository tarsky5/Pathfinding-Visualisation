// We use AnyChart to create the UI for the graphs


// Clear function

function clear(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}


// Extending Graph and Node classes with pure UI functions - graph_generator file

Graph.prototype.background_color = "#29262a";
Graph.prototype.color_links = "#F1F224";
Graph.prototype.color_normal = Graph.prototype.background_color;
Graph.prototype.color_focus = "#FF0000";
Graph.prototype.color_start = "#00FF00"; // Pick a unique color in the page ! (otherwise A* won't work)
Graph.prototype.color_end = "#FF0000";
Graph.prototype.normalDotHeight = 15;
Graph.prototype.specialDotHeight = 30;
Graph.prototype.weightConst = 1;


Graph.prototype.JSONify = function() { // Function that export graph data in a readable JSON for AnyChart
    var data = {nodes : [], edges: []};

    var alreadySaved = []; // List that saves connections - prevent linking 2x same vertices

    data['nodes'].push({id: this.start.name, 
                        normal: {height: this.specialDotHeight, fill: this.color_start},
                        hovered: {height: this.specialDotHeight, fill: this.color_start},
                        selected: {height: this.specialDotHeight, fill: this.color_focus}});

    for(let j = 0; j < this.start.near.length; j++){
        alreadySaved.push(this.start.name + "to" + this.start.near[j][0].name);
        data['edges'].push({from: this.start.name, to: this.start.near[j][0].name,
                            id: this.start.getDistance(this.start.near[j][0], true),
                            normal: {stroke: {color: this.color_links, thickness: this.weightConst}},
                            hovered: {stroke: {color: this.color_links, thickness: this.weightConst + 1, dash: "10 5", lineJoin: "round"}}});
    }

    data['nodes'].push({id: this.end.name,
                        normal: {height: this.specialDotHeight, fill: this.color_end},
                        hovered: {height: this.specialDotHeight, fill: this.color_end},
                        selected: {height: this.specialDotHeight, fill: this.color_focus}});

    for(let j = 0; j < this.end.near.length; j++){
        alreadySaved.push(this.end.name + "to" + this.end.near[j][0].name);
        data['edges'].push({from: this.end.name, to: this.end.near[j][0].name,
                            id: this.end.getDistance(this.end.near[j][0], true),
                            normal: {stroke: {color: this.color_links, thickness: this.weightConst}},
                            hovered: {stroke: {color: this.color_links, thickness: this.weightConst + 1, dash: "10 5", lineJoin: "round"}}});
    }
    
    for(let i = 0; i < this.nodes.length; i++){
        cNode = this.nodes[i];
        
        data['nodes'].push({id: cNode.name,
                            normal: {height: this.normalDotHeight, fill: this.color_normal},
                            hovered: {height: this.normalDotHeight, fill: this.color_normal},
                            selected: {height: this.normalDotHeight, fill: this.color_focus}});

        for(let j = 0; j < cNode.near.length; j++){
            if(!alreadySaved.includes(cNode.name + "to" + cNode.near[j][0].name)
            && !alreadySaved.includes(cNode.near[j][0].name + "to" + cNode.name)){

                alreadySaved.push(cNode.name + "to" + cNode.near[j][0].name);
                data['edges'].push({from: cNode.name, to: cNode.near[j][0].name,
                                    id: cNode.getDistance(cNode.near[j][0], true),
                                    normal: {stroke: {color: this.color_links, thickness: this.weightConst}},
                                hovered: {stroke: {color: this.color_links, thickness: this.weightConst + 1, dash: "10 5", lineJoin: "round"}}});
            }
        }
    }
    return(data);
}

Graph.prototype.plot = function (data, container, algo) { // Function to plot the graph with correct parameters
    var that = this;
    clear(container);
    this.containers.push(container);
    var chart = anychart.graph();
    chart.data(data);
    chart.background().fill(this.background_color);
    if(algo == "dijkstra"){
        chart.title("Dijkstra Algorithm");
    } else {
        chart.title("A* Algorithm");
    }

    chart.title().fontColor(this.color_links);
    chart.title().fontSize(20);
    chart.title().fontFamily('ReemKufi');

    chart.nodes().labels().enabled(true);

    chart.nodes().labels().format(function() { // Only Start and End have a label for visibility
        if (this.id == that.start.name || this.id == that.end.name) {
          return(this.id);
        }});

    chart.edges().tooltip().format("{%id}");
    chart.nodes().labels().fontSize(14);
    chart.nodes().labels().fontWeight(600);
    chart.nodes().labels().fontColor(this.color_links)
    chart.nodes().labels().fontFamily('ReemKufi')
    chart.nodes().normal().stroke(this.color_links);

    chart.interactivity().hoverGap(20);
    
    chart.container(container.id);
    chart.draw();
    return(chart);
}

// Function that find the distance between 2 points - litteral attribute = true when assigning labels to edges

Node.prototype.getDistance = function(node, litteral = false) {
    var distance = 0;
    for(let i = 0; i < this.near.length; i++){
        if(this.near[i][0] == node){
            distance = this.near[i][1];}}

    if(litteral){
        return("Distance " + this.name + " -> " + node.name + " = " + distance);
    } else {
        return(distance);
    }
}

// Function that change the color of edges to indicate that it's currently computed by the algorithm

Graph.prototype.focus = function(node_list, container, algo) {
    clear(container);
    var data = this.JSONify();
    for(let j = 0; j < node_list.length - 1; j++){ // Takes the points 2 by 2 to color their mutual edge
        node = node_list[j];
        other_node = node_list[j+1];
        for(let i = 0; i < data['edges'].length; i++){
            cElem = data['edges'][i];
            if((cElem['from'] == node.name && cElem['to'] == other_node.name) 
            || (cElem['from'] == other_node.name && cElem['to'] == node.name)){
                cElem["normal"]["stroke"]["color"] = this.color_focus; // Change color
                cElem["normal"]["stroke"]['thickness'] = this.weightConst + 1; // Increase thickness
            }
        }
    }

    this.plot(data, container, algo); // Plot the new data
}

