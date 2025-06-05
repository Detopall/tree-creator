import { useState, useRef, useEffect } from "react";
import "./TreeView.css";

function TreeNodeView({ node, isRoot = false, highlightedNodes = [], foundNode }) {
	if (!node) return null;

	const countChildren = (node) => {
		if (!node) return 0;
		let count = 0;
		if (node.left) count += 1 + countChildren(node.left);
		if (node.right) count += 1 + countChildren(node.right);
		return count;
	};

	const getDepth = (node) => {
		if (!node) return 0;
		const leftDepth = node.left ? getDepth(node.left) : 0;
		const rightDepth = node.right ? getDepth(node.right) : 0;
		return Math.max(leftDepth, rightDepth) + 1;
	};

	const childrenCount = countChildren(node);
	const nodeDepth = getDepth(node);
	const isLeaf = !node.left && !node.right;
	const hasOnlyOneChild = (node.left && !node.right) || (!node.left && node.right);

	let nodeTypeClass = '';
	if (isRoot) {
		nodeTypeClass = 'root-node';
	} else if (isLeaf) {
		nodeTypeClass = 'leaf-node';
	}

	const isHighlighted = highlightedNodes.includes(node.value);
	const isFound = foundNode === node.value;

	let statusClass = '';
	if (isFound) statusClass = 'node-found';
	else if (isHighlighted) statusClass = 'node-highlighted';

	const tooltipContent = [
		`Value: ${node.value}`,
		`Children: ${childrenCount}`,
		`Depth: ${nodeDepth}`,
		isLeaf ? 'Type: Leaf' : isRoot ? 'Type: Root' : 'Type: Internal',
		hasOnlyOneChild ? 'Structure: Single child' : ''
	].filter(Boolean).join(' | ');

	return (
		<li>
			<div className="tree-node">
				<div
					className={`tree-node-circle ${nodeTypeClass} ${statusClass}`}
					tabIndex="0"
					role="button"
					aria-label={`Tree node with value ${node.value}`}
				>
					{node.value}
					<div className="tree-node-tooltip">
						{tooltipContent}
					</div>
				</div>
			</div>
			{(node.left || node.right) && (
				<ul className="tree-children">
					{node.left && <TreeNodeView node={node.left} highlightedNodes={highlightedNodes} foundNode={foundNode} />}
					{node.right && <TreeNodeView node={node.right} highlightedNodes={highlightedNodes} foundNode={foundNode} />}
				</ul>
			)}
		</li>
	);
}

function TreeView({ tree, highlightedNodes = [], foundNode = null }) {
	const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);
	const wrapperRef = useRef(null);

	const handleMouseDown = (e) => {
		if (e.target.closest('.tree-node-circle')) return;

		setIsDragging(true);
		setDragStart({
			x: e.clientX - transform.x,
			y: e.clientY - transform.y
		});

		if (containerRef.current) {
			containerRef.current.classList.add('dragging');
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;

		const newX = e.clientX - dragStart.x;
		const newY = e.clientY - dragStart.y;

		setTransform(prev => ({
			...prev,
			x: newX,
			y: newY
		}));
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		if (containerRef.current) {
			containerRef.current.classList.remove('dragging');
		}
	};

	const handleWheel = (e) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		const newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);

		setTransform(prev => ({
			...prev,
			scale: newScale
		}));
	};

	const resetView = () => {
		setTransform({ x: 0, y: 0, scale: 1 });
	};

	const zoomIn = () => {
		setTransform(prev => ({
			...prev,
			scale: Math.min(prev.scale * 1.2, 3)
		}));
	};

	const zoomOut = () => {
		setTransform(prev => ({
			...prev,
			scale: Math.max(prev.scale * 0.8, 0.3)
		}));
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('wheel', handleWheel);
		};
	}, [isDragging, dragStart, transform]);

	if (!tree || !tree.root) {
		return (
			<div className="tree-container tree-scroll">
				<div className="tree">
					<p>No tree data available</p>
				</div>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="tree-container tree-scroll">
			<div className="tree-controls">
				<button className="tree-control-btn" onClick={zoomIn} title="Zoom In">+</button>
				<button className="tree-control-btn" onClick={zoomOut} title="Zoom Out">−</button>
				<button className="tree-control-btn" onClick={resetView} title="Reset View">⌂</button>
			</div>
			<div className="zoom-indicator">{Math.round(transform.scale * 100)}%</div>
			<div
				ref={wrapperRef}
				className="tree-wrapper"
				style={{
					transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
				}}
			>
				<div className="tree">
					<ul>
						<TreeNodeView
							node={tree.root}
							isRoot={true}
							highlightedNodes={highlightedNodes}
							foundNode={foundNode}
						/>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default TreeView;

