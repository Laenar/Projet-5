let workSection = document.getElementById('items'); // Varriable de travaile principale

get_Products ();

function get_Products () //Recupere l’emseble des produits
{
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    read_Product(value);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function read_Product (product) // Ajoute les produits 1 à 1 sur la page (Utilise la var workSection)
{
  product.forEach(element => {
    let codeItem = ' <article> <img src="'+element['imageUrl']+'" alt="'+element['altTxt']+'"> <h3 class="productName">'+element['name']+'</h3> <p class="productDescription">'+element['description']+'</p></article>';
    let newElem = document.createElement("a");
    newElem.setAttribute("href","product.html?id="+element['_id']);
    newElem.innerHTML = codeItem;
    workSection.appendChild(newElem);
  });
}