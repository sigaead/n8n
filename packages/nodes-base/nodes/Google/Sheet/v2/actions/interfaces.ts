import {
	AllEntities,
	Entity,
	PropertiesOf,
} from 'n8n-workflow';

// delete is del
type GoogleSheetsMap = {
	spreadsheet: 'create';
	sheet: 'append' | 'clear' | 'create' | 'delete' | 'readMatchingRows' | 'readAllRows' | 'remove' | 'update' | 'appendOrUpdate';
};

export type GoogleSheets = AllEntities<GoogleSheetsMap>;

export type GoogleSheetsSpreadSheet = Entity<GoogleSheetsMap, 'spreadsheet'>;
export type GoogleSheetsSheet = Entity<GoogleSheetsMap, 'sheet'>;

export type SpreadSheetProperties = PropertiesOf<GoogleSheetsSpreadSheet>;
export type SheetProperties = PropertiesOf<GoogleSheetsSheet>;