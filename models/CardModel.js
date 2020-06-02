import { extendObservable, Autobind } from "mobx";

class CardModel {
  constructor(data) {
    extendObservable(this, data);
  }
}

export default CardModel;
