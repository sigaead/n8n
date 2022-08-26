/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import {
	INodeTypeDescription,
} from 'n8n-workflow';

import * as sheet from './sheet';
import * as spreadsheet from './spreadsheet';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Google Sheets',
	name: 'googleSheets',
	icon: 'file:googleSheets.svg',
	group: ['input', 'output'],
	version: 2,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Read, update and write data to Google Sheets',
	defaults: {
		name: 'Google Sheets',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'googleApi',
			required: true,
			displayOptions: {
				show: {
					authentication: [
						'serviceAccount',
					],
				},
			},
			testedBy: 'googleApiCredentialTest',
		},
		{
			name: 'googleSheetsOAuth2Api',
			required: true,
			displayOptions: {
				show: {
					authentication: [
						'oAuth2',
					],
				},
			},
		},
	],
	properties: [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Service Account',
					value: 'serviceAccount',
				},
				{
					name: 'OAuth2',
					value: 'oAuth2',
				},
			],
			default: 'oAuth2',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Document',
					value: 'spreadsheet',
				},
				{
					name: 'Sheet Within Document',
					value: 'sheet',
				},
			],
			default: 'sheet',
		},
		...sheet.descriptions,
		...spreadsheet.descriptions,
	],
};