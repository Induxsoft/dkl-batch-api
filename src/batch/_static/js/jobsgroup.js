var jobsgroup =
{
    init()
    {
        const form = document.getElementById("form")
        const apikey = document.getElementById("apikey");

        if (apikey) form.addEventListener("submit", e => this.comparePasswords(e,apikey));
    },

    comparePasswords(e,apikey) {
        const newPwd = document.getElementById("newPwd");
        const pwd1 = document.getElementById("pwd1");
        const pwd2 = document.getElementById("pwd2");

        console.log(apikey.value)
        console.log(pwd1.value)
        console.log(pwd2.value)

        if (!(pwd1.value == pwd2.value)) {
            alert("Las contraseñas no coinciden");
            e.preventDefault();
        } else if (!(pwd1.value == "" || pwd1.value == "")) {
            apikey.value = pwd1.value;
            newPwd.value = true;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    jobsgroup.init();
})