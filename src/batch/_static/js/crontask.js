var crontask =
{
    init()
    {
        const check_disabled = document.querySelector('#check_disabled');
        const ipt_disabled = document.querySelector('#ipt_disabled');

        if (check_disabled && ipt_disabled) check_disabled.addEventListener('change', e => { this.set_input_check_value(ipt_disabled, check_disabled) });
    },

    set_input_check_value(inputElement, checkElement)
    {
        inputElement.value = (checkElement.checked ? 1 : 0);
    },

    uploadFiles()
    {
        let adjuntos = document.getElementById("txt_adjuntos");
        if (adjuntos.files.length == 0) return;

        let endpoint = this.url_files + qa_issue._GET["_entity_id"] + "/?_act=upload-file&_entities_type="+qa_issue._GET["_entities_type"];

        let fd = new FormData();
        for (let i = 0; i < adjuntos.files.length; i++) {
            const file = adjuntos.files[i];
            fd.append(file.name,file);
        }

        InduxsoftCrudlModel.InvokeService(endpoint, fd,
            (data) => { this.printAttachments(data); },
            (error) => { alert(error.message ?? JSON.stringify(error)); },
        "POST", false, false, "", true);
    },

    deleteFile(filename)
    {
        if (!confirm("¿Desea eliminar el archivo: "+filename+"?")) return;
        
        let endpoint = this.url_files + qa_issue._GET["_entity_id"] + "/?_act=delete-file&filename="+filename+"&_entities_type="+qa_issue._GET["_entities_type"];
        
        InduxsoftCrudlModel.InvokeService(endpoint, null,
            () => { this.removeAttachment(filename); },
            (error) => { alert(error.message ?? JSON.stringify(error)); },
        "DELETE", false, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    crontask.init()
});