var crontask =
{
    init()
    {
        const sel_jobsgroup = document.getElementById("sel_jobsgroup");
        const sel_program = document.getElementById("sel_program");
        const nombre = document.getElementById("nombre")

        sel_jobsgroup.addEventListener("change", () => {
            this.change_program(sel_jobsgroup,sel_program);
        })

        sel_program.addEventListener("change", () => {
            if (sel_program.value != "") {
                nombre.value = sel_program.value
            }
        })

        const check_disabled = document.querySelector('#check_disabled');
        const ipt_disabled = document.querySelector('#ipt_disabled');

        if (check_disabled && ipt_disabled) check_disabled.addEventListener('change', () => { this.set_input_check_value(ipt_disabled, check_disabled) });
    },

    change_program(jobgroup,sel_program)
    {
        InduxsoftCrudlModel.InvokeService("./?idGroup="+jobgroup.value, null,
            success => {
                let options = success.map(program => `<option value=${program}>${program}</option>`).join('/n');
                sel_program.innerHTML = options;
            },
            failure => {
                alert('Failure \n' + JSON.stringify(failure))
            },
            'GET', false
        );
    },

    set_input_check_value(inputElement, checkElement)
    {
        inputElement.value = (checkElement.checked ? 1 : 0);
    },
}

document.addEventListener('DOMContentLoaded', () => {
    crontask.init()
});