import SwiperStore from "./swiper";

class RootStore {
  constructor() {
    this.swiperStore = new SwiperStore(this);
  }
}

export default RootStore;
