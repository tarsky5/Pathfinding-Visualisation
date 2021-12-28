// Queue class for pathfinding algorithms

function Queue(start){
    
    this.content = [{element: start, from: [], value: 0}]; // Initialize the content with start
    this.travel_history = [] // Create a string for all edges explored, to prevent loops (closed list)

    this.add = function (element, source, value){ // function to add an element to the queue
        this.content.push({element: element, from: source, value: value});
        this.order();
        return(this.content);
    }
 
    this.delete = function (object){ // function to delete an element from the queue
        new_content = [];
        for(let i = 0; i < this.content.length; i++){
            if(this.content[i] !== object){
                new_content.push(this.content[i]);
            }
        }
        this.content = new_content;
        this.order();
    }

    this.order = function() { // Function that uses a merge sort to sort the elements in the queue

        // Merge sort implementation
        const _mergeArrays = (a, b) => {
            const c = []
        
            while (a.length && b.length) {
                c.push(a[0]["value"] > b[0]["value"] ? b.shift() : a.shift());
            }

            while (a.length) {
                c.push(a.shift());
            }
            while (b.length) {
                c.push(b.shift());
            }
            return(c)
        }
        
        const mergeSort = (a) => {
            if (a.length < 2){
                return(a);
            }
            const middle = Math.floor(a.length / 2);
            const a_l = a.slice(0, middle);
            const a_r = a.slice(middle, a.length);
            const sorted_l = mergeSort(a_l);
            const sorted_r = mergeSort(a_r);
            return(_mergeArrays(sorted_l, sorted_r));
        }

        this.content = mergeSort(this.content);
    }
}