$('.carousel').carousel({
  interval: 2000
})

// for login page
const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})


// CART CONTROLS

$(document).ready(function(){
  	update_amounts();
  	$('.qty, .price').on('keyup keypress blur change', function(e) {
	  	update_amounts();
  	});
});
function update_amounts(){
	var sum = 0.0;
	  	$('#myTable > tbody  > tr').each(function() {
			var qty = $(this).find('.qty').val();
		  	var price = $(this).find('.price').val();
		  	var amount = (qty*price)
		  	sum+=amount;
		  	$(this).find('.amount').text(''+amount);
	  	});
	$('.total').text(sum);
}



//----------------for quantity-increment-or-decrement-------
var incrementQty;
var decrementQty;
var plusBtn  = $(".cart-qty-plus");
var minusBtn = $(".cart-qty-minus");
var incrementQty = plusBtn.click(function() {
	var $n = $(this)
		.parent(".button-container")
		.find(".qty");
	$n.val(Number($n.val())+1 );
	update_amounts();
});

var decrementQty = minusBtn.click(function() {
		var $n = $(this)
		.parent(".button-container")
		.find(".qty");
	var QtyVal = Number($n.val());
	if (QtyVal > 0) {
		$n.val(QtyVal-1);
	}
	update_amounts();
});


function viewImage (event){
    document.getElementById("imgPreview").src=URL.createObjectURL(event.target.files[0])
}
function incrProductQty(productId){
  console.log("increase qty");
  console.log(productId);
}
