// A* algoritm implementation - uses Euclidian distance (ED) heuristic

// Method used to get the ED between vertice and End has flaws
// and is motivated by the impossibity to get vertices x and y
// coordonates. A futur implementation of homemade UI functions 
// will be created to change this method. 

// This algorithm uses Graph Class from graph_generator.js, Queue from queue.js & generate UI with UI_functions.js

function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return(results);
  }

function getED(graph, container){

    // Firstly, we attribute an ED to each node of the graph

    const startpoint = container.querySelectorAll('[fill="' + graph.color_start + '"]')[0]; // find the only element in the color of Startpoint = startpoint
    const first_id = parseInt(Array.prototype.slice.call(startpoint.attributes)[0]['nodeValue']); // find the id of the startpoint (first point generated)
    const last_id = first_id + 1; // ID of the Endpoint.

    var endpoint = container.querySelectorAll('[data-ac-wrapper-id="' + last_id.toString() + '"]')[0]; // find the End point
    endPosition = endpoint.getBoundingClientRect()

    // Then, we can deduce the id attributed to each other points, and their ED
    for(let i = 0; i < graph.nodes.length; i++){
        point_id = last_id + i + 1;
        var point = container.querySelectorAll('[data-ac-wrapper-id="' + point_id.toString() + '"]')[0]; // find the point element

        graph.nodes[i].euclidian = (Math.sqrt(Math.pow(point.getBoundingClientRect().x - endPosition.x, 2) 
                                           + (Math.pow(point.getBoundingClientRect().y - endPosition.y, 2))));
    }
}

async function Astar(queue, graph, container, i = 0){ // Astar implementation

    getED(graph, container);

    var cElem = queue.content[0]; // We look at the element at the top of the queue

    if(cElem["element"] == graph.end){ // If we are connected to the END
        
        // Take the path already taken and add the last point
        var fullpath = cElem["from"].concat([cElem]);
        var fpElement = [];
        var total_path = 0;

        for(let x = 0; x < fullpath.length; x++){ // Create a list with the correct format to send to focus function
            fpElement.push(fullpath[x]["element"]);
        }
        for(let x = 0; x < fullpath.length - 1; x++){ // Calculate the length of the path founded
            var distance = fullpath[x]["element"].getDistance(fullpath[x+1]["element"]);
            total_path += distance;
        }

        graph.focus(fpElement, container, "astar"); // UI indicator of the path examined
        return([i, total_path]); // Return the number of steps before completion + path length

    }

    var proxylist = cElem["element"].near // Extracting all the neighbors from the top element
    for(let j = 0; j < proxylist.length; j++){
        // prevent back and forth between 2 points or infinite cycles
        if(!queue.travel_history.includes(cElem["element"].name + "to" + proxylist[j][0].name)
        && !queue.travel_history.includes(proxylist[j][0].name + "to" + cElem["element"].name)){
            
            queue.travel_history.push(cElem["element"].name + "to" + proxylist[j][0].name);

            var score = proxylist[j][1] + proxylist[j][0].euclidian; // Compute the distance for each neighbors + ED from the End
            var fullpath = cElem["from"].concat([cElem]);

            var fpElement = [];
            for(let x = 0; x < fullpath.length; x++){ // Create a list with the correct format to send to focus function
                fpElement.push(fullpath[x]["element"]);
            }
            graph.focus(fpElement, container, "astar"); // UI indicator of the path examined

            await new Promise(res => setTimeout(res, 200)); // Create a delay to create a good animation.

            queue.add(proxylist[j][0], fullpath, cElem["value"] + score); // Add the neighbors to the queue

        }
    }
    queue.delete(cElem); // Delete the element on the top
    return(await Astar(queue, graph, container, i+1)); // Recursive call of the function

}