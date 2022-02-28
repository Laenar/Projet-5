let workSection = document.getElementById('items');
let textFormat = [];

get_Products ();

function get_Products () {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    read_Product(value);
    console.log(value);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function read_Product (product) {
  product.forEach(element => {
    print_Product (element);
  });
}

function print_Product (product) {
  let codeItem = ' <article> <img src="'+product['imageUrl']+'" alt="'+product['altTxt']+'"> <h3 class="productName">'+product['name']+'</h3> <p class="productDescription">'+product['description']+'</p></article>';
  
  textFormat.push(codeItem);
  let newElem = document.createElement("a");
  newElem.setAttribute("href","product.html?id="+product['_id']);
    newElem.innerHTML = codeItem;
    workSection.appendChild(newElem);
}
