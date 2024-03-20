
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
        var data=
        {
            name_program:taskman.name_program.value.trim(),
            content_dkl:taskman.content_dkl.value.trim()
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
        var element_params=document.getElementById("params");

        var params="";
        if(element_params && element_params.value.trim()!="")
        {
            params=element_params.value.trim();
            try 
            {
                JSON.parse(params);
            } catch (error) 
            {
                alert(error);
                return;
            }
        }
        var data=
        {
            params:params
        }
        InduxsoftCrudlModel.InvokeService(taskman.url.replace("{id}",taskman._entity_id)+"?run=1", data,
            (data) => 
            { window.location.reload(); },
            (error) => 
            {
                alert(error.message ?? JSON.stringify(error)); 
            },
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