class TreeNode {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
	}
}

class Tree {
	constructor() {
		this.root = null;
	}

	insert(value) {
		const newNode = new TreeNode(value);
		if (this.root === null) {
			this.root = newNode;
		} else {
			let currentNode = this.root;
			while (true) {
				if (value < currentNode.value) {
					if (currentNode.left === null) {
						currentNode.left = newNode;
						break;
					} else {
						currentNode = currentNode.left;
					}
				} else {
					if (currentNode.right === null) {
						currentNode.right = newNode;
						break;
					} else {
						currentNode = currentNode.right;
					}
				}
			}
		}
	}

	// Modified for animation: return path and found result
	bfsSearchPath(value) {
		let path = [];
		let queue = [];

		if (this.root === null) return { path, found: null };

		queue.push(this.root);
		while (queue.length > 0) {
			const currentNode = queue.shift();
			path.push(currentNode);

			if (currentNode.value === value) {
				return { path, found: currentNode };
			}
			if (currentNode.left) queue.push(currentNode.left);
			if (currentNode.right) queue.push(currentNode.right);
		}
		return { path, found: null };
	}

	// Modified for animation: return path and found result
	dfsSearchPath(value) {
		let path = [];
		let stack = [];

		if (this.root === null) return { path, found: null };

		stack.push(this.root);
		while (stack.length > 0) {
			const currentNode = stack.pop();
			path.push(currentNode);

			if (currentNode.value === value) {
				return { path, found: currentNode };
			}
			if (currentNode.right) stack.push(currentNode.right);
			if (currentNode.left) stack.push(currentNode.left);
		}
		return { path, found: null };
	}

	printTree() {
		let queue = [];
		if (this.root) queue.push(this.root);
		while (queue.length > 0) {
			const currentNode = queue.shift();
			console.log(currentNode.value);
			if (currentNode.left) queue.push(currentNode.left);
			if (currentNode.right) queue.push(currentNode.right);
		}
	}
}

export { Tree, TreeNode };
