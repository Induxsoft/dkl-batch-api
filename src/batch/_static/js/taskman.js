
document.addEventListener("DOMContentLoaded",()=>{taskman.init()});

var taskman=
{
    program_token: "",
    jobs_instances: 0,
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

        taskman.url1 = taskman.url.replace("{id}",taskman._entity_id)+"?_act=get-program-status";
        taskman.url2 = taskman.url.replace("{id}",taskman._entity_id)+"?_act=get-program-log&job_token="+taskman.job;
        taskman.url3 = taskman.url.replace("{id}",taskman._entity_id)+"?_act=get-job-instances&job_token="+taskman.job;

        setInterval(() => {
            this.checkJobsInProgress();
            // this.checkProgramStatus();
        }, this.interval_time);
    },

    checkProgramStatus()
    {
        if (this.program_status >= 3) return;

        const spinner = document.getElementById("spinner");
        const st_text = document.getElementById("status_text");
        const program_params = document.getElementById("_program_params");
        const btn_run_program = document.getElementById("btn_run_program");
        const btn_cancel = document.getElementById("btn-cancel");

        fetch(taskman.url1).then(response => response.json())
        .then(data => {
            if (data && data.status == 99) btn_cancel.classList.add("d-none");
            else if (data && data.status < 3) btn_cancel.classList.remove("d-none");
            else
            {
                spinner.classList.add("d-none");
                st_text.classList.add("d-none");
                btn_run_program.disabled = false;
                program_params.disabled = false;
                btn_cancel.classList.add("d-none")
                
                if (program_params.tagName.toLowerCase() === "form")
                {
                    let controls = program_params.elements;
                    for (let i = 0; i < controls.length; i++) {
                        const element = controls[i];
                        element.disabled = false;
                    }
                }
            }

            this.program_status = data.status;
            this.updateLogs();
        });
    },

    checkJobsInProgress()
    {
        // if (this.jobs_instances <= 0) return;

        const spinner = document.getElementById("spinner");
        const stt_txt = document.getElementById("status_text");
        const tbody = document.querySelector("#tbl_instances tbody");

        fetch(taskman.url3).then(response => response.json())
        .then(data => {
            // this.jobs_instances = data.length;
            let show_spinner = (data.filter(obj => obj.istatus < 3).length > 0);
            
            spinner.classList.toggle("d-none",!show_spinner);
            stt_txt.classList.toggle("d-none",!show_spinner);

            tbody.innerHTML = "";
            data.forEach((job,irow) => {
                let cells = ["row","sys_guid","usuario","finicio","sttext"];
                job["row"] = (irow+1);

                const tr = document.createElement("tr");
                cells.forEach(key => {
                    const td = document.createElement("td");
                    const text = document.createTextNode(job[key]);
                    
                    td.appendChild(text)
                    tr.appendChild(td)
                });
                
                const _actions = document.createElement("td");

                if (this._user_id == job.sys_user && job.istatus < 3)
                {
                    const _cancelar = document.createElement("button");
                    _cancelar.classList.add("btn", "btn-sm", "btn-light", "border");
                    _cancelar.setAttribute("onclick",`taskman.cancelTask('${job.sys_guid}')`);
                    _cancelar.textContent = "Cancelar";
                    _actions.appendChild(_cancelar);
                }

                tr.appendChild(_actions);
                tbody.appendChild(tr);
            });
        });
    },

    updateLogs(logs=[], get=true)
    {
        const div_errors = document.getElementById("errors");
        if (!div_errors) return;

        const PrintLogs = function (list,container) {
            container.innerHTML = "";
            list.forEach(log => {
                const small = document.createElement("small");
                small.style.cssText = "white-space: break-spaces;"
                small.textContent = log.note + "\n";

                div_errors.prepend(small);
            });
        }

        if (logs.length > 0 && !get) PrintLogs(logs,div_errors);

        if (get)
        {
            fetch(taskman.url2).then(response => response.json())
            .then(data => {
                let dlog = (data?.log??[]);

                if (!(data?.success??true) || (data?.message??"")!=="") {
                    let msg = { note: (data?.message ?? JSON.stringify(data)) };
                    dlog.push(msg);
                }
                
                PrintLogs([...logs,...dlog],div_errors);
            });
        }
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
        const spn_start_text = document.getElementById("spn_start_text");

        let endpoint = taskman.url.replace("{id}",taskman._entity_id)+"?run=1&progress_type="+this.progress_type+"&steps="+this.steps;
        let data = { params: params }

        btn_run_program.disabled = true;
        spn_start_text.classList.remove("d-none");

        if (_program_params.tagName.toLowerCase() === "form")
        {
            let controls = _program_params.elements;
            for (let i = 0; i < controls.length; i++) {
                const element = controls[i];
                element.disabled = true;
            }
        }
        else _program_params.disabled = true;

        InduxsoftCrudlModel.InvokeService(endpoint, data,
            (data) => { window.location.reload(); },
            (error) => { alert(error.message ?? JSON.stringify(error)); },
        "PATCH", false);
    },

    cancelTask(idJob)
    {
        // let url = taskman.url.replace("{id}",taskman._entity_id)+"?_act=cancel-task&sys_guid_job="+taskman.job;
        let url = taskman.url.replace("{id}",taskman._entity_id)+"?_act=cancel-task&sys_guid_job="+idJob;

        fetch(url).then(response => response.json())
        .then((data) => { window.location.reload() })
        .then((error) => { alert(error.message) });
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