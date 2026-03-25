import { useMemo } from "react";
import { getQueryHtml } from "@svar-ui/filter-store";

import "./QueryHighlight.css";

function QueryHighlight(props) {
	const {
		query = "",
		fields = [],
		options = {},
		inline = false,
		showErrors = true,
		cursorPos = -1,
		parse = "allowFreeText",
	} = props;

	const highlightedHtml = useMemo(
		() =>
			getQueryHtml(query, {
				fields,
				options,
				showErrors,
				cursorPos,
				allowFreeText: parse === "allowFreeText",
			}),
		[query, fields, options, showErrors, cursorPos, parse]
	);

	if (inline) {
		return (
			<span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
		);
	}

	if (!query) return null;

	return (
		<div
			className="wx-query-highlight wx-aacwWF55"
			dangerouslySetInnerHTML={{ __html: highlightedHtml }}
		/>
	);
}

export default QueryHighlight;
