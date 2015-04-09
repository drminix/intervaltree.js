/**!
 * @filename: interval_tree.js
 
 * @authors: Sanghyeb(Sam) Lee
 * @contact: drminix@gmail.com
 * @date: 
 * @description: a modified interval tree.
 */

//Inveral Tree 
function IntervalNode(l_low,l_high, l_aplog_index) {
	this.low=l_low;
	this.high=l_high;
	this.max = l_high;
	this.aplog_index = l_aplog_index;
};

IntervalNode.prototype.compare = function(othernode) {
	if(this.low==othernode.low) return 0; //equal
	else if(this.low<othernode.low) return -1; //smaller
	else return 1; //bigger
};

//Added for IntervalTree
//This works since we know that our tree will not be modified after construction
RedBlackTree.prototype.prepare = function() {
	//call max() function on the root to maxify
	this._root.max();
};
	
function recursionNodeStackNode() {
	this.start_node = null;
	this.tryRightIndex=false;
	this.parentIndex=0;
};
//initialization function
var recursionNodeStack=[];
var recursionNodeStackSize=128;
for(var i=0;i<recursionNodeStackSize;i++) {
		recursionNodeStack.push(new recursionNodeStackNode());
}
var recursionNodeStackTop=1;
	
//Added for search function
//find all intervals!!
RedBlackTree.prototype.search = function(target) {
	
	recursionNodeStackTop=1;
	var overlapped_list=[];
	var currentParent = 0;
	
	var x = this._root._left;
	var stuffToDo = (x != null);
	recursionNodeStack[0].start_node = this._root;
	
	while(stuffToDo) {
		//check if overlap  x.value.low <= target <= x.value.high
		if(target >= x._value.low && target <= x._value.high) {
			//push it into stacks
			overlapped_list.push( x._value.aplog_index );
			//push it into recursion NodeStack
			recursionNodeStack[currentParent].tryRightIndex=true;
		}
		
		//if left has higher max than target
		if(x._left != null && x._left._value.max >= target) {
			//resize recursionNodeStack if required
			if(recursionNodeStackTop == recursionNodeStackSize) {
				recursionNodeStackTop *= 2;
				for(var i= recursionNodeStackTop/2;i<recursionNodeStackTop;i++) {
					recursionNodeStack.push(new recursionNodeStackNode());
				}
			}	
			recursionNodeStack[recursionNodeStackTop].start_node = x;
			recursionNodeStack[recursionNodeStackTop].tryRightIndex = true
			recursionNodeStack[recursionNodeStackTop].parentIndex = currentParent;
			currentParent = recursionNodeStackTop++;
			x = x._left;
		}else { //otherwise
			x = x._right;
		}
		
		stuffToDo = ( x != null); 
		
		while( (!stuffToDo) && (recursionNodeStackTop >= 1)) {
			if(recursionNodeStack[--recursionNodeStackTop].tryRightIndex == true) {
				x = recursionNodeStack[recursionNodeStackTop].start_node._right;
				currentParent = recursionNodeStack[recursionNodeStackTop].parentIndex; 
				recursionNodeStack[currentParent].tryRightIndex = true;
				stuffToDo = ( x!= null); 
			}
		}
	}
	return overlapped_list;
}
//interval
RedBlackTree.prototype.search_interval = function(target) {
	
	recursionNodeStackTop=1;
	var overlapped_list=[];
	var currentParent = 0;
	
	var x = this._root._left;
	var stuffToDo = (x != null);
	recursionNodeStack[0].start_node = this._root;
	
	while(stuffToDo) {
		//check if overlap  x.value.low <= target <= x.value.high
		//three cases - (1) inside, (2) overlap left, (3) overlap right
		if((target[0] >= x._value.low && target[1] <= x._value.high) ||
		   (target[0] <= x._value.low && target[1] >= x._value.low)  ||
		   (target[0] >= x._value.low && target[0] <= x._value.high)) {
			//push it into stacks
			overlapped_list.push( x._value.aplog_index );
			//push it into recursion NodeStack
			recursionNodeStack[currentParent].tryRightIndex=true;
		}
		
		//if left has higher max than target
		if(x._left != null && x._left._value.max >= target[0]) {
			//resize recursionNodeStack if required
			if(recursionNodeStackTop == recursionNodeStackSize) {
				recursionNodeStackTop *= 2;
				for(var i= recursionNodeStackTop/2;i<recursionNodeStackTop;i++) {
					recursionNodeStack.push(new recursionNodeStackNode());
				}
			}	
			recursionNodeStack[recursionNodeStackTop].start_node = x;
			recursionNodeStack[recursionNodeStackTop].tryRightIndex = true
			recursionNodeStack[recursionNodeStackTop].parentIndex = currentParent;
			currentParent = recursionNodeStackTop++;
			x = x._left;
		}else { //otherwise
			x = x._right;
		}
		
		stuffToDo = ( x != null); 
		
		while( (!stuffToDo) && (recursionNodeStackTop >= 1)) {
			if(recursionNodeStack[--recursionNodeStackTop].tryRightIndex == true) {
				x = recursionNodeStack[recursionNodeStackTop].start_node._right;
				currentParent = recursionNodeStack[recursionNodeStackTop].parentIndex; 
				recursionNodeStack[currentParent].tryRightIndex = true;
				stuffToDo = ( x!= null); 
			}
		}
	}
	return overlapped_list;
}

