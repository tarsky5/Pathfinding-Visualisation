// Graph / Node generator class

function Node(name, type = "normal"){

    this.name = name;
    this.type = type;
    this.near = []; // List of all the connected node to this one. Structure : [[Node, link], [Node, link], ...]
    
    this.isLinked = function (node) { // Function that checks if a vertice is linked to this one
        var linked = false;
        var distance = 0;
        for(let i = 0; i < this.near.length; i++){
            if(this.near[i][0] == node){
                linked = true; }}

        return(linked);
    }

    this.getDistance = function (node, litteral = false) { // Function that find the distance between 2 points
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

    this.createLink = function (other_node, link) { // Function that creates a link between current and another node

        this.near.push([other_node, link]);
        other_node.near.push([this, link]);

    }
}

function Graph () {
    this.containers = [];
    this.start = new Node("Start", "start");
    this.end = new Node("End", "end");
    this.nodes = [];

    this.generation_factor = 4;
    this.minimal_child = 2; // Always between minimal_child and generation_factor childs generated
    this.link_factor = 1; // Links of strength between 1 and link_factor generated
    
    this.addNode = function (from, link){

        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        this.giveID = function (index){ // Recursive function to give an id to every points
            const remain = index % alphabet.length;
            const multi = (index - (index % alphabet.length)) / alphabet.length;
            var ID = "";
            if(multi == 0){
                ID = alphabet[remain];
            } else {
                ID = giveID(multi) + alphabet[remain];
            }
            return(ID);
        }

        var new_node = new Node(this.giveID(this.nodes.length)); // Create a new node
        new_node.createLink(from, link); // Link the node to its root

        this.nodes.push(new_node);
        return(new_node);
    }

    this.generate = function (node, max_points, max_depth, depth){

        if(depth <= max_depth && this.nodes.length < max_points){
            n_child = Math.floor(Math.random() * (this.generation_factor + 1 - this.minimal_child)) + this.minimal_child;

            for(let i = 0; i < n_child; i++){
                link = Math.floor(Math.random() * this.link_factor) + 1;
                this.generate(this.addNode(node, link), max_points, max_depth, depth + 1);
            }
        }
    }

    this.randomizeLinks = function (){ // Randomly add links within the graph
        var isEnd = false; 
        const chanceFactor = ((1/this.nodes.length)*1);
        for(let i = 0; i < this.nodes.length; i++){
            current_node = this.nodes[i];
            for(let j = 0; j < this.nodes.length; j++){
                if(current_node.isLinked(this.nodes[j]) == false && this.nodes[j] !== current_node){
                    if(Math.random() < chanceFactor){
                        current_node.createLink(this.nodes[j], Math.floor(Math.random() * this.link_factor) + 1);
                    }
                }
            }
    
            // Randomly link points to the end if they are not the start
    
            if(Math.random() < chanceFactor/2){
                var connected = false;
                for(let x = 0; x < current_node.near.length; x ++){
                    if(current_node.near[x][0] == this.start){
                        connected = true;
                    }
                }
                if(!connected){
                    validChoice = true;
                    current_node.createLink(this.end, Math.floor(Math.random() * this.link_factor) + 1); // Randomly add links within the graph
                    isEnd = true;
                }
            }
        }
        // Randomly link a point to the end if no points are already connected

        if(!isEnd){
            validChoice = false;
            // If not 1 node away from start
            while(!validChoice){
                random_index = Math.floor(Math.random() * this.nodes.length);
                var connected = false;
                for(let x = 0; x < this.nodes[random_index].near.length; x ++){
                    if(this.nodes[random_index].near[x][0] == this.start){
                        connected = true;
                    }
                }
                if(!connected){
                    validChoice = true;
                }
            }
            // Randomly add links to the end if no links previously
            this.nodes[random_index].createLink(this.end, Math.floor(Math.random() * this.link_factor) + 1);
        }
    }

}