import Vue from 'vue';
import { NODE_TYPES_EXCLUDED_FROM_AUTOCOMPLETION } from '../constants';
import { addVarType } from '../utils';
import type { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { INodeUi } from '@/Interface';
import type { CodeNodeEditorMixin } from '../types';

function getAutocompletableNodeNames(nodes: INodeUi[]) {
	return nodes
		.filter((node: INodeUi) => !NODE_TYPES_EXCLUDED_FROM_AUTOCOMPLETION.includes(node.type))
		.map((node: INodeUi) => node.name);
}

export const baseCompletions = (Vue as CodeNodeEditorMixin).extend({
	methods: {
		/**
		 * - Complete `$` to `$execution $input $prevNode $runIndex $workflow $now $today
		 * $jmespath $('nodeName')` in both modes.
		 * - Complete `$` to `$json $binary $itemIndex` in single-item mode.
		 */
		baseCompletions(context: CompletionContext): CompletionResult | null {
			const preCursor = context.matchBefore(/\$\w*/);

			if (!preCursor || (preCursor.from === preCursor.to && !context.explicit)) return null;

			const TOP_LEVEL_COMPLETIONS_IN_BOTH_MODES: Completion[] = [
				{
					label: '$execution',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$execution'),
				},
				{ label: '$input', info: this.$locale.baseText('codeNodeEditor.autocompleter.$input') },
				{
					label: '$prevNode',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$prevNode'),
				},
				{
					label: '$workflow',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$workflow'),
				},
				{
					label: '$now',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$now'),
				},
				{
					label: '$today',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$today'),
				},
				{
					label: '$jmespath()',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$jmespath'),
				},
				{
					label: '$runIndex',
					info: this.$locale.baseText('codeNodeEditor.autocompleter.$runIndex'),
				},
			];

			const options: Completion[] = TOP_LEVEL_COMPLETIONS_IN_BOTH_MODES.map(addVarType);

			options.push(
				...getAutocompletableNodeNames(this.$store.getters.allNodes).map((name) => {
					return {
						label: `$('${name}')`,
						type: 'variable',
					};
				}),
			);

			if (this.mode === 'runOnceForEachItem') {
				const TOP_LEVEL_COMPLETIONS_IN_SINGLE_ITEM_MODE = [
					{ label: '$json' },
					{ label: '$binary' },
					{
						label: '$itemIndex',
						info: this.$locale.baseText('codeNodeEditor.autocompleter.$itemIndex'),
					},
				];

				options.push(...TOP_LEVEL_COMPLETIONS_IN_SINGLE_ITEM_MODE.map(addVarType));
			}

			return {
				from: preCursor.from,
				options,
			};
		},

		/**
		 * Complete `$(` to `$('nodeName')`.
		 */
		nodeSelectorCompletions(context: CompletionContext): CompletionResult | null {
			const preCursor = context.matchBefore(/\$\(.*/);

			if (!preCursor || (preCursor.from === preCursor.to && !context.explicit)) return null;

			const options: Completion[] = getAutocompletableNodeNames(this.$store.getters.allNodes).map(
				(nodeName) => {
					return {
						label: `$('${nodeName}')`,
						type: 'variable',
					};
				},
			);

			return {
				from: preCursor.from,
				options,
			};
		},
	},
});