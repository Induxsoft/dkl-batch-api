
document.addEventListener("DOMContentLoaded",()=>{taskman.init()});

var taskman=
{
    show_logs: false,
    program_token: "",
    program_status: 0,
    interval_time: 0,
    progress_type: 0,
    steps: 0,
    job: 0,

    init()
    {
        taskman.file_program = document.getElementById("file_program");

        if(taskman.file_program)taskman.file_program.addEventListener("change",()=>
        {
            taskman.uploadProgram();
        });

        taskman.name_program = document.getElementById("name_program");
        taskman.content_dkl = document.getElementById("content_dkl");
        taskman.config_params = document.getElementById("config_params");

        const btn_cancel = document.getElementById("btn-cancel");
        if (btn_cancel) btn_cancel.classList.add("d-none");

        taskman.url1 = taskman.url.replace("{id}",taskman._entity_id)+"?_act=get-program-status";
        taskman.url2 = taskman.url.replace("{id}",taskman._entity_id)+"?_act=get-program-log&job_token="+taskman.job;

        if (btn_cancel) setInterval(this.checkProgramStatus, this.interval_time, btn_cancel);
    },

    checkProgramStatus(btn_cancel)
    {
        if (this.program_status >= 3) return;

        fetch(taskman.url1).then(response => response.json())
        .then(data => {
            if (data && data.status == 99) {
                if (!btn_cancel.classList.contains("d-none")) btn_cancel.classList.add("d-none")
            }

            if (data && data.status < 3) {
                console.log("consultando...");
                if (btn_cancel.classList.contains("d-none")) btn_cancel.classList.remove("d-none")
                taskman.show_logs = true;
            } else {
                const spinner = document.getElementById("spinner");
                const st_text = document.getElementById("status_text");
                const program_params = document.getElementById("_program_params");
                const btn_run_program = document.getElementById("btn_run_program");

                spinner.classList.add("d-none");
                st_text.classList.add("d-none");
                btn_run_program.disabled = false;
                program_params.disabled = false;

                if (!btn_cancel.classList.contains("d-none")) btn_cancel.classList.add("d-none")
                
                if (program_params.tagName.toLowerCase() === "form") {
                    let controls = _program_params.elements;
                    for (let i = 0; i < controls.length; i++) {
                        const element = controls[i];
                        element.disabled = false;
                    }
                }

                if (data.status == 3 && taskman.show_logs == true) {
                    taskman.updateLogs();
                }
            }
        });

        if (taskman.show_logs == true) {
            taskman.updateLogs();
        }
    },

    updateLogs()
    {
        fetch(taskman.url2).then(response => response.json())
        .then(data => {
            errors.replaceChildren();

            data.log.map(error => {
                small = document.createElement("small");
                small.textContent = error.note + "\n";
                small.style.cssText = "white-space: break-spaces;"
                errors.prepend(small);
            })
        });
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

    async runProgram()
    {
        const _program_params = document.getElementById("_program_params");
        let params = "";

        if (_program_params.tagName.toLowerCase() === "form")
        {
            if (!_program_params.reportValidity()) return;

            let frmFiles = new FormData();
            let fileCount = 0;
            let fd = {};
            let fields = _program_params.elements;

            for (let i = 0; i < fields.length; i++) {
                const el = fields[i];
                if (el.name === "") continue;
                
                if (el.type === "file" && el.files.length > 0)
                {
                    const file = el.files[0];
                    frmFiles.append(el.name, file);
                    fileCount++
                }
                else fd[el.name] = el.value;
            }
            
            if (fileCount > 0) {
                let url = taskman.url.replace("{id}",taskman._entity_id)+"?upload=program-files";

                try {
                    const response = await fetch(url,{
                        method: "PATCH",
                        body: frmFiles
                    });

                    if (!response.ok) { alert('Hubo un problema con la solicitud: ' + response.status); return; }
                    const data = await response.json();
                    
                    Object.entries(data).forEach(entry => {
                        const [key,value] = entry;
                        fd[key] = value;
                    });
                } catch (error) {
                    console.error('Se produjo un error al realizar la solicitud:', error);
                }
                
                /* InduxsoftCrudlModel.InvokeService(url, frmFiles,
                    (data) => { console.log(data); },
                    (error) => { alert(error.message ?? JSON.stringify(error)); },
                "PATCH", false, true, "", true); */
            }

            params = JSON.stringify(fd);
        }
        else
        {
            if (_program_params.value.trim() != "")
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

        const btn_run_program = document.getElementById("btn_run_program");

        let endpoint = taskman.url.replace("{id}",taskman._entity_id)+"?run=1&progress_type="+this.progress_type+"&steps="+this.steps;
        let data = { params: params }

        btn_run_program.disabled = true;
        InduxsoftCrudlModel.InvokeService(endpoint, data,
            (data) => { {} },
            (error) => { alert(error.message ?? JSON.stringify(error)); },
        "PATCH", false);
    },

    cancelTask()
    {
        let url = taskman.url.replace("{id}",taskman._entity_id)+"?_act=cancel-task&sys_guid_job="+taskman.job;

        fetch(url).then(response => response.json())
        .then(() => {
            if (!taskman.btn_cancel.classList.contains("d-none")) taskman.btn_cancel.classList.add("d-none")
        });
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