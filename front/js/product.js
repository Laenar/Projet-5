
let url = new URL(window.location.href);
let id = url.searchParams.get("id");
let product;

getProduct();


function getProduct() {
    fetch("http://localhost:3000/api/products/"+id)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(async function (returnAPI) {
        product = await returnAPI;
        if (!product) {
            // En cas de retours de donnée null
            window.location.href ="index.html";
        } else {
            insertProduct(product);
        }
    }) 
    .catch(function(err) {
      console.log("Une erreur est survenue :\n\t"+err);
    });
}
    
function insertProduct(product) {

    let imgProduct = document.createElement('img');
    imgProduct.setAttribute ('src',product.imageUrl);
    imgProduct.setAttribute ('alt',product.altTxt);
    document.querySelector(".item__img").appendChild(imgProduct);

    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;

    product.colors.forEach(colors => {
        let colorsProduct = document.createElement("option");
        document.querySelector("#colors").appendChild(colorsProduct);
        colorsProduct.value = colors;
        colorsProduct.textContent = colors;
    });
}

document.getElementById('addToCart').addEventListener("click", (event)=>{

    let choixCouleur = document. getElementById("colors").value;
    let choixQuantite = document.getElementById("quantity").value;

    if (choixCouleur != 0 && choixQuantite) {

        if (sessionStorage == 0) {
            sessionStorage.setItem((sessionStorage.length)+1, [id , choixCouleur, choixQuantite ]);
        } else {
            let onStorage = false;
            for (let index = 1; index <= sessionStorage.length; index++) {
                const item = (sessionStorage.getItem(index).split(','));
                if (item['0'] == id && item['1'] == choixCouleur ) {
                    let newQuantite = parseInt(choixQuantite) + parseInt(item['2']);
                    sessionStorage.setItem(index, [id , choixCouleur, newQuantite ]);
                    onStorage = true;
                    break;
                }
            }

            if (!onStorage) {
                sessionStorage.setItem((sessionStorage.length)+1, [id , choixCouleur, choixQuantite ]);
            }
        }    
        window.location.href ="cart.html";
    } else {
        alert('Un ou plusieurs paramétre ne sont pas defini !')
    }
    
});