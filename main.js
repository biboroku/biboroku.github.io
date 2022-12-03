console.log("ここはコンソール欄だよ、ここにたどり着いた君は相当な手練だね");
$(function () {
    function end_loader() {
      $('.loader').fadeOut(800);
    }
    $(window).on('load', function () {
      setTimeout(function () {
        end_loader();
      }, 3000)
    })
  })  