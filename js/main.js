const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const template = document.getElementById('template-card').content
const TemplateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()  //Mostramos el json capturado abajo
}) 

cards.addEventListener('click', e =>{
    addCarrito(e)
})
const fetchData = async() => {  //capturamos el json
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}  

const pintarCards = data =>{
    data.forEach(productos => {    //uso foreach por que estoy recorriendo una json
        template.querySelector('h5').textContent = productos.title
        template.querySelector('p').textContent = productos.precio
        template.querySelector('img').setAttribute("src", productos.thumbnailUrl)
        template.querySelector('.btn-dark').dataset.id = productos.id   // con dataset Agrego el id   ! en el query selector la clase o id se escriben como en css
         const clone = template.cloneNode(true)
         fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e =>{
   if(e.target.classList.contains('btn-dark')) { // en contains la clase va sin el punto
        setCarrito(e.target.parentElement)
   } 
   e.stopPropagation()
}

//REPASAR MUY BIEN ESTO!!!! es complicado e importante
const setCarrito = objeto => {
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        title : objeto.querySelector('h5').textContent,
        precio : objeto.querySelector('p').textContent,
        cantidad: 1  
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () =>{
    items.innerHTML = ''
   Object.values(carrito).forEach(producto => {
            TemplateCarrito.querySelector('th').textContent = producto.id
            TemplateCarrito.querySelectorAll('td')[0].textContent = producto.title
            TemplateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            TemplateCarrito.querySelector('.btn-info').dataset.id = producto.id                //no entendi bien esto
            TemplateCarrito.querySelector('.btn-danger').dataset.id = producto.id
            TemplateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
            const clone = TemplateCarrito.cloneNode(true)
            fragment.appendChild(clone)
   })
   items.appendChild(fragment)
   pintarFooter()
}
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML =  `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th> `  //alt + 96
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc , {cantidad}) => acc + cantidad, 0 )
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + (precio * cantidad) , 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener( 'click' , () => {
        carrito = {}
        pintarCarrito()
    })
}

items.addEventListener('click', e => {
        btnAccion(e)
})

const btnAccion = e =>{
      if(e.target.classList.contains('btn-info')){
          const producto = carrito[e.target.dataset.id]
          producto.cantidad++
          carrito[e.target.dataset.id] = {...producto}
      }
      if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        carrito[e.target.dataset.id] = {...producto}
        if(producto.cantidad === 0){
            delete  carrito[e.target.dataset.id]
        }
    }
    pintarCarrito()
    e.stopPropagation()
}