// Definir las URLs
const cuentasUrl = 'https://66f5eb49436827ced975725c.mockapi.io/enpoint/cuenta';
const publicacionesUrl = 'https://66f5eb49436827ced975725c.mockapi.io/enpoint/cuenta/1/publicaciones';

// Declarar las variables fuera de la función para que estén accesibles
let cuentas = [];
let publicaciones = [];

const dialogo =document.getElementById('dialog-publicar');
const abrirDialog=document.getElementById('abrir-dialog');
const cerrarDialog=document.getElementById('cerrar-dialog');
const camara=document.getElementById('sacar-foto');
const imagenPreview=document.getElementById('imagen-preview')

const inputDescripcion=document.getElementById('input-descripcion-dialog')
const inputCamara = document.createElement('input');

inputCamara.type = 'file';
inputCamara.id = 'inputFile';
inputCamara.accept = '.png, .jpeg, .webp';
inputCamara.capture = 'environment';
camara.addEventListener('click',()=>inputCamara.click())

inputCamara.addEventListener('change', ()=> {
  const imagenCaptura = URL.createObjectURL(inputCamara.files[0])
  // BLOB: Big Large OBject 
  imagenPreview.src = imagenCaptura      
  camara.style.display='none' 
})


abrirDialog.addEventListener('click' , function(){
    dialogo.showModal();
});

  cerrarDialog.addEventListener('click',function()
    {
        dialogo.close();
    });




const btnPublicar=document.getElementById('boton-publicar')
function borrarInputDialog(){
  //Aca debo resetear los inputs
}
btnPublicar.addEventListener('click',()=>{

  const canvas = document.createElement('canvas') // Lienzo 
    canvas.width = imagenPreview.width
    canvas.height = imagenPreview.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(imagenPreview, 0, 0, imagenPreview.width, imagenPreview.height)


    const imagenBase64 = canvas.toDataURL("image/webp").toString();
    const descripcion = inputDescripcion.value
    console.log(imagenBase64)
    
    //Metodo POST
  const nuevaPublicacion=
    {
      imagen: imagenBase64,
      descripcion: descripcion,
      id: "",
      idCuenta: "1",
    }

    
    const opciones={
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(nuevaPublicacion)
    }
  fetch(publicacionesUrl,opciones)
  .then((response)=>{
    if (response.status===201){
      return response.json
      
    }
    else{
      throw new Error('No se pudo crear el recurso. ' + response.status)
    }
  }).catch((error)=> console.log(error))
  .then(()=>{
    obtenerDatos()
  })
  


})


// Función para obtener cuentas y publicaciones
async function obtenerDatos() {
  try {
    // Obtener las cuentas
    const cuentasResponse = await fetch(cuentasUrl);
    cuentas = await cuentasResponse.json(); // Asignar a la variable global

    // Obtener las publicaciones
    const publicacionesResponse = await fetch(publicacionesUrl);
    publicaciones = await publicacionesResponse.json(); // Asignar a la variable global

    // Mostrar los resultados
    console.log('Cuentas:', cuentas);
    console.log('Publicaciones:', publicaciones);

    // Llamar a getPublicaciones después de obtener los datos
    getPublicaciones(cuentas, publicaciones);

  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
}







// Función para generar los divs de las publicaciones
function getPublicaciones(cuentas, publicaciones) {
    const publicacionesContainer = document.getElementById('publicaciones-container');

    publicaciones.forEach((publicacion) => {
        // Crear el div principal de la publicación
        const publicacionDiv = document.createElement('div');
        publicacionDiv.classList.add('div-publicacion');

        // Obtener la cuenta asociada a la publicación (relación por idCuenta)
        const cuenta = cuentas.find(c => c.idCuenta === publicacion.idCuenta);

        // Crear el div de cabecera
        const cabeceraDiv = document.createElement('div');
        cabeceraDiv.classList.add('div-cabecera-publicacion');

        const imagenPerfil = document.createElement('img');
        imagenPerfil.src = cuenta ? cuenta.fotoPerfil : 'imagenes/default-profile.jpg'; // Utiliza la imagen de perfil de la cuenta o una por defecto
        imagenPerfil.alt = '';
        imagenPerfil.classList.add('foto-de-perfil');

        const nombreCuenta = document.createElement('h2');
        nombreCuenta.classList.add('nombre-cuenta');
        nombreCuenta.textContent = cuenta ? cuenta.user : 'Usuario Desconocido'; // Mostrar el nombre de la cuenta o "Usuario Desconocido"

        cabeceraDiv.appendChild(imagenPerfil);
        cabeceraDiv.appendChild(nombreCuenta);

        // Crear el div de imagen de la publicación
        const imagenDiv = document.createElement('div');
        imagenDiv.classList.add('div-imagen-publicacion');

        const imagenPublicacion = document.createElement('img');
        imagenPublicacion.src = publicacion.imagen || 'imagenes/default-publication.jpg'; // Usa la imagen de la publicación o una por defecto
        imagenPublicacion.alt = '';
        imagenPublicacion.classList.add('imagen-final');

        imagenDiv.appendChild(imagenPublicacion);

        // Crear el div de descripción de la publicación
        const descripcionDiv = document.createElement('div');
        descripcionDiv.classList.add('div-descripcion-publicacion');

        const descripcionSpan = document.createElement('span');
        descripcionSpan.classList.add('descripcion-publicacion');
        descripcionSpan.textContent = publicacion.descripcion || 'Sin descripción'; // Mostrar la descripción o un texto por defecto

        descripcionDiv.appendChild(descripcionSpan);

        // Añadir los divs internos al div principal
        publicacionDiv.appendChild(cabeceraDiv);
        publicacionDiv.appendChild(imagenDiv);
        publicacionDiv.appendChild(descripcionDiv);

        // Añadir la publicación al contenedor
        publicacionesContainer.appendChild(publicacionDiv);
    });
}


// Llamar a obtenerDatos para cargar los datos y mostrar las publicaciones
obtenerDatos();


