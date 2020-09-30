export interface CollectionValueProfileInterface {
  collectionPosition: number;
  matchUpValue: number;
}

export interface CollectionDefinitionInterface {
  collectionId: string;
  collectionName: string;
  matchUpType: string; // TODO: provide enum
  matchUpCount: number;
  matchUpFormat: string;
  collectionValue?: number;
  matchUpValue?: number;
  collectionValueProfile?: CollectionValueProfileInterface[];
}

export interface WinCriteriaInterface {
  valueGoal: number;
}

export interface TieFormatInterface {
  winCriteria: WinCriteriaInterface;
  collectionDefinitions: CollectionDefinitionInterface[];
}
