import { useState, useEffect, useMemo, useRef, useCallback, useContext } from 'react';
import {
	parseSet,
	getAutocompleteContext,
	getSuggestions,
	prepareFields,
	buildFieldMaps,
	idsToLabels,
	labelsToIds,
} from '@svar-ui/filter-store';
import { useWritableProp } from '@svar-ui/lib-react';
import { context } from '@svar-ui/react-core';
import { locale } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/filter-locales';

import Suggest from './suggest/Suggest.jsx';
import QueryHighlight from './QueryHighlight.jsx';

import './FilterQuery.css';

function FilterQuery(props) {
	const {
		value: valueProp = '',
		placeholder = '',
		onChange: onchange = null,
		parse: parseMode = 'allowFreeText',
		fields = [],
		options = {},
	} = props;

	const i18nCtx = useContext(context.i18n);
	const i18n = ((i18nCtx || locale(en)).getGroup('filter'));

	const [value, setValue] = useWritableProp(valueProp || '');

	const parseEnabled = useMemo(() => parseMode !== 'none', [parseMode]);
	const strictParser = useMemo(() => parseMode === 'strict', [parseMode]);

	const pFields = useMemo(() => prepareFields(fields), [fields]);
	const fieldMaps = useMemo(() => buildFieldMaps(pFields), [pFields]);

	function getErrorMessage(error) {
		if (!error || typeof error === 'boolean') return null;
		const fn = i18n(error.code.toString().toLowerCase());
		if (typeof fn === 'function') return fn(error.field, error.value);
		return error.message || fn;
	}

	const [text, setText_] = useState('');
	const isInternalChangeRef = useRef(false);
	const hasBeenSetRef = useRef(false);

	const [progressActive, setProgressActive] = useState(false);
	const [progressKey, setProgressKey] = useState(0);
	const [showErrors, setShowErrors] = useState(true);
	const [cursorPos, setCursorPos] = useState(0);
	const [suggestOpen, setSuggestOpen] = useState(false);

	const inputEl = useRef(null);
	const highlightEl = useRef(null);
	const suggestRef = useRef(null);

	const parseResult = useMemo(
		() =>
			parseEnabled
				? parseSet(text, pFields, options, {
						allowFreeText: !strictParser,
					})
				: null,
		[parseEnabled, text, pFields, options, strictParser]
	);

	const activeTokenInfo = useMemo(() => {
		if (!parseEnabled) return null;
		return getAutocompleteContext(text, cursorPos, pFields);
	}, [parseEnabled, text, cursorPos, pFields]);

	const currentTokenValue = useMemo(
		() =>
			activeTokenInfo
				? text
						.slice(activeTokenInfo.start, activeTokenInfo.end)
						.toLowerCase()
				: '',
		[activeTokenInfo, text]
	);

	const suggestions = useMemo(() => {
		if (!suggestOpen) return [];
		// no autocomplete for strict-match-any
		if (activeTokenInfo && text[activeTokenInfo.start - 1] === '#')
			return [];
		const all = getSuggestions(activeTokenInfo, pFields, options);
		if (!all || !currentTokenValue) return all || [];
		// Hide suggestion that exactly matches what's already typed
		return all.filter((s) => s.id.toLowerCase() !== currentTokenValue);
	}, [suggestOpen, activeTokenInfo, text, pFields, options, currentTokenValue]);

	// Refs to hold latest values for triggerFilter callback
	const onchangeRef = useRef(onchange);
	onchangeRef.current = onchange;
	const parseEnabledRef = useRef(parseEnabled);
	parseEnabledRef.current = parseEnabled;
	const strictParserRef = useRef(strictParser);
	strictParserRef.current = strictParser;
	const pFieldsRef = useRef(pFields);
	pFieldsRef.current = pFields;
	const optionsRef = useRef(options);
	optionsRef.current = options;
	const parseResultRef = useRef(parseResult);
	parseResultRef.current = parseResult;
	const valueRef = useRef(value);
	valueRef.current = value;
	const fieldMapsRef = useRef(fieldMaps);
	fieldMapsRef.current = fieldMaps;
	const textRef = useRef(text);
	textRef.current = text;

	const startProgress = useCallback(() => {
		setProgressKey((k) => k + 1);
		setProgressActive(true);
	}, []);

	const endProgress = useCallback(() => {
		setProgressActive(false);
	}, []);

	function closeSuggestions() {
		setSuggestOpen(false);
	}

	const triggerFilter = useCallback(() => {
		setSuggestOpen(false);
		// Normalize text: convert any typed field IDs to labels
		const currentFieldMaps = fieldMapsRef.current;
		setText_((prevText) => idsToLabels(prevText, currentFieldMaps));
		setShowErrors(true);
		const currentOnchange = onchangeRef.current;
		if (currentOnchange) {
			const currentParseEnabled = parseEnabledRef.current;
			const currentParseResult = parseResultRef.current;
			const currentValue = valueRef.current;
			const currentText = textRef.current;
			if (currentParseEnabled && currentParseResult) {
				const error = currentParseResult.isInvalid
					? {
							...currentParseResult.isInvalid,
							message: getErrorMessage(currentParseResult.isInvalid),
						}
					: null;

				const finalText =
					!error || error.code === 'NO_DATA'
						? currentParseResult.naturalText || ''
						: currentText;
				currentOnchange({
					parsed: currentParseResult,
					value: currentParseResult.config,
					text: finalText,
					error,
					startProgress,
					endProgress,
				});
			} else {
				currentOnchange({
					value: currentValue,
					text: currentText,
					startProgress,
					endProgress,
				});
			}
		}
	}, [startProgress, endProgress]);

	// Reset hasBeenSetRef on unmount so StrictMode's remount behaves like a real mount.
	useEffect(() => {
		return () => {
			hasBeenSetRef.current = false;
		};
	}, []);

	// Effect watching value — mirrors the Svelte $effect with untrack.
	// All reads use refs so deps stay minimal (matching Svelte's untrack() semantics).
	// Refs are synced before triggerFilter so it sees the new text/parseResult,
	// since setState is async and parseResult useMemo hasn't re-run yet.
	useEffect(() => {
		if (isInternalChangeRef.current) {
			isInternalChangeRef.current = false;
			return;
		}
		if (!hasBeenSetRef.current) {
			hasBeenSetRef.current = true;
			if (!value) return;
		}
		const newText = idsToLabels(value, fieldMapsRef.current);
		setText_(newText);
		// Sync refs immediately so triggerFilter reads the correct values
		textRef.current = newText;
		if (parseEnabledRef.current) {
			parseResultRef.current = parseSet(newText, pFieldsRef.current, optionsRef.current, {
				allowFreeText: !strictParserRef.current,
			});
		}
		triggerFilter();
	}, [value, triggerFilter]);

	function setText(newText) {
		setText_(newText);
		isInternalChangeRef.current = true;
		setValue(labelsToIds(newText, fieldMaps));
	}

	function onkeydown(e) {
		if (suggestions && suggestions.length) {
			suggestRef.current.keydown(e);
		}
		// Enter triggers filter unless Suggest handled it (selected an item)
		if (e.key === 'Enter' && !e.defaultPrevented) {
			triggerFilter();
		}
	}

	function selectByEvent(event) {
		const insertText = event.id;
		if (!activeTokenInfo) return;

		const before = text.slice(0, activeTokenInfo.start);
		const after = text.slice(activeTokenInfo.end);

		let newText;
		let newCursorPos;
		if (activeTokenInfo.type === 'field') {
			// Append ": " after field name per query syntax
			newText = `${before}${insertText}: ${after}`;
			newCursorPos = before.length + insertText.length + 2;
		} else if (activeTokenInfo.type === 'predicate') {
			// Append ": " after predicate (e.g., "StartDate.year: ")
			newText = `${before}${insertText}: ${after}`;
			newCursorPos = before.length + insertText.length + 2;
		} else {
			// Add space after colon if missing: "field:" -> "field: value"
			const needsSpace = before.endsWith(':');
			const prefix = needsSpace ? ' ' : '';
			newText = `${before}${prefix}${insertText}${after}`;
			newCursorPos = before.length + prefix.length + insertText.length;
		}

		setText(newText);
		setCursorPos(newCursorPos);
		closeSuggestions();

		// Wait for React to update DOM before setting cursor position
		requestAnimationFrame(() => {
			if (inputEl.current) {
				inputEl.current.setSelectionRange(newCursorPos, newCursorPos);
				inputEl.current.focus();
			}
		});
	}

	function handleInput(e) {
		const newText = e.target.value;
		setText_(newText);
		isInternalChangeRef.current = true;
		setValue(labelsToIds(newText, fieldMaps));
		const pos = e.target.selectionStart;
		setCursorPos(pos);
		setShowErrors(pos); // Pass position to suppress errors at active token
		setSuggestOpen(true);
	}

	function handleScroll() {
		if (highlightEl.current && inputEl.current) {
			highlightEl.current.scrollLeft = inputEl.current.scrollLeft;
		}
	}

	function handleInputClick() {
		closeSuggestions();
	}

	function clear() {
		setText_('');
		isInternalChangeRef.current = true;
		setValue('');
	}

	return (
		<div
			className="wx-filter-query wx-aaccSW8j"
			onKeyDown={onkeydown}
		>
			<div
				className={`wx-progress-bar wx-aaccSW8j${progressActive ? ' active' : ''}`}
			>
				{progressActive && (
					<div
						key={progressKey}
						className="wx-progress-fill wx-aaccSW8j"
					></div>
				)}
			</div>
			<div className="wx-filter-query-row wx-aaccSW8j">
				<div className="wx-filter-query-input-wrapper wx-aaccSW8j">
					{parseEnabled && (
						<div
							className={`wx-filter-query-highlight wx-aaccSW8j${!text ? ' wx-placeholder' : ''}`}
							ref={highlightEl}
							aria-hidden="true"
						>
							{text ? (
								<>
									<QueryHighlight
										parse={parseMode}
										query={text}
										fields={pFields}
										options={options}
										inline={true}
										showErrors={showErrors}
										cursorPos={cursorPos}
									/>
									&nbsp;
								</>
							) : (
								placeholder
							)}
						</div>
					)}
					<input
						type="text"
						className={`wx-filter-query-input wx-aaccSW8j${parseEnabled ? ' wx-parse-mode' : ''}`}
						ref={inputEl}
						value={text}
						placeholder={parseEnabled ? '' : placeholder}
						onInput={handleInput}
						onScroll={handleScroll}
						onClick={handleInputClick}
						onChange={() => {}}
					/>
				</div>
				{text && (
					<button
						type="button"
						className="wx-filter-query-clear wx-aaccSW8j"
						onClick={clear}
						aria-label="Clear"
					>
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								fill="currentColor"
								d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
							/>
						</svg>
					</button>
				)}
				<button
					type="button"
					className="wx-filter-query-search wx-aaccSW8j"
					onClick={triggerFilter}
					aria-label="Search"
				>
					<svg viewBox="0 0 24 24" width="18" height="18">
						<path
							fill="currentColor"
							d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
						/>
					</svg>
				</button>
			</div>
			<Suggest
				ref={suggestRef}
				items={suggestions}
				onSelect={selectByEvent}
				onClose={closeSuggestions}
			>
				{({ option }) => option.label}
			</Suggest>
		</div>
	);
}

export default FilterQuery;
