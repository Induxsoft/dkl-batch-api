
document.addEventListener("DOMContentLoaded",()=>{taskman.init()});

var taskman=
{
    init()
    {
        taskman.file_program=document.getElementById("file_program");
        if(taskman.file_program)taskman.file_program.addEventListener("change",()=>
        {
            taskman.uploadProgram();
        });

        taskman.name_program=document.getElementById("name_program");
        taskman.content_dkl=document.getElementById("content_dkl");
        taskman.config_params=document.getElementById("config_params");
    },  
    uploadProgram()
    {
        var data=new FormData();
        if(!taskman.file_program)return;
        var lng=taskman.file_program.files.length;

        if(lng<1)return;

        for (let i = 0; i <lng ; i++) 
        {
            const element = taskman.file_program.files[i];
            data.append(element.name,element);
        }
        InduxsoftCrudlModel.InvokeService(taskman.url.replace("{id}",taskman._entity_id)+"?upload=1", data,
            (data) => 
            { window.location.reload(); },
            (error) => 
            {
                taskman.file_program.value=""; 
                alert(error.message ?? JSON.stringify(error)); 
            },
        "PUT", false, false, "", true);
    },
    cretePrograma()
    {
        if(!taskman.name_program || !taskman.content_dkl)return;

        if(taskman.name_program.value.trim()=="")
        {
            alert("Debe colocar el nombre del programa");
            taskman.name_program.focus();
            return;
        }
        if(taskman.content_dkl && taskman.content_dkl.value.trim()=="")
        {
            alert("Debe colocar el contenido del programa");
            taskman.content_dkl.focus();
            return;
        }
        var config_params="";
        if(taskman.config_params && taskman.config_params.value.trim()!="")
        {
            config_params=taskman.config_params.value.trim();
            try 
            {
                JSON.parse(config_params);   
            } catch (error) 
            {
                alert(error);
                taskman.config_params.focus();
                return;    
            }
        }
        var data=
        {
            name_program:taskman.name_program.value.trim(),
            content_dkl:taskman.content_dkl.value.trim(),
            config_params:config_params
        }

        InduxsoftCrudlModel.InvokeService(taskman.url.replace("{id}",taskman._entity_id)+"?create=1", data,
            (data) => 
            { window.location.reload(); },
            (error) => 
            {
                alert(error.message ?? JSON.stringify(error)); 
            },
        "PATCH", false);
    },
    runProgram()
    {
        const _program_params = document.getElementById("_program_params");
        let params = "";

        if (_program_params.tagName.toLowerCase() === "form")
        {
            if (!_program_params.reportValidity()) return;

            let formData = {}
            let fields = _program_params.elements;

            for (let i = 0; i < fields.length; i++) {
                const f = fields[i];
                if (f.name !== "")
                    formData[f.name] = f.value;
            }

            params = JSON.stringify(formData);
        }
        else
        {
            if (_program_params && _program_params.value.trim() != "")
            {
                try 
                {
                    params = _program_params.value.trim();
                    JSON.parse(params);
                } catch (error) 
                {
                    alert(error);
                    _program_params.focus();
                    return;
                }
            }
        }

        let endpoint = taskman.url.replace("{id}",taskman._entity_id)+"?run=1";
        let data = { params: params }

        InduxsoftCrudlModel.InvokeService(endpoint, data,
            (data) => { window.location.reload(); },
            (error) => { alert(error.message ?? JSON.stringify(error)); },
        "PATCH", false);
    },
    showModal(modalId='')
    {
        this.getBSModal(modalId).show();
    },
    hideModal(modalId='')
    {
        this.getBSModal(modalId).hide();
    },
    getBSModal(modalId='')
    {
        if(modalId.trim()=="")return;

        const modalElement = document.getElementById(modalId);
        if(!modalElement)return;

        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (!bsModal) return new bootstrap.Modal(modalElement);

        return bsModal;
    },
}