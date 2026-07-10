type StringDictionary = {
  [translationCode: string]: string;
};

const translations: StringDictionary = {
  save: "Сохранить",
  cancel: "Отмена",
  close: "Закрыть",
};

type UserNamesById = {
  [id: string]: string;
};

const users: UserNamesById = {
  "1": "Анна",
  "2": "Борис",
};

type BrokenDictionary = {
  [key: string]: string | number;

  version: number;
};

const dictionary: BrokenDictionary = {
  save: "Сохранить",
  cancel: "Отмена",
  close: "Закрыть",
  version: 2,
};

const value = dictionary.save;
