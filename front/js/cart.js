let mainTemplate = document.getElementById('mainTemplate');
let workSection = document.getElementById('cart__items');
let total = [document.getElementById('totalQuantity'),document.getElementById('totalPrice'),0,0];
let eltForm = [document.getElementById('firstName'), document.getElementById('lastName'), document.getElementById('address'), document.getElementById('city'), document.getElementById('email'),document.getElementById('firstNameErrorMsg'), document.getElementById('lastNameErrorMsg'), document.getElementById('addressErrorMsg'), document.getElementById('cityErrorMsg'), document.getElementById('emailErrorMsg')];
let orderVerrif = ["nom","nom","add","nom","email"];
let productPrice;

innit();
updatePrice();

for (let index = 0; index < eltForm.length/2; index++) { //event controle texte saisie
  eltForm[index].addEventListener('change', function() {
    eltForm[index+(eltForm.length/2)].textContent = verifForm(orderVerrif[index],this.value);
  });
}

document.getElementById('order').addEventListener('click', (event) => // Event qui controle la validité des données saisie dens le formulaire ET envoie la commende
{
  event.preventDefault();
  let verif = false;  // Si vrai alors pas de requette 
  for (let index = 0; index < eltForm.length/2; index++) {
    if (verifForm(orderVerrif[index],eltForm[index].value) != '') {
      eltForm[index+(eltForm.length/2)].textContent = verifForm(orderVerrif[index],eltForm[index].value);
      verif = true;
    }
  }

  if (!verif) {
    let products = [];
    for (let index = 1; index <= localStorage.length; index++) {
      if (localStorage.getItem(index) != "null") {
        const item = (localStorage.getItem(index).split(','));
        products.push(item[0]);
      }
    }
  
      const order = { //Mise en forme recuperation value
        contact : {
          firstName : eltForm[0].value,
          lastName : eltForm[1].value,
          address : eltForm[2].value,
          city : eltForm[3].value,
          email : eltForm [4].value
        },
        products: products,
    } 
  
    const options = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            'Accept': 'application/json', 
            "Content-Type": "application/json" 
        },
    };
    
      // envoie reqette 
      fetch("http://localhost:3000/api/products/order", options)
          .then(response => response.json())
          .then(data => {
          document.location.href = 'confirmation.html?id='+ data.orderId;
        });
  }
});

function innit() // Fonction init du pannier
{
    if (localStorage == 0) {
        window.location.href ="index.html"; // retour vers Home si panier vide
    } else {
        let onStorage = false;
        for (let index = 1; index <= localStorage.length; index++) { // Lecture storage et extraction des données
          if (localStorage.getItem(index) != "null") {
            const item = (localStorage.getItem(index).split(','));
            getProduct(item[0],item[1],item[2],0);
          }
        }
    }
}

function getProduct(id,color, number, mode) // permet d'optenir les produit (fonctionne avec une var id)
{
    fetch("http://localhost:3000/api/products/"+id)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(async function (returnAPI) {
        let product = await returnAPI;
        if (mode == 0) {
          printProducts(product, id, color, number);
        } else {
          console.log("###> "+product.price);
          productPrice = product.price;
        }
        
    })
    .catch(function(err) {
      console.log("Une erreur est survenue :\n\t"+err);
    });
}
function printProducts (product, id, color, number) // Clonne le template pour le remplir et l'ajouter a la workSection, cree les callback pour le prix et la suppr
{

  const cloneElt = document.importNode(mainTemplate.content, true);
  let elt = cloneElt.children[0];    

  elt.setAttribute('data-id', id);
  elt.setAttribute('data-color', color);
  elt = elt.children[0];

  elt.children[0].setAttribute ('src',product.imageUrl);
  elt.children[0].setAttribute ('alt',product.altTxt);
  elt = elt.nextElementSibling;

  let eltDesc = elt.children[0];
  eltDesc.children[0].textContent = product.name;
  eltDesc.children[1].textContent = color;
  eltDesc.children[2].textContent = product.description;
  elt = eltDesc.nextElementSibling;

  let eltSettings = elt.children[0];
  eltSettings.children[1].setAttribute('value',number);
  eltSettings.children[1].addEventListener("click", (event)=>{ //callBack modifie une quantité demande
    const article = (event.target).closest("article");
    let data_Product = [article.getAttribute('data-id'),article.getAttribute('data-color')];
    changeQte(event.target, data_Product);

  })

  eltSettings = elt.children[1];
  eltSettings.children[0].addEventListener("click", (event)=>{  //callBack supprime un article demande
    const article = (event.target).closest("article");
    let data_Product = [article.getAttribute('data-id'),article.getAttribute('data-color')];
    delProduct(article, data_Product);

  })

  workSection.appendChild(cloneElt);
}
// Fonction appeler par callBack supprime un article demande l'article et son id
function delProduct (article, data_Product) {
  for (let index = 1; index <= localStorage.length; index++) {
    if(localStorage[index] != "null") {
      const item = (localStorage.getItem(index).split(','));
      if (item[0] == data_Product[0] && item[1] == data_Product[1]) {
        localStorage.setItem(index,null);
        article.remove();
      }
    }
  }
  updatePrice()
}
// Fonction appeler par callBack modifie unequantité demande input et son id
function changeQte (input, data_Product) {

  if (parseInt(input.valueAsNumber )>0) {
    for (let index = 1; index <= localStorage.length; index++) {
      if(localStorage[index] != "null") {
        const item = (localStorage.getItem(index).split(','));
        if (item[0] == data_Product[0] && item[1] == data_Product[1]) {
          localStorage.setItem(index, [data_Product[0] , data_Product[1], input.valueAsNumber ]);
        }
      }
    }
    updatePrice();
  } else {
    alert("Valure non conforme");
  }
  
}
function verifForm(type, data) // Fonction utilise des RegExp, prend le type de reg et une str
{
  let emailReg = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let nomReg = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressReg = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
  let valid;
  switch (type) {
    case "email":
      valid = emailReg.test(data);
        if (valid) {
          return '';
        } else {
          return 'Email invalide';
        }
      break;

    case "nom":
      valid = nomReg.test(data);
        if (valid) {
          return '';
        } else {
          return 'Ce nom est invalide';
        }
      break;

    case "add":
      valid = addressReg.test(data);
        if (valid) {
          return '';
        } else {
          return 'Cette addresse est invalide';
        }
      break;

  
    default:
      return '';
      break;
  }
}

function updatePrice() // get les donnée en vue d'une modification de qte
{
  total[2] = 0;
  total[3] = 0;
  for (let index = 1; index <= localStorage.length; index++) {
    if (localStorage.getItem(index) != "null") {
      const item = (localStorage.getItem(index).split(','));
      let qte = parseInt(item[2]);

      let price = fetch("http://localhost:3000/api/products/"+item[0])
      .then(function(res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then( function (returnAPI) {
          let product = returnAPI;
          printPrice(parseInt(product.price),qte);
      })
      .catch(function(err) {
        console.log("Une erreur est survenue :\n\t"+err);
      });
    }
  }
}
function printPrice (price , qte) // effectue le calcule pour modifier le prix 
{
  total[2] = parseInt(total[2]) +qte;
  total[3] = parseInt(total[3])+(parseInt(price)*qte);

  total[0].textContent = total[2];
  total[1].textContent = total[3];
}