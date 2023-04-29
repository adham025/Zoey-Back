import axios from "axios";

const baseUrl = 'http://localhost:3000/api/v1/auth'

$("#login").click(() => {
    const email = $("#email").val();
    const password = $("#password").val();
    const data = { email, password }

    axios({
        method: "POST",
        url: `http://localhost:3000/api/v1/auth/login`,
        data: data,
        headers: { 'Content-Type': 'application/json' },
    }).then(function (response) {
        const { message, result } = response.data
        if (message == "Done") {
            localStorage.setItem('userID', result[0].id);
            window.location.replace("c:/users/Adham")
        } else {
            alert("Invalid email or password")
        }
    }).catch(function (error) {
        console.log(error);
    })
})