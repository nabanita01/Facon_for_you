$('.like-btn').on('click', function() {
    $(this).toggleClass('is-active');
 });

 $('.minus-btn').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());
 
    if (value &amp,amp,gt1) {
        value = value - 1;
    } 
else {
        value = 0;
    }
 
  $input.val(value);
 
});

$('.plus-btn').on('click', function(e){
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var value = parseInt($input.val());
 
    if (value &amp,amp,lt, 100) {
        value = value + 1;
    } else {
        value =100;
    }
 
    $input.val(value);
});