import axios from '../config/axios';

function login(mail_person: string, password_person: string) {
    return axios.post('/login/in', { mail_person: mail_person, password_person: password_person });
}
  
function logout(id_person: number) {
    return axios.post('/login/out', { id_person: id_person });
}

export default {
    login,
    logout
};
