import { useState } from "react";
import "./components/TreeView.css";
import { Tree } from './components/Node';
import TreeView from './components/TreeView';

function App() {
	const [tree, setTree] = useState(() => {
		const t = new Tree();
		let numbers = [];
		numbers.forEach(n => t.insert(n));
		return t;
	});

	const [addValue, setAddValue] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [searchType, setSearchType] = useState("bfs");
	const [searchResult, setSearchResult] = useState(null);
	const [highlightedNodes, setHighlightedNodes] = useState([]);
	const [foundNode, setFoundNode] = useState(null);

	const handleAdd = () => {
		if (addValue === "") return;
		tree.insert(Number(addValue));
		setTree(Object.assign(Object.create(Object.getPrototypeOf(tree)), tree));
		setAddValue("");
	};

	const animateSearch = async (path, target) => {
		setHighlightedNodes([]);
		setFoundNode(null);
		setSearchResult(null);

		for (let i = 0; i < path.length; i++) {
			const currentNode = path[i];
			setHighlightedNodes(prev => [...prev, currentNode.value]);
			await new Promise(res => setTimeout(res, 500));

			if (currentNode.value === target) {
				setFoundNode(currentNode.value);
				setHighlightedNodes(prev => [...prev, currentNode.value]);
				return;
			}
		}

		setSearchResult("Not found");
	};

	const handleSearch = () => {
		if (searchValue === "") return;

		const method = searchType === "bfs" ? "bfsSearchPath" : "dfsSearchPath";
		const { path, _ } = tree[method](Number(searchValue));
		animateSearch(path, Number(searchValue));
	};

	return (
		<>
			<h1>Binary Search Tree</h1>
			<div>
				<TreeView
					tree={tree}
					highlightedNodes={highlightedNodes}
					foundNode={foundNode}
				/>
				<div id="controls">
					<div className="control">
						<button onClick={() => {
							const randomNumbers = [15, 6, 18, 3, 7, 17, 20, 2, 4, 14, 88];
							const newTree = new Tree();
							randomNumbers.forEach(n => newTree.insert(n));
							setTree(newTree);
							setHighlightedNodes([]);
							setFoundNode(null);
							setSearchResult(null);
						}}>Set example numbers</button>
					</div>
					<div className="control">
						<button onClick={() => {
							setTree(new Tree());
							setHighlightedNodes([]);
							setFoundNode(null);
							setSearchResult(null);
						}}>Clear</button>
					</div>
					<div className="control">
						<input
							type="number"
							value={addValue}
							onChange={e => setAddValue(e.target.value)}
							placeholder="Add a number"
						/>
						<button onClick={handleAdd}>Add</button>
					</div>
					<div className="control">
						<select
							value={searchType}
							onChange={e => setSearchType(e.target.value)}
						>
							<option value="bfs">BFS</option>
							<option value="dfs">DFS</option>
						</select>
						<input
							type="number"
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							placeholder="Search for a number"
						/>
						<div className="button-container">
							<button onClick={handleSearch}>Search</button>
							{searchResult && <p className="search-result">{searchResult}</p>}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;

