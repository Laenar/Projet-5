let url = new URL(window.location.href);
let id = url.searchParams.get("id");
let product;

getProduct();

function getProduct() // Récupére un produit unique (Utilise la var id)
{
    fetch("http://localhost:3000/api/products/"+id)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(async function (returnAPI) {
        product = await returnAPI;
        if (!product) {
            window.location.href ="index.html"; // En cas de retours de donnée null
        } else {
            insertProduct(product);
        }
    }) 
    .catch(function(err) {
      console.log("Une erreur est survenue :\n\t"+err);
    });
} 
function insertProduct(product) // Requière un objet de type produit, insert ses données directement dans la page.
{
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
document.getElementById('addToCart').addEventListener("click", (event)=> //Gestion du pannier
{
    let choixCouleur = document. getElementById("colors").value;
    let choixQuantite = document.getElementById("quantity").value;

    if (choixCouleur != 0 && choixQuantite) {

        if (localStorage == 0) //Dans le cas ou c'est le premier produit ajouté au pannier.
        {
            localStorage.setItem((localStorage.length)+1, [id , choixCouleur, choixQuantite ]);
        } else {
            let onStorage = false;
            for (let index = 1; index <= localStorage.length; index++) // Recherche si le produit est deja dans le pannier
            {
                const item = (localStorage.getItem(index).split(','));
                if (item['0'] == id && item['1'] == choixCouleur ) {
                    let newQuantite = parseInt(choixQuantite) + parseInt(item['2']);
                    localStorage.setItem(index, [id , choixCouleur, newQuantite ]); // ajouts au pannier de la nouvelle qte
                    onStorage = true;
                    break;
                }
            }

            if (!onStorage) // ajouts du produit que l'on veux ajouté si il n'est pas dans la liste 
            {
                localStorage.setItem((localStorage.length)+1, [id , choixCouleur, choixQuantite ]);
            }
        }    
        window.location.href ="cart.html"; // Nous envoie vers le panier
    } else {
        alert('Un ou plusieurs paramétre ne sont pas defini !'); //  Message d'erreur
    }
    
});