var jobsgroup =
{
    init()
    {
        const form = document.getElementById("form");
        const pwdMsg1 = document.getElementById("pwdMsg1");
        const pwdMsg2 = document.getElementById("pwdMsg2");
        const pwd1 = document.getElementById("pwd1");
        const pwd2 = document.getElementById("pwd2");

        form.addEventListener("submit", (event) => {
            if (pwdMsg1) {
                if (pwdMsg1.textContent != "") {
                    alert("Las contraseñas no coinciden.");
                    event.preventDefault()
                }
                
            }
        });

        if (pwd1 && pwd2) {
            [pwd1,pwd2].forEach(c => c.addEventListener("keyup", () => { this.validatePasswords(pwd1.value, pwd2.value, pwdMsg1) }));
        }

        if (pwd1 && pwd2) {
            [pwd1,pwd2].forEach(c => c.addEventListener("keyup", () => { this.validatePasswords(pwd1.value, pwd2.value, pwdMsg2) }));
        }
    },

    getBSModal(modalId='')
    {
        const modalElement = document.getElementById(modalId);
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (!bsModal) return new bootstrap.Modal(modalElement);

        return bsModal;
    },

    getValues(containerId='', includeEmpy=false)
    {
        values = {};
        const controls = document.querySelectorAll(`#${containerId} input, #${containerId} select, #${containerId} textarea`);
        
        controls.forEach(control => 
        {
            if (values != null)
            {
                let v = '';

                if (control.id != 'inputv') v = control.value;
                else v = control.getAttribute('value');

                if (v.trim() == '' && control.getAttribute('required')=='true') {
                    alert('El campo: ' + control.name + ' es requerido');
                    control.focus();
                    values = null;
                }

                if (values && (control.getAttribute('type')??'').toLowerCase() == 'number' || ((control.getAttribute('hidden-type')??'') == 'number')) 
                    v = Number(v);

                if (values && (includeEmpy || v.toString().trim() != '')) values[control.name] = v;
            }
        });

        return values;
    },

    clearValues(containerId, includeHidden=false)
    {
        const controls = document.querySelectorAll(`#${containerId} input, #${containerId} select, #${containerId} textarea, #${containerId} input-key`);
        
        try
        {
            controls.forEach(control => {
                if (control.tagName.toLowerCase() != 'input-key') {
                    if(includeHidden || control.type != "hidden") control.value = '';
                }
                else control.clear();
            });
            return true;
        }
        catch(error)
        {
            alert(error);
            return false;
        }
    },

    changePassword()
    {
        const apikey = document.getElementById("apikey");
        const newPwd = document.getElementById("newPwd");

        let values = this.getValues("mdl_cpwd_controls", true);
        if (values == null) return;

        if (this.validatePasswords(values.pwd, values.pwd_confirm)) {
            apikey.value = values.pwd;
            newPwd.value = "true";

            this.clearValues("mdl_cpwd_controls");
            this.getBSModal("modal_change_pwd").hide();
        }
    },

    validatePasswords(pwd1,pwd2,pwdMsg)
    {
        if (pwd1 != pwd2) {
            if (pwdMsg) pwdMsg.textContent = "La contraseñas no coinciden.";
            return false;
        } else if (!(pwd1 == "" || pwd2 == "")) {
            if (pwdMsg) pwdMsg.textContent = "";
            return true;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    jobsgroup.init();
})