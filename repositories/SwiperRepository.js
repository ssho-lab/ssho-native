import axios from "axios";

class SwiperRepository {
  URL = "http://13.124.59.2";

  constructor(url) {
    this.URL = url || this.URL;
  }

  getItemList() {
    return axios.get(this.URL + ":8081/item", {});
  }

  saveSwipeLogs(SwipeLogs) {
    axios
      .post(this.URL + ":8082/log/swipe", SwipeLogs)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
}

export default SwiperRepository;