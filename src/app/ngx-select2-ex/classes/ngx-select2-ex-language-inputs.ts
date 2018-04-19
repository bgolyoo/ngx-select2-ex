import { INgxSelect2ExLanguageInputs } from '../interfaces/ngx-select2-ex-language-inputs';

export class NgxSelect2ExLanguageInputs implements INgxSelect2ExLanguageInputs {

  errorLoading: Function;
  inputTooLong: Function;
  inputTooShort: Function;
  loadingMore: Function;
  maximumSelected: Function;
  noResults: Function;
  searching: Function;

  constructor(languageInputs?: INgxSelect2ExLanguageInputs) {
    this.errorLoading = languageInputs && languageInputs.errorLoading ?
      languageInputs.errorLoading : () => `The results could not be loaded.`;

    this.inputTooLong = languageInputs && languageInputs.inputTooLong ?
      languageInputs.inputTooLong : (n) => `Please delete ${n} character`;

    this.inputTooShort = languageInputs && languageInputs.inputTooShort ?
      languageInputs.inputTooShort : (n) => `Please enter ${n} or more characters`;

    this.loadingMore = languageInputs && languageInputs.loadingMore ?
      languageInputs.loadingMore : () => `Loading more results…`;

    this.maximumSelected = languageInputs && languageInputs.maximumSelected ?
      languageInputs.maximumSelected : (n) => `You can only select ${n} item`;

    this.noResults = languageInputs && languageInputs.noResults ?
      languageInputs.noResults : () => `No results found`;

    this.searching = languageInputs && languageInputs.searching ?
      languageInputs.searching : () => `Searching…`;
  }

}