//Added for IntervalTree for maxifying process
RedBlackNode.prototype.max = function() {
	//get maximum of (this._value.high, this._left.max, this_right.max)
	var range=[];
	//console.log("pushing main value "+this._value.max);
	range.push(this._value.max);
	
	if(this._left != null) {
		var value = this._left.max();
		//console.log("pushing left "+value);
		range.push(value);
	}
	if(this._right != null) {
		var value = this._right.max();
		//console.log("pushing right "+value);
		range.push(value);
	}
	
	if(range.length == 1) {
		this._value.max = range[0];
	}else if(range.length == 2) {
		this._value.max = (range[0]>=range[1])?range[0]:range[1];
	}else if(range.length == 3) {
		if(range[0]>=range[1] && range[0] >=range[2]) {
			this._value.max = range[0];
		}else if(range[1]>=range[0] && range[1] >= range[2]) {
			this._value.max = range[1];
		}else if(range[2]>=range[0] && range[2] >= range[1]) {
			this._value.max = range[2];
		}
	}
	
	return this._value.max;
}

//RedBlackTree implementation
RedBlackTree.VERSION=1.0;
function RedBlackTree(){this._root=null;this._cursor=null;this._ancestors=[];}
RedBlackTree.prototype._findNode=function(value,saveAncestors){if(saveAncestors==null)saveAncestors=false;var result=this._root;if(saveAncestors){this._ancestors=[];}while(result!=null){var relation=value.compare(result._value);if(relation!=0){if(saveAncestors){this._ancestors.push(result);}if(relation<0){result=result._left;}else{result=result._right;}}else{break;}}return result;};
RedBlackTree.prototype._maxNode=function(node,saveAncestors){if(node==null)node=this._root;if(saveAncestors==null)saveAncestors=false;if(node!=null){while(node._right!=null){if(saveAncestors){this._ancestors.push(node);}node=node._right;}}return node;};
RedBlackTree.prototype._minNode=function(node,saveAncestors){if(node==null)node=this._root;if(saveAncestors==null)saveAncestors=false;if(node!=null){while(node._left!=null){if(saveAncestors){this._ancestors.push(node);}node=node._left;}}return node;};
RedBlackTree.prototype._nextNode=function(node){if(node!=null){if(node._right!=null){this._ancestors.push(node);node=this._minNode(node._right,true);}else{var ancestors=this._ancestors;parent=ancestors.pop();while(parent!=null&&parent._right===node){node=parent;parent=ancestors.pop();}node=parent;}}else{this._ancestors=[];node=this._minNode(this._root,true);}return node;};
RedBlackTree.prototype._previousNode=function(node){if(node!=null){if(node._left!=null){this._ancestors.push(node);node=this._maxNode(node._left,true);}else{var ancestors=this._ancestors;parent=ancestors.pop();while(parent!=null&&parent._left===node){node=parent;parent=ancestors.pop();}node=parent;}}else{this._ancestors=[];node=this._maxNode(this._root,true);}return node;};
RedBlackTree.prototype.add=function(value){var result;if(this._root==null){result=this._root=new RedBlackNode(value);}else{var addResult=this._root.add(value);this._root=addResult[0];result=addResult[1];}return result;};
RedBlackTree.prototype.find=function(value){var node=this._findNode(value);return(node!=null)?node._value:null;};
RedBlackTree.prototype.findNext=function(value){var current=this._findNode(value,true);current=this._nextNode(current);return(current!=null)?current._value:null;};
RedBlackTree.prototype.findPrevious=function(value){var current=this._findNode(value,true);current=this._previousNode(current);return(current!=null)?current._value:null;};
RedBlackTree.prototype.max=function(){var result=this._maxNode();return(result!=null)?result._value:null;};
RedBlackTree.prototype.min=function(){var result=this._minNode();return(result!=null)?result._value:null;};
RedBlackTree.prototype.next=function(){this._cursor=this._nextNode(this._cursor);return(this._cursor)?this._cursor._value:null;};
RedBlackTree.prototype.previous=function(){this._cursor=this._previousNode(this._cursor);return(this._cursor)?this._cursor._value:null;};
RedBlackTree.prototype.remove=function(value){var result;if(this._root!=null){var remResult=this._root.remove(value);this._root=remResult[0];result=remResult[1];}else{result=null;}return result;};
RedBlackTree.prototype.traverse=function(func){if(this._root!=null){this._root.traverse(func);}};
RedBlackTree.prototype.toString=function(){var lines=[];if(this._root!=null){var indentText="  ";var stack=[[this._root,0,"^"]];while(stack.length>0){var current=stack.pop();var node=current[0];var indent=current[1];var line="";for(var i=0;i<indent;i++){line+=indentText;}line+=current[2]+"("+node.toString()+")";lines.push(line);if(node._right!=null)stack.push([node._right,indent+1,"R"]);if(node._left!=null)stack.push([node._left,indent+1,"L"]);}}return lines.join("\n");};

