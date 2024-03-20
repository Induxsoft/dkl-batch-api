var crontask =
{
    init()
    {
        const check_disabled = document.querySelector('#check_disabled');
        const ipt_disabled = document.querySelector('#ipt_disabled');

        if (check_disabled && ipt_disabled) check_disabled.addEventListener('change', () => { this.set_input_check_value(ipt_disabled, check_disabled) });
    },

    set_input_check_value(inputElement, checkElement)
    {
        inputElement.value = (checkElement.checked ? 1 : 0);
    },
}

document.addEventListener('DOMContentLoaded', () => {
    crontask.init()
});