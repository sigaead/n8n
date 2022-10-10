import { IExecutionsSummary } from "@/Interface";
import dateFormat from "dateformat";
import mixins from "vue-typed-mixins";
import { genericHelpers } from "./genericHelpers";

export interface IExecutionUIData {
	name: string;
	label: string;
	startTime: string,
	runningTime: string;
}

export const executionHelpers = mixins(genericHelpers).extend({
	computed: {
		executionId(): string {
			return this.$route.params.executionId;
		},
		workflowName (): string {
			return this.$store.getters.workflowName;
		},
		currentWorkflow (): string {
			return this.$route.params.name || this.$store.getters.workflowId;
		},
		executions(): IExecutionsSummary[] {
			return this.$store.getters['workflows/currentWorkflowExecutions'];
		},
		activeExecution(): IExecutionsSummary {
			return this.$store.getters['workflows/getActiveWorkflowExecution'];
		},
	},
	methods: {
		getExecutionUIDetails(execution: IExecutionsSummary): IExecutionUIData {
			const status = {
				name: 'unknown',
				startTime: this.formatDate(new Date(execution.startedAt)),
				label: 'Status unknown',
				runningTime: '',
			};

			if (execution.waitTill) {
				status.name = 'waiting';
				status.label = 'Waiting';
			} else if (execution.stoppedAt === undefined) {
				status.name = 'running';
				status.label = 'Running';
			} else if (execution.finished) {
				status.name = 'success';
				status.label = 'Succeeded';
				if (execution.stoppedAt) {
					status.runningTime = this.displayTimer(new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime(), true);
				}
			} else if (execution.stoppedAt !== null) {
				status.name = 'error';
				status.label = 'Failed';
				if (execution.stoppedAt) {
					status.runningTime = this.displayTimer(new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime(), true);
				}
			}

			return status;
		},
		formatDate(date: Date) {
			return dateFormat(date.getTime(), 'HH:MM:ss "on" d mmmm');
		},
	},
});