RedBlackNode.VERSION=1.0;
function RedBlackNode(value){this._left=null;this._right=null;this._value=value;this._height=1;}
RedBlackNode.prototype.add=function(value){var relation=value.compare(this._value);var addResult;var result;var newNode;if(relation!=0){if(relation<0){if(this._left!=null){addResult=this._left.add(value);this._left=addResult[0];newNode=addResult[1];}else{newNode=this._left=new RedBlackNode(value);}}else if(relation>0){if(this._right!=null){addResult=this._right.add(value);this._right=addResult[0];newNode=addResult[1];}else{newNode=this._right=new RedBlackNode(value);}}result=[this.balanceTree(),newNode];}else{result=[this,this];}return result;};
RedBlackNode.prototype.balanceTree=function(){var leftHeight=(this._left!=null)?this._left._height:0;var rightHeight=(this._right!=null)?this._right._height:0;var result;if(leftHeight>rightHeight+1){result=this.swingRight();}else if(rightHeight>leftHeight+1){result=this.swingLeft();}else{this.setHeight();result=this;}return result;};
RedBlackNode.prototype.join=function(that){var result;if(that==null){result=this;}else{var top;if(this._height>that._height){top=this;top._right=that.join(top._right);}else{top=that;top._left=this.join(top._left);}result=top.balanceTree();}return result;};
RedBlackNode.prototype.moveLeft=function(){var right=this._right;var rightLeft=right._left;this._right=rightLeft;right._left=this;this.setHeight();right.setHeight();return right;};
RedBlackNode.prototype.moveRight=function(){var left=this._left;var leftRight=left._right;this._left=leftRight;left._right=this;this.setHeight();left.setHeight();return left;};
RedBlackNode.prototype.remove=function(value){var relation=value.compare(this._value);var remResult;var result;var remNode;if(relation!=0){if(relation<0){if(this._left!=null){remResult=this._left.remove(value);this._left=remResult[0];remNode=remResult[1];}else{remNode=null;}}else{if(this._right!=null){remResult=this._right.remove(value);this._right=remResult[0];remNode=remResult[1];}else{remNode=null;}}result=this;}else{remNode=this;if(this._left==null){result=this._right;}else if(this._right==null){result=this._left;}else{result=this._left.join(this._right);this._left=null;this._right=null;}}if(remNode!=null){if(result!=null){return[result.balanceTree(),remNode];}else{return[result,remNode];}}else{return[this,null];}};
RedBlackNode.prototype.setHeight=function(){var leftHeight=(this._left!=null)?this._left._height:0;var rightHeight=(this._right!=null)?this._right._height:0;this._height=(leftHeight<rightHeight)?rightHeight+1:leftHeight+1;};
RedBlackNode.prototype.swingLeft=function(){var right=this._right;var rightLeft=right._left;var rightRight=right._right;var left=this._left;var leftHeight=(left!=null)?left._height:0;var rightLeftHeight=(rightLeft!=null)?rightLeft._height:0;var rightRightHeight=(rightRight!=null)?rightRight._height:0;if(rightLeftHeight>rightRightHeight){this._right=right.moveRight();}return this.moveLeft();};
RedBlackNode.prototype.swingRight=function(){var left=this._left;var leftRight=left._right;var leftLeft=left._left;var right=this._right;var rightHeight=(right!=null)?right._height:0;var leftRightHeight=(leftRight!=null)?leftRight._height:0;var leftLeftHeight=(leftLeft!=null)?leftLeft._height:0;if(leftRightHeight>leftLeftHeight){this._left=left.moveLeft();}return this.moveRight();};
RedBlackNode.prototype.traverse=function(func){if(this._left!=null)this._left.traverse(func);func(this);if(this._right!=null)this._right.traverse(func);};
RedBlackNode.prototype.toString=function(){return this._value.toString();};