import http from '../../common/http-common'

class AuthService {
  async login(email, password) {
    const response = await http.post("auth/login", {
      email,
      password
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();