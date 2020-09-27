const express = require('express');
const router = express.Router();

const pool = require('../lib/database');
const { isLoggedIn } = require('../lib/auth');

var fs = require('fs');
var pdf = require('dynamic-html-pdf');
var html = fs.readFileSync('./src/public/template.hbs', 'utf8');

const slash = process.platform === 'win32' ? '\\' : '/';

var imgPath = "file:---" + process.cwd() + "-src-public-img-uploads-"; //"cssgPat1h = imgPath.replace(/-/g, slash);
imgPath = imgPath.replace(/-/g, slash);

router.get('/:id', isLoggedIn, async (req, res) => {

    const { id } = req.params;
    const emp  = await pool.query('SELECT * FROM empresa');
    const rows = await pool.query('SELECT productos.*,precios.* FROM productos,precios WHERE precios.p_cod=productos.cod and productos.activo=? and productos.dpto=?', [1,id]);
    console.log(i);
    var aux = true;
    for (i = 0; i < rows.length; i++) {
        
        aux = !aux;
        rows[i].preciod1 = rows[i].preciod1.toFixed(2);
        rows[i].preciod2 = rows[i].preciod2.toFixed(2);
        rows[i].precioy1 = rows[i].precioy1.toFixed(2);
        rows[i].precioy2 = rows[i].precioy2.toFixed(2);
        rows[i].img = imgPath + rows[i].img;
        rows[i].xx = aux;
        
            
    };

    var info = {
        empresa :{
            nombre: emp[0].nombre,
            rif: emp[0].rif,
            correo: emp[0].email,
            tlf: emp[0].tlf
        },

        prod : rows,
        path : "file:///F:/nodejs/programas/catalogo/src/public"
    };
   
   var name = new Date().getTime();

    var document = {
        type: 'file',     // 'file' or 'buffer'
        template: html,
        context: {
            info: info
        },
        path: "./" + name + ".pdf"    // it is not required if type is buffer
    };
    
    var options = {
        format: "Letter",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "40mm",
            contents: "<div style='width: 196mm;  height: 25mm;' class='text-center border border-primary rounded'><H2 class='text-dark'>"+info.empresa.nombre+"</H2><H5 class='text-dark'>"+info.empresa.rif+"</H5><H5 class='text-danger'>Correo: <span class='text-muted'>"+info.empresa.correo+ "</span>- Tlf: <span class='text-muted'>"+info.empresa.tlf+"</span></H5></div>"
          },
          footer: {
             height: "5mm",
            contents: "<div style='width: 196mm;  height: 5mm; margin-top: 5px' class='text-center bg-dark text-light'><span>{{page}}</span>/<span>{{pages}}</span></div>"
          }
        
    };

    pdf.create(document, options)
        .then(resp => {
            console.log(resp);

            fs.readFile(process.cwd() + slash + name + ".pdf", (err, data) => {

                if (err) {
                    console.log(err);
                }

                res.type("application/pdf");
                res.send(data);
            });
            fs.unlink(process.cwd() + slash + name + ".pdf", (err) => {
                if (err) return console.log(err);
                console.log('file deleted successfully');
            });
        })
        .catch(error => {
            console.error(error)
        });
});

module.exports = router;