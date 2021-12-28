// Dijkstra algorithm - uses Graph Class from graph_generator.js, Queue from queue.js & generate UI with UI_functions.js


async function Dijkstra(queue, graph, container, i = 0){ // Dijkstra implementation

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

        graph.focus(fpElement, container, "dijkstra"); // UI indicator of the path examined
        return([i, total_path]); // Return the number of steps before completion + path length

    }

    var proxylist = cElem["element"].near // Extracting all the neighbors from the top element
    for(let j = 0; j < proxylist.length; j++){
        // prevent back and forth between 2 points or infinite cycles
        if(!queue.travel_history.includes(cElem["element"].name + "to" + proxylist[j][0].name)
        && !queue.travel_history.includes(proxylist[j][0].name + "to" + cElem["element"].name)){
            
            queue.travel_history.push(cElem["element"].name + "to" + proxylist[j][0].name);
            var score = proxylist[j][1]; // Compute the distance for each neighbors
            var fullpath = cElem["from"].concat([cElem]);

            var fpElement = [];
            for(let x = 0; x < fullpath.length; x++){ // Create a list with the correct format to send to focus function
                fpElement.push(fullpath[x]["element"]);
            }
            graph.focus(fpElement, container, "dijkstra"); // UI indicator of the path examined

            await new Promise(res => setTimeout(res, 200)); // Create a delay to create a good animation.

            queue.add(proxylist[j][0], fullpath, cElem["value"] + score); // Add the neighbors to the queue

        }
    }
    queue.delete(cElem); // Delete the element on the top
    return(await Dijkstra(queue, graph, container, i+1)); // Recursive call of the function

}