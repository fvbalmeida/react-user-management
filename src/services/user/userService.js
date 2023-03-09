import http from "../../common/http-common"
import authHeader from "../auth/auth-header";

class UserService {

  getAll() {
    return http.get("/user", { headers: authHeader() });
  }

  getById(id) {
    return http.get(`/user/${id}`, { headers: authHeader() });
  }

  findByNameOrEmail(searchString) {
    return http.get(`/user/search/${searchString}`, { headers: authHeader() });
  }

  create(data) {
    return http.post("/user/create", data, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/user/update/${id}`, data, { headers: authHeader() })
  }

  remove(id) {
    return http.delete(`/user/remove/${id}`, { headers: authHeader() });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();