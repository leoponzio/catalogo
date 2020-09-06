var tableRoles,opcion;

document.addEventListener("DOMContentLoaded",function(){

   tableRoles = $('#tableRoles').DataTable({
          "aProcessing": true,
          "aServerSide": true,
      	  "language": {
              "decimal":        ".",
              "emptyTable":     "No hay datos para mostrar",
              "info":           "Mostrando del _START_ al _END_ (_TOTAL_ total)",
              "infoEmpty":      "Sin Resultados",
              "infoFiltered":   "(filtrado de todas las _MAX_ Registros)",
              "infoPostFix":    "",
              "thousands":      "'",
              "lengthMenu":     "Mostrar _MENU_ entradas",
              "loadingRecords": "Cargando...",
              "processing":     "Procesando...",
              "search":         "Buscar:",
              "zeroRecords":    "No hay resultados",
              "paginate": {
                "first":      "Primero",
                "last":       "Último",
                "next":       "Siguiente",
                "previous":   "Anterior"
           
              },
              "aria": {
                "sortAscending":  ": ordenar de manera Ascendente",
                "sortDescending": ": ordenar de manera Descendente ",
              }
            },

            "ajax":{
                "url": " "+base_url+"/Roles/getRoles",
                "dataSrc":""
            },
            
            "columns":[
                  {"data":"idrol"},
                  {"data":"nombrerol"},
                  {"data":"descripcion"},
                  {"data":"status"},
                  {"data":"option"},
                  
            ],
            
            "resonsieve":"true",
            "bDestroy": true,
            "iDisplayLength": 10
  });

  $('#tableRoles').on( 'page.dt', function () {
         fntEditRol();
         fntDelRol();
        // fntPermisos();
  } ).DataTable();  
 

  //new rol
  var formRol = document.querySelector("#formRol");
  formRol.onsubmit = function(e){
     e.preventDefault();

     strnombre  = document.querySelector("#txtNombre").value;
     strdescrip = document.querySelector("#txtDescripcion").value;
     intstatus  = document.querySelector("#listStatus").value;

     if (strnombre== '' || strdescrip== '' || intstatus == '')
     {
        swal("Atencion", "Todos los campos son obligatorios","error");
        return false;
     }

     var request  = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
     var ajaxUrl   = base_url+'/Roles/setRol';
     var formData = new FormData(formRol);
 
     request.open("POST", ajaxUrl,true);
     request.send(formData);
     request.onreadystatechange = function(){

         if(request.readyState == 4 && request.status == 200)
         {
            var objData = JSON.parse(request.responseText);

            if(objData.status)
            {
              $('#modalFormRol').modal('hide');
              formRol.reset();
              swal("Roles de Usuario", objData.msg,"success");
              tableRoles.ajax.reload(function(){
                    fntEditRol();
                    fntDelRol();
                   // fntPermisos();
              }); 
            }else{
              swal("Error", objData.msg, "error");
            }
         }  
            
      } 
  } 

});

function openModal(){

   document.querySelector('#idRol').value = "";
   document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
   document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
   document.querySelector('#btnText').innerHTML = "Guardar";
   document.querySelector('#titleModal').innerHTML = "Nuevo Rol";
   document.querySelector('#formRol').reset();
   
   $('#modalFormRol').modal('show'); 
};

window.addEventListener('load', function(){
        
        fntEditRol();
        fntDelRol();
}, false);


function fntEditRol(){
  var btnEditRol = document.querySelectorAll(".btnEditRol");
  btnEditRol.forEach( function(btnEditRol) {
       btnEditRol.addEventListener('click',function(){

           document.querySelector('#titleModal').innerHTML = "Actualizar Rol";
           document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
           document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
           document.querySelector('#btnText').innerHTML = "Actualizar";

           var idrol = this.getAttribute('rl');
           var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
           var ajaxetUser = base_url+'/Roles/getRol/'+idrol;
           request.open("GET", ajaxetUser, true);
           request.send();
            
           request.onreadystatechange = function(){

               if(request.readyState == 4 && request.status == 200)
               {
                
                  var objData = JSON.parse(request.responseText);
                  
                  if(objData.status)
                  {
                    document.querySelector('#idRol').value = objData.data.idrol;
                    document.querySelector('#txtNombre').value = objData.data.nombrerol;
                    document.querySelector('#txtDescripcion').value = objData.data.descripcion;

                    if (objData.data.status == 1)
                    {
                        var optionSelect = ' <option value="1" selected class="notBlock">Activo</option>';
                    }else{
                        var optionSelect = ' <option value="2" selected class="notBlock">Inactivo</option>';
                    }  

                    var htmlSelect = `${optionSelect} 
                                      <option value="1">Activo</option>
                                      <option value="2">Inactivo</option>
                                      `;

                    document.querySelector("#listStatus").innerHTML = htmlSelect;                  
                    $('#modalFormRol').modal('show');

                  }else{
                    swal("Error", objData.msg, "error");
                  }
               }  
                  
            }  

         $('#modalFormRol').modal('show');
       });
  });
};

function fntDelRol(){
  var btnDelrol = document.querySelectorAll(".btnDelrol");
  btnDelrol.forEach( function(btnDelrol) {
       
       btnDelrol.addEventListener('click',function(){

           var idrol = this.getAttribute('rl');
           var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
           var ajaxetUser = base_url+'/Roles/getRol/'+idrol;
           request.open("GET", ajaxetUser, true);
           request.send();
            
           request.onreadystatechange = function(){

             if(request.readyState == 4 && request.status == 200)
             {
                var objData = JSON.parse(request.responseText);
                
                if(objData.status)
                {
                  nombre = objData.data.nombrerol;
                                     
                  swal({
                    title:"Borrar Registro?",
                    text: "Seguro de borrar el Rol: "+nombre,
                    type: "warning",
                    dangerMode: true,
                    showCancelButton: true,
                    confirmButtonText: "Si!,Eliminar",
                    cancelButtonText:  "No!,Cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                  }, function(isConfirm) {
                      if (isConfirm) 
                      {

                        var ajaxetDel = base_url+'/Roles/delRol/';
                        var strData   = "idrol="+idrol;
                        request.open("POST", ajaxetDel, true);
                        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        request.send(strData); 

                        request.onreadystatechange = function(){

                          if(request.readyState == 4 && request.status == 200)
                          { 
                           
                            var objData1 = JSON.parse(request.responseText);
                            if(objData1.status)
                            {
                                swal("Eliminar!", objData1.msg, "success");
                            }else{
                                swal("Atencion!", objData1.msg, "error");
                            } 
                          }
                        };
                                               
                      } else {
                         swal("Cancelado!", "", "error");
                      }
                      tableRoles.ajax.reload(function(){
                            fntEditRol();
                            fntDelRol();
                           // fntPermisos();
                      }); 
                  }); 
                }  
            }  
      };
  });
}
)};






