import {
	forwardRef,
	useImperativeHandle,
	useState,
	useEffect,
	useRef,
} from "react";
import { Dropdown } from "@svar-ui/react-core";
import { locateID } from "@svar-ui/lib-dom";

import "./Suggest.css";

const Suggest = forwardRef(function Suggest(props, ref) {
	const { items = [], children, onSelect, onClose } = props;

	const listRef = useRef(null);
	const [navIndex, setNavIndex] = useState(-1);

	function setNav(index) {
		setNavIndex(index);
	}

	function navigate(dir) {
		let index;
		if (navIndex === -1) {
			index = dir > 0 ? 0 : items.length - 1;
		} else {
			index = Math.max(0, Math.min(navIndex + dir, items.length - 1));
		}
		if (index === navIndex) return;
		setNav(index);
		scrollToIndex(index);
	}

	function scrollToIndex(index) {
		if (index >= 0 && listRef.current) {
			const el = listRef.current.querySelectorAll(".wx-item")[index];
			if (el) {
				el.scrollIntoView({ block: "nearest" });
			}
		}
	}

	function handleMove(ev) {
		const id = locateID(ev);
		const index = items.findIndex(a => a.id == id);
		if (index !== -1 && index !== navIndex) {
			setNav(index);
		}
	}

	function keydown(ev) {
		if (!items.length) return;

		switch (ev.code) {
			case "Enter":
				if (navIndex >= 0) {
					ev.preventDefault();
					onSelect && onSelect({ id: items[navIndex].id });
				} else {
					onClose && onClose();
				}
				break;
			case "Escape":
			case "Tab":
				onClose && onClose();
				break;
			case "ArrowDown":
				ev.preventDefault();
				navigate(1);
				break;
			case "ArrowUp":
				ev.preventDefault();
				navigate(-1);
				break;
		}
	}

	useImperativeHandle(ref, () => ({
		keydown,
	}));

	function handleClick(ev) {
		ev.stopPropagation();
		const id = locateID(ev);
		const item = items.find(a => a.id == id);
		if (item) {
			onSelect && onSelect({ id: item.id });
		}
	}

	// Reset selection when items change to avoid stale index
	useEffect(() => {
		if (!listRef.current || !items.length) {
			setNavIndex(-1);
		}
	}, [items]);

	if (items.length <= 0) return null;

	return (
		<Dropdown onCancel={onClose}>
			<div
				className="wx-list wx-aac97azI"
				ref={listRef}
				onClick={handleClick}
				onMouseMove={handleMove}
			>
				{items.map((data, index) => (
					<div
						key={data.id}
						className={`wx-item wx-aac97azI${index === navIndex ? " wx-focus" : ""}`}
						data-id={data.id}
					>
						{children
							? children({ option: data })
							: data.label}
					</div>
				))}
			</div>
		</Dropdown>
	);
});

export default Suggest;
