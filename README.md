# intervaltree.js
=====================
 [Interval tree](http://en.wikipedia.org/wiki/Interval_tree) data structure in implemented 100% in JavaScript.

Interval tree is an ordered tree data structure optimized for finding overlapping intervals when given (1) a specific timestamp or (2) a time-interval. This is a modification of RBT tree, and is often used for windowing queries. For example, it can be used to find all applications ran within a given time window as shown below

![](https://raw.githubusercontent.com/drminix/intervaltree.js/master/example1.jpg)

# Install
Download and copy intervaltree.js script file to your script folder.

# Example
Here is an example of some basic usage:

```javascript
//create a javascript
var intervaltree = new RedBlackTree();

//add an element to interval tree
intervaltree.add(new IntervalNode(currentnode.StartTime, currentnode.EndTime, i));

//prepare tree for look up
if(aplog_raw.length!=0) intervaltree.prepare();
	
	//search data
 var selected_log = intervaltree.search(global_selected_time);
```

# API

### `new RedBlackTree()`
create an interval tree

### `new IntervalNode(starttime, endtime, value)`
create an interval node containing [starttime, endtime] and a value

### `add(intervalnode)`
push a node into the interval tree

### `search(key)`
retrieve all overlapping intervals as an array

### `search_interval([starttime,endtimp])`
retrieve all overlapping intervals as an array. 

### `prepare()`
optimize interval tree for the efficient lookup




(c) Sanghyeb(Sam) Lee MIT License